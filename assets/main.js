// Hundeschererei Rheinbach – Startseite
(function () {
  // Vorher/Nachher
  var ba = document.querySelector('.ba');
  var regler = document.getElementById('regler');
  function wischen() { ba.style.setProperty('--wipe', regler.value + '%'); }
  regler.addEventListener('input', wischen);
  wischen();

  // Öffnungsstatus
  var plan = { 0: null, 1: [10, 18], 2: [10, 18], 3: [10, 18], 4: [10, 18], 5: [10, 18], 6: [10, 14] };
  var namen = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
  var jetzt = new Date();
  var tag = jetzt.getDay();
  var std = jetzt.getHours() + jetzt.getMinutes() / 60;
  var heute = plan[tag];
  var offen = false, text = 'Geschlossen';
  if (heute && std >= heute[0] && std < heute[1]) {
    offen = true; text = 'Jetzt geöffnet bis ' + heute[1] + ':00 Uhr';
  } else if (heute && std < heute[0]) {
    text = 'Öffnet heute um ' + heute[0] + ':00 Uhr';
  } else {
    for (var i = 1; i <= 7; i++) {
      var t = (tag + i) % 7;
      if (plan[t]) { text = 'Geschlossen, öffnet ' + (i === 1 ? 'morgen' : namen[t]) + ' um ' + plan[t][0] + ':00 Uhr'; break; }
    }
  }
  document.querySelectorAll('[data-status]').forEach(function (el) {
    el.textContent = text;
    el.classList.toggle('ist-offen', offen);
  });
  var zeile = document.querySelector('.zeiten [data-tag="' + tag + '"]');
  if (zeile) zeile.classList.add('heute');

  // Externe Inhalte: erst nach Klick laden (DSGVO, Zwei-Klick-Lösung)
  var SCHLUESSEL = 'hs-extern-erlaubt';
  function gemerkt() { try { return localStorage.getItem(SCHLUESSEL) === '1'; } catch (e) { return false; } }
  function merken(an) { try { if (an) localStorage.setItem(SCHLUESSEL, '1'); else localStorage.removeItem(SCHLUESSEL); } catch (e) {} }
  function rahmen(src, titel, klasse) {
    var f = document.createElement('iframe');
    f.src = src; f.title = titel; f.loading = 'lazy';
    f.referrerPolicy = 'strict-origin-when-cross-origin';
    if (klasse) f.className = klasse;
    return f;
  }
  var LADER = {
    tiktok: function (ziel) {
      var zitat = document.createElement('blockquote');
      zitat.className = 'tiktok-embed';
      zitat.setAttribute('cite', 'https://www.tiktok.com/@hundescherereirheinbach');
      zitat.setAttribute('data-unique-id', 'hundescherereirheinbach');
      zitat.setAttribute('data-embed-type', 'creator');
      zitat.style.cssText = 'max-width:780px;min-width:288px;margin:0 auto';
      var abschnitt = document.createElement('section');
      var link = document.createElement('a');
      link.href = 'https://www.tiktok.com/@hundescherereirheinbach?refer=creator_embed';
      link.target = '_blank'; link.rel = 'noopener'; link.textContent = '@hundescherereirheinbach';
      abschnitt.appendChild(link); zitat.appendChild(abschnitt); ziel.appendChild(zitat);
      var skript = document.createElement('script');
      skript.async = true; skript.src = 'https://www.tiktok.com/embed.js';
      document.body.appendChild(skript);
    },
    instagram: function (ziel) {
      ziel.appendChild(rahmen('https://www.instagram.com/hundeschererei_rheinbach/embed/', 'Instagram-Profil @hundeschererei_rheinbach', 'ig-rahmen'));
    },
    karte: function (ziel) {
      ziel.appendChild(rahmen('https://www.google.com/maps?q=Aachener+Stra%C3%9Fe+27,+53359+Rheinbach&z=16&output=embed', 'Karte: Hundeschererei Rheinbach, Aachener Straße 27'));
    }
  };
  var boxen = document.querySelectorAll('[data-extern]');
  var merkenBox = document.getElementById('extern-merken');
  var sperren = document.getElementById('extern-sperren');
  function laden(box) {
    if (box.classList.contains('geladen')) return;
    box.replaceChildren();
    box.classList.add('geladen');
    LADER[box.getAttribute('data-extern')](box);
  }
  boxen.forEach(function (box) {
    box.querySelector('[data-laden]').addEventListener('click', function () {
      if (merkenBox.checked) { merken(true); sperren.hidden = false; boxen.forEach(laden); }
      else laden(box);
    });
  });
  if (gemerkt()) { merkenBox.checked = true; sperren.hidden = false; boxen.forEach(laden); }
  sperren.addEventListener('click', function (e) { e.preventDefault(); merken(false); location.reload(); });

  // Mobiles Menü
  var knopf = document.querySelector('.menu-knopf');
  var nav = document.getElementById('hauptnav');
  function menu(auf) {
    knopf.setAttribute('aria-expanded', String(auf));
    knopf.setAttribute('aria-label', auf ? 'Menü schließen' : 'Menü öffnen');
    document.body.classList.toggle('menu-offen', auf);
  }
  knopf.addEventListener('click', function () { menu(knopf.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) menu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && knopf.getAttribute('aria-expanded') === 'true') { menu(false); knopf.focus(); }
  });
})();
