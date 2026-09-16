const DATA_URL = "https://script.google.com/macros/s/AKfycbwisIG5MrtXFguYQHXQ8FrmrnC5HtPRAdLt_uC454Pbm9adNh8fykmFoquCERT0yIIx/exec";

const PRODUCT_CONFIG = {
  "gimi": { title: "Google Ai Pro", cardImage: "../img/gimi.png", bannerImage: "../img/gimi.png" },
  "gpt": { title: "ChatGPT", cardImage: "../img/gpt.png", bannerImage: "../img/gpt.png" },
  "cup": { title: "Capcut Pro Ai", cardImage: "../img/cup.png", bannerImage: "../img/cup.png" },
  "can": { title: "Canva Pro", cardImage: "../img/can.png", bannerImage: "../img/can.png" },
  "Lovable EX": { title: "Lovable", cardImage: "../img/lova.png", bannerImage: "../img/lova.png" },
  "win": { title: "Activate Windows", cardImage: "../img/win.png", bannerImage: "../img/win.png" }
};

const PAYMENT_CONFIG = {
  instapayNumber: "01558143429",
  teldaUsername: "mahmoudmomajed",
  supportPhone: "201274277202"
};

const STORAGE_KEY = "mcaiFlowState";

let PRODUCTS = [];
let currentProduct = null;
let currentVariantIndex = 0;
let appliedCoupon = null;
let activePayMethod = "instapay";

function getProductMeta(key) {
  return PRODUCT_CONFIG[key] || { title: key, cardImage: "../img/logo.png", bannerImage: "../img/logo.png" };
}

function rowsToObjects(rows) {
  if (!rows || !rows.length) return [];
  const headers = rows[0];
  return rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? row[i] : ""; });
    return obj;
  });
}

function parseData(json) {
  const products = [];
  (json.sheets || []).forEach(sheet => {
    if (String(sheet.name).trim().toLowerCase() === "code") return;
    const variants = rowsToObjects(sheet.rows).filter(v => String(v.name || "").trim() !== "");
    if (!variants.length) return;
    products.push({ key: sheet.name, variants });
  });
  return products;
}

function isFree(val) {
  return String(val || "").trim().toUpperCase() === "FREE";
}

function toNumber(val) {
  const n = parseFloat(String(val).replace(/[^\d.]/g, ""));
  return isNaN(n) ? null : n;
}

function formatEGP(n) {
  return `${Math.round(n).toLocaleString("en-US")} ج.م`;
}

function priceLabel(variant) {
  if (isFree(variant.cash)) return "مجاناً";
  const n = toNumber(variant.cash);
  return n !== null ? formatEGP(n) : "";
}

function minPriceOf(product) {
  const values = product.variants
    .map(v => (isFree(v.cash) ? 0 : toNumber(v.cash)))
    .filter(n => n !== null);
  return values.length ? Math.min(...values) : null;
}

function sharedValue(variants, field) {
  const values = variants.map(v => String(v[field] || "").trim());
  if (values.every(v => v === "")) return "";
  return values.every(v => v === values[0]) ? values[0] : null;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderSkeleton(count) {
  const grid = document.getElementById("catalog-grid");
  grid.innerHTML = "";
  for (let i = 0; i < count; i++) {
    const card = document.createElement("div");
    card.className = "skeleton-card";
    card.innerHTML = `
      <div class="skeleton-img"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line"></div>
        <div class="skeleton-line"></div>
      </div>
    `;
    grid.appendChild(card);
  }
}

function renderCatalog() {
  const grid = document.getElementById("catalog-grid");
  const status = document.getElementById("catalog-status");
  grid.innerHTML = "";
  if (!PRODUCTS.length) {
    status.classList.remove("hidden");
    status.innerHTML = "<i class=\"fa-solid fa-circle-exclamation\"></i> مفيش باقات متاحة دلوقتي";
    return;
  }
  status.classList.add("hidden");
  PRODUCTS.forEach((product, i) => {
    const meta = getProductMeta(product.key);
    const min = minPriceOf(product);
    const card = document.createElement("div");
    card.className = "product-card";
    card.setAttribute("role", "button");
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-label", meta.title);
    card.style.animationDelay = Math.min(i * 60, 400) + "ms";
    card.innerHTML = `
      <div class="product-card-img"><img src="${meta.cardImage}" alt="${escapeHtml(meta.title)}" loading="lazy" onerror="this.style.opacity='0'"></div>
      <div class="product-card-body">
        <h3>${escapeHtml(meta.title)}</h3>
        <div class="product-card-price">${min !== null ? "يبدأ من " + formatEGP(min) : ""}</div>
      </div>
    `;
    card.addEventListener("click", () => openFlow(product.key));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openFlow(product.key);
      }
    });
    grid.appendChild(card);
  });
}

