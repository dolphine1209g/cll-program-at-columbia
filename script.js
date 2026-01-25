(function () {
  // Mobile nav toggle
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // Hero gallery
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const slides = Array.from(gallery.querySelectorAll(".slide"));
  const dotsWrap = gallery.querySelector("[data-dots]");
  const btnPrev = gallery.querySelector("[data-prev]");
  const btnNext = gallery.querySelector("[data-next]");

  let index = 0;
  let timer = null;
  const intervalMs = 4500;

  function setActive(i) {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === index));
    if (dotsWrap) {
      dotsWrap.querySelectorAll(".hero-dot").forEach((d, k) => {
        d.classList.toggle("is-active", k === index);
      });
    }
  }

  function next() { setActive(index + 1); }
  function prev() { setActive(index - 1); }

  function start() {
    stop();
    timer = window.setInterval(next, intervalMs);
  }
  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  // Build dots
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
    slides.forEach((_, k) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "hero-dot" + (k === 0 ? " is-active" : "");
      b.setAttribute("aria-label", `Go to slide ${k + 1}`);
      b.addEventListener("click", () => {
        setActive(k);
        start();
      });
      dotsWrap.appendChild(b);
    });
  }

  // Buttons
  if (btnNext) btnNext.addEventListener("click", () => { next(); start(); });
  if (btnPrev) btnPrev.addEventListener("click", () => { prev(); start(); });

  // Pause on hover/focus (nice for readability)
  gallery.addEventListener("mouseenter", stop);
  gallery.addEventListener("mouseleave", start);
  gallery.addEventListener("focusin", stop);
  gallery.addEventListener("focusout", start);

  // Kick off
  setActive(0);
  start();
})();

(function setupMobileReadMore() {
  const MOBILE = window.matchMedia("(max-width: 768px)");

  function initIntro(intro) {
    if (intro.dataset.readmoreInit === "1") return;
    intro.dataset.readmoreInit = "1";

    // Wrap existing <p> in a .bio-text div (preserves your paragraphs)
    const p = intro.querySelector("p");
    if (!p) return;

    const wrapper = document.createElement("div");
    wrapper.className = "bio-text";

    // Move ALL children (not just first p) into wrapper
    while (intro.firstChild) wrapper.appendChild(intro.firstChild);
    intro.appendChild(wrapper);

    // Add toggle button
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bio-toggle";
    btn.textContent = "Read more";
    intro.appendChild(btn);

    btn.addEventListener("click", () => {
      const collapsed = intro.classList.toggle("is-collapsed");
      btn.textContent = collapsed ? "Read more" : "Read less";
    });
  }

  function applyMode() {
    document.querySelectorAll(".person-intro").forEach((intro) => {
      initIntro(intro);

      const btn = intro.querySelector(".bio-toggle");
      if (!btn) return;

      intro.classList.add("has-toggle");

      if (MOBILE.matches) {
        // Collapse on mobile by default
        intro.classList.add("is-collapsed");
        btn.textContent = "Read more";
      } else {
        // Expand on desktop and effectively hide the toggle (CSS handles)
        intro.classList.remove("is-collapsed");
        btn.textContent = "Read less";
      }
    });
  }

  applyMode();
  MOBILE.addEventListener?.("change", applyMode);
  window.addEventListener("resize", applyMode);
})();
