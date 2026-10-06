/* ==========================================================
 * main.js — Interacciones de la página
 *   1) Barra de progreso del scroll
 *   2) Animación de aparición de los elementos al hacer scroll
 * ========================================================== */
(function () {
  'use strict';

  // ¿El usuario pidió reducir el movimiento en su sistema?
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) Barra de progreso del scroll ---------- */
  var bar = document.getElementById('progress');

  // Calcula cuánto se ha desplazado la página (0 a 1) y estira la barra
  function updateProgress() {
    var max = document.documentElement.scrollHeight - innerHeight;
    var ratio = max > 0 ? Math.min(scrollY / max, 1) : 0;
    bar.style.transform = 'scaleX(' + ratio + ')';
  }
  addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  // Si hay que reducir movimiento (o el navegador no soporta el observador), no animamos más
  if (reduce || !('IntersectionObserver' in window)) return;

  /* ---------- 2) Aparición al hacer scroll ---------- */
  // Elementos que aparecerán subiendo suavemente
  var selector = [
    '#sobre-mi h2', '.about p', '.facts li',
    '#proyectos h2', '.card',
    '#talentos h2', '.talent', 'h2.sub', '.hobbies span',
    '.contact h2', '.contact p', '.contact .btn'
  ].join(',');

  var items = [].slice.call(document.querySelectorAll(selector));

  items.forEach(function (el) {
    el.classList.add('rv'); // estado inicial oculto (ver animations.css)
    // Retraso escalonado según la posición entre sus hermanos (máx. 6)
    var index = [].indexOf.call(el.parentElement.children, el);
    el.style.setProperty('--i', Math.min(index, 6));
  });

  // Cuando un elemento entra en pantalla, se muestra
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var el = entry.target;
      el.classList.add('in');     // dispara la transición de aparición
      observer.unobserve(el);     // solo se anima una vez

      // Al terminar, quitamos las clases para que vuelvan sus efectos hover normales
      el.addEventListener('transitionend', function done(ev) {
        if (ev.propertyName !== 'transform') return;
        el.classList.remove('rv', 'in');
        el.style.removeProperty('--i');
        el.removeEventListener('transitionend', done);
      });
    });
  }, { threshold: 0.15 }); // se activa cuando se ve el 15% del elemento

  items.forEach(function (el) { observer.observe(el); });
})();