function findProduct(key) {
  return PRODUCTS.find(p => p.key === key) || null;
}

const STEP_ORDER = ["detail", "payment", "customer", "invoice"];

function resolveVariantIndex(product, restore) {
  if (!restore) return 0;
  if (restore.variantName) {
    const byName = product.variants.findIndex(v => v.name === restore.variantName);
    if (byName !== -1) return byName;
  }
  if (typeof restore.variantIndex === "number" && restore.variantIndex < product.variants.length) {
    return restore.variantIndex;
  }
  return 0;
}

function openFlow(key, restore) {
  const product = findProduct(key);
  if (!product) return;
  currentProduct = product;
  currentVariantIndex = resolveVariantIndex(product, restore);
  appliedCoupon = (restore && restore.coupon) || null;
  activePayMethod = (restore && restore.payMethod) || "instapay";

  document.getElementById("coupon-input").value = (restore && restore.couponInput) || "";
  document.getElementById("customer-name").value = (restore && restore.customerName) || "";
  document.getElementById("customer-phone").value = (restore && restore.customerPhone) || "";
  document.getElementById("agree-check").checked = !!(restore && restore.agreed);
  document.getElementById("transfer-confirm").checked = !!(restore && restore.transferConfirmed);
  document.getElementById("to-customer-btn").disabled = !(restore && restore.transferConfirmed);

  const msg = document.getElementById("coupon-msg");
  if (appliedCoupon) {
    msg.textContent = "تم تطبيق الكود بنجاح";
    msg.className = "coupon-msg ok";
  } else {
    msg.textContent = "";
    msg.className = "coupon-msg";
  }

  setPayMethod(activePayMethod);
  renderDetail();
  validateCustomerFields();

  const step = (restore && restore.step) || "detail";
  if (step === "payment" || step === "customer") renderPayment();
  if (step === "invoice" && restore.invoice) renderInvoice(restore.invoice);

  document.getElementById("flow-overlay").classList.add("open");
  document.body.classList.add("modal-open");
  showStep(step, true);
  document.getElementById("flow-close").focus();
  persistState();
}

function closeFlow() {
  document.getElementById("flow-overlay").classList.remove("open");
  document.body.classList.remove("modal-open");
  currentProduct = null;
  appliedCoupon = null;
  localStorage.removeItem(STORAGE_KEY);
}

function hideFlowOnly() {
  document.getElementById("flow-overlay").classList.remove("open");
  document.body.classList.remove("modal-open");
}

function showStep(step, silent) {
  document.querySelectorAll(".flow-panel").forEach(p => p.classList.toggle("active", p.dataset.panel === step));
  const stepIndex = STEP_ORDER.indexOf(step);
  document.querySelectorAll(".flow-step-dot").forEach(d => {
    const dotIndex = STEP_ORDER.indexOf(d.dataset.step);
    d.classList.toggle("active", dotIndex === stepIndex);
    d.classList.toggle("done", dotIndex < stepIndex);
  });
  const fill = document.getElementById("flow-steps-fill");
  if (fill) fill.style.width = stepIndex <= 0 ? "0%" : `${(stepIndex / (STEP_ORDER.length - 1)) * 100}%`;
  const panel = document.querySelector(".flow-panel.active .panel-scroll, .flow-panel.active .detail-body");
  if (panel) panel.scrollTop = 0;
  if (!silent) persistState();
}

