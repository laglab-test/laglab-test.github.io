'use strict';

// ---------- Powerstation Anker SOLIX, nur in der Vereinsfassung ----------
// Die Android-Hülle meldet beim Start, welche Zusätze sie kann. Nur dann lädt native.js diese Datei.
// Sie baut den Abschnitt „06 Powerstation“, den Akkustand oben links im Betrieb und zwei Zeilen der Hilfe selbst auf.
// Die übrigen Dateien der App wissen nichts davon,
// so bleibt die kommerzielle Fassung ohne diesen Teil.
// Machbarkeitstest: „Bericht …“ zeigt Zustand, Verbindung, Aushandeln, Werte und die letzten Ereignisse
// auf einem Bildschirm, damit ein Foto genügt.

(() => {
  const style = document.createElement('style');
  style.textContent = `
    #solixGrp { --good: #4fc97a; }
    html[data-theme="light"] #solixGrp { --good: #1f8a4c; }
    .sxRows { display: grid; grid-template-columns: 1fr auto; gap: 6px 14px; margin: 2px 0 4px; font-size: 15px; }
    .sxRows > span { color: var(--mut); }
    .sxRows b { font: 400 15px var(--mono); font-variant-numeric: tabular-nums; text-align: right; }
    .sxRows b.good { color: var(--good); }
    .sxRows b.mid { color: var(--warn); }
    .sxRows b.low { color: var(--bad); }
    .sxState { display: flex; align-items: center; gap: 12px; }
    #sxMsg { flex: 1; color: var(--mut); font-size: 14px; line-height: 1.35; }
    #sxFind { min-height: 44px; padding: 0 14px; white-space: nowrap; }
    #sxRepOpen { margin-top: 8px; min-height: 36px; padding: 0 12px; font-size: 13px; }
    #sxRep { position: fixed; inset: 0; z-index: 100; background: var(--bg); color: var(--fg); display: flex; flex-direction: column;
      padding: 14px 18px; gap: 10px; font: 12.5px/1.45 var(--mono); }
    #sxRep.hidden { display: none !important; }
    #sxRep header { display: flex; align-items: center; gap: 16px; font: 600 16px var(--sans); }
    #sxRep header span { flex: 1; }
    #sxRep header button { min-height: 44px; padding: 0 18px; }
    #sxRepBody { flex: 1; min-height: 0; display: grid; grid-template-columns: 1fr 1fr 1.2fr; gap: 18px; overflow: auto; }
    #sxRepBody > div { min-width: 0; }
    #sxRep h4 { margin: 0 0 4px; font: 600 12px var(--sans); letter-spacing: 0.12em; text-transform: uppercase; color: var(--acc-text); }
    #sxRep h4:not(:first-child) { margin-top: 12px; }
    #sxRep p { margin: 0; white-space: pre-wrap; word-break: break-all; }
    #sxRep .ok { color: var(--good, #4fc97a); }
    #sxRep .err { color: var(--bad); }
    #sxRep .dim { color: var(--mut); }
    /* Akkustand im Betrieb oben links, im Stil der Sekunden oben rechts. Der Betrieb ist immer dunkel, daher das helle Grün. */
    #sxBadge { position: absolute; top: 3cqh; left: 2.5cqw; pointer-events: none; color: #4fc97a;
      font: 400 4.5cqh/1.1 var(--sans); font-variant-numeric: tabular-nums; letter-spacing: -0.01em;
      -webkit-text-stroke: 0.55cqh rgba(0, 0, 0, 0.6); paint-order: stroke fill; text-shadow: 0 0 0.5cqh rgba(0, 0, 0, 0.35); }
    #sxBadge.mid { color: var(--warn); }
    #sxBadge.low { color: var(--bad); }
    #sxBadge:empty { display: none; }
    /* Eine Reihe mehr in der rechten Spalte, Start bleibt ganz unten */
    #panel:has(#solixGrp) { grid-template-rows: auto auto auto auto 1fr; }
  `;
  document.head.append(style);

  const grp = document.createElement('div');
  grp.className = 'grp';
  grp.id = 'solixGrp';
  grp.innerHTML = `
    <div class="label"><span class="no">06</span>Powerstation</div>
    <div class="sxRows">
      <span>Akku</span><b id="sxBat">–</b>
      <span id="sxTimeLabel">Restlaufzeit</span><b id="sxTime">–</b>
      <span>Temperatur</span><b id="sxTemp">–</b>
      <span>Leistung rein · raus</span><b><span id="sxIn">–</span> · <span id="sxOut">–</span></b>
    </div>
    <div class="sxState"><span id="sxMsg"></span><button class="tool" id="sxFind">Verbinden …</button></div>
    <button class="tool" id="sxRepOpen">Bericht …</button>`;
  $('panel').insertBefore(grp, $('panel').querySelector('.actions'));

  const badge = document.createElement('div');
  badge.id = 'sxBadge';
  $('stage').append(badge);

  // Zwei Zeilen in der Hilfe. Sie wird beim ersten Öffnen gefüllt, die Zeilen kommen danach dazu.
  $('uiHelp').addEventListener('click', () => {
    if ($('sxHelp')) return;
    const add = (sec, before, dt, dd, id) => {
      const dl = document.querySelector(`#${sec} dl`);
      if (!dl) return;
      const t = document.createElement('dt'), d = document.createElement('dd');
      if (id) t.id = id;
      t.innerHTML = dt;
      d.textContent = dd;
      const ref = [...dl.children].find(x => x.tagName === 'DT' && x.textContent === before);
      dl.insertBefore(t, ref || null);
      dl.insertBefore(d, ref || null);
    };
    add('h-live', 'Start', '06 Powerstation', 'Werte der Anker-Powerstation. „Verbinden …“ sucht sie beim ersten Mal', 'sxHelp');
    add('h-run', 'Bild', '<span style="color:#4fc97a">78 %</span>', 'Akkustand der Powerstation oben links. Grün ab 50 %, gelb ab 20 %, sonst rot');
  });

  // Bericht über den ganzen Bildschirm, außerhalb von #app, damit er auch bei „Bildschirm anpassen“ alles zeigt
  const rep = document.createElement('div');
  rep.id = 'sxRep';
  rep.className = 'hidden';
  rep.innerHTML = `<header><span>Powerstation · Bericht</span><button class="tool" id="sxRepClose">Schließen</button></header>
    <div id="sxRepBody"><div id="sxRep1"></div><div id="sxRep2"></div><div id="sxRep3"></div></div>`;
  document.body.append(rep);

  const TEXT = {
    none: 'Noch keine Powerstation verbunden.',
    search: 'Suche läuft …',
    notfound: 'Keine Powerstation gefunden. Ist Bluetooth an der Powerstation an und die Anker-App geschlossen?',
    location: 'Für die Suche bitte den Standort am Tablet einschalten.',
    denied: 'Ohne die Erlaubnis für Bluetooth geht es nicht. Bitte in den Android-Einstellungen freigeben.',
    off: 'Bluetooth am Tablet ist aus.',
    connect: 'Verbinde …',
    negotiate: 'Verbindung wird eingerichtet …',
    ok: 'Verbunden',
    lost: 'Verbindung unterbrochen, verbinde neu …',
    failed: 'Keine Verbindung. „Verbinden …“ versucht es erneut.',
  };

  let state = 'none';
  const log = [];
  const now = () => new Date().toLocaleTimeString('de-DE');
  function note(s) {
    log.push(now() + '  ' + s);
    if (log.length > 200) log.shift();
    if (!rep.classList.contains('hidden')) renderReport();
  }

  // Was der Bericht zusammenfasst
  const info = { msg: '', mac: '', mtu: '', disco: '', services: [], steps: {}, attempts: '', errors: [], vals: null, raw: null, valCount: 0, valAt: '' };
  const STEPS = [['0801', 'Antwort 1'], ['0803', 'Antwort 2'], ['0829', 'Antwort 3, Gerät'], ['0805', 'Antwort 4'],
    ['0821', 'Schlüssel der Powerstation'], ['4822', 'Bestätigung, nicht immer']];

  function collect(m) {
    if (m.state) {
      info.msg = m.state + (m.msg ? ' · ' + m.msg : '');
      if (m.mac) info.mac = m.mac;
      if (m.state === 'connect') info.steps = {};   // jeder Versuch handelt neu aus
    }
    const s = m.stage;
    if (s) {
      if (s.startsWith('mtu ')) info.mtu = s.slice(4);
      else if (s.startsWith('Dienstsuche')) { info.disco = s; info.services = []; }
      else if (s.startsWith('Dienst ') || s.startsWith('  Merkmal')) info.services.push(s.trim());
      else if (s.startsWith('Neuer Versuch')) info.attempts = now() + ' ' + s;
      else if (s.startsWith('Fehler')) { info.errors.push(now() + ' ' + s); if (info.errors.length > 5) info.errors.shift(); }
      else if (/^[0-9a-f]{4}$/.test(s)) info.steps[s] = now();
    }
    if (m.vals) { info.vals = m.vals; info.raw = m.raw || null; info.valCount++; info.valAt = now(); }
  }

  function renderReport() {
    const esc = t => String(t).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[c]);
    const line = (k, v, cls = '') => `<p><span class="dim">${esc(k)}</span> <span class="${cls}">${esc(v)}</span></p>`;
    let a = `<h4>Zustand</h4>${line('App', 'Stand ' + APP_VERSION + ' · ' + now())}${line('Zustand', info.msg || '–', state === 'ok' ? 'ok' : '')}`;
    a += line('Gerät', info.mac || '–') + line('Versuche', info.attempts || '–');
    a += `<h4>Verbindung</h4>${line('MTU', info.mtu || '–')}${line('Dienste', info.disco || '–')}`;
    // Die Standarddienste 1800 und 1801 sind uninteressant, gezeigt wird der Rest
    const sv = info.services.filter(x => !/0000180[01]-|00002a0[015]-|00002b(3a|29)-/.test(x));
    a += sv.length ? `<p>${esc(sv.join('\n'))}</p>` : '<p class="dim">–</p>';
    a += '<h4>Aushandeln</h4>' + STEPS.map(([c, t]) => line(c + ' ' + t, info.steps[c] ? '✓ ' + info.steps[c] : '–', info.steps[c] ? 'ok' : '')).join('');
    if (info.errors.length) a += `<h4>Fehler</h4><p class="err">${esc(info.errors.join('\n'))}</p>`;
    let b = `<h4>Werte</h4>${line('Empfangen', info.valCount ? info.valCount + ' mal, zuletzt ' + info.valAt : 'noch nie', info.valCount ? 'ok' : 'err')}`;
    if (info.vals) {
      const v = info.vals;
      b += line('Akku', v.bat != null ? v.bat + ' %' : '–') + line('Restzeit', v.min != null ? v.min + ' min' : '–');
      b += line('Temperatur', v.temp != null ? v.temp + ' °C' : '–') + line('Rein · raus', (v.pin ?? '–') + ' W · ' + (v.pout ?? '–') + ' W');
      b += line('Laden', v.chg === 2 ? 'lädt' : v.chg === 1 ? 'entlädt' : v.chg === 0 ? 'ruht' : '–');
    }
    if (info.raw) b += `<h4>Rohwerte</h4><p>${esc(Object.entries(info.raw).map(([k, v]) => k + '=' + v).join(' '))}</p>`;
    // Werte, Rohwerte und Dienste stehen schon links, hier nur die übrigen Ereignisse
    const events = log.filter(l => !/ {2}(Werte|roh|Schritt Dienst|Schritt {3}Merkmal) /.test(l));
    const c = `<h4>Letzte Ereignisse</h4><p>${esc(events.slice(-38).join('\n'))}</p>`;
    $('sxRep1').innerHTML = a;
    $('sxRep2').innerHTML = b;
    $('sxRep3').innerHTML = c;
  }

  function openReport() {
    renderReport();
    rep.classList.remove('hidden');
    history.pushState({ v: 'sxrep' }, '');
  }
  $('sxRepOpen').addEventListener('click', openReport);
  $('sxRepClose').addEventListener('click', () => history.back());
  // Die Zurück-Geste schließt den Bericht. Andere Teile der App reagieren in den Einstellungen nicht darauf.
  window.addEventListener('popstate', () => rep.classList.add('hidden'));

  function clearValues() {
    for (const id of ['sxBat', 'sxTime', 'sxTemp', 'sxIn', 'sxOut']) { $(id).textContent = '–'; $(id).className = ''; }
    $('sxTimeLabel').textContent = 'Restlaufzeit';
  }

  // Verbunden stehen nur die Werte da, sonst nur Zustand und Knopf. So bleibt der Abschnitt kurz.
  function renderState(s, msg) {
    state = s;
    if (s !== 'ok') badge.textContent = '';   // ohne Verbindung keine Anzeige im Betrieb
    $('sxMsg').textContent = msg || TEXT[s] || s;
    $('sxFind').disabled = s === 'search';
    grp.querySelector('.sxRows').classList.toggle('hidden', s !== 'ok');
    grp.querySelector('.sxState').classList.toggle('hidden', s === 'ok');
    if (s !== 'ok') clearValues();   // ohne Verbindung kein Wert
  }

  const duration = min => (min >= 60 ? `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')} min` : `${min} min`);

  function renderValues(v) {
    if (state !== 'ok') return;
    if (v.bat != null) {
      $('sxBat').textContent = v.bat + ' %';
      $('sxBat').className = v.bat >= 50 ? 'good' : v.bat >= 20 ? 'mid' : 'low';
      badge.textContent = v.bat + ' %';
      badge.className = $('sxBat').className;
    }
    if (v.min != null) {
      const charging = v.chg === 2;   // beim Laden meldet die Powerstation die Zeit bis voll
      $('sxTimeLabel').textContent = charging ? 'Voll in' : 'Restlaufzeit';
      $('sxTime').textContent = v.min > 0 ? duration(v.min) : '–';
    }
    if (v.temp != null) $('sxTemp').textContent = v.temp + ' °C';
    if (v.pin != null) $('sxIn').textContent = v.pin + ' W';
    if (v.pout != null) $('sxOut').textContent = v.pout + ' W';
  }

  window.addEventListener('laglab-native', e => {
    const m = e.detail;
    if (m.t !== 'solix') return;
    collect(m);
    if (m.state) { renderState(m.state, m.msg); note('Zustand ' + m.state + (m.msg ? ' · ' + m.msg : '') + (m.mac ? ' · ' + m.mac : '')); }
    if (m.stage) note('Schritt ' + m.stage);
    if (m.vals) {
      renderValues(m.vals);
      note('Werte ' + JSON.stringify(m.vals));
      if (m.raw) note('roh ' + Object.entries(m.raw).map(([k, v]) => k + '=' + v).join(' '));
    }
  });

  $('sxFind').addEventListener('click', () => native.send({ t: 'solix', op: 'find' }));
  renderState('none');
  native.send({ t: 'solix', op: 'start' });
})();
