# The Buy-In Bowl — Ligaarchiv

Statische Webseite. Kein Server, keine Datenbank, keine Abhängigkeiten. Läuft in zehn Jahren noch genauso, solange die Dateien existieren.

**Inhalte stehen ausschließlich in `/data`.** An `index.html`, `assets/style.css` und `assets/app.js` musst du nie etwas ändern.

```
index.html              Gerüst
assets/style.css        Aussehen
assets/app.js           Darstellung, Tabelle, Bracket
data/league.js          Manager, Buy-in, Preisgeld, Regeln, Landing-Texte
data/season-2025.js     Saison I  — abgeschlossen
data/season-2026.js     Saison II — läuft
media/                  Bilder, falls du welche einbindest
```

Zum Ansehen reicht ein Doppelklick auf `index.html`.

---

## Online stellen (GitHub Pages)

Einmalig, zehn Minuten, kostenlos. Am Rechner, nicht am Handy.

1. Auf **github.com** einloggen, oben rechts **+ → New repository**
2. Name: `buy-in-bowl`. Sichtbarkeit **Public** (bei Private kostet Pages Geld). **Create repository**
3. **Add file → Upload files.** Zip vorher entpacken und den **Inhalt** des Ordners hochladen — also `index.html`, `assets`, `data`, `media`. Nicht den Ordner selbst, sonst landet die Seite eine Ebene zu tief
4. Unten **Commit changes**
5. **Settings → Pages → Source: Deploy from a branch → Branch: `main`, Ordner `/ (root)` → Save**
6. Ein bis zwei Minuten warten. Die Seite liegt dann unter
   `https://DEINNAME.github.io/buy-in-bowl/`

Alternativ per Git:

```bash
git init
git add .
git commit -m "Archiv angelegt"
git branch -M main
git remote add origin https://github.com/DEINNAME/buy-in-bowl.git
git push -u origin main
```

**Aktualisieren** heißt ab da: Datei ändern, committen, pushen. Für kleine Änderungen geht das direkt im Browser über das Stift-Symbol in GitHub — auch vom Handy aus.

**Eigene Domain** (optional): Domain kaufen, beim Anbieter einen CNAME auf `DEINNAME.github.io` setzen, in GitHub unter Settings → Pages eintragen. Bedenke: eine Domain ist eine jährliche Rechnung, die in acht Jahren vielleicht niemand mehr bezahlt. Die github.io-Adresse kostet nichts und bleibt.

---

## Wöchentlich, zwei Minuten

In `data/season-2026.js`:

1. **Tabelle** unter `standings` aktualisieren — Rang, Bilanz und Punkte aus Yahoo übernehmen
2. Optional die Woche unter `weeks` ergänzen:

```js
{
  week: 2,
  headline: "Kincaid rettet die Woche in der letzten Minute",
  matchups: [
    { home: "Handegg United", away: "Julius's Juicemen", homeScore: 118.42, awayScore: 111.06 }
  ],
  notes: ["Was war besonders."],
  quotes: [{ text: "Spruch aus dem Ligachat", by: "Julius", when: "Week 2" }]
}
```

Der Live-Chip auf der Startseite zählt sich aus der Tabelle selbst hoch.

## Am Saisonende

In `data/season-2026.js` ausfüllen: `champion`, `runnerUp`, `lastPlace` samt Strafe, `pointsLeader`, finale `standings`, `playoffs` mit allen Paarungen. Dann `status` auf `"complete"` setzen.

Damit das Bracket erscheint, braucht `playoffs`:

```js
playoffs: {
  order: ["Quarterfinals", "Semifinals", "Final"],
  byes: { Quarterfinals: ["Team A", "Team B"] },
  thirdPlaceRound: "Third place",
  games: [
    { round: "Quarterfinals", home: "X", away: "Y", winner: "Y" },
    ...
  ]
}
```

`winner` reicht — Punktzahlen sind optional und werden im Baum ohnehin nicht angezeigt.

## Neue Saison anlegen

1. `data/season-2026.js` kopieren nach `data/season-2027.js`
2. Darin `2026` durch `2027` ersetzen, Titel auf `"The Buy-In Bowl III"`, Inhalte leeren
3. In `index.html` eine Zeile ergänzen: `<script src="data/season-2027.js"></script>`
4. In `data/league.js` bei jedem Manager den Teamnamen für das neue Jahr ergänzen

Tab, Tabelle, Bracket und die ewige Bilanz aktualisieren sich von selbst.

---

## Noch offen

- **Landing-Texte**: In `data/league.js` steht ein Block `landing` mit `headline`, `intro`, `highlights` und `image`. Solange die leer sind, greifen die Standardtexte.
- **Spielstände der Playoffs 2025**: Viertel- und Halbfinale sind mit Siegern erfasst, die Punkte fehlen. Auf Tabelle und Baum hat das keinen Einfluss.