function youtubeEmbedUrl(url) {
  const match = String(url).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{6,})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function renderDetail() {
  const meta = getProductMeta(currentProduct.key);
  const banner = document.getElementById("detail-banner-img");
  banner.src = meta.bannerImage;
  banner.alt = meta.title;
  document.getElementById("detail-title").textContent = meta.title;

  const list = document.getElementById("variant-list");
  list.innerHTML = "";
  currentProduct.variants.forEach((variant, i) => {
    const row = document.createElement("div");
    const selected = i === currentVariantIndex;
    row.className = "variant-option" + (selected ? " selected" : "");
    row.setAttribute("role", "radio");
    row.setAttribute("aria-checked", String(selected));
    row.setAttribute("tabindex", selected ? "0" : "-1");
    const oldNum = toNumber(variant.out_cash);
    const newNum = isFree(variant.cash) ? 0 : toNumber(variant.cash);
    const showOld = oldNum !== null && newNum !== null && oldNum > newNum;
    row.innerHTML = `
      <span class="variant-option-name">${escapeHtml(variant.name)}</span>
      <span class="variant-option-price">
        ${showOld ? `<span class="variant-option-old">${formatEGP(oldNum)}</span>` : ""}
        <span class="variant-option-new">${priceLabel(variant)}</span>
      </span>
    `;
    row.addEventListener("click", () => selectVariant(i));
    row.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectVariant(i);
      }
    });
    list.appendChild(row);
  });

  const infoWrap = document.getElementById("info-blocks");
  infoWrap.innerHTML = "";
  const fields = [
    { key: "dit", title: "تفاصيل الباقة" },
    { key: "how_use", title: "طريقة الاستخدام" },
    { key: "back", title: "سياسة الاسترجاع" }
  ];
  fields.forEach(f => {
    const shared = sharedValue(currentProduct.variants, f.key);
    const text = shared === "" ? "" : (shared !== null ? shared : currentProduct.variants[currentVariantIndex][f.key]);
    if (!text) return;
    const block = document.createElement("div");
    block.className = "info-block";
    block.innerHTML = `<div class="info-block-title">${f.title}</div><div class="info-block-text">${escapeHtml(text)}</div>`;
    infoWrap.appendChild(block);
  });

  const extra = document.getElementById("lovable-extra");
  extra.innerHTML = "";
  const variant = currentProduct.variants[currentVariantIndex];
  if (variant.EX_url) {
    const a = document.createElement("a");
    a.href = variant.EX_url;
    a.target = "_blank";
    a.rel = "noopener";
    a.innerHTML = `<i class="fa-solid fa-download"></i> تحميل الإضافة`;
    extra.appendChild(a);
  }
  if (variant.vid_url) {
    const btn = document.createElement("button");
    btn.innerHTML = `<i class="fa-solid fa-play"></i> شغل الفيديو`;
    const videoWrap = document.createElement("div");
    videoWrap.className = "lovable-video";
    const ytUrl = youtubeEmbedUrl(variant.vid_url);
    videoWrap.innerHTML = ytUrl
      ? `<iframe src="${ytUrl}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="width:100%;aspect-ratio:16/9;border:0;display:block;"></iframe>`
      : `<video controls src="${variant.vid_url}"></video>`;
    btn.addEventListener("click", () => videoWrap.classList.toggle("open"));
    extra.appendChild(btn);
    extra.appendChild(videoWrap);
  }

  document.getElementById("detail-price").textContent = priceLabel(variant);
}

function selectVariant(i) {
  currentVariantIndex = i;
  renderDetail();
  persistState();
}

function currentVariant() {
  return currentProduct.variants[currentVariantIndex];
}

function basePrice() {
  const v = currentVariant();
  return isFree(v.cash) ? 0 : (toNumber(v.cash) || 0);
}

