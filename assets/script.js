/* Chuanhao Zhao — homepage.
   Progressive enhancement only: the page reads fine with JS disabled. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 深色模式切换 ---------- */
  var toggle = document.getElementById("theme-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
    });
  }

  /* ---------- 顶栏滚动阴影 ---------- */
  var topbar = document.querySelector(".topbar");
  if (topbar) {
    var onScroll = function () {
      topbar.classList.toggle("scrolled", window.scrollY > 8);
    };
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 入场动画 ---------- */
  var revealables = document.querySelectorAll(".reveal");
  if (reduced || !("IntersectionObserver" in window)) {
    revealables.forEach(function (el) { el.classList.add("in"); });
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el) { ro.observe(el); });
  }

  /* ---------- 邮箱一键复制 ---------- */
  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var text = btn.dataset.copy || "";
      var done = function () {
        btn.textContent = "copied";
        btn.setAttribute("data-copied", "");
        setTimeout(function () {
          btn.textContent = "copy";
          btn.removeAttribute("data-copied");
        }, 1600);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(done, function () {});
      } else {
        var ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand("copy"); done(); } catch (e) {}
        document.body.removeChild(ta);
      }
    });
  });

  /* ---------- BibTeX 展开/收起 ---------- */
  document.querySelectorAll(".bib-btn").forEach(function (btn) {
    var pre = btn.closest(".pub-body").querySelector(".bib");
    if (!pre) return;
    btn.setAttribute("aria-expanded", "false");
    btn.addEventListener("click", function () {
      var open = pre.hidden;
      pre.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
    });
  });

  /* ---------- News 折叠：超过 4 条自动隐藏 ---------- */
  var VISIBLE_NEWS = 4;
  document.querySelectorAll(".more-btn").forEach(function (btn) {
    var list = document.querySelector(btn.dataset.target);
    if (!list) return;
    var items = Array.prototype.slice.call(list.children);
    if (items.length <= VISIBLE_NEWS) return;

    items.forEach(function (li, i) { li.hidden = i >= VISIBLE_NEWS; });
    btn.hidden = false;
    btn.setAttribute("aria-expanded", "false");

    btn.addEventListener("click", function () {
      var expand = btn.getAttribute("aria-expanded") === "false";
      items.forEach(function (li, i) { li.hidden = !expand && i >= VISIBLE_NEWS; });
      btn.setAttribute("aria-expanded", String(expand));
      btn.textContent = expand ? "show less" : "show all";
    });
  });

  /* ---------- 导航高亮当前章节 ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav a"));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var visible = new Set();
    var paint = function () {
      var current = sections.find(function (s) { return visible.has(s.id); });
      navLinks.forEach(function (a) {
        if (current && a.getAttribute("href") === "#" + current.id) {
          a.setAttribute("aria-current", "true");
        } else {
          a.removeAttribute("aria-current");
        }
      });
    };
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) visible.add(e.target.id);
        else visible.delete(e.target.id);
      });
      paint();
    }, { rootMargin: "-20% 0px -70% 0px" });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- 页脚年份 ---------- */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
})();
