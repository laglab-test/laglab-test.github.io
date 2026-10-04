'use strict';

// Hilfe, erreichbar über das „i“ im Fenster Einstellungen. Der Text steht hier, die Bildschirmfotos im Ordner hilfe.
// Symbole werden aus den echten Knöpfen der App geholt, damit sie immer gleich aussehen: <i data-ico="Selektor"></i>.
// Vorerst nur Deutsch. Der Text ist von der Übersetzung ausgenommen (data-notr am Fenster).

const HELP_HTML = `
<section id="h-start">
  <h3><span class="no">01</span>Einrichten</h3>
  <p>LagLab filmt einen Sprung mit dem Tablet und zeigt ihn mit einigen Sekunden Verzögerung auf einem Fernseher. Der Springer steigt aus dem Becken, schaut auf den Fernseher und sieht seinen Sprung.</p>
  <p>Stellen Sie das Tablet fest auf, etwa auf ein Stativ, und richten Sie die Kamera auf den Turm oder das Brett. Der ganze Sprung bis zum Eintauchen sollte im Bild sein.</p>
  <p>Den Fernseher verbinden Sie mit einem Adapter von USB-C auf HDMI. Das Tablet zeigt dann sein Bild auch auf dem Fernseher.</p>
  <p>Eine USB-Kamera geht nur in der Android-App. Schließen Sie die Kamera an und wählen Sie auf der Seite Live unter „02 Kamera“ den Punkt „USB“. Android fragt beim ersten Mal, ob die App die Kamera benutzen darf.</p>
  <p>Ist das Bild auf dem Fernseher abgeschnitten oder hat es einen Rand, öffnen Sie über das Zahnrad die Einstellungen und tippen unter „05 Bildschirm“ auf „Anpassen …“. Mit Breite, Höhe, Links, rechts und Oben, unten passen Sie die App an den Fernseher an. Ein Rahmen in der Akzentfarbe zeigt dabei die Ränder. „Fertig“ übernimmt die Werte, „Zurücksetzen“ stellt beide Größen auf 100 %.</p>
</section>

<section id="h-live">
  <h3><span class="no">02</span>Live</h3>
  <p>Auf der Seite Live richten Sie die Kamera ein. Links sehen Sie das Kamerabild mit Auflösung und Bildrate, darunter die Verzögerung.</p>
  <figure><img src="hilfe/live.jpg" width="1280" height="800" alt="Seite Live"><figcaption>Die Seite Live mit Verzögerung und den Einstellungen der Kamera</figcaption></figure>
  <dl>
    <dt>01 Verzögerung</dt><dd>So viele Sekunden später erscheint das Bild auf dem Fernseher, von 1 bis 30. Wählen Sie die Zeit, die ein Springer vom Eintauchen bis zum Blick auf den Fernseher braucht.</dd>
    <dt>02 Kamera</dt><dd>Rückseite, Vorderseite oder USB. Hat das Gerät nur eine Kamera, steht dort „Kamera“.</dd>
    <dt>03 Zoom</dt><dd>Vergrößert das Bild bis zum Vierfachen.</dd>
    <dt>04 Belichtung</dt><dd>Auto regelt die Helligkeit selbst. Bei Manuell stellen Sie sie mit dem Regler ein. Das hilft bei Gegenlicht oder spiegelndem Wasser.</dd>
    <dt>05 Fokus</dt><dd>Erscheint nur, wenn die Kamera einen einstellbaren Fokus hat. Bei Manuell stellen Sie die Schärfe von nah bis fern ein.</dd>
  </dl>
  <p>Zoom, Belichtung und Fokus merkt sich die App für jede Kamera einzeln. Mit „Start“ beginnt der Betrieb.</p>
</section>

<section id="h-run">
  <h3><span class="no">03</span>Betrieb</h3>
  <p>Im Betrieb füllt das verzögerte Bild den ganzen Bildschirm. Oben rechts steht die Verzögerung in Sekunden. In den ersten Sekunden füllt sich der Speicher, erst danach erscheint ein Bild.</p>
  <figure><img src="hilfe/betrieb.jpg" width="1280" height="800" alt="Betrieb"><figcaption>Rechts unten der Knopf zum Speichern, darüber die Zeitlupe</figcaption></figure>
  <dl>
    <dt><i data-ico="#saveBtn"></i>Speichern</dt><dd>Halten Sie den Knopf unten rechts eine Sekunde lang, bis sich der Ring gefüllt hat. Gespeichert wird ab dem Bild, das gerade auf dem Fernseher läuft, bis jetzt. Danach bleibt der Knopf 5 Sekunden grau. Ein Tippen in dieser Zeit öffnet das Video sofort. Mit „‹ Wiedergabe“ geht es zurück in den Betrieb, die Kamera nimmt in der Zwischenzeit weiter auf.</dd>
    <dt><i data-ico="#slowBtn"></i>Zeitlupe</dt><dd>Halten Sie den Knopf darüber eine Sekunde lang. Ab dem Bild auf dem Fernseher läuft es langsamer weiter, oben rechts erscheint ein Uhrsymbol. Nochmals halten beendet die Zeitlupe, danach geht es mit der normalen Verzögerung weiter. Wie langsam, stellen Sie in den Einstellungen unter „06 Zeitlupe“ ein.</dd>
    <dt>Beenden</dt><dd>Drücken Sie eine Sekunde lang auf eine freie Stelle im Bild. Dann sind Sie wieder auf der Seite Live. Die Zurück-Geste von Android wirkt im Betrieb nicht, damit ein versehentliches Wischen nichts beendet.</dd>
  </dl>
</section>

<section id="h-list">
  <h3><span class="no">04</span>Analyse</h3>
  <p>Unter „Analyse“ liegen alle gespeicherten Videos und Bilder, die neuesten zuerst. Oben links wechseln Sie zwischen „Videos“ und „Bilder“.</p>
  <p>Der Knopf links in der Reihe der Filter wählt die Ansicht. Jedes Tippen schaltet weiter, von Tage über Wochen und Monate zu Jahre. Je größer der Zeitraum, desto kleiner die Kacheln. So sehen Sie schnell, wann Videos gespeichert wurden. Unter Jahre steht jeder Monat als eine Kachel mit der Anzahl.</p>
  <p>Ein Tippen auf eine Kachel führt eine Stufe tiefer zu genau diesem Video, von Jahre zu Monate, von Monate zu Wochen und von Wochen zu Tage. Erst unter Tage öffnet sich das Video. Die Zurück-Geste führt wieder eine Stufe hinauf. Beim Öffnen der Analyse steht die Ansicht immer auf Tage.</p>
  <figure><img src="hilfe/analyse.jpg" width="1280" height="800" alt="Übersicht der Analyse"><figcaption>Die Übersicht mit den Filtern oben</figcaption></figure>
  <p>Videos heißen nach ihrer Nummer am Tag, also 1, 2, 3. Das fünfte Bild aus Video 4 heißt 4.5. Bilder aus einem Vergleich heißen vs1.1, vs1.2 und so weiter. Jeden Tag beginnt die Zählung neu, eine Nummer wird nie zweimal vergeben.</p>
  <dl>
    <dt>★</dt><dd>Zeigt nur Einträge mit Stern.</dd>
    <dt>Name und Stichwort</dt><dd>Zeigt nur Einträge mit diesem Namen oder Stichwort. Beides tragen Sie im Player ein.</dd>
    <dt>vs</dt><dd>Nur unter „Bilder“. Zeigt nur Bilder aus Vergleichen.</dd>
    <dt>×</dt><dd>Setzt alle Filter zurück.</dd>
  </dl>
  <p>Ein Tippen auf eine Karte öffnet das Video oder Bild im Player.</p>
</section>

<section id="h-player">
  <h3><span class="no">05</span>Player</h3>
  <figure><img src="hilfe/player.jpg" width="1280" height="800" alt="Player"><figcaption>Der Player mit Werkzeugen rechts und der Steuerung unten</figcaption></figure>
  <p>Oben links führt „‹ Übersicht“ zurück. Mit „Video | Bilder“ wechseln Sie zu den Bildern, die aus diesem Video gespeichert wurden. Rechts tragen Sie Stern, Name und Stichwort ein. Bei Name und Stichwort schlägt die App frühere Einträge vor.</p>
  <dl>
    <dt><i data-ico="#pDown"></i>Herunterladen</dt><dd>Speichert das Video oder Bild als Datei. In der Android-App landet es im Download-Ordner. Der Dateiname enthält Datum, Nummer, Name und Stichwort.</dd>
    <dt>Löschen</dt><dd>Zweimal tippen. Beim ersten Mal steht dort „Ja, löschen“, erst das zweite Tippen löscht.</dd>
    <dt>‹ ›</dt><dd>Die Pfeile oben links im Bild blättern zum nächsten Eintrag, in der Reihenfolge der Übersicht. Haben Sie die Bilder über „Video | Bilder“ geöffnet, bleiben die Pfeile bei den Bildern dieses Videos. Nach dem letzten kommt wieder das erste.</dd>
  </dl>
  <p>Unten steuern Sie die Wiedergabe.</p>
  <dl>
    <dt><i data-ico="#pPrev"></i><i data-ico="#pNext"></i>Bild zurück, Bild vor</dt><dd>Ein Bild weiter. Gehalten läuft es fortlaufend.</dd>
    <dt><i data-ico="#pPlay .i-play"></i>Abspielen</dt><dd>Spielt ab oder hält an. Der Regler daneben springt an jede Stelle.</dd>
    <dt><i data-ico="#pLoop"></i>Wiederholen</dt><dd>Am Ende beginnt das Video von vorn.</dd>
    <dt>1×</dt><dd>Geschwindigkeit. Jedes Tippen schaltet weiter auf ½, ¼ und ⅛.</dd>
  </dl>
</section>

<section id="h-tools">
  <h3><span class="no">06</span>Werkzeuge</h3>
  <p>Rechts im Player stehen die Werkzeuge zum Zeichnen und Messen. Gezeichnet wird auf das Bild, das gerade steht. Läuft das Video weiter, verschwindet die Zeichnung. Wollen Sie sie behalten, tippen Sie auf „Speichern“.</p>
  <dl>
    <dt><i data-ico="#dZoom"></i>1:1</dt><dd>Zoomen und verschieben Sie mit zwei Fingern, das geht in jedem Werkzeug. 1:1 holt das ganze Bild zurück.</dd>
    <dt><i data-ico="[data-tool=free]"></i>Stift</dt><dd>Freies Zeichnen mit dem Finger.</dd>
    <dt><i data-ico="[data-tool=line]"></i>Linie</dt><dd>Eine gerade Linie vom Aufsetzen bis zum Loslassen.</dd>
    <dt><i data-ico="[data-tool=arc]"></i>Bogen</dt><dd>Ziehen Sie erst eine Linie. Danach erscheinen zwei Griffe. Ziehen Sie daran, wölbt sich die Linie, etwa zur Flugbahn.</dd>
    <dt><i data-ico="[data-tool=angle]"></i>Winkel</dt><dd>Tippen Sie drei Punkte, der mittlere ist der Scheitel. Die Gradzahl erscheint am Scheitel, etwa für den Winkel in Hüfte oder Knie.</dd>
    <dt><i data-ico="[data-tool=circle]"></i>Kreis</dt><dd>Setzen Sie den Finger auf die Mitte und ziehen Sie nach außen. Damit kreisen Sie etwa ein Gelenk ein. Der Griff in der Mitte verschiebt den Kreis, der Griff am Rand ändert die Größe.</dd>
    <dt><i data-ico="[data-tool=plumb]"></i>Lot</dt><dd>Eine senkrechte Linie über das ganze Bild, etwa um zu sehen, ob der Körper beim Eintauchen gerade ist.</dd>
    <dt><i data-ico="[data-tool=level]"></i>Waage</dt><dd>Eine waagerechte Linie über das ganze Bild, etwa auf Höhe des Bretts.</dd>
    <dt><i data-ico="#dGrid"></i>Raster</dt><dd>Blendet dezente Linien zur Orientierung ein und aus. Das Raster landet nicht in gespeicherten Bildern.</dd>
    <dt><i data-ico="#dColor"></i>Farbe</dt><dd>Jedes Tippen wechselt die Farbe für das nächste Zeichnen, Gelb, Rot, Grün, Türkis und Weiß.</dd>
    <dt><i data-ico="#dCut"></i>Schneiden</dt><dd>Nur bei Videos. Wählen Sie mit den beiden Griffen unten den Teil, der bleiben soll, und tippen Sie auf „Schneiden“. Der Rest wird entfernt. Das lässt sich nicht rückgängig machen.</dd>
    <dt><i data-ico="#dUndo"></i>Rückgängig</dt><dd>Entfernt das zuletzt Gezeichnete.</dd>
    <dt><i data-ico="#dClear"></i>Leeren</dt><dd>Entfernt die ganze Zeichnung.</dd>
    <dt><i data-ico="#dSave"></i>Speichern</dt><dd>Speichert das Bild mit Zeichnung. Es erscheint unter „Bilder“ und beim Video unter „Video | Bilder“.</dd>
  </dl>
  <p>Punkte von Linie, Bogen, Winkel und Kreis lassen sich später noch mit dem Finger verschieben.</p>
</section>

<section id="h-cmp">
  <h3><span class="no">07</span>Vergleich</h3>
  <p>Im Vergleich sehen Sie zwei bis vier Videos nebeneinander, etwa denselben Sprung von heute und von vor einem Jahr.</p>
  <ol>
    <li>Tippen Sie unter „Videos“ rechts auf „Vergleichen“.</li>
    <li>Tippen Sie die Videos an. Jedes bekommt eine Nummer. Die Auswahl bleibt, auch wenn Sie dazwischen Filter oder Ansicht ändern. Unter Monate sehen Sie viele Videos auf einmal und können etwa ein Video von heute und eines von vor einem Jahr nacheinander antippen.</li>
    <li>Tippen Sie auf „Öffnen“.</li>
  </ol>
  <figure><img src="hilfe/vergleich.jpg" width="1280" height="800" alt="Vergleich"><figcaption>Zwei Videos im Vergleich, unter dem Bild die Regler zum Ausrichten</figcaption></figure>
  <p>Unter dem Bild hat jedes Video einen eigenen Regler. Schieben Sie jedes Video auf denselben Moment, etwa den Absprung. Tippen Sie dann unten rechts auf „Start“. Ab jetzt laufen alle Videos gemeinsam, die Regler verschwinden und die Videos werden größer. Ein weiteres Tippen auf „Start“ holt die Regler zurück.</p>
  <p>Die Werkzeuge funktionieren wie im Player. Gespeicherte Bilder heißen vs1.1, vs1.2 und so weiter.</p>
</section>

<section id="h-star">
  <h3><span class="no">08</span>Sterne und Löschen</h3>
  <p>Damit das Tablet nicht vollläuft, löscht die App Videos ohne Stern nach einigen Tagen von selbst. Wie viele Tage, stellen Sie in den Einstellungen unter „07 Videos“ ein.</p>
  <ul>
    <li>Über das Löschen entscheidet nur der Stern des Videos. Ein Video mit Stern bleibt.</li>
    <li>Jedes Bild hat einen eigenen Stern. Ein Stern am Bild setzt auch den Stern am Video.</li>
    <li>Wird ein Video gelöscht, verschwinden seine Bilder mit.</li>
    <li>Der Filter ★ unter „Bilder“ zeigt nur Bilder mit eigenem Stern.</li>
  </ul>
  <p>Wollen Sie einen Sprung behalten, setzen Sie also den Stern.</p>
</section>

<section id="h-set">
  <h3><span class="no">09</span>Einstellungen</h3>
  <p>Das Zahnrad oben rechts öffnet die Einstellungen. Ein Tippen neben das Fenster schließt es wieder.</p>
  <figure><img src="hilfe/einstellungen.jpg" width="1280" height="800" alt="Einstellungen"><figcaption>Das Fenster Einstellungen</figcaption></figure>
  <dl>
    <dt>01 Farbe</dt><dd>Die Akzentfarbe der App. Der bunte Kreis öffnet eine freie Auswahl.</dd>
    <dt>02 Sprache</dt><dd>Jedes Tippen wechselt die Sprache.</dd>
    <dt>03 Modus</dt><dd>Dunkel, Mittel oder Hell. Der Betrieb bleibt immer dunkel.</dd>
    <dt>04 Größe</dt><dd>Wie groß Knöpfe und Schrift sind, klein, mittel oder groß.</dd>
    <dt>05 Bildschirm</dt><dd>Passt die App an den Fernseher an, siehe Einrichten.</dd>
    <dt>06 Zeitlupe</dt><dd>Wie langsam die Zeitlupe im Betrieb läuft, ½, ¼ oder ⅛. Jedes Tippen schaltet weiter.</dd>
    <dt>07 Videos</dt><dd>Nach wie vielen Tagen Videos ohne Stern gelöscht werden, von 1 bis 30 Tagen oder nie. Eine kürzere Frist löscht nichts ohne Rückfrage. Darunter steht, wie viel Speicher belegt ist. „Videos löschen …“ löscht auf einmal alle Videos ohne Stern oder alle Videos, nach einer Rückfrage.</dd>
  </dl>
  <p>Die Nummer der Version steht oben rechts neben dem Zahnrad.</p>
</section>
`;