function validateCodeRemote(input) {
  const clean = String(input || "").trim();
  if (!clean) return Promise.resolve({ ok: false, message: "اكتب الكود الأول" });
  return fetch(`${DATA_URL}?action=validateCode&code=${encodeURIComponent(clean)}`)
    .then(res => res.json())
    .catch(() => ({ ok: false, message: "تعذر التأكد من الكود، حاول تاني" }));
}

function computeTotal() {
  const base = basePrice();
  if (!appliedCoupon) return { base, discount: 0, final: base };
  let discount = 0;
  if (appliedCoupon.type === "fixed") discount = appliedCoupon.value;
  else if (appliedCoupon.type === "percent") discount = base * (appliedCoupon.value / 100);
  const final = Math.max(base - discount, 0);
  return { base, discount, final };
}

function renderPayment() {
  const meta = getProductMeta(currentProduct.key);
  const variant = currentVariant();
  document.getElementById("order-summary").innerHTML = `
    <div class="order-summary-name">${escapeHtml(meta.title)}</div>
    <div class="order-summary-plan">${escapeHtml(variant.name)}</div>
  `;
  const totals = computeTotal();
  document.getElementById("total-amount").textContent = formatEGP(totals.final);
  renderPayDetail();
}

function renderPayDetail() {
  const box = document.getElementById("pay-detail");
  if (activePayMethod === "instapay") {
    box.innerHTML = `حول المبلغ عبر رقم انستا باي<br><strong>${PAYMENT_CONFIG.instapayNumber}</strong><span class="pay-copy" data-copy="${PAYMENT_CONFIG.instapayNumber}"><i class="fa-solid fa-copy"></i> نسخ</span>`;
  } else if (activePayMethod === "telda") {
    box.innerHTML = `حول على اليوزر نيم<br><strong>${PAYMENT_CONFIG.teldaUsername}</strong><span class="pay-copy" data-copy="${PAYMENT_CONFIG.teldaUsername}"><i class="fa-solid fa-copy"></i> نسخ</span>`;
  } else {
    box.innerHTML = `هيتم تحديد بيانات التحويل بعد التواصل مع الدعم الفني وإرسال الفاتورة<br><a class="pay-copy" href="https://wa.me/${PAYMENT_CONFIG.supportPhone}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp"></i> تواصل مع الدعم</a>`;
  }
}

function setPayMethod(method) {
  activePayMethod = method;
  document.querySelectorAll(".pay-tab").forEach(t => t.classList.toggle("active", t.dataset.method === method));
  renderPayDetail();
}

function showToast(text) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1800);
}

function copyText(text, el) {
  const done = () => {
    showToast("تم النسخ");
    if (el) {
      const original = el.innerHTML;
      el.classList.add("copied");
      el.innerHTML = `<i class="fa-solid fa-check"></i> اتنسخ`;
      setTimeout(() => {
        el.classList.remove("copied");
        el.innerHTML = original;
      }, 1500);
    }
  };
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(done);
  } else {
    done();
  }
}

function isValidEgyptPhone(phone) {
  return /^01[0125][0-9]{8}$/.test(String(phone || "").trim());
}

function validateCustomerFields() {
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const agreed = document.getElementById("agree-check").checked;
  const nameField = document.getElementById("name-field");
  const phoneField = document.getElementById("phone-field");
  const nameHint = document.getElementById("name-hint");
  const phoneHint = document.getElementById("phone-hint");

  const nameOk = name.length >= 2;
  const phoneOk = isValidEgyptPhone(phone);

  nameField.classList.toggle("invalid", name.length > 0 && !nameOk);
  nameHint.textContent = name.length > 0 && !nameOk ? "اكتب اسمك بالكامل" : "";

  phoneField.classList.toggle("invalid", phone.length > 0 && !phoneOk);
  phoneHint.textContent = phone.length > 0 && !phoneOk ? "رقم الهاتف مش صحيح" : "";

  const valid = nameOk && phoneOk && agreed;
  document.getElementById("to-invoice-btn").disabled = !valid;
  return valid;
}

