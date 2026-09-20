/* The Buy-In Bowl — archive
   Two pages: the landing page and the all-time table.
   All content lives in /data. */

(function () {
  "use strict";

  var L = window.LEAGUE || {};
  var S = window.SEASONS || {};
  var root = document.getElementById("app");

  /* ---------- Helpers ---------- */
  function esc(v) {
    if (v === null || v === undefined) return "";
    return String(v).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function has(v) {
    if (v === null || v === undefined) return false;
    if (typeof v === "string") return v.trim() !== "";
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === "object") return Object.keys(v).some(function (k) { return has(v[k]); });
    return true;
  }
  function years() {
    return Object.keys(S).map(Number).sort(function (a, b) { return b - a; });
  }
  function num(v, dec) {
    if (v === null || v === undefined || v === "") return "–";
    return Number(v).toLocaleString("en-US", {
      minimumFractionDigits: dec || 0, maximumFractionDigits: dec === undefined ? 0 : dec
    });
  }
  function nothing(txt) { return '<p class="empty">' + esc(txt) + "</p>"; }
  function bullets(arr) {
    if (!has(arr)) return "";
    return '<ul class="bullets">' + arr.map(function (b) { return "<li>" + esc(b) + "</li>"; }).join("") + "</ul>";
  }
  function managerName(id, year) {
    var m = (L.managers || []).filter(function (x) { return x.id === id; })[0];
    if (!m) return id ? esc(id) : "";
    if (has(m.name)) return esc(m.name);
    if (m.teams && year && m.teams[year]) return esc(m.teams[year]);
    return "";
  }
  function trophySvg() {
    return '<svg class="trophy" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M7 3h10v5a5 5 0 0 1-10 0V3Z"/>' +
      '<path d="M7 5H4v2a4 4 0 0 0 3.2 3.9M17 5h3v2a4 4 0 0 1-3.2 3.9"/>' +
      '<path d="M12 13v4M9 21h6M10 17h4l1 4H9l1-4Z"/></svg>';
  }
  /* "The Buy-In Bowl II" -> "II" */
  function edition(y) {
    var s = S[y];
    if (!s || !has(s.title)) return "";
    var m = String(s.title).match(/\b([IVX]+)\s*$/);
    return m ? m[1] : "";
  }

  function avatar(id, cls) {
    var m = (L.managers || []).filter(function (x) { return x.id === id; })[0];
    if (!m || !has(m.avatar)) return "";
    return '<img class="avatar ' + (cls || "") + '" src="' + esc(m.avatar) +
      '" alt="" loading="lazy">';
  }

  function seasonLogo(y, cls) {
    var s = S[y];
    if (!s || !has(s.logo)) return "";
    return '<img class="slogo ' + (cls || "") + '" src="' + esc(s.logo) +
      '" alt="Buy-In Bowl ' + y + '" loading="lazy">';
  }

  function rings(n) {
    var out = "", i;
    for (i = 0; i < n; i++) out += trophySvg();
    return out;
  }

  /* ---------- Landing ---------- */
  function defendingChampion() {
    var ys = years(), i;
    for (i = 0; i < ys.length; i++) {
      var c = S[ys[i]].champion;
      if (c && has(c.team)) return { y: ys[i], c: c };
    }
    return null;
  }

  /* Live status instead of repeating the champion, which sits right below */
  function statusChip() {
    var ys = years(), i;
    for (i = 0; i < ys.length; i++) {
      var s = S[ys[i]];
      if (s.status !== "live" && s.status !== "laufend") continue;
      var first = (s.standings || [])[0];
      var played = first ? (+first.w || 0) + (+first.l || 0) + (+first.t || 0) : 0;
      var ed = edition(ys[i]);
      return '<div class="eyebrow live"><span class="pulse"></span>Buy-In Bowl' +
        (ed ? ' <span class="rn">' + ed + "</span>" : "") + " running" +
        (played ? " &middot; week " + played + " in the books" : " &middot; season about to start") +
        "</div>";
    }
    return '<div class="eyebrow">Founded ' + (L.founded || "") + " &middot; " +
      ys.length + (ys.length === 1 ? " season" : " seasons") + " on file</div>";
  }

  function renderLanding() {
    var ys = years();
    var lp = L.landing || {};
    var def = defendingChampion();

    var h = '<section class="hero"><div class="wrap">';
    var cur = ys[0];
    if (S[cur] && has(S[cur].logo)) h += '<div class="hero-logo">' + seasonLogo(cur, "") + "</div>";
    h += statusChip();
    h += '<h1 class="hero-title">' + esc(has(lp.headline) ? lp.headline : (L.claim || "")) + "</h1>";
    h += '<p class="plaque-sub">' + esc(has(lp.intro) ? lp.intro :
      "Every win, every collapse, every ring \u2014 kept somewhere the group chat can't lose it.") + "</p>";
    if (has(lp.highlights)) h += bullets(lp.highlights);

    var titled = ys.filter(function (y) { return S[y].champion && has(S[y].champion.team); }).length;
    var stats = [
      [ys.length, ys.length === 1 ? "Season" : "Seasons"],
      [L.teamCount || (L.managers || []).length, "Teams"],
      [has(L.money && L.money.pot) ? L.money.pot : "–", "In the pot"],
      [titled, titled === 1 ? "Title decided" : "Titles decided"]
    ];
    h += '<div class="statband">' + stats.map(function (s2) {
      return '<div class="stat"><div class="stat-v">' + esc(s2[0]) + '</div><div class="stat-l">' +
        esc(s2[1]) + "</div></div>";
    }).join("") + "</div>";
    h += "</div></section>";

    h += ticker();

    if (has(lp.image)) {
      h += '<div class="wrap"><img class="hero-img" src="' + esc(lp.image) + '" alt=""></div>';
    }

    if (def) {
      h += '<div class="wrap"><div class="showcase">' +
        '<div class="showcase-glow" aria-hidden="true"></div>' +
        '<div class="showcase-trophy">' + trophySvg() + "</div>" +
        '<div class="showcase-label">Champion · ' + def.y + "</div>" +
        '<div class="showcase-name">' + esc(def.c.team) + "</div>" +
        '<div class="showcase-line">' +
        [managerName(def.c.manager, def.y), esc(def.c.record), esc(def.c.note)]
          .filter(function (x) { return x; }).join(" · ") + "</div>" +
        '<button type="button" class="cta" data-route="table">Open the all-time table</button>' +
        "</div></div>";
    }

    h += '<div class="wordwall" aria-hidden="true"><span>BUY-IN BOWL</span></div>';
    return h;
  }

  /* Stadium ribbon board: every team name the league has ever had */
  function ticker() {
    /* Only the teams playing the current season */
    var current = years()[0];
    var names = [];
    (L.managers || []).forEach(function (m) {
      var team = (m.teams || {})[current];
      if (team && names.indexOf(team) === -1) names.push(team);
    });
    if (!names.length) return "";
    var champs = {};
    years().forEach(function (y) {
      var c = S[y].champion;
      if (c && has(c.team)) champs[c.team] = true;
    });
    var run = names.map(function (n) {
      return '<span class="tk' + (champs[n] ? " won" : "") + '">' + esc(n) +
        (champs[n] ? trophySvg() : "") + '</span><i class="tkdot"></i>';
    }).join("");
    return '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + run + run + "</div></div>";
  }

  /* ---------- All-time table ---------- */
  var mTab = "all";
  var mSort = { key: "wins", dir: -1 };

  /* Year tabs open in the final standings, all-time opens by wins. */
  function defaultSort(mode) {
    return mode === "all" ? { key: "wins", dir: -1 } : { key: "place", dir: 1 };
  }

  function teamManager(year, team) {
    var ms = L.managers || [], i;
    for (i = 0; i < ms.length; i++) {
      if (ms[i].teams && ms[i].teams[year] === team) return ms[i].id;
    }
    var st = ((S[year] && S[year].standings) || []).filter(function (r) { return r.team === team; })[0];
    return st ? st.manager : null;
  }

  /* mode: "all" or a single year. Playoff games count wherever a score is on file. */
  function careers(mode) {
    var ys = years().slice().sort(function (a, b) { return a - b; });
    if (mode !== "all") ys = ys.filter(function (y) { return String(y) === String(mode); });

    var rows = (L.managers || []).map(function (m) {
      var st = { id: m.id, name: m.name, seasons: 0, titles: 0, w: 0, l: 0, t: 0,
                 pw: 0, pl: 0, pf: 0, teams: [], last: "", place: 999 };

      ys.forEach(function (y) {
        var s = S[y];
        if (!s) return;
        var team = (m.teams || {})[y], line = null;

        (s.standings || []).forEach(function (r) {
          if (r.manager !== m.id) return;
          st.w += +r.w || 0; st.l += +r.l || 0; st.t += +r.t || 0; st.pf += +r.pf || 0;
          if (r.rank) st.place = Math.min(st.place, +r.rank);
          line = r.team;
        });

        ((s.playoffs || {}).games || []).forEach(function (g) {
          /* Winner comes from an explicit field, otherwise from the scores. */
          var win = has(g.winner) ? g.winner : null;
          if (!win) {
            if (g.homeScore === null || g.homeScore === undefined) return;
            if (g.awayScore === null || g.awayScore === undefined) return;
            win = g.homeScore > g.awayScore ? g.home : g.away;
          }
          var side = teamManager(y, g.home) === m.id ? g.home
                   : teamManager(y, g.away) === m.id ? g.away : null;
          if (!side) return;
          if (side === win) st.pw++; else st.pl++;
        });

        if (team || line) {
          st.seasons++;
          st.last = team || line;
          if (st.teams.indexOf(team || line) === -1) st.teams.push(team || line);
        }
        if (s.champion && s.champion.manager === m.id) st.titles++;
      });

      st.wins = st.w + st.pw;
      st.losses = st.l + st.pl;
      st.games = st.wins + st.losses + st.t;
      st.pct = st.games ? st.wins / st.games : 0;
      st.label = has(st.name) ? st.name : st.last;
      return st;
    }).filter(function (x) { return x.seasons > 0; });

    var k = mSort.key, dir = mSort.dir;
    rows.sort(function (a, b) {
      if (k === "label") {
        var av = (a.label || "").toLowerCase(), bv = (b.label || "").toLowerCase();
        return av < bv ? dir : av > bv ? -dir : 0;
      }
      if (k === "place") return (a.place - b.place) * dir || b.wins - a.wins;
      return ((a[k] || 0) - (b[k] || 0)) * dir || b.wins - a.wins || b.pf - a.pf;
    });
    return rows;
  }

  function cellValue(r, key) {
    if (key === "pct") return r.games ? (r.pct * 100).toFixed(1) + "%" : "–";
    if (key === "pf") return r.pf ? num(r.pf, 2) : "–";
    if (key === "label") return r.label;
    if (key === "titles") return r.titles || 0;
    return r[key] || 0;
  }

  /* Podium reacts to whichever column is sorted */
  function podium(rows) {
    if (rows.length < 3) return "";
    var key = mSort.key === "label" ? "wins" : mSort.key;
    var label = { wins: "Wins", losses: "Losses", games: "Games", pct: "Win rate",
                  pf: "Points", titles: "Titles", seasons: "Seasons" }[key] || "Wins";
    var top = rows.slice(0, 3);
    var order = [1, 0, 2];
    var h = '<div class="podium"><div class="podium-label">Top three by ' + esc(label.toLowerCase()) + "</div>";
    h += '<div class="podium-row">';
    order.forEach(function (idx) {
      var r = top[idx];
      h += '<div class="pod p' + (idx + 1) + '">' +
        (avatar(r.id, "pod-av") || "") +
        '<div class="pod-name">' + esc(r.label) + "</div>" +
        '<div class="pod-val">' + esc(cellValue(r, key)) + "</div>" +
        '<div class="pod-bar"><span class="pod-rank">' + (idx + 1) + "</span>" +
        (r.titles ? '<span class="pod-trophy">' + trophySvg() + "</span>" : "") +
        "</div></div>";
    });
    return h + "</div></div>";
  }

  function renderTable() {
    var ys = years();
    var cols = [
      { key: "label", label: "Manager" },
      { key: "seasons", label: "Seasons", num: true, allOnly: true },
      { key: "titles", label: "Titles", num: true },
      { key: "wins", label: "W", num: true },
      { key: "losses", label: "L", num: true },
      { key: "games", label: "Games", num: true },
      { key: "pct", label: "Win %", num: true },
      { key: "pf", label: "Points", num: true }
    ].filter(function (c) { return mTab === "all" || !c.allOnly; });

    var rows = careers(mTab);

    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">All-time table</h1>' +
      '<p class="page-kicker">Regular season and playoffs combined. Tap a column to sort.</p></div>';

    h += '<div class="tabs">' +
      '<button type="button" class="tab' + (mTab === "all" ? " on" : "") +
        '" data-mtab="all"><b>All-time</b><small>Every season</small></button>' +
      ys.map(function (y) {
        var ed = edition(y);
        return '<button type="button" class="tab has-logo' + (String(mTab) === String(y) ? " on" : "") +
          '" data-mtab="' + y + '">' + seasonLogo(y, "tab-logo") +
          '<span class="tab-txt"><b>' + y + "</b><small>Buy-In Bowl" +
          (ed ? ' <span class="rn">' + ed + "</span>" : "") + "</small></span></button>";
      }).join("") + "</div>";

    if (!rows.length) return h + nothing("Nothing recorded for this season yet.") + "</div>";

    h += podium(rows);

    var maxPf = rows.reduce(function (m, r) { return Math.max(m, r.pf || 0); }, 0) || 1;

    var byPlace = mSort.key === "place" && mTab !== "all";
    h += '<div class="table-scroll"><table class="ranked-table"><thead><tr>' +
      '<th class="rank sortable' + (byPlace ? " on" : "") + '" data-sort="place">#' +
      (byPlace ? '<i class="ar">' + (mSort.dir === -1 ? "\u25BC" : "\u25B2") + "</i>" : "") + "</th>";
    cols.forEach(function (c) {
      var on = mSort.key === c.key;
      h += '<th class="' + (c.num ? "num " : "") + "sortable" + (on ? " on" : "") +
        '" data-sort="' + c.key + '">' + esc(c.label) +
        (on ? '<i class="ar">' + (mSort.dir === -1 ? "\u25BC" : "\u25B2") + "</i>" : "") + "</th>";
    });
    h += "</tr></thead><tbody>";

    rows.forEach(function (r, i) {
      var pct = r.pf ? Math.max(4, Math.round((r.pf / maxPf) * 100)) : 0;
      var cls = r.titles > 0 ? "is-first" : "";
      if (byPlace && i === 5 && rows.length > 6) cls += " playoff-cut";
      h += '<tr class="' + cls + '" style="--w:' + pct + '%">';
      h += '<td class="rank">' + (i + 1) + "</td>";
      cols.forEach(function (c) {
        if (c.key === "label") {
          h += '<td class="mcell"><div class="mwrap">' + avatar(r.id) +
            '<span class="mtxt"><span class="mname">' + esc(r.label) + "</span>" +
            (r.teams.length ? '<span class="mteam">' + esc(r.teams.join(", ")) + "</span>" : "") +
            "</span></div></td>";
        } else if (c.key === "titles") {
          h += '<td class="num">' + (r.titles ? '<span class="rings">' + rings(r.titles) + "</span>" : "–") + "</td>";
        } else if (c.key === "pct") {
          h += '<td class="num">' + (r.games ? (r.pct * 100).toFixed(1) + "%" : "–") + "</td>";
        } else if (c.key === "pf") {
          h += '<td class="num">' + (r.pf ? num(r.pf, 2) : "–") + "</td>";
        } else {
          var v = r[c.key];
          h += '<td class="num">' + (v === undefined || v === null ? "–" : v) + "</td>";
        }
      });
      h += "</tr>";
    });

    h += "</tbody></table></div>";
    h += '<p class="hint">W and L include the playoffs.' +
      (byPlace && rows.length > 6 ? " The heavier rule marks the playoff cut after sixth place." : "") +
      "</p>";
    h += brackets();
    return h + "</div>";
  }

  /* ---------- Playoff bracket ---------- */
  function winnerOf(g) {
    if (has(g.winner)) return g.winner;
    if (g.homeScore === null || g.homeScore === undefined) return null;
    if (g.awayScore === null || g.awayScore === undefined) return null;
    return g.homeScore > g.awayScore ? g.home : g.away;
  }

  /* Build rounds, split each one into a left and a right branch so the
     bracket funnels inward toward the final. */
  function buildRounds(po) {
    var games = (po.games || []).filter(function (g) { return g.round !== po.thirdPlaceRound; });
    if (!games.length) return null;

    var order = (po.order || []).slice();
    games.forEach(function (g) { if (order.indexOf(g.round) === -1) order.push(g.round); });
    order = order.filter(function (rd) {
      return games.some(function (g) { return g.round === rd; });
    });

    var last = order[order.length - 1];
    var fin = games.filter(function (g) { return g.round === last; })[0];
    var side = {};
    if (fin) { side[fin.home] = "l"; side[fin.away] = "r"; }

    /* Walk backwards: a match inherits the branch of the team that moved on. */
    for (var i = order.length - 2; i >= 0; i--) {
      games.filter(function (g) { return g.round === order[i]; }).forEach(function (g) {
        var w = winnerOf(g);
        var s = side[w] || "l";
        g._side = s;
        side[g.home] = side[g.home] || s;
        side[g.away] = side[g.away] || s;
      });
    }

    return order.map(function (rd, ri) {
      var items = games.filter(function (g) { return g.round === rd; }).map(function (g) {
        return { type: "match", g: g, side: g._side || (ri === order.length - 1 ? "c" : "l") };
      });
      ((po.byes && po.byes[rd]) || []).forEach(function (b) {
        items.push({ type: "bye", team: b, side: side[b] || "l" });
      });
      items.sort(function (a, b) {
        var rank = { l: 0, c: 1, r: 2 };
        return rank[a.side] - rank[b.side] || (a.type === "bye" ? -1 : 1);
      });
      return { label: rd, items: items };
    });
  }

  function brackets() {
    if (mTab === "all") return "";
    var ys = years().filter(function (y) {
      if (String(y) !== String(mTab)) return false;
      return has((S[y].playoffs || {}).games);
    });
    if (!ys.length) return "";

    return ys.map(function (y) {
      var po = S[y].playoffs || {};
      var rounds = buildRounds(po);
      if (!rounds) return "";

      var h = '<section class="bracket-block" data-year="' + y + '">';
      var ed = edition(y);
      h += '<h2 class="sec">' + seasonLogo(y, "sec-logo") + "Playoffs " + y +
        (ed ? " &middot; Buy-In Bowl " + ed : "") +
        '<button type="button" class="replay" data-replay>Replay</button></h2>';
      h += '<div class="bracket-wrap"><svg class="bracket-lines" aria-hidden="true"></svg>';

      rounds.forEach(function (rd, ri) {
        h += '<div class="round-row" data-r="' + ri + '">';
        h += '<div class="row-label"><span>' + esc(rd.label) + "</span></div>";
        var groups = { l: [], c: [], r: [] };
        rd.items.forEach(function (it) { (groups[it.side] || groups.l).push(it); });

        function card(it, ri2, ii) {
          var id = ri2 + "-" + ii;
          if (it.type === "bye") {
            return '<div class="match bye" data-mid="' + id + '">' +
              '<div class="side" data-team="' + esc(it.team) + '">' +
              '<span class="nm">' + esc(it.team) + "</span><em>Bye</em></div></div>";
          }
          var g = it.g, win = winnerOf(g);
          return '<div class="match" data-mid="' + id + '">' +
            '<div class="side' + (win === g.home ? " win" : "") + '" data-team="' + esc(g.home) + '">' +
              '<span class="nm">' + esc(g.home) + "</span></div>" +
            '<div class="side' + (win === g.away ? " win" : "") + '" data-team="' + esc(g.away) + '">' +
              '<span class="nm">' + esc(g.away) + "</span></div></div>";
        }

        var n = 0;
        if (groups.c.length) {
          h += '<div class="row-items centered">';
          groups.c.forEach(function (it) { h += card(it, ri, n++); });
        } else {
          h += '<div class="row-items">';
          h += '<div class="branch">';
          groups.l.forEach(function (it) { h += card(it, ri, n++); });
          h += '</div><div class="branch">';
          groups.r.forEach(function (it) { h += card(it, ri, n++); });
          h += "</div>";
        }
        h += "</div></div>";
      });

      h += "</div>";

      var lastRound = rounds[rounds.length - 1];
      var finItem = lastRound.items.filter(function (i2) { return i2.type === "match"; })[0];
      var champ = finItem ? winnerOf(finItem.g) : null;
      if (champ) {
        h += '<div class="champ-row"><div class="bracket-winner" data-team="' + esc(champ) + '">' +
          trophySvg() + "<span>" + esc(champ) + "</span></div></div>";
      }
      return h + "</section>";
    }).join("");
  }

  /* ---------- Bracket choreography ---------- */
  var NS = "http://www.w3.org/2000/svg";

  function sourceFor(block, team, round) {
    /* The card this team came from: a win in the previous round, or a bye. */
    for (var r = round - 1; r >= 0; r--) {
      var row = block.querySelector('.round-row[data-r="' + r + '"]');
      if (!row) continue;
      var el = row.querySelector('.side.win[data-team="' + cssq(team) + '"]') ||
               row.querySelector('.match.bye .side[data-team="' + cssq(team) + '"]');
      if (el) return el;
    }
    return null;
  }
  function cssq(v) { return String(v).replace(/"/g, '\\"'); }

  /* Where a name starts its flight: its row in the table above. */
  function tableSource(team) {
    var cells = [].slice.call(root.querySelectorAll(".mteam"));
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].textContent.indexOf(team) !== -1) return cells[i];
    }
    return null;
  }

  function drawLines(block, animate) {
    var wrap = block.querySelector(".bracket-wrap");
    var svg = block.querySelector(".bracket-lines");
    if (!wrap || !svg) return [];
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var wb = wrap.getBoundingClientRect();
    svg.setAttribute("viewBox", "0 0 " + wb.width + " " + wb.height);
    svg.setAttribute("width", wb.width);
    svg.setAttribute("height", wb.height);

    var rows = [].slice.call(block.querySelectorAll(".round-row"));
    var made = [];

    rows.forEach(function (row, ri) {
      if (ri === 0) return;
      [].slice.call(row.querySelectorAll(".match")).forEach(function (m) {
        [].slice.call(m.querySelectorAll(".side")).forEach(function (sd) {
          var src = sourceFor(block, sd.getAttribute("data-team"), ri);
          if (!src) return;
          var a = src.getBoundingClientRect(), b = m.getBoundingClientRect();
          var x1 = a.left + a.width / 2 - wb.left, y1 = a.bottom - wb.top;
          var x2 = b.left + b.width / 2 - wb.left, y2 = b.top - wb.top;
          if (y2 < y1) return;
          var my = y1 + (y2 - y1) / 2;
          var r = 8;
          var dir = x2 > x1 ? 1 : -1;
          var d;
          if (Math.abs(x2 - x1) < 4) {
            d = "M" + x1 + " " + y1 + " L" + x2 + " " + y2;
          } else {
            d = "M" + x1 + " " + y1 +
                " L" + x1 + " " + (my - r) +
                " Q" + x1 + " " + my + " " + (x1 + r * dir) + " " + my +
                " L" + (x2 - r * dir) + " " + my +
                " Q" + x2 + " " + my + " " + x2 + " " + (my + r) +
                " L" + x2 + " " + y2;
          }
          var path = document.createElementNS(NS, "path");
          path.setAttribute("d", d);
          path.setAttribute("class", "bline");
          svg.appendChild(path);
          var len = path.getTotalLength ? path.getTotalLength() : 200;
          if (animate) {
            path.style.strokeDasharray = len;
            path.style.strokeDashoffset = len;
          }
          made.push({ path: path, len: len, round: ri });
        });
      });
    });
    return made;
  }

  function flyIn(el, from, delay, dur) {
    var t2 = el.getBoundingClientRect();
    var dx = 0, dy = -48;
    if (from) {
      var f = from.getBoundingClientRect();
      dx = Math.max(-900, Math.min(900, (f.left + f.width / 2) - (t2.left + t2.width / 2)));
      dy = Math.max(-900, Math.min(900, (f.top + f.height / 2) - (t2.top + t2.height / 2)));
    }
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(.92)";
    setTimeout(function () {
      el.style.transition = "transform " + dur + "ms cubic-bezier(.22,1,.36,1), opacity " +
        Math.round(dur * 0.55) + "ms ease";
      el.style.opacity = "1";
      el.style.transform = "none";
    }, delay);
  }

  function runBracket(block) {
    var timers = block._timers || [];
    timers.forEach(clearTimeout);
    timers = block._timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    block.classList.remove("done");
    var rows = [].slice.call(block.querySelectorAll(".round-row"));
    var cards = [].slice.call(block.querySelectorAll(".match"));
    var badge = block.querySelector(".bracket-winner");

    cards.forEach(function (c) { c.classList.remove("shown"); });
    block.querySelectorAll(".side").forEach(function (s) {
      s.style.transition = "none"; s.style.opacity = "0"; s.style.transform = "none";
    });
    block.querySelectorAll(".side").forEach(function (s) { s.classList.remove("crowned", "lost"); });
    if (badge) badge.classList.remove("shown");

    var lines = drawLines(block, true);
    var STEP = 1500, STAG = 170, FLY = 850;

    rows.forEach(function (row, ri) {
      var base = ri * STEP;

      lines.filter(function (l) { return l.round === ri; }).forEach(function (l, i) {
        at(base - 260 + i * 60, function () {
          l.path.style.transition = "stroke-dashoffset 520ms cubic-bezier(.22,1,.36,1)";
          l.path.style.strokeDashoffset = 0;
        });
      });

      [].slice.call(row.querySelectorAll(".match")).forEach(function (m, mi) {
        at(base, function () { m.classList.add("shown"); });
        [].slice.call(m.querySelectorAll(".side")).forEach(function (sd, si) {
          var team = sd.getAttribute("data-team");
          var from = ri === 0 ? tableSource(team) : sourceFor(block, team, ri);
          flyIn(sd, from, mi * STAG + si * 60, FLY);
        });
      });

      at(base + FLY + 220, function () {
        [].slice.call(row.querySelectorAll(".match")).forEach(function (m) {
          if (m.classList.contains("bye")) return;
          [].slice.call(m.querySelectorAll(".side")).forEach(function (s) {
            if (s.classList.contains("win")) s.classList.add("crowned");
            else s.classList.add("lost");
          });
        });
      });
    });

    at(rows.length * STEP + 350, function () {
      if (badge) badge.classList.add("shown");
      block.classList.add("done");
    });
  }

  function showBracketStatic(block) {
    block.classList.add("done");
    block.querySelectorAll(".match").forEach(function (c) { c.classList.add("shown"); });
    block.querySelectorAll(".side").forEach(function (s) { s.style.opacity = "1"; s.style.transform = "none"; });
    block.querySelectorAll(".match").forEach(function (m) {
      if (m.classList.contains("bye")) return;
      m.querySelectorAll(".side").forEach(function (s) {
        s.classList.add(s.classList.contains("win") ? "crowned" : "lost");
      });
    });
    var b = block.querySelector(".bracket-winner");
    if (b) b.classList.add("shown");
    drawLines(block, false);
  }

  function wireBrackets() {
    var blocks = [].slice.call(root.querySelectorAll(".bracket-block"));
    if (!blocks.length) return;

    if (REDUCE || !("IntersectionObserver" in window)) {
      blocks.forEach(showBracketStatic);
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          io.unobserve(en.target);
          runBracket(en.target);
        });
      }, { threshold: 0.15 });
      blocks.forEach(function (b) { io.observe(b); });
    }

    if (!window._blineResize) {
      window._blineResize = true;
      window.addEventListener("resize", function () {
        root.querySelectorAll(".bracket-block.done").forEach(function (b) { drawLines(b, false); });
      });
    }

    blocks.forEach(function (b) {
      var rp = b.querySelector("[data-replay]");
      if (rp) rp.addEventListener("click", function (e) {
        e.stopPropagation();
        b.classList.remove("tracing");
        b.querySelectorAll(".lit").forEach(function (x) { x.classList.remove("lit"); });
        runBracket(b);
      });

      b.addEventListener("click", function (e) {
        var s = e.target.closest ? e.target.closest("[data-team]") : null;
        if (!s) { b.classList.remove("tracing"); b.removeAttribute("data-lit"); return; }
        var team = s.getAttribute("data-team");
        var already = b.classList.contains("tracing") && b.getAttribute("data-lit") === team;
        b.querySelectorAll(".lit").forEach(function (x) { x.classList.remove("lit"); });
        if (already) { b.classList.remove("tracing"); b.removeAttribute("data-lit"); return; }
        b.classList.add("tracing");
        b.setAttribute("data-lit", team);
        b.querySelectorAll('[data-team="' + cssq(team) + '"]').forEach(function (x) {
          x.classList.add("lit");
          if (x.parentNode && x.parentNode.classList.contains("match")) x.parentNode.classList.add("lit");
        });
      });
    });
  }

  /* ---------- Motion ---------- */
  var REDUCE = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function countUp(el) {
    var raw = el.textContent.trim();
    var m = raw.match(/^(\$?)(-?[\d,]+(?:\.\d+)?)$/);
    if (!m) return;
    var prefix = m[1], grouped = m[2].indexOf(",") !== -1;
    var clean = m[2].replace(/,/g, "");
    var target = parseFloat(clean);
    if (!isFinite(target)) return;
    var dot = clean.indexOf(".");
    var dec = dot === -1 ? 0 : clean.length - dot - 1;
    function fmt(v) {
      return prefix + v.toLocaleString("en-US", {
        minimumFractionDigits: dec, maximumFractionDigits: dec, useGrouping: grouped
      });
    }
    var dur = 2200, start = null;
    el.textContent = fmt(0);
    function step(ts) {
      if (start === null) start = ts;
      var k = Math.min(1, (ts - start) / dur);
      var e = 1 - Math.pow(1 - k, 4);
      el.textContent = fmt(target * e);
      if (k < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target);
    }
    requestAnimationFrame(step);
  }

  function enhance() {
    var items = [].slice.call(root.querySelectorAll(
      ".stat, .showcase, .podium, .pod, .table-scroll, .tabs, .page-head, .hero-title, " +
      ".plaque-sub, .eyebrow, .bullets li, .hero-img, .hint, .ticker, .bracket-block, .bracket-winner"
    ));
    if (REDUCE) {
      items.forEach(function (el) { el.classList.add("in"); });
      wireBrackets();
      return;
    }

    items.forEach(function (el) {
      el.classList.add("reveal");
      var idx = el.parentNode ? [].slice.call(el.parentNode.children).indexOf(el) : 0;
      el.style.setProperty("--d", Math.min(Math.max(idx, 0), 7) * 0.055 + "s");
    });

    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("in"); });
      tilt();
      wireBrackets();
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
        var v = en.target.querySelector ? en.target.querySelector(".stat-v") : null;
        if (v) countUp(v);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    items.forEach(function (el) { io.observe(el); });
    tilt();
    wireBrackets();
  }

  /* Pointer-reactive light and tilt on the champion card */
  function tilt() {
    var sc = root.querySelector(".showcase");
    if (!sc || REDUCE) return;
    sc.addEventListener("pointermove", function (e) {
      var b = sc.getBoundingClientRect();
      var x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
      sc.style.setProperty("--mx", (x * 100).toFixed(1) + "%");
      sc.style.setProperty("--my", (y * 100).toFixed(1) + "%");
      sc.style.transform = "perspective(900px) rotateX(" + ((0.5 - y) * 4).toFixed(2) +
        "deg) rotateY(" + ((x - 0.5) * 5).toFixed(2) + "deg)";
    });
    sc.addEventListener("pointerleave", function () {
      sc.style.transform = "";
      sc.style.setProperty("--mx", "50%");
      sc.style.setProperty("--my", "0%");
    });
  }

  /* ---------- Router ---------- */
  var current = "home";

  function render(route, keepScroll) {
    current = route === "table" ? "table" : "home";
    root.innerHTML = current === "table" ? renderTable() : renderLanding();
    document.querySelectorAll("#nav [data-route]").forEach(function (b) {
      if (b.getAttribute("data-route") === current) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    if (!keepScroll) window.scrollTo(0, 0);
    enhance();
  }

  function navigate(route) {
    render(route);
    try { history.replaceState(null, "", route === "table" ? "#/table" : "#/"); } catch (e) { /* sandboxed */ }
  }

  function routeFromHash() {
    return /#\/table/.test(location.hash || "") ? "table" : "home";
  }

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || !el.closest) return;

    var r = el.closest("[data-route]");
    if (r) { e.preventDefault(); navigate(r.getAttribute("data-route")); return; }

    var tab = el.closest("[data-mtab]");
    if (tab) {
      e.preventDefault();
      mTab = tab.getAttribute("data-mtab");
      mSort = defaultSort(mTab);
      render("table", true);
      return;
    }

    var so = el.closest("[data-sort]");
    if (so) {
      e.preventDefault();
      var key = so.getAttribute("data-sort");
      if (mSort.key === key) mSort.dir = -mSort.dir;
      else { mSort.key = key; mSort.dir = key === "label" ? 1 : -1; }
      render("table", true);
    }
  });

  function buildNav() {
    document.getElementById("nav").innerHTML =
      '<button type="button" data-route="home">Home</button>' +
      '<button type="button" data-route="table">All-time table</button>';
    var mark = document.getElementById("mark");
    mark.innerHTML = "The Buy-In <span>Bowl</span>";
    mark.setAttribute("data-route", "home");
    document.title = (L.name || "Archive") + " — Archive";
  }

  window.addEventListener("hashchange", function () { render(routeFromHash()); });
  buildNav();
  render(routeFromHash());
})();
