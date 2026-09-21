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

  /* ---------- 入场动画 ----------
     .reveal 起始是 opacity:0，所以这段代码一旦不生效，内容就会永久不可见。
     这对一个"给审稿人核验用"的页面是不能接受的失败模式，因此下面留了安全网。 */
  var revealables = document.querySelectorAll(".reveal");

  /* 硬显示：直接卸掉 .reveal（唯一把 opacity 设为 0 的地方），
     而不是加 .in 去跑淡入过渡 —— 过渡本身也可能不执行
     （隐藏标签页、零高度视口、无头浏览器），那样内容照样看不见。 */
  var hardShow = function (el) {
    el.classList.remove("reveal");
    el.classList.add("in");
  };
  var showAll = function () {
    revealables.forEach(hardShow);
  };
  var stuckInvisible = function (el) {
    return el.classList.contains("reveal") &&
           parseFloat(getComputedStyle(el).opacity) < 0.99;
  };

  if (reduced || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in");
        obs.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.06 });
    revealables.forEach(function (el) { ro.observe(el); });

    /* 安全网，两条规则，覆盖两种失效方式：
       ① 一个都没亮 → 观察器根本没工作（零高度视口、无头浏览器、爬虫），
          整页硬显示，连同折叠线以下的内容。
       ② 有的亮了，但某个在视口内的元素仍停在 opacity:0 → 类加上了、
          过渡没跑起来，单独把它硬显示。折叠线以下的保留滚动动画。
       宁可丢掉动画，也不能让内容消失。 */
    setTimeout(function () {
      var anyShown = Array.prototype.some.call(revealables, function (el) {
        return !el.classList.contains("reveal") || !stuckInvisible(el);
      });
      if (!anyShown) { showAll(); return; }

      revealables.forEach(function (el) {
        if (!stuckInvisible(el)) return;
        var r = el.getBoundingClientRect();
        var inView = !innerHeight || (r.top < innerHeight && r.bottom > 0);
        if (inView) hardShow(el);
      });
    }, 2500);
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
