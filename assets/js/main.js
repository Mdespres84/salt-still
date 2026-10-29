/* Salt & Still — site behavior */
(function () {
  'use strict';

  /* Hide any photo that fails to load (its frame shows a leather tone) */
  document.querySelectorAll('img').forEach(function (img) {
    function mark() { img.classList.add('broken'); }
    if (img.complete && img.naturalWidth === 0 && img.src) mark();
    img.addEventListener('error', mark);
  });

  /* Nav: solid after scrolling, mobile menu */
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var mobile = document.getElementById('mobileNav');
  function onScroll() { nav.classList.toggle('solid', window.scrollY > 40 || !mobile.hidden); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  function setMenu(open) {
    mobile.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    onScroll();
  }
  toggle.addEventListener('click', function () { setMenu(mobile.hidden); });
  mobile.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !mobile.hidden) setMenu(false); });

  /* Keep each headline line on one line at every width */
  var heroTitle = document.querySelector('.hero-title');
  function fitHero() {
    if (!heroTitle) return;
    heroTitle.style.fontSize = '';
    var avail = heroTitle.clientWidth, widest = 0;
    heroTitle.querySelectorAll('.line').forEach(function (l) { widest = Math.max(widest, l.scrollWidth); });
    if (widest > avail) {
      var size = parseFloat(getComputedStyle(heroTitle).fontSize);
      heroTitle.style.fontSize = Math.floor(size * (avail / widest) * 0.98) + 'px';
    }
  }
  fitHero();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitHero);
  var fitTimer;
  window.addEventListener('resize', function () { clearTimeout(fitTimer); fitTimer = setTimeout(fitHero, 100); });

  /* Estimate inside the RSVP card. Prices live here. */
  var RATE = 115;        // per bartender, per hour
  var RIG = 750;         // trailer bar, Sport Coat and Black Tie
  var MIXERS = 5;        // per guest, Sport Coat and Black Tie
  var ZERO_PROOF = 9;    // per guest when the whole bar is zero proof (we supply every drink)
  var CONCIERGE = 350;   // Black Tie: shopping, hauling, bar captain (flat, never tied to alcohol)
  var GUESTS_PER_BARTENDER = 60;
  var CUSTOM = 125;      // per custom signature cocktail
  var MIN_HOURS = 4;     // shorter parties are welcome but billed at this minimum

  var form = document.getElementById('inquireForm');
  var guestsEl = document.getElementById('guests');
  var hoursEl = document.getElementById('hours');
  var customEl = document.getElementById('custom');
  var countyEl = document.getElementById('county');
  var totalEl = document.getElementById('estTotal');
  var detailEl = document.getElementById('estDetail');
  var estField = document.getElementById('f-estimate');

  function clampVal(el, fallback) {
    var v = parseFloat(el.value);
    if (isNaN(v)) v = fallback;
    return Math.round(Math.min(parseFloat(el.max), Math.max(parseFloat(el.min), v)));
  }
  function money(n) { return '$' + Math.round(n).toLocaleString('en-US'); }

  function calc() {
    var guests = clampVal(guestsEl, 100);
    var hours = clampVal(hoursEl, 5);
    var bartenders = Math.max(1, Math.ceil(guests / GUESTS_PER_BARTENDER));
    var picked = form.querySelector('input[name="package"]:checked');
    var pkg = picked ? picked.getAttribute('data-pkg') : '2';
    var billed = Math.max(MIN_HOURS, hours);
    var total = RATE * bartenders * billed;
    var drinksEl = form.querySelector('input[name="drinks"]:checked');
    var dry = drinksEl && drinksEl.value === 'Zero proof only';
    if (pkg !== '1') total += RIG + (dry ? ZERO_PROOF : MIXERS) * guests;
    if (pkg === '3') total += CONCIERGE;
    var extras = 0;
    form.querySelectorAll('input[name="extras"]:checked').forEach(function (c) { extras += parseFloat(c.getAttribute('data-price')); });
    total += extras;
    var custom = clampVal(customEl, 0);
    total += CUSTOM * custom;
    var feeAttr = countyEl.options[countyEl.selectedIndex].getAttribute('data-fee');
    var travel = feeAttr === 'quote' ? 0 : parseFloat(feeAttr);
    total += travel;

    totalEl.textContent = money(total);
    detailEl.textContent = (picked ? picked.value : 'Sport Coat') + (dry ? ', zero proof' : '') + ' · ' + guests + ' guests · ' + hours + ' hours · ' +
      bartenders + (bartenders === 1 ? ' bartender' : ' bartenders') + (hours < MIN_HOURS ? ', priced at the 4-hour minimum' : '') +
      (custom ? ' · ' + custom + (custom === 1 ? ' custom cocktail' : ' custom cocktails') : '') +
      (travel ? ' · $' + travel + ' travel' : '') + (feeAttr === 'quote' ? ' · travel quoted separately' : '') + (dry ? '. Before tax.' : '. Before tax. Liquor not included.');
    estField.value = money(total) + ' (' + detailEl.textContent + ')';
  }
  form.querySelectorAll('input, select').forEach(function (el) {
    el.addEventListener('input', calc);
    el.addEventListener('change', calc);
  });
  [guestsEl, hoursEl, customEl].forEach(function (el) {
    el.addEventListener('blur', function () { el.value = clampVal(el, el === guestsEl ? 100 : el === hoursEl ? 5 : 0); calc(); });
  });
  calc();

  /* Send the inquiry (Formspree) */
  var status = document.getElementById('formStatus');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var bad = [];
    form.querySelectorAll('[required]').forEach(function (f) {
      var ok = f.value.trim() !== '' && (f.type !== 'email' || /.+@.+\..+/.test(f.value));
      f.classList.toggle('invalid', !ok);
      if (!ok) bad.push(f);
    });
    if (bad.length) {
      status.className = 'f-status err';
      status.textContent = 'Add your name, a valid email, and the date so we can check availability.';
      bad[0].focus();
      return;
    }
    if (form.action.indexOf('YOUR_FORM_ID') !== -1) {
      status.className = 'f-status err';
      status.textContent = 'This form isn’t connected yet. Call, text, or email us and we’ll get right back to you.';
      return;
    }
    status.className = 'f-status';
    status.textContent = 'Sending…';
    fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
      .then(function (res) {
        if (!res.ok) throw new Error();
        form.reset(); calc();
        status.className = 'f-status ok';
        status.textContent = 'Inquiry sent. We’ll reply within one business day.';
      })
      .catch(function () {
        status.className = 'f-status err';
        status.textContent = 'That didn’t send. Try again, or email hello@saltandstill.com.';
      });
  });

  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();
