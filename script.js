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
