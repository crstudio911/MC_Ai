const reviews = [{
  img: "img/pro1.png",
  name: "أحمد سعيد",
  text: "كل شئ كان سهل و أمن و عرفت كل التفاصيل قبل الاشتراك"
},
{
  img: "img/pro1.png",
  name: "عبد الله حسن",
  text: "الدعم الفني فعلا سريع جدا في الرد"
},
{
  img: "img/pro2.png",
  name: "د.فاطمة",
  text: "تعامل راقي و بصراحة مش اول تعامل كنت بتعامل معاهم من قبل"
},
];
const faqs = [{
  q: "اقدر اعمل استرجاع بعد الشراء؟ ",
  a: "تفاصيل الاسترجاع و الباقه موجوده في تفاصيل الاشتراك "
},
{
  q: "ما هي طرق التحويل المتاحه؟ ",
  a: " أنستا باي او حساب بنكي او فوري او تيلدا"
},
{
  q: " الدعم الفني اتواصل معا ازاي؟",
  a: " تقدر تتواصل عن طريق رقم الواتساب الثابت الرسمي او عن طريق الزر العائم الي تحت علي اليمين او الشمال"
},
];
function reviewCard(r) {
  const card = document.createElement("div");
  card.className = "review-card";
  card.innerHTML = `
    <div class="review-stamp"><i class="fa-solid fa-check"></i> عميل موثق</div>
    <p class="review-text">${r.text}</p>
    <div class="review-person">
      <img src="${r.img}" alt="${r.name}" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'avatar-fallback',innerHTML:'<i class=\\'fa-solid fa-user\\'></i>'}))">
      <span>${r.name}</span>
    </div>
  `;
  return card;
}
function buildMarquee() {
  const rowRight = document.getElementById("row-right");
  const rowLeft = document.getElementById("row-left");
  if (!rowRight || !rowLeft) return;
  const half = Math.ceil(reviews.length / 2);
  const setA = reviews.slice(0, half);
  const setB = reviews.slice(half);
  [setA, setA].forEach(set => set.forEach(r => rowRight.appendChild(reviewCard(r))));
  [setB, setB].forEach(set => set.forEach(r => rowLeft.appendChild(reviewCard(r))));
}
function buildFaq() {
  const list = document.getElementById("faq-list");
  if (!list) return;
  faqs.forEach(f => {
    const item = document.createElement("div");
    item.className = "faq-item";
    item.innerHTML = `
      <button class="faq-q">
        <span>${f.q}</span>
        <i class="fa-solid fa-chevron-down"></i>
      </button>
      <div class="faq-a"><p>${f.a}</p></div>
    `;
    const btn = item.querySelector(".faq-q");
    const answer = item.querySelector(".faq-a");
    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      list.querySelectorAll(".faq-item").forEach(el => {
        el.classList.remove("open");
        el.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
    list.appendChild(item);
  });
}
function setupNavShadow() {
  const nav = document.getElementById("topbar");
  const bar = document.getElementById("progress-bar");
  if (!nav) return;
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      nav.style.background = "rgba(5,6,8,.94)";
      nav.style.borderBottomColor = "rgba(238,241,245,.1)";
    } else {
      nav.style.background = "linear-gradient(to bottom, rgba(5,6,8,.86), rgba(5,6,8,0))";
      nav.style.borderBottomColor = "transparent";
    }
    if (bar) {
      const scrolled = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = height > 0 ? `${scrolled / height * 100}%` : "0%";
    }
  });
}
function setupMagneticCta() {
  const btn = document.getElementById("cta-magnetic");
  if (!btn || window.matchMedia("(pointer: coarse)").matches) return;
  btn.addEventListener("mousemove", e => {
    const rect = btn.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${relX * 0.15}px, ${relY * 0.28}px)`;
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0, 0)";
  });
}
function setupAiCoreParallax() {
  const stage = document.querySelector(".hero-visual");
  const core = document.getElementById("ai-core");
  if (!stage || !core || window.matchMedia("(pointer: coarse)").matches) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  stage.addEventListener("mousemove", e => {
    const rect = stage.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    core.style.transform = `rotateY(${px * 14}deg) rotateX(${py * -14}deg)`;
  });
  stage.addEventListener("mouseleave", () => {
    core.style.transform = "";
  });
}
document.addEventListener("DOMContentLoaded", () => {
  buildMarquee();
  buildFaq();
  setupNavShadow();
  setupMagneticCta();
  setupAiCoreParallax();
});

//=======================BdaCODE,ElAssist=====================

(function () {
  "use strict";

  if (window.__A9NA_CHAT_WIDGET_LOADED__) return;
  window.__A9NA_CHAT_WIDGET_LOADED__ = true;

  var CFG = {
    whatsappNumber: "201274277202",
    brandName: "مساعد MC_Ai",
    position: "right",
    firstOpenDelayTyping: 550
  };

  var css = "" +
  "#a9na-chat-launcher{position:fixed;" + (CFG.position === "left" ? "left:22px;" : "right:22px;") + "bottom:22px;width:54px;height:54px;border-radius:50%;" +
    "background:linear-gradient(135deg,var(--chrome-300,#b7bec9),var(--azure-600,#1f6fb3));box-shadow:0 14px 34px -8px rgba(0,0,0,.55),0 0 0 4px rgba(47,143,224,.14);" +
    "display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:999999;border:none;transition:transform .25s var(--ease,cubic-bezier(.16,.84,.32,1)),box-shadow .25s;}" +
  "#a9na-chat-launcher:hover{transform:translateY(-3px) scale(1.05);box-shadow:0 18px 40px -8px rgba(0,0,0,.6),0 0 0 6px rgba(47,143,224,.2);}" +
  "#a9na-chat-launcher svg{width:24px;height:24px;fill:var(--void,#050608);transition:transform .35s var(--ease,cubic-bezier(.16,.84,.32,1));}" +
  "#a9na-chat-launcher.open svg{transform:rotate(90deg) scale(.001);opacity:0;position:absolute;}" +
  "#a9na-chat-launcher .a9na-close-ic{position:absolute;width:24px;height:24px;fill:var(--void,#050608);opacity:0;transform:rotate(-90deg) scale(.001);transition:transform .35s var(--ease,cubic-bezier(.16,.84,.32,1)),opacity .2s;}" +
  "#a9na-chat-launcher.open .a9na-close-ic{opacity:1;transform:rotate(0) scale(1);}" +
  "#a9na-chat-launcher .a9na-ping{position:absolute;inset:-4px;border-radius:50%;border:2px solid rgba(47,143,224,.5);animation:a9naPing 2.2s ease-out infinite;}" +
  "#a9na-chat-launcher .a9na-badge{position:absolute;top:-4px;" + (CFG.position === "left" ? "right:-4px;" : "left:-4px;") + "min-width:20px;height:20px;padding:0 5px;border-radius:999px;background:var(--danger,#e5677a);color:#fff;font:700 11px/20px 'Almarai',sans-serif;text-align:center;box-shadow:0 2px 8px rgba(0,0,0,.4);}" +
  "@keyframes a9naPing{0%{transform:scale(.9);opacity:.7}70%{transform:scale(1.35);opacity:0}100%{opacity:0}}" +

  "#a9na-chat-window{position:fixed;" + (CFG.position === "left" ? "left:22px;" : "right:22px;") + "bottom:92px;width:300px;max-width:90vw;height:400px;max-height:65vh;" +
    "background:var(--void-panel,#0b0e14);border:1px solid var(--void-line,rgba(238,241,245,.1));border-radius:20px;overflow:hidden;" +
    "box-shadow:0 24px 70px -20px rgba(2,3,6,.8);display:flex;flex-direction:column;z-index:999998;" +
    "opacity:0;transform:translateY(18px) scale(.97);pointer-events:none;transition:opacity .28s var(--ease-soft,cubic-bezier(.22,.61,.36,1)),transform .28s var(--ease-soft,cubic-bezier(.22,.61,.36,1));" +
    "font-family:'Almarai',sans-serif;direction:rtl;}" +
  "#a9na-chat-window.open{opacity:1;transform:translateY(0) scale(1);pointer-events:auto;}" +

  "#a9na-chat-header{display:flex;align-items:center;gap:12px;padding:16px 18px;background:linear-gradient(180deg,var(--void-panel,#0b0e14),var(--void-raised,#12161f));border-bottom:1px solid var(--void-line,rgba(238,241,245,.1));flex-shrink:0;}" +
  "#a9na-chat-header .a9na-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--chrome-300,#b7bec9),var(--azure-600,#1f6fb3));display:flex;align-items:center;justify-content:center;flex-shrink:0;}" +
  "#a9na-chat-header .a9na-avatar svg{width:20px;height:20px;fill:var(--void,#050608);}" +
  "#a9na-chat-header .a9na-title{flex:1;min-width:0;}" +
  "#a9na-chat-header .a9na-title b{display:block;color:var(--chrome-100,#eef1f5);font-size:15px;font-family:'El Messiri',sans-serif;font-weight:700;}" +
  "#a9na-chat-header .a9na-title span{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--azure-300,#6cc4ff);margin-top:2px;}" +
  "#a9na-chat-header .a9na-title span::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--azure-300,#6cc4ff);box-shadow:0 0 6px var(--azure-300,#6cc4ff);}" +
  "#a9na-chat-header .a9na-home-btn,#a9na-chat-header .a9na-close-btn{width:30px;height:30px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:transparent;color:var(--chrome-300,#b7bec9);transition:background .2s,color .2s;flex-shrink:0;}" +
  "#a9na-chat-header .a9na-home-btn:hover,#a9na-chat-header .a9na-close-btn:hover{background:rgba(238,241,245,.08);color:var(--chrome-100,#eef1f5);}" +
  "#a9na-chat-header .a9na-home-btn svg,#a9na-chat-header .a9na-close-btn svg{width:16px;height:16px;fill:currentColor;}" +

  "#a9na-chat-body{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}" +
  "#a9na-chat-body::-webkit-scrollbar{width:6px;}#a9na-chat-body::-webkit-scrollbar-thumb{background:var(--azure-600,#1f6fb3);border-radius:6px;}" +

  ".a9na-row{display:flex;gap:8px;max-width:92%;animation:a9naIn .28s var(--ease-soft,cubic-bezier(.22,.61,.36,1));}" +
  "@keyframes a9naIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}" +
  ".a9na-row.bot{align-self:flex-start;}" +
  ".a9na-row.user{align-self:flex-end;flex-direction:row-reverse;}" +
  ".a9na-row .a9na-mini-avatar{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--chrome-300,#b7bec9),var(--azure-600,#1f6fb3));flex-shrink:0;display:flex;align-items:center;justify-content:center;margin-top:2px;}" +
  ".a9na-row .a9na-mini-avatar svg{width:13px;height:13px;fill:var(--void,#050608);}" +
  ".a9na-bubble{padding:11px 14px;border-radius:16px;font-size:13.5px;line-height:1.8;white-space:pre-wrap;word-break:break-word;box-shadow:0 4px 14px -4px rgba(0,0,0,.35);display:flex;align-items:flex-start;gap:8px;}" +
  ".a9na-bubble-icon{flex-shrink:0;margin-top:2px;}" +
  ".a9na-bubble-icon svg{width:15px;height:15px;fill:var(--azure-300,#6cc4ff);display:block;}" +
  ".a9na-row.user .a9na-bubble-icon svg{fill:#fff;}" +
  ".a9na-row.bot .a9na-bubble{background:var(--void-raised,#12161f);color:var(--chrome-100,#eef1f5);border-bottom-right-radius:4px;border:1px solid var(--void-line,rgba(238,241,245,.08));}" +
  ".a9na-row.user .a9na-bubble{background:linear-gradient(120deg,var(--azure-600,#1f6fb3),var(--azure-500,#2f8fe0));color:#fff;border-bottom-left-radius:4px;}" +

  ".a9na-typing{align-self:flex-start;display:flex;gap:4px;padding:12px 16px;background:var(--void-raised,#12161f);border-radius:16px;border-bottom-right-radius:4px;border:1px solid var(--void-line,rgba(238,241,245,.08));width:fit-content;}" +
  ".a9na-typing span{width:6px;height:6px;border-radius:50%;background:var(--chrome-300,#b7bec9);animation:a9naBlink 1.2s infinite ease-in-out;}" +
  ".a9na-typing span:nth-child(2){animation-delay:.18s}.a9na-typing span:nth-child(3){animation-delay:.36s}" +
  "@keyframes a9naBlink{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-4px);opacity:1}}" +

  ".a9na-chips{display:flex;flex-direction:column;gap:8px;align-self:flex-start;max-width:92%;margin-top:2px;}" +
  ".a9na-chip{text-align:right;padding:10px 14px;border-radius:10px;background:var(--void-panel,#0b0e14);border:1px solid var(--azure-900,#0d2c4a);color:var(--azure-300,#6cc4ff);font-size:13px;font-weight:700;cursor:pointer;transition:background .2s,border-color .2s,transform .15s;display:flex;align-items:center;gap:8px;}" +
  ".a9na-chip:hover{background:rgba(47,143,224,.1);border-color:var(--azure-500,#2f8fe0);transform:translateX(-2px);}" +
  ".a9na-chip svg{width:15px;height:15px;fill:currentColor;flex-shrink:0;}" +

  ".a9na-back-btn{align-self:flex-start;display:flex;align-items:center;gap:6px;padding:8px 14px;border-radius:999px;background:transparent;border:1px solid var(--void-line,rgba(238,241,245,.14));color:var(--chrome-300,#b7bec9);font-size:12.5px;font-weight:700;cursor:pointer;transition:background .2s,color .2s;margin-top:2px;}" +
  ".a9na-back-btn:hover{background:rgba(238,241,245,.06);color:var(--chrome-100,#eef1f5);}" +
  ".a9na-back-btn svg{width:12px;height:12px;fill:currentColor;}" +

  "#a9na-chat-footer{border-top:1px solid var(--void-line,rgba(238,241,245,.1));padding:10px;display:none;gap:8px;flex-shrink:0;background:var(--void-panel,#0b0e14);}" +
  "#a9na-chat-footer.active{display:flex;}" +
  "#a9na-chat-input{flex:1;resize:none;max-height:70px;background:var(--void-raised,#12161f);border:1px solid var(--void-line,rgba(238,241,245,.12));border-radius:12px;padding:10px 12px;color:var(--chrome-100,#eef1f5);font:400 13.5px/1.6 'Almarai',sans-serif;outline:none;transition:border-color .2s;}" +
  "#a9na-chat-input:focus{border-color:var(--azure-500,#2f8fe0);}" +
  "#a9na-chat-input::placeholder{color:var(--text-faint,#5c6270);}" +
  "#a9na-chat-send{width:40px;height:40px;border-radius:12px;background:linear-gradient(120deg,var(--azure-600,#1f6fb3),var(--azure-500,#2f8fe0));display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:transform .15s;}" +
  "#a9na-chat-send:hover{transform:scale(1.06);}" +
  "#a9na-chat-send:active{transform:scale(.94);}" +
  "#a9na-chat-send svg{width:17px;height:17px;fill:#fff;}" +
  "#a9na-chat-send:disabled{opacity:.45;pointer-events:none;}" +

  "@media (max-width:420px){#a9na-chat-window{width:92vw;height:68vh;bottom:84px;" + (CFG.position === "left" ? "left:4vw;" : "right:4vw;") + "}}";

  var styleTag = document.createElement("style");
  styleTag.id = "a9na-chat-style";
  styleTag.textContent = css;
  document.head.appendChild(styleTag);

  var ICONS = {
    chat: '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.57 2.78 6.19-.15 1.29-.7 2.6-1.68 3.53a.5.5 0 00.4.85c1.83-.15 3.6-.85 5.06-1.87.78.16 1.6.24 2.44.24 5.52 0 10-4.03 10-9S17.52 2 12 2z"/></svg>',
    close: '<svg viewBox="0 0 24 24"><path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"/></svg>',
    home: '<svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>',
    bot: '<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 012 2c0 .74-.4 1.39-1 1.73V7h3a3 3 0 013 3v6a3 3 0 01-3 3H8a3 3 0 01-3-3v-6a3 3 0 013-3h3V5.73c-.6-.34-1-.99-1-1.73a2 2 0 012-2zM8 12a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm8 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z"/></svg>',
    idea: '<svg viewBox="0 0 24 24"><path d="M9 21h6v-1H9v1zm3-19a7 7 0 00-4 12.74c.6.44 1 1.16 1 1.96v.3h6v-.3c0-.8.4-1.52 1-1.96A7 7 0 0012 2z"/></svg>',
    support: '<svg viewBox="0 0 24 24"><path d="M12 2a9 9 0 00-9 9v5a3 3 0 003 3h1v-7H5v-1a7 7 0 0114 0v1h-2v7h1a3 3 0 003-3v-5a9 9 0 00-9-9z"/></svg>',
    back: '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l4.88-4.88a1 1 0 10-1.42-1.41l-6.59 6.6a1 1 0 000 1.4l6.59 6.6a1 1 0 001.42-1.41L7.83 13H20a1 1 0 000-2z"/></svg>',
    send: '<svg viewBox="0 0 24 24"><path d="M3.4 20.6l17.7-8.3a1 1 0 000-1.8L3.4 2.2a1 1 0 00-1.4 1.1L4.3 11l-2.3 7.7a1 1 0 001.4 1.1z"/></svg>',
    shield: '<svg viewBox="0 0 24 24"><path d="M12 2l8 3.5v5.3c0 5-3.4 9.2-8 10.7-4.6-1.5-8-5.7-8-10.7V5.5L12 2zm-1.2 13.4l6-6-1.4-1.4-4.6 4.6-2-2-1.4 1.4 3.4 3.4z"/></svg>',
    clock: '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.4l4 2.4-.75 1.25L11 13.5V6h1.5v6.4z"/></svg>',
    check: '<svg viewBox="0 0 24 24"><path d="M9.5 16.6L5.4 12.5l-1.4 1.4 5.5 5.5 11-11-1.4-1.4z"/></svg>'
  };

  var launcher = document.createElement("button");
  launcher.id = "a9na-chat-launcher";
  launcher.setAttribute("aria-label", "افتح المساعد الذكي");
  launcher.innerHTML =
    '<svg class="a9na-chat-ic" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.03 2 11c0 2.4 1.05 4.57 2.78 6.19-.15 1.29-.7 2.6-1.68 3.53a.5.5 0 00.4.85c1.83-.15 3.6-.85 5.06-1.87.78.16 1.6.24 2.44.24 5.52 0 10-4.03 10-9S17.52 2 12 2z"/></svg>' +
    '<svg class="a9na-close-ic" viewBox="0 0 24 24"><path d="M18.3 5.71a1 1 0 00-1.42 0L12 10.59 7.11 5.7A1 1 0 105.7 7.11L10.59 12 5.7 16.89a1 1 0 101.41 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z"/></svg>' +
    '<span class="a9na-ping"></span>' +
    '<span class="a9na-badge" id="a9na-badge">1</span>';
  document.body.appendChild(launcher);

  var win = document.createElement("div");
  win.id = "a9na-chat-window";
  win.innerHTML =
    '<div id="a9na-chat-header">' +
      '<div class="a9na-avatar">' + ICONS.bot + '</div>' +
      '<div class="a9na-title"><b>' + CFG.brandName + '</b><span>متصل الآن</span></div>' +
      '<button class="a9na-home-btn" id="a9na-home-btn" title="القائمة الرئيسية">' + ICONS.home + '</button>' +
      '<button class="a9na-close-btn" id="a9na-close-btn" title="إغلاق">' + ICONS.close + '</button>' +
    '</div>' +
    '<div id="a9na-chat-body"></div>' +
    '<div id="a9na-chat-footer">' +
      '<textarea id="a9na-chat-input" rows="1" placeholder="اكتب رسالتك هنا..."></textarea>' +
      '<button id="a9na-chat-send" disabled>' + ICONS.send + '</button>' +
    '</div>';
  document.body.appendChild(win);

  var body = win.querySelector("#a9na-chat-body");
  var footer = win.querySelector("#a9na-chat-footer");
  var input = win.querySelector("#a9na-chat-input");
  var sendBtn = win.querySelector("#a9na-chat-send");
  var badge = launcher.querySelector("#a9na-badge");

  var state = { mode: "root", opened: false };

  function scrollDown() {
    body.scrollTop = body.scrollHeight + 200;
  }

  function addBotBubble(text, cb, iconKey) {
    var typing = document.createElement("div");
    typing.className = "a9na-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typing);
    scrollDown();
    setTimeout(function () {
      typing.remove();
      var row = document.createElement("div");
      row.className = "a9na-row bot";
      row.innerHTML = '<div class="a9na-mini-avatar">' + ICONS.bot + '</div><div class="a9na-bubble"></div>';
      var bubble = row.querySelector(".a9na-bubble");
      if (iconKey && ICONS[iconKey]) {
        var icWrap = document.createElement("span");
        icWrap.className = "a9na-bubble-icon";
        icWrap.innerHTML = ICONS[iconKey];
        bubble.appendChild(icWrap);
      }
      var textSpan = document.createElement("span");
      textSpan.textContent = text;
      bubble.appendChild(textSpan);
      body.appendChild(row);
      scrollDown();
      if (cb) cb();
    }, CFG.firstOpenDelayTyping + Math.random() * 300);
  }

  function addUserBubble(text) {
    var row = document.createElement("div");
    row.className = "a9na-row user";
    row.innerHTML = '<div class="a9na-bubble"></div>';
    row.querySelector(".a9na-bubble").textContent = text;
    body.appendChild(row);
    scrollDown();
  }

  function addChips(options) {
    var wrap = document.createElement("div");
    wrap.className = "a9na-chips";
    options.forEach(function (opt) {
      var btn = document.createElement("button");
      btn.className = "a9na-chip";
      btn.innerHTML = opt.icon + "<span>" + opt.label + "</span>";
      btn.addEventListener("click", function () {
        wrap.remove();
        addUserBubble(opt.label);
        opt.onClick();
      });
      wrap.appendChild(btn);
    });
    body.appendChild(wrap);
    scrollDown();
  }

  function addBackButton(label, onClick) {
    var btn = document.createElement("button");
    btn.className = "a9na-back-btn";
    btn.innerHTML = ICONS.back + "<span>" + label + "</span>";
    btn.addEventListener("click", function () {
      btn.remove();
      onClick();
    });
    body.appendChild(btn);
    scrollDown();
  }

  function clearChipsAndInputs() {
    body.querySelectorAll(".a9na-chips, .a9na-back-btn").forEach(function (el) { el.remove(); });
  }

  function setFooter(active, placeholder) {
    if (active) {
      footer.classList.add("active");
      input.placeholder = placeholder || "اكتب رسالتك هنا...";
      input.value = "";
      sendBtn.disabled = true;
      setTimeout(function () { input.focus(); }, 50);
    } else {
      footer.classList.remove("active");
    }
  }

  function openWhatsApp(message) {
    var url = "https://wa.me/" + CFG.whatsappNumber + "?text=" + encodeURIComponent(message);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function showRootMenu(withGreeting) {
    state.mode = "root";
    setFooter(false);
    clearChipsAndInputs();
    var options = [
      { label: "اقتراح لتطوير المنصة", icon: ICONS.idea, onClick: startSuggestFlow },
      { label: "التواصل مع الدعم الفني", icon: ICONS.support, onClick: startSupportFlow }
    ];
    if (withGreeting) {
      addBotBubble("أهلاً بيك 👋 أنا هنا عشان أساعدك.", function () {
        addBotBubble("خليك عارف: مقدرش أشوف أي بيانات جوه حسابك، ولا أنفّذ أي إجراء بدالك — بس أقدر أوصل كلامك للفريق المختص فورًا.", function () {
          addBotBubble("تحب تعمل ايه دلوقتي؟", function () {
            addChips(options);
          });
        }, "shield");
      });
    } else {
      addBotBubble("تمام، رجعناك للقائمة الرئيسية. اختار من الاسئلة تحت:", function () {
        addChips(options);
      });
    }
  }

  function startSuggestFlow() {
    state.mode = "suggest";
    addBotBubble("تمام، اكتب اقتراحك بالتفصيل زي ما انت عايز، وهوصله لفريق التطوير على طول — كل اقتراح بيتقرا فعلاً وبيتفكّر فيه.", function () {
      setFooter(true, "اكتب اقتراحك هنا...");
      addBackButton("رجوع للقائمة الرئيسية", function () { showRootMenu(false); });
    }, "idea");
  }

  function startSupportFlow() {
    state.mode = "support";
    addBotBubble("تمام، احكيلي مشكلتك أو استفسارك بالتفصيل عشان الدعم يقدر يساعدك بأسرع وقت.", function () {
      addBotBubble("غالبًا هيتم الرد خلال دقايق في أوقات الشغل.", function () {
        setFooter(true, "اكتب طلبك هنا...");
        addBackButton("رجوع للقائمة الرئيسية", function () { showRootMenu(false); });
      }, "clock");
    }, "support");
  }

  function handleSend() {
    var text = input.value.trim();
    if (!text) return;
    var mode = state.mode;
    addUserBubble(text);
    input.value = "";
    sendBtn.disabled = true;
    setFooter(false);
    clearChipsAndInputs();

    var waMessage = "";
    if (mode === "suggest") {
      waMessage = "أهلاً، عندي اقتراح لتطوير المنصة:\n" + text + "\nوشكراً";
    } else if (mode === "support") {
      waMessage = "أهلاً، عايز أتواصل مع الدعم الفني بخصوص:\n" + text + "\nوشكراً";
    }

    addBotBubble("تمام ✅ رسالتك جاهزة، هحولك دلوقتي على واتساب عشان نكمل معاك هناك.", function () {
      setTimeout(function () {
        openWhatsApp(waMessage);
        showRootMenu(false);
      }, 700);
    }, "check");
  }

  input.addEventListener("input", function () {
    sendBtn.disabled = input.value.trim().length === 0;
    input.style.height = "auto";
    input.style.height = Math.min(input.scrollHeight, 70) + "px";
  });
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!sendBtn.disabled) handleSend();
    }
  });
  sendBtn.addEventListener("click", handleSend);

  win.querySelector("#a9na-close-btn").addEventListener("click", function () { toggleWindow(false); });
  win.querySelector("#a9na-home-btn").addEventListener("click", function () { showRootMenu(false); });

  function toggleWindow(force) {
    var willOpen = typeof force === "boolean" ? force : !win.classList.contains("open");
    win.classList.toggle("open", willOpen);
    launcher.classList.toggle("open", willOpen);
    if (willOpen) {
      if (badge) { badge.remove(); badge = null; }
      if (!state.opened) {
        state.opened = true;
        showRootMenu(true);
      }
    }
  }

  launcher.addEventListener("click", function () { toggleWindow(); });

  win.addEventListener("click", function (e) { e.stopPropagation(); });

  document.addEventListener("click", function (e) {
    if (!win.classList.contains("open")) return;
    if (win.contains(e.target) || launcher.contains(e.target)) return;
    toggleWindow(false);
  });
})();

//===========5LSCODE,ElAssist==============================