const helpEl = $('help');

function fillHelp() {
  const body = $('helpBody');
  if (body.childElementCount) return;
  body.innerHTML = HELP_HTML;
  // Symbole aus den echten Knöpfen
  for (const i of body.querySelectorAll('i[data-ico]')) {
    const src = document.querySelector(i.dataset.ico);
    const svg = src && (src.tagName === 'svg' ? src : src.querySelector('svg, .dot'));
    if (svg) i.append(svg.cloneNode(true));
    else i.remove();
  }
  // Inhaltsverzeichnis aus den Überschriften
  const nav = $('helpNav');
  for (const s of body.querySelectorAll('section')) {
    const b = document.createElement('button');
    b.dataset.to = s.id;
    b.innerHTML = s.querySelector('h3').innerHTML;
    nav.append(b);
  }
  nav.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (b) $(b.dataset.to).scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  // Das gerade gelesene Kapitel ist im Verzeichnis hervorgehoben
  body.addEventListener('scroll', markHelpNav, { passive: true });
}

function markHelpNav() {
  const body = $('helpBody');
  const top = body.getBoundingClientRect().top + 40;
  let cur = null;
  for (const s of body.querySelectorAll('section')) if (s.getBoundingClientRect().top <= top) cur = s.id;
  if (!cur) cur = body.querySelector('section').id;
  for (const b of $('helpNav').children) b.classList.toggle('on', b.dataset.to === cur);
}

const helpOpen = () => !helpEl.classList.contains('hidden');

function openHelp() {
  fillHelp();
  helpEl.classList.remove('hidden');
  $('helpBody').scrollTop = 0;
  markHelpNav();
  history.pushState({ v: 'help' }, '');
}

// Geschlossen wird über × oder die Zurück-Geste, danach sind die Einstellungen wieder da
function closeHelp() {
  helpEl.classList.add('hidden');
}

$('uiHelp').addEventListener('click', openHelp);
$('helpClose').addEventListener('click', () => history.back());