function buildInvoice() {
  const meta = getProductMeta(currentProduct.key);
  const variant = currentVariant();
  const totals = computeTotal();
  const now = new Date();
  return {
    id: "MC-" + now.getTime().toString(36).toUpperCase(),
    date: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
    customerName: document.getElementById("customer-name").value.trim(),
    customerPhone: document.getElementById("customer-phone").value.trim(),
    productTitle: meta.title,
    variantName: variant.name,
    basePrice: totals.base,
    couponCode: appliedCoupon ? String(appliedCoupon.code) : "",
    discountAmount: totals.discount,
    finalPrice: totals.final,
    backText: variant.back || ""
  };
}

function renderInvoice(inv) {
  document.getElementById("invoice-id").textContent = "رقم الفاتورة: " + inv.id;
  document.getElementById("invoice-date").textContent = "التاريخ: " + inv.date;
  document.getElementById("invoice-customer").textContent = `${inv.customerName} — ${inv.customerPhone}`;
  document.getElementById("invoice-product").textContent = `${inv.productTitle} — ${inv.variantName}`;
  document.getElementById("invoice-back").textContent = inv.backText;

  const table = document.getElementById("invoice-price-table");
  let html = `<div class="invoice-price-line"><span>سعر الباقة</span><span>${formatEGP(inv.basePrice)}</span></div>`;
  if (inv.couponCode) {
    html += `<div class="invoice-price-line"><span>كود الخصم (${escapeHtml(inv.couponCode)})</span><span>- ${formatEGP(inv.discountAmount)}</span></div>`;
  }
  html += `<div class="invoice-price-line total"><span>الإجمالي</span><strong>${formatEGP(inv.finalPrice)}</strong></div>`;
  table.innerHTML = html;
}

