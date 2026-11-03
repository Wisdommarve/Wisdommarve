document.documentElement.classList.add('js');

document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        menuToggle.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Scroll progress bar + active nav link ---------- */
  var progress = document.getElementById('progress');
  var navAnchors = document.querySelectorAll('#navLinks a');
  var sectionIds = ['home', 'about', 'services', 'packages', 'process', 'authors', 'resources', 'blog', 'faq', 'contact'];

  function onScroll() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (progress && height > 0) {
      progress.style.width = (scrollTop / height) * 100 + '%';
    }

    var current = sectionIds[0];
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= 120) {
        current = id;
      }
    });

    navAnchors.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll ---------- */
  var revealItems = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealItems.forEach(function (item) { observer.observe(item); });
  } else {
    revealItems.forEach(function (item) { item.classList.add('visible'); });
  }

  /* ---------- Image fallback (shows initials / colored block if an image is missing) ---------- */
  document.querySelectorAll('img.safe-img').forEach(function (img) {
    img.addEventListener('error', function () {
      img.classList.add('hidden');
    });
    if (img.complete && img.naturalWidth === 0) {
      img.classList.add('hidden');
    }
  });

  /* ---------- Contact form (Formspree, no page reload) ---------- */
  var form = document.getElementById('contactForm');
  var statusMsg = document.getElementById('formStatus');
  var formBtn = document.getElementById('formBtn');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      statusMsg.className = 'form-status';
      statusMsg.textContent = '';
      formBtn.disabled = true;
      formBtn.textContent = 'Sending...';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            statusMsg.textContent = 'Thank you! Your message has been sent. You will receive a written reply by email.';
            statusMsg.className = 'form-status success';
            form.reset();
          } else {
            throw new Error('Form error');
          }
        })
        .catch(function () {
          statusMsg.textContent = 'Sorry, something went wrong. Please email me directly at wisdom.authorservices@gmail.com.';
          statusMsg.className = 'form-status error';
        })
        .finally(function () {
          formBtn.disabled = false;
          formBtn.textContent = 'Send Message';
        });
    });
  }

  /* ---------- Footer year ---------- */
  var year = document.getElementById('year');
  if (year) { year.textContent = new Date().getFullYear(); }
});