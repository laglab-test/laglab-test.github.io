'use strict';

// ---------- Powerstation Anker SOLIX, nur in der Vereinsfassung ----------
// Die Android-Hülle meldet beim Start, welche Zusätze sie kann. Nur dann lädt native.js diese Datei.
// Sie baut den Abschnitt „06 Powerstation“, den Akkustand oben links im Betrieb und zwei Zeilen der Hilfe selbst auf.
// Die übrigen Dateien der App wissen nichts davon, so bleibt die kommerzielle Fassung ohne diesen Teil.

(() => {
  const style = document.createElement('style');
  style.textContent = `
    #solixGrp { --good: #4fc97a; border-bottom: none; }   /* darunter folgt nur Start, keine Linie */
    html[data-theme="light"] #solixGrp { --good: #1f8a4c; }
    /* Zeilen wie in einer Tabelle, mit dünnen Linien dazwischen. Die Werte stehen rechts. */
    .sxRows { display: grid; grid-template-columns: 1fr auto; column-gap: 14px; margin: 0 0 2px; }
    .sxRows > * { padding: 7px 0; }
    .sxRows > :nth-child(n+3) { border-top: 1px solid var(--line); }
    .sxRows > span { color: var(--mut); font-size: 14px; }
    .sxRows b { font: 400 15px var(--mono); font-variant-numeric: tabular-nums; text-align: right; }
    .sxRows b.good { color: var(--good); }
    .sxRows b.mid { color: var(--warn); }
    .sxRows b.low { color: var(--bad); }
    .sxState { display: flex; align-items: center; gap: 12px; }
    #sxMsg { flex: 1; color: var(--mut); font-size: 14px; line-height: 1.35; }
    #sxFind { min-height: 44px; padding: 0 14px; white-space: nowrap; }
    /* Akkustand im Betrieb oben links, im Stil der Sekunden oben rechts. Der Betrieb ist immer dunkel, daher das helle Grün. */
    #sxBadge { position: absolute; top: 3cqh; left: 2.5cqw; pointer-events: none; color: #4fc97a;
      font: 400 4.5cqh/1.1 var(--sans); font-variant-numeric: tabular-nums; letter-spacing: -0.01em;
      -webkit-text-stroke: 0.55cqh rgba(0, 0, 0, 0.6); paint-order: stroke fill; text-shadow: 0 0 0.5cqh rgba(0, 0, 0, 0.35); }
    #sxBadge.mid { color: var(--warn); }
    #sxBadge.low { color: var(--bad); }
    #sxBadge:empty { display: none; }
    /* Eine Reihe mehr in der rechten Spalte, Start bleibt ganz unten. Ab Stufe 1 mit Abstandszeile wie in style.css. */
    #panel:has(#solixGrp) { grid-template-rows: auto auto auto auto 1fr; }
    html.big #panel:has(#solixGrp) { grid-template-rows: auto var(--sp) auto var(--sp) auto var(--sp) auto 1fr; }
    html.big #solixGrp { grid-row: 7; }
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
    <div class="sxState"><span id="sxMsg"></span><button class="tool" id="sxFind">Verbinden …</button></div>`;
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

  const TEXT = {
    none: 'Noch keine Powerstation verbunden.',
    search: 'Suche läuft …',
    notfound: 'Keine C300 gefunden. Ist Bluetooth an der Powerstation an und die Anker-App geschlossen?',
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
      const cls = v.bat >= 50 ? 'good' : v.bat >= 20 ? 'mid' : 'low';
      $('sxBat').textContent = v.bat + ' %';
      $('sxBat').className = cls;
      badge.textContent = v.bat + ' %';
      badge.className = cls;
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
    if (m.state) renderState(m.state, m.msg);
    if (m.vals) renderValues(m.vals);
  });

  $('sxFind').addEventListener('click', () => native.send({ t: 'solix', op: 'find' }));
  renderState('none');
  native.send({ t: 'solix', op: 'start' });
})();
