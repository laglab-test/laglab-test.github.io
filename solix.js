'use strict';

// ---------- Powerstation Anker SOLIX, nur in der Vereinsfassung ----------
// Die Android-Hülle meldet beim Start, welche Zusätze sie kann. Nur dann lädt native.js diese Datei.
// Sie baut den Abschnitt „06 Powerstation“ selbst auf. Die übrigen Dateien der App wissen nichts davon,
// so bleibt die kommerzielle Fassung ohne diesen Teil.
// Machbarkeitstest: unter „Rohdaten“ stehen Zwischenschritte und alle empfangenen Werte.

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
    #sxDiag { margin-top: 8px; font-size: 13px; color: var(--mut); }
    #sxDiag pre { font: 11px/1.4 var(--mono); white-space: pre-wrap; word-break: break-all; max-height: 220px; overflow: auto; margin: 6px 0 0; }
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
    <details id="sxDiag"><summary>Rohdaten</summary><pre id="sxLog"></pre></details>`;
  $('panel').insertBefore(grp, $('panel').querySelector('.actions'));

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
  };

  let state = 'none';
  const log = [];
  function note(s) {
    const t = new Date().toLocaleTimeString('de-DE');
    log.push(t + '  ' + s);
    if (log.length > 60) log.shift();
    $('sxLog').textContent = log.join('\n');
  }

  function clearValues() {
    for (const id of ['sxBat', 'sxTime', 'sxTemp', 'sxIn', 'sxOut']) { $(id).textContent = '–'; $(id).className = ''; }
    $('sxTimeLabel').textContent = 'Restlaufzeit';
  }

  // Verbunden stehen nur die Werte da, sonst nur Zustand und Knopf. So bleibt der Abschnitt kurz.
  function renderState(s, msg) {
    state = s;
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