function persistState() {
  if (!currentProduct) return;
  const activePanel = document.querySelector(".flow-panel.active");
  const variant = currentProduct.variants[currentVariantIndex];
  const state = {
    productKey: currentProduct.key,
    variantIndex: currentVariantIndex,
    variantName: variant ? variant.name : "",
    step: activePanel ? activePanel.dataset.panel : "detail",
    coupon: appliedCoupon,
    couponInput: document.getElementById("coupon-input").value,
    payMethod: activePayMethod,
    transferConfirmed: document.getElementById("transfer-confirm").checked,
    customerName: document.getElementById("customer-name").value,
    customerPhone: document.getElementById("customer-phone").value,
    agreed: document.getElementById("agree-check").checked,
    invoice: window.__lastInvoice || null
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const state = JSON.parse(raw);
    if (state.invoice) window.__lastInvoice = state.invoice;
    openFlow(state.productKey, state);
  } catch (e) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function resetFlow() {
  localStorage.removeItem(STORAGE_KEY);
  window.__lastInvoice = null;
  appliedCoupon = null;
  document.getElementById("coupon-input").value = "";
  document.getElementById("coupon-msg").textContent = "";
  document.getElementById("customer-name").value = "";
  document.getElementById("customer-phone").value = "";
  document.getElementById("agree-check").checked = false;
  document.getElementById("transfer-confirm").checked = false;
  document.getElementById("to-customer-btn").disabled = true;
  document.getElementById("to-invoice-btn").disabled = true;
  document.getElementById("name-field").classList.remove("invalid");
  document.getElementById("phone-field").classList.remove("invalid");
  closeFlow();
}

function handleFlowClose() {
  const activePanel = document.querySelector(".flow-panel.active");
  if (activePanel && activePanel.dataset.panel === "invoice") {
    hideFlowOnly();
  } else {
    resetFlow();
  }
}

function bindEvents() {
  document.getElementById("flow-close").addEventListener("click", handleFlowClose);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape" && document.getElementById("flow-overlay").classList.contains("open")) {
      handleFlowClose();
    }
  });

  document.getElementById("to-payment-btn").addEventListener("click", () => {
    renderPayment();
    showStep("payment");
  });

  document.querySelectorAll("[data-back]").forEach(btn => {
    btn.addEventListener("click", () => showStep(btn.dataset.back));
  });

  document.getElementById("coupon-apply").addEventListener("click", () => {
    const input = document.getElementById("coupon-input").value.trim();
    const msg = document.getElementById("coupon-msg");
    const btn = document.getElementById("coupon-apply");
    msg.textContent = "جاري التأكد من الكود";
    msg.className = "coupon-msg";
    btn.disabled = true;
    validateCodeRemote(input).then(result => {
      btn.disabled = false;
      if (result.ok) {
        appliedCoupon = { code: input, type: result.type, value: result.value };
        msg.textContent = "تم تطبيق الكود بنجاح";
        msg.className = "coupon-msg ok";
      } else {
        appliedCoupon = null;
        msg.textContent = result.message || "الكود غير صحيح";
        msg.className = "coupon-msg error";
      }
      renderPayment();
      persistState();
    });
  });

  document.querySelectorAll(".pay-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      setPayMethod(tab.dataset.method);
      persistState();
    });
  });

  document.getElementById("pay-detail").addEventListener("click", e => {
    const target = e.target.closest(".pay-copy[data-copy]");
    if (target) copyText(target.dataset.copy, target);
  });

  document.getElementById("transfer-confirm").addEventListener("change", e => {
    document.getElementById("to-customer-btn").disabled = !e.target.checked;
    persistState();
  });

  document.getElementById("to-customer-btn").addEventListener("click", () => {
    showStep("customer");
    validateCustomerFields();
  });

  ["customer-name", "customer-phone"].forEach(id => {
    document.getElementById(id).addEventListener("input", () => {
      validateCustomerFields();
      persistState();
    });
  });

  document.getElementById("agree-check").addEventListener("change", () => {
    validateCustomerFields();
    persistState();
  });

  document.getElementById("to-invoice-btn").addEventListener("click", () => {
    const error = document.getElementById("customer-error");
    if (!validateCustomerFields()) {
      error.textContent = "من فضلك اتأكد من البيانات وإنك موافق على السياسة";
      return;
    }
    error.textContent = "";
    const invoice = buildInvoice();
    window.__lastInvoice = invoice;
    renderInvoice(invoice);
    showStep("invoice");
  });

  document.getElementById("download-invoice-btn").addEventListener("click", () => {
    html2canvas(document.getElementById("invoice-card"), { backgroundColor: "#0b0e14" }).then(canvas => {
      const link = document.createElement("a");
      link.download = (window.__lastInvoice ? window.__lastInvoice.id : "invoice") + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    });
  });

  document.getElementById("send-whatsapp-btn").addEventListener("click", () => {
    const inv = window.__lastInvoice;
    if (!inv) return;
    const text = `مرحبًا، معايا فاتورة رقم ${inv.id}\nالباقة: ${inv.productTitle} - ${inv.variantName}\nالإجمالي: ${formatEGP(inv.finalPrice)}\nهبعتلك سكرين التحويل والفاتورة`;
    window.open(`https://wa.me/${PAYMENT_CONFIG.supportPhone}?text=${encodeURIComponent(text)}`, "_blank");
  });

  document.getElementById("new-order-btn").addEventListener("click", resetFlow);
}

document.addEventListener("DOMContentLoaded", () => {
  bindEvents();
  renderSkeleton(6);
  fetch(DATA_URL)
    .then(res => res.json())
    .then(json => {
      PRODUCTS = parseData(json);
      renderCatalog();
      restoreState();
    })
    .catch(() => {
      document.getElementById("catalog-grid").innerHTML = "";
      const status = document.getElementById("catalog-status");
      status.classList.remove("hidden");
      status.innerHTML = "<i class=\"fa-solid fa-circle-exclamation\"></i> تعذر تحميل الباقات، جرب تحدث الصفحة";
    });
});