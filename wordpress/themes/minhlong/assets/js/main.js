/* Minh Long theme — menu điện thoại, banner tự chạy, nút lên đầu trang */
(function () {
  'use strict';

  // Menu trên điện thoại
  var toggle = document.querySelector('.ml-menu-toggle');
  var nav = document.getElementById('ml-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.classList.toggle('ml-nav-open', open);
    });
  }

  // Nút "Danh mục sản phẩm" (bấm để mở trên điện thoại / bàn phím)
  var catBtn = document.querySelector('.ml-cat-toggle');
  if (catBtn) {
    catBtn.addEventListener('click', function () {
      var wrap = catBtn.parentElement;
      var open = wrap.classList.toggle('is-open');
      catBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('click', function (e) {
      if (!catBtn.parentElement.contains(e.target)) {
        catBtn.parentElement.classList.remove('is-open');
        catBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // Banner trang chủ: tự chuyển 6 giây, dừng khi rê chuột
  var hero = document.querySelector('.ml-hero');
  if (hero) {
    var slides = hero.querySelectorAll('.ml-hero-slide');
    var dots = hero.querySelectorAll('.ml-hero-dots button');
    var idx = 0;
    var timer = null;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var show = function (i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('is-active', k === idx); });
      dots.forEach(function (d, k) { d.classList.toggle('is-active', k === idx); });
    };
    var start = function () {
      if (reduce || slides.length < 2) return;
      stop();
      timer = setInterval(function () { show(idx + 1); }, 6000);
    };
    var stop = function () { if (timer) clearInterval(timer); };
    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); start(); }); });
    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  // Nút lên đầu trang
  var top = document.querySelector('.ml-to-top');
  if (top) {
    window.addEventListener('scroll', function () {
      top.classList.toggle('is-visible', window.scrollY > 600);
    }, { passive: true });
    top.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }
})();
