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

  /* Small inline SVG flags (emoji flags don't render on Windows) */
  var FLAGS = {
    US: { name: "United States", vb: "0 0 19 10", body: (function () {
      var b = '<rect width="19" height="10" fill="#B22234"/>', i;
      for (i = 1; i < 13; i += 2) b += '<rect y="' + (i * 10 / 13).toFixed(3) + '" width="19" height="' + (10 / 13).toFixed(3) + '" fill="#fff"/>';
      b += '<rect width="7.6" height="5.385" fill="#3C3B6E"/>';
      for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++)
        b += '<circle cx="' + (1.1 + c * 1.8).toFixed(2) + '" cy="' + (1 + r * 1.7).toFixed(2) + '" r="0.42" fill="#fff"/>';
      return b;
    })() },
    DE: { name: "Germany", vb: "0 0 5 3",
      body: '<rect width="5" height="1" fill="#000"/><rect y="1" width="5" height="1" fill="#DD0000"/>' +
            '<rect y="2" width="5" height="1" fill="#FFCE00"/>' }
  };

  function flagSvg(code) {
    var f = FLAGS[code];
    if (!f) return "";
    return '<svg class="flag" viewBox="' + f.vb + '" preserveAspectRatio="none" role="img" aria-label="' +
      f.name + '"><title>' + f.name + "</title>" + f.body + "</svg>";
  }

  /* Same flag as a nested element inside another SVG */
  function flagInSvg(code, x, y, w, h) {
    var f = FLAGS[code];
    if (!f) return "";
    return '<svg class="pl-flag" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
      '" viewBox="' + f.vb + '" preserveAspectRatio="none">' + f.body + "</svg>" +
      '<rect class="pl-flag-edge" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="1.5"/>';
  }

  function flagFor(id) {
    var m = (L.managers || []).filter(function (x) { return x.id === id; })[0];
    return m && m.country ? flagSvg(m.country) : "";
  }

  function medalSvg() {
    return '<svg class="medal" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M7.5 2.5l3 6.2M16.5 2.5l-3 6.2M9.5 2.5h5"/>' +
      '<circle cx="12" cy="15" r="6.2"/>' +
      '<path d="M12 11.9l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"/></svg>';
  }

  /* Titles and points medals per manager, optionally only up to a year */
  function honors(upto) {
    var out = {};
    years().forEach(function (y) {
      if (upto && y > upto) return;
      var s = S[y], c = s.champion, pl = s.pointsLeader;
      if (c && c.manager) (out[c.manager] = out[c.manager] || { t: 0, m: 0 }).t++;
      if (pl && (pl.manager || pl.team)) {
        var id = pl.manager || teamManager(y, pl.team);
        if (id) (out[id] = out[id] || { t: 0, m: 0 }).m++;
      }
    });
    return out;
  }

  function medals(n) {
    var o = "", i;
    for (i = 0; i < n; i++) o += medalSvg();
    return o;
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

  /* Sum of all buy-ins across every season on file */
  function totalPaidIn() {
    var sum = 0;
    years().forEach(function (y) {
      var s = S[y], b = +s.buyIn || 0;
      if (!b) return;
      var n = (s.standings || []).length ||
        (L.managers || []).filter(function (m) { return m.teams && m.teams[y]; }).length;
      sum += b * n;
    });
    return sum ? "$" + sum.toLocaleString("en-US") : "–";
  }

  function renderLanding() {
    var ys = years();
    var lp = L.landing || {};

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
      [totalPaidIn(), "Total money paid in"],
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

    h += lineup();
    h += formerMembers();
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
    var hon = honors();
    var byTeam = {};
    (L.managers || []).forEach(function (m) {
      var team = (m.teams || {})[current];
      if (team) byTeam[team] = hon[m.id] || { t: 0, m: 0 };
    });
    var run = names.map(function (n) {
      var hn = byTeam[n] || { t: 0, m: 0 };
      var deco = (hn.t ? trophySvg() : "") + (hn.m ? medalSvg() : "");
      return '<span class="tk' + (deco ? " won" : "") + '">' + esc(n) + deco +
        '</span><i class="tkdot"></i>';
    }).join("");
    return '<div class="ticker" aria-hidden="true"><div class="ticker-track">' + run + run + "</div></div>";
  }

  function crewBadges(hn) {
    if (!hn || (!hn.t && !hn.m)) return "";
    var b = '<span class="crew-badges">';
    if (hn.t) b += '<span class="crew-badge">' + trophySvg() + (hn.t > 1 ? "<b>" + hn.t + "</b>" : "") + "</span>";
    if (hn.m) b += '<span class="crew-badge medal-badge">' + medalSvg() + (hn.m > 1 ? "<b>" + hn.m + "</b>" : "") + "</span>";
    return b + "</span>";
  }

  /* The current season's managers as illustrated cards, in standings order */
  function lineup() {
    var cur = years()[0];
    var s = S[cur];
    if (!s) return "";
    var order = (s.standings || []).map(function (r) { return r.manager; });
    var list = (L.managers || []).filter(function (m) {
      return m.teams && m.teams[cur] && has(m.card);
    });
    if (!list.length) return "";
    list.sort(function (a, b) {
      var ia = order.indexOf(a.id), ib = order.indexOf(b.id);
      return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
    });

    var hon = honors();
    var ed = edition(cur);
    var h = '<div class="wrap"><section class="crew-block">';
    h += '<h2 class="sec">The lineup' + (ed ? " &middot; Buy-In Bowl " + ed : "") + "</h2>";
    h += '<div class="crew">';
    list.forEach(function (m) {
      h += '<button type="button" class="crew-card" data-profile="' + m.id + '" aria-label="' +
        esc(m.name || m.teams[cur]) + ", " + esc(m.teams[cur]) + '">' +
        '<img src="' + esc(m.card) + '" alt="" loading="lazy">' +
        (m.country ? '<span class="crew-flag">' + flagSvg(m.country) + "</span>" : "") +
        crewBadges(hon[m.id]) +
        "</button>";
    });
    h += "</div></section></div>";
    return h;
  }

  /* ---------- Manager profile popup ---------- */
  function ensureSheet() {
    var sh = document.getElementById("sheet");
    if (sh) return sh;
    sh = document.createElement("div");
    sh.id = "sheet";
    sh.className = "sheet";
    sh.setAttribute("aria-hidden", "true");
    sh.innerHTML = '<div class="sheet-bg" data-close></div>' +
      '<div class="sheet-panel" role="dialog" aria-modal="true" aria-label="Manager profile">' +
      '<button type="button" class="sheet-x" data-close aria-label="Close">&times;</button>' +
      '<div class="sheet-body"></div></div>';
    document.body.appendChild(sh);
    sh.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("[data-close]")) closeProfile();
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeProfile(); });
    return sh;
  }

  function closeProfile() {
    var sh = document.getElementById("sheet");
    if (!sh || !sh.classList.contains("open")) return;
    sh.classList.remove("open");
    sh.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("sheet-lock");
  }

  function roleSvg() {
    return '<svg class="role-ico" viewBox="0 0 24 24" aria-hidden="true">' +
      '<path d="M12 2.5l7.5 3v6c0 4.6-3.2 8.3-7.5 10-4.3-1.7-7.5-5.4-7.5-10v-6z"/>' +
      '<path d="M8.8 12.2l2.2 2.2 4.3-4.6"/></svg>';
  }

  /* Best final placing, completed seasons only */
  function bestFinish(id) {
    var best = null, when = null;
    years().forEach(function (y) {
      var s = S[y];
      if (s.status === "live" || s.status === "laufend") return;
      (s.standings || []).forEach(function (r) {
        if (r.manager === id && r.rank && (best === null || r.rank < best)) { best = r.rank; when = y; }
      });
    });
    return best === null ? "–" : best + '.<small>' + when + "</small>";
  }

  function openProfile(id) {
    var m = mgr(id);
    if (!m.id) return;
    var sh = ensureSheet();
    var ys = years();
    var cur = ys[0];
    var team = (m.teams || {})[cur];
    var all = careers("all").filter(function (r) { return r.id === id; })[0];

    /* honours with years */
    var hon = [];
    ys.slice().sort().forEach(function (y) {
      var s = S[y];
      if (s.champion && s.champion.manager === id) hon.push(trophySvg() + "Champion " + y);
      var pl = s.pointsLeader;
      if (pl && (pl.manager === id || (pl.team && teamManager(y, pl.team) === id))) hon.push(medalSvg() + "Most points " + y);
      if (s.runnerUp && (s.runnerUp.manager === id || teamManager(y, s.runnerUp.team) === id)) hon.push('<span class="dot silver"></span>Runner-up ' + y);
    });

    /* current season line */
    var st = team ? (S[cur].standings || []).filter(function (r) { return r.manager === id; })[0] : null;
    var img = has(m.portrait) ? m.portrait : (m.face || m.avatar);

    var h = '<div class="sp-head">';
    if (has(img)) h += '<div class="sp-pic"><img src="' + esc(img) + '" alt=""></div>';
    h += '<div class="sp-id"><div class="sp-name">' + esc(m.name || id) + flagFor(id) + "</div>" +
      '<div class="sp-team">' + esc(team || (all && all.last) || "") + "</div>" +
      (has(m.role) ? '<div class="sp-role">' + roleSvg() + esc(m.role) + "</div>" : "") +
      (team ? "" : '<div class="sp-gone">Not in the league anymore</div>') +
      (has(m.avatar) ? '<img class="sp-logo" src="' + esc(m.avatar) + '" alt="">' : "") + "</div></div>";

    if (hon.length) h += '<div class="sp-honors">' + hon.map(function (x) { return "<span>" + x + "</span>"; }).join("") + "</div>";

    function tiles(list) {
      return '<div class="sp-grid">' + list.map(function (x) {
        return '<div class="sp-tile"><div class="sp-k">' + x[0] + '</div><div class="sp-v">' + x[1] + "</div></div>";
      }).join("") + "</div>";
    }

    if (st) {
      var played = (+st.w || 0) + (+st.l || 0) + (+st.t || 0);
      var ed = edition(cur);
      h += '<h4 class="sp-sec">' + cur + (ed ? " &middot; Buy-In Bowl " + ed : "") + "</h4>";
      h += tiles([
        ["Rank", st.rank + '<small>/' + (S[cur].standings || []).length + "</small>"],
        ["Record", st.w + "-" + st.l + (st.t ? "-" + st.t : "")],
        ["Points", num(st.pf, 2)],
        ["Avg", played ? (st.pf / played).toFixed(1) : "–"]
      ]);
    }

    if (all) {
      h += '<h4 class="sp-sec">All-time</h4>';
      h += tiles([
        ["Seasons", all.seasons],
        ["Record", all.wins + "-" + all.losses + (all.t ? "-" + all.t : "")],
        ["Win %", all.games ? (all.pct * 100).toFixed(1) + "%" : "–"],
        ["Points", all.pf ? num(all.pf, 2) : "–"],
        ["Best finish", bestFinish(id)],
        ["Titles", all.titles || "–"]
      ]);
      h += '<p class="sp-note">Record includes the playoffs.</p>';
    }

    var names = Object.keys(m.teams || {}).sort();
    var distinct = names.map(function (y) { return String(m.teams[y]).toLowerCase(); })
      .filter(function (v, i, a) { return a.indexOf(v) === i; });
    if (distinct.length > 1) {
      h += '<h4 class="sp-sec">Team names</h4><ul class="sp-list">' + names.map(function (y) {
        return "<li><b>" + y + "</b>" + esc(m.teams[y]) + "</li>";
      }).join("") + "</ul>";
    }

    sh.querySelector(".sheet-body").innerHTML = h;
    sh.querySelector(".sheet-panel").scrollTop = 0;
    sh.setAttribute("aria-hidden", "false");
    document.documentElement.classList.add("sheet-lock");
    void sh.offsetWidth;
    sh.classList.add("open");
  }

  /* ---------- Champions ---------- */
  function seasonRecord(y, id) {
    var r = careers(String(y)).filter(function (x) { return x.id === id; })[0];
    return r || null;
  }

  function podiumOf(y) {
    var s = S[y], po = s.playoffs || {};
    var first = s.champion && s.champion.manager ? s.champion.manager : null;
    var second = s.runnerUp && (s.runnerUp.manager || teamManager(y, s.runnerUp.team));
    var third = null;
    var g = (po.games || []).filter(function (x) { return x.round === po.thirdPlaceRound; })[0];
    if (g) {
      var w3 = has(g.winner) ? g.winner :
        (g.homeScore != null && g.awayScore != null ? (g.homeScore > g.awayScore ? g.home : g.away) : null);
      if (w3) third = teamManager(y, w3);
    }
    if (!third) {
      var st = (s.standings || []).filter(function (r) { return r.rank === 3; })[0];
      third = st ? st.manager : null;
    }
    return [first, second, third];
  }

  function confetti(colors) {
    var h = '<div class="confetti" aria-hidden="true">', i;
    for (i = 0; i < 34; i++) {
      var left = (Math.random() * 100).toFixed(1);
      var delay = (Math.random() * 4).toFixed(2);
      var dur = (3.2 + Math.random() * 2.8).toFixed(2);
      var rot = Math.round(Math.random() * 360);
      var col = colors[i % colors.length];
      h += '<i style="left:' + left + "%;animation-delay:-" + delay + "s;animation-duration:" + dur +
        "s;--r:" + rot + "deg;background:" + col + '"></i>';
    }
    return h + "</div>";
  }

  function seasonMedal(y) {
    var pl = S[y].pointsLeader;
    if (pl && has(pl.team)) {
      var pid = pl.manager || teamManager(y, pl.team);
      return '<div class="medalcard"' + (pid ? ' data-profile="' + pid + '"' : "") + ">" +
        '<div class="medalcard-icon">' + medalSvg() + "</div>" +
        '<div class="medalcard-txt"><div class="medalcard-label">Most points · ' + y + "</div>" +
        '<div class="medalcard-name">' + esc(pl.team) + "</div>" +
        '<div class="medalcard-line">' + [managerName(pid, y) + flagFor(pid),
          pl.points ? num(pl.points, 2) + " pts" : ""]
          .filter(function (x) { return x; }).join(" · ") + "</div></div></div>";
    }
    return '<div class="medalcard tbd"><div class="medalcard-icon">' + medalSvg() + "</div>" +
      '<div class="medalcard-txt"><div class="medalcard-label">Most points · ' + y + "</div>" +
      '<div class="medalcard-name">TBD</div>' +
      '<div class="medalcard-line">After the regular season</div></div></div>';
  }

  function renderChampions() {
    var done = years().filter(function (y) { return S[y].champion && has(S[y].champion.team); });
    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">Champions</h1>' +
      '<p class="page-kicker">Every ring, every runner-up, every podium.</p></div>';

    if (!years().length) return h + nothing("No seasons on file yet.") + "</div>";

    /* One card per season, oldest first; the running season shows TBD */
    h += '<div class="cc-row">';
    years().slice().sort(function (a, b) { return a - b; }).forEach(function (yy) {
      var cc = S[yy].champion;
      var hasChamp = cc && has(cc.team) && cc.manager;
      h += '<div class="cc-col">';
      if (!hasChamp) {
        h += '<div class="champcard tbd">' +
          '<div class="cc-year">' + yy + "</div>" +
          '<div class="cc-ribbon"><span>Champion</span></div>' +
          '<div class="cc-inner"><div class="cc-portrait cc-q"><span>?</span></div>' +
          '<div class="cc-first">To be decided</div><div class="cc-team">TBD</div></div>' +
          '<div class="cc-stats"><div class="cc-stat"><div class="cc-k">Record</div><div class="cc-v">–</div></div>' +
          '<div class="cc-stat"><div class="cc-k">Avg points</div><div class="cc-v">–</div></div></div>' +
          '<div class="cc-note">Crowned in<br>week ' + (((S[yy].playoffs || {}).weeks || {}).Final || 17) + "</div></div>";
        h += seasonMedal(yy) + "</div>";
        return;
      }
      var mm = mgr(cc.manager);
      var rec = seasonRecord(yy, cc.manager);
      var regGames = 0, regPf = 0;
      (S[yy].standings || []).forEach(function (r) {
        if (r.manager === cc.manager) { regGames = (+r.w || 0) + (+r.l || 0) + (+r.t || 0); regPf = +r.pf || 0; }
      });
      var avg = regGames ? (regPf / regGames).toFixed(1) : "–";
      var img = has(cc.image) ? cc.image : has(mm.portrait) ? mm.portrait : (mm.card || mm.avatar);
      h += '<div class="champcard">';
      h += confetti([mm.color || "#A9791C", "#A9791C", "#D8B45A", "#16181C", "#C9CDD3"]);
      h += '<div class="cc-year">' + yy + "</div>";
      h += '<div class="cc-ribbon"><span>Champion</span></div>';
      h += '<div class="cc-inner" data-profile="' + cc.manager + '">';
      if (has(img)) h += '<div class="cc-portrait"><img src="' + esc(img) + '" alt=""></div>';
      h += '<div class="cc-first">' + esc(mm.name || "") + flagFor(cc.manager) + "</div>";
      h += '<div class="cc-team">' + esc(cc.team) + "</div></div>";
      h += '<div class="cc-stats">' +
        '<div class="cc-stat"><div class="cc-k">Record</div><div class="cc-v">' +
          (rec ? rec.wins + "-" + rec.losses + (rec.t ? "-" + rec.t : "") : esc(cc.record || "–")) + "</div></div>" +
        '<div class="cc-stat"><div class="cc-k">Avg points</div><div class="cc-v">' + avg + "</div></div></div>";
      if (has(cc.note)) h += '<div class="cc-note">' + esc(cc.note) + "</div>";
      h += "</div>";
      h += seasonMedal(yy) + "</div>";
    });
    h += "</div>";

    if (!done.length) return h + "</div>";

    /* Top three of every finished season */
    h += '<section class="block"><h2 class="sec">Season champs</h2>';
    h += '<div class="table-scroll"><table class="champs-table"><thead><tr>' +
      "<th>Year</th><th>Champion</th><th>2nd place</th><th>3rd place</th></tr></thead><tbody>";
    done.forEach(function (yy) {
      var pod = podiumOf(yy);
      function cell(id, cls) {
        if (!id) return '<td><span class="dot ' + cls + '"></span>–</td>';
        var mm = mgr(id);
        return '<td><div class="cwho"><span class="dot ' + cls + '"></span>' +
          (has(mm.face || mm.avatar) ? '<img class="avatar" src="' + esc(mm.face || mm.avatar) + '" alt="">' : "") +
          '<span class="mtxt"><span class="mname">' + esc(mm.name || id) + flagFor(id) + "</span>" +
          '<span class="mteam">' + esc((mm.teams || {})[yy] || "") + "</span></span></div></td>";
      }
      var ed = edition(yy);
      h += "<tr><td class=\"cyear\"><b>" + yy + "</b>" + (ed ? '<span class="bb">Buy-In Bowl <span class="rn">' + ed + "</span></span>" : "") + "</td>" +
        cell(pod[0], "gold") + cell(pod[1], "silver") + cell(pod[2], "bronze") + "</tr>";
    });
    h += "</tbody></table></div></section>";

    return h + "</div>";
  }

  /* Managers who played before but are not in the current season */
  function formerMembers() {
    var cur = years()[0];
    var list = (L.managers || []).filter(function (m) {
      return m.teams && !m.teams[cur] && Object.keys(m.teams).length;
    });
    if (!list.length) return "";
    var h = '<div class="wrap"><section class="crew-block former-block">';
    h += '<h2 class="sec">Former league members</h2><div class="crew">';
    list.forEach(function (m) {
      var ys = Object.keys(m.teams).sort();
      var lastTeam = m.teams[ys[ys.length - 1]];
      var label = esc(m.name || "") + ", " + esc(lastTeam);
      if (has(m.card)) {
        h += '<button type="button" class="crew-card" data-profile="' + m.id + '" aria-label="' + label + '">' +
          '<img src="' + esc(m.card) + '" alt="" loading="lazy">' +
          (m.country ? '<span class="crew-flag">' + flagSvg(m.country) + "</span>" : "") +
          '<span class="former-years">' + ys.join(", ") + "</span></button>";
      } else {
        h += '<button type="button" class="crew-card former-card" data-profile="' + m.id + '" aria-label="' + label + '">' +
          '<span class="fc-frame">' + (has(m.avatar) ? '<img src="' + esc(m.avatar) + '" alt="">' : "") + "</span>" +
          (m.country ? '<span class="crew-flag">' + flagSvg(m.country) + "</span>" : "") +
          '<span class="fc-label"><b>' + esc(m.name || "") + "</b><small>" + esc(lastTeam) + "</small></span>" +
          '<span class="former-years">' + ys.join(", ") + "</span></button>";
      }
    });
    return h + "</div></section></div>";
  }

  /* ---------- All-time table ---------- */
  var mTab = "all";
  var mSort = { key: "power", dir: -1 };

  /* Year tabs open in the final standings, all-time opens by wins. */
  function defaultSort(mode) {
    return mode === "all" ? { key: "power", dir: -1 } : { key: "place", dir: 1 };
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
  function careers(mode, upto) {
    var ys = years().slice().sort(function (a, b) { return a - b; });
    if (mode !== "all") ys = ys.filter(function (y) { return String(y) === String(mode); });
    if (upto) ys = ys.filter(function (y) { return y <= upto; });

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

      var hn = honors(upto)[m.id];
      st.medals = hn ? hn.m : 0;
      if (mode !== "all" && !upto) {
        var one = S[mode] && S[mode].pointsLeader;
        st.medals = one && (one.manager === m.id || teamManager(mode, one.team) === m.id) ? 1 : 0;
      }
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
      if (k === "power") return (b.titles - a.titles || b.pf - a.pf || b.wins - a.wins) * -dir;
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
    var key = mSort.key === "label" ? "wins" : mSort.key === "power" ? "pf" : mSort.key;
    var label = { wins: "Wins", losses: "Losses", games: "Games", pct: "Win rate",
                  pf: "Points", titles: "Titles", seasons: "Seasons" }[key] || "Wins";
    var top = rows.slice(0, 3);
    var order = [1, 0, 2];
    var h = '<div class="podium"><div class="podium-label">' +
      (mSort.key === "power" ? "All-time top three" : "Top three by " + esc(label.toLowerCase())) + "</div>";
    h += '<div class="podium-row">';
    order.forEach(function (idx) {
      var r = top[idx];
      h += '<div class="pod p' + (idx + 1) + '">' +
        (avatar(r.id, "pod-av") || "") +
        '<div class="pod-name">' + flagFor(r.id) + esc(r.label) + "</div>" +
        '<div class="pod-val">' + esc(cellValue(r, key)) + "</div>" +
        '<div class="pod-bar"><span class="pod-rank">' + (idx + 1) + "</span>" +
        (r.titles || r.medals ? '<span class="pod-trophy">' + (r.titles ? trophySvg() : "") +
          (r.medals ? medalSvg() : "") + "</span>" : "") +
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
          h += '<td class="mcell"><div class="mwrap" data-profile="' + r.id + '" role="button" tabindex="0">' + avatar(r.id) +
            '<span class="mtxt"><span class="mname">' + esc(r.label) + flagFor(r.id) + "</span>" +
            (r.teams.length ? '<span class="mteam">' + esc(r.teams.join(", ")) + "</span>" : "") +
            "</span></div></td>";
        } else if (c.key === "titles") {
          h += '<td class="num">' + (r.titles || r.medals ? '<span class="rings">' + rings(r.titles) +
            medals(r.medals) + "</span>" : "–") + "</td>";
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
    h += powerLines();
    h += weekLines();
    return h + "</div>";
  }

  /* ---------- Power lines: all-time rank after each season ---------- */
  /* Available width of each chart, measured after the first render */
  var chartW = { all: 0, week: 0 };
  var reflowDepth = 0;
  function powerRank(rows) {
    return rows.slice().sort(function (a, b) {
      return b.titles - a.titles || b.pf - a.pf || b.wins - a.wins ||
        String(a.label).localeCompare(String(b.label));
    });
  }

  function mgr(id) {
    return (L.managers || []).filter(function (m) { return m.id === id; })[0] || {};
  }

  function powerLines() {
    if (mTab !== "all") return "";
    var yrs = years().slice().sort(function (a, b) { return a - b; });
    if (!yrs.length) return "";

    /* rank of every manager after each season. The first season has no
       history yet, so its column is simply that season's final standings. */
    var table = yrs.map(function (y, idx) {
      var pos = {}, n = 0, s0 = S[y];
      var done0 = s0.status !== "live" && s0.status !== "laufend";
      if (idx === 0 && done0 && has(s0.standings)) {
        s0.standings.forEach(function (r) { if (r.manager) { pos[r.manager] = r.rank; n++; } });
      } else {
        var ranked = powerRank(careers("all", y));
        ranked.forEach(function (r, i) { pos[r.id] = i + 1; });
        n = ranked.length;
      }
      return { y: y, pos: pos, n: n };
    });
    var N = Math.max.apply(null, table.map(function (c) { return c.n; }));
    var ids = Object.keys(table[table.length - 1].pos);
    var last = yrs[yrs.length - 1];

    /* a few empty future seasons to the right, like the weekly chart */
    var future = [last + 1, last + 2, last + 3];
    var TOP = 40, RH = 29, H = TOP + N * RH + 10;
    var X0 = 52, ncol = yrs.length + future.length;
    var CW = chartW.all ? Math.max(118, (chartW.all - X0 - 40) / (ncol - 1)) : 118;
    var W = X0 + CW * (ncol - 1) + 30;
    function xOf(i) { return X0 + CW * i; }
    function yOf(r) { return TOP + (r - 0.5) * RH; }

    var s = '<svg class="pl-svg" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H +
      '" role="img" aria-label="All-time rank after each season">';
    s += "<defs>";
    ids.forEach(function (id) {
      s += '<clipPath id="plc-' + id + '"><circle r="10.5"/></clipPath>';
    });
    s += '<filter id="pl-gray"><feColorMatrix type="saturate" values="0"/></filter>';
    s += '<clipPath id="rv-all"><rect class="pl-reveal" x="0" y="0" width="' + W + '" height="' + H +
      '" data-w="' + W + '" data-end="' + (xOf(yrs.length - 1) + 16) + '"/></clipPath></defs>';

    /* grid */
    for (var r = 1; r <= N; r++) {
      s += '<line class="pl-row" x1="' + (X0 - 18) + '" x2="' + (W - 6) + '" y1="' + yOf(r) + '" y2="' + yOf(r) + '"/>';
      s += '<text class="pl-rank' + (r === 1 ? " top" : "") + '" x="20" y="' + (yOf(r) + 4.5) + '">' + r + "</text>";
    }
    future.forEach(function (y, k) {
      var i = yrs.length + k;
      s += '<line class="pl-col future" x1="' + xOf(i) + '" x2="' + xOf(i) + '" y1="' + (TOP - 8) + '" y2="' + (H - 8) + '"/>';
      s += '<text class="pl-year future" x="' + xOf(i) + '" y="15">' + y + "</text>";
    });
    yrs.forEach(function (y, i) {
      s += '<line class="pl-col" x1="' + xOf(i) + '" x2="' + xOf(i) + '" y1="' + (TOP - 8) + '" y2="' + (H - 8) + '"/>';
      var ed = edition(y);
      s += '<text class="pl-year" x="' + xOf(i) + '" y="15">' + y + "</text>";
      if (ed) s += '<text class="pl-ed" x="' + xOf(i) + '" y="27">' + ed + "</text>";
    });

    /* one group per manager: lines, dots, face, name */
    ids.forEach(function (id) {
      var m = mgr(id), col = m.color || "#8A9099";
      var pts = [];
      table.forEach(function (c, i) { if (c.pos[id]) pts.push({ i: i, y: c.y, r: c.pos[id] }); });
      var active = !!(m.teams && m.teams[last]);

      s += '<g class="pl-m' + (active ? "" : " gone") + '" data-m="' + id + '" style="--c:' + col + '">';
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k];
        var xa = xOf(a.i), xb = xOf(b.i), ya = yOf(a.r), yb = yOf(b.r), mx = (xa + xb) / 2;
        var played = m.teams && m.teams[b.y];
        s += '<path class="pl-line' + (played ? "" : " off") + '" clip-path="url(#rv-all)" d="M' + xa + " " + ya +
          " C" + mx + " " + ya + " " + mx + " " + yb + " " + xb + " " + yb + '"/>';
      }
      pts.forEach(function (p, k) {
        if (k === pts.length - 1) return;
        s += '<circle class="pl-dot" clip-path="url(#rv-all)" cx="' + xOf(p.i) + '" cy="' + yOf(p.r) + '" r="4"/>';
      });

      var e = pts[pts.length - 1], ex = xOf(e.i), ey = yOf(e.r);
      var img = has(m.face) ? m.face : m.avatar;
      s += '<g class="pl-head" transform="translate(' + ex + " " + ey + ')">';
      s += '<circle class="pl-ring" r="12.5"/>';
      if (has(img)) {
        s += '<image href="' + esc(img) + '" x="-10.5" y="-10.5" width="21" height="21" ' +
          'preserveAspectRatio="xMidYMid slice" clip-path="url(#plc-' + id + ')"' +
          (active ? "" : ' filter="url(#pl-gray)"') + "/>";
      }
      s += "</g>";
      if (m.country) s += '<g class="pl-name">' + flagInSvg(m.country, ex + 18, ey - 3.5, 11, 7.5) + "</g>";
      s += '<text class="pl-name" x="' + (ex + (m.country ? 33 : 18)) + '" y="' + (ey + 3.5) + '">' + esc(m.name || id) + "</text>";
      s += "</g>";
    });
    s += "</svg>";

    var h = '<section class="pl-block">';
    h += '<h2 class="sec">Power lines<button type="button" class="replay" data-plreplay>Replay</button></h2>';
    h += '<div class="pl-card"><div class="pl-scroll">' + s + "</div></div>";
    h += '<p class="hint">' + yrs[0] + " shows the final standings. From then on the all-time rank: titles first, then total points, then wins. " +
      "Tap a line to follow one manager. Faded faces are no longer in the league.</p>";
    return h + "</section>";
  }

  /* Weekly power lines for one season: rank after every week */
  function weekLines() {
    if (mTab === "all") return "";
    var y = +mTab, s = S[y];
    var hist = s && s.rankHistory;
    if (!hist || !hist.length) return "";

    var total = s.totalWeeks || 17;
    var byWeek = {};
    hist.forEach(function (e) { byWeek[e.week] = e; });

    /* Pre = last season's final standings; departed managers drop out,
       new managers start at the bottom. */
    var prev = S[y - 1], preFromPrev = false;
    if (!byWeek[0] && prev && has(prev.standings)) {
      var active = (L.managers || []).filter(function (m) { return m.teams && m.teams[y]; });
      var activeIds = active.map(function (m) { return m.id; });
      var carried = prev.standings.slice().sort(function (a, b) { return a.rank - b.rank; })
        .map(function (r) { return r.manager; })
        .filter(function (id) { return activeIds.indexOf(id) !== -1; });
      var rookies = activeIds.filter(function (id) { return carried.indexOf(id) === -1; });
      byWeek[0] = { week: 0, order: carried.concat(rookies).map(function (id) {
        return mgr(id).teams[y];
      }) };
      preFromPrev = true;
    }

    var cols = [];
    if (byWeek[0]) cols.push({ label: "Pre", w: 0 });
    for (var w = 1; w <= total; w++) cols.push({ label: "W" + w, w: w });

    cols.forEach(function (c) {
      var e = byWeek[c.w];
      if (!e) return;
      c.pos = {};
      (e.order || []).forEach(function (team, i) {
        var id = teamManager(y, team);
        if (id) c.pos[id] = i + 1;
      });
    });
    var lastIdx = -1;
    cols.forEach(function (c, i) { if (c.pos) lastIdx = i; });
    if (lastIdx < 0) return "";

    var ids = Object.keys(cols[lastIdx].pos);
    var N = ids.length;
    var cut = (L.format && L.format.playoffTeams) || 0;

    var TOP = 38, RH = 29, H = TOP + N * RH + 10;
    var X0 = 20;
    var CW = chartW.week ? Math.max(40, (chartW.week - X0 - 36) / (cols.length - 1)) : 40;
    var W = X0 + CW * (cols.length - 1) + 28;
    function xOf(i) { return X0 + CW * i; }
    function yOf(r) { return TOP + (r - 0.5) * RH; }

    /* fixed rank column */
    var left = '<svg class="wl-ranks" viewBox="0 0 34 ' + H + '" width="34" height="' + H + '">';
    for (var r = 1; r <= N; r++) {
      left += '<text class="pl-rank' + (r === 1 ? " top" : "") + '" x="17" y="' + (yOf(r) + 4.5) + '">' + r + "</text>";
    }
    left += "</svg>";

    var sv = '<svg class="wl-svg" viewBox="0 0 ' + W + " " + H + '" width="' + W + '" height="' + H + '">';
    sv += "<defs>";
    ids.forEach(function (id) { sv += '<clipPath id="wlc-' + id + '"><circle r="10"/></clipPath>'; });
    sv += '<clipPath id="rv-wk"><rect class="pl-reveal" x="0" y="0" width="' + W + '" height="' + H +
      '" data-w="' + W + '" data-end="' + (xOf(lastIdx) + 16) + '"/></clipPath>';
    sv += "</defs>";
    for (r = 1; r <= N; r++) {
      sv += '<line class="pl-row" x1="0" x2="' + W + '" y1="' + yOf(r) + '" y2="' + yOf(r) + '"/>';
    }
    cols.forEach(function (c, i) {
      var future = !c.pos;
      sv += '<line class="pl-col' + (future ? " future" : "") + '" x1="' + xOf(i) + '" x2="' + xOf(i) +
        '" y1="' + (TOP - 8) + '" y2="' + (H - 8) + '"/>';
      sv += '<text class="pl-year wl-wk' + (future ? " future" : "") + (i === lastIdx ? " now" : "") +
        '" x="' + xOf(i) + '" y="20">' + c.label + "</text>";
    });
    if (cut && cut < N) {
      var cy = TOP + cut * RH;
      sv += '<line class="wl-cut" x1="0" x2="' + W + '" y1="' + cy + '" y2="' + cy + '"/>';
    }

    ids.forEach(function (id) {
      var m = mgr(id), col = m.color || "#8A9099";
      var pts = [];
      cols.forEach(function (c, i) { if (c.pos && c.pos[id]) pts.push({ i: i, r: c.pos[id] }); });
      sv += '<g class="pl-m" data-m="' + id + '" style="--c:' + col + '">';
      for (var k = 1; k < pts.length; k++) {
        var a = pts[k - 1], b = pts[k];
        var xa = xOf(a.i), xb = xOf(b.i), ya = yOf(a.r), yb = yOf(b.r), mx = (xa + xb) / 2;
        sv += '<path class="pl-line" clip-path="url(#rv-wk)" d="M' + xa + " " + ya + " C" + mx + " " + ya + " " + mx + " " + yb +
          " " + xb + " " + yb + '"/>';
      }
      pts.forEach(function (p, k) {
        if (k === pts.length - 1) return;
        sv += '<circle class="pl-dot" clip-path="url(#rv-wk)" cx="' + xOf(p.i) + '" cy="' + yOf(p.r) + '" r="4"/>';
      });
      var e = pts[pts.length - 1];
      var img = has(m.face) ? m.face : m.avatar;
      sv += '<g class="pl-head" transform="translate(' + xOf(e.i) + " " + yOf(e.r) + ')">' +
        '<title>' + esc(m.name || id) + "</title>" +
        '<circle class="pl-ring" r="12"/>' +
        (has(img) ? '<image href="' + esc(img) + '" x="-10" y="-10" width="20" height="20" ' +
          'preserveAspectRatio="xMidYMid slice" clip-path="url(#wlc-' + id + ')"/>' : "") +
        "</g></g>";
    });
    sv += "</svg>";

    var ed = edition(y);
    var h = '<section class="pl-block wl-block">';
    h += '<h2 class="sec">Power lines &middot; ' + y + (ed ? " " + ed : "") +
      '<button type="button" class="replay" data-plreplay>Replay</button></h2>';
    h += '<div class="pl-card wl-card"><div class="wl-wrap">' + left +
      '<div class="wl-scroll" data-last="' + xOf(lastIdx) + '">' + sv + "</div></div></div>";
    h += '<p class="hint">Standings after every week. ' +
      (byWeek[0] ? (preFromPrev ? "Pre is the final " + (y - 1) + " standings, new managers start at the bottom. "
                               : "Pre is the preseason order. ") : "") +
      (cut ? "The bronze line is the playoff cut after " + cut + "th place. " : "") +
      "Swipe sideways for the season, tap a line to follow one manager.</p>";
    return h + "</section>";
  }

  function runPower(block) {
    var rect = block.querySelector(".pl-reveal");
    var heads = [].slice.call(block.querySelectorAll(".pl-head, .pl-name"));
    block.querySelectorAll(".pl-dot").forEach(function (n) { n.classList.add("on"); });
    if (block._raf) cancelAnimationFrame(block._raf);
    clearTimeout(block._headT);
    heads.forEach(function (n) { n.classList.remove("on"); });
    if (!rect) { heads.forEach(function (n) { n.classList.add("on"); }); return; }

    var full = +rect.getAttribute("data-w") || 0;
    var end = Math.min(full, +rect.getAttribute("data-end") || full);
    /* weekly chart: pace per week; all-time chart: one steady sweep */
    var steps = block.querySelectorAll(".wl-wk:not(.future)").length || block.querySelectorAll(".pl-year:not(.future)").length || 2;
    var dur = Math.min(4200, 700 + steps * 650);
    rect.setAttribute("width", 0);
    var t0 = null;
    function ease(k) { return k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
    function step(ts) {
      if (t0 === null) t0 = ts;
      var k = Math.min(1, (ts - t0) / dur);
      rect.setAttribute("width", (end * ease(k)).toFixed(1));
      if (k < 1) { block._raf = requestAnimationFrame(step); return; }
      rect.setAttribute("width", full);
      heads.forEach(function (n) { n.classList.add("on"); });
    }
    block._raf = requestAnimationFrame(step);
  }

  function measureCharts() {
    var changed = false;
    var a = root.querySelector(".pl-block:not(.wl-block) .pl-scroll");
    if (a && a.clientWidth && Math.abs(a.clientWidth - chartW.all) > 8) { chartW.all = a.clientWidth; changed = true; }
    var b = root.querySelector(".wl-block .wl-scroll");
    if (b && b.clientWidth && Math.abs(b.clientWidth - chartW.week) > 8) { chartW.week = b.clientWidth; changed = true; }
    return changed;
  }

  function wirePower() {
    /* first pass: size the charts to the card, then render once more */
    if (current === "table" && reflowDepth === 0 && measureCharts()) {
      reflowDepth++;
      try { render("table", true); } finally { reflowDepth--; }
      return;
    }
    [].slice.call(root.querySelectorAll(".pl-block")).forEach(function (block) {
      var sc = block.querySelector(".wl-scroll");
      if (sc) {
        var x = +sc.getAttribute("data-last") || 0;
        sc.scrollLeft = Math.max(0, x - sc.clientWidth * 0.6);
      }
      if (REDUCE || !("IntersectionObserver" in window)) {
        block.querySelectorAll(".pl-head, .pl-name, .pl-dot").forEach(function (n) { n.classList.add("on"); });
      } else {
        var io = new IntersectionObserver(function (en) {
          en.forEach(function (x2) {
            if (!x2.isIntersecting) return;
            io.unobserve(x2.target);
            runPower(x2.target);
          });
        }, { threshold: 0.25 });
        io.observe(block);
      }
      var rp = block.querySelector("[data-plreplay]");
      if (rp) rp.addEventListener("click", function (e) {
        e.stopPropagation();
        block.classList.remove("tracing");
        runPower(block);
      });
      block.addEventListener("click", function (e) {
        var g = e.target.closest ? e.target.closest(".pl-m") : null;
        var cur = block.getAttribute("data-lit");
        block.querySelectorAll(".pl-m.lit").forEach(function (x3) { x3.classList.remove("lit"); });
        if (!g || g.getAttribute("data-m") === cur) {
          block.classList.remove("tracing"); block.removeAttribute("data-lit"); return;
        }
        g.classList.add("lit");
        g.parentNode.appendChild(g);
        block.classList.add("tracing");
        block.setAttribute("data-lit", g.getAttribute("data-m"));
        openProfile(g.getAttribute("data-m"));
      });
    });
  }

  /* ---------- Playoff bracket ---------- */
  function winnerOf(g) {
    if (has(g.winner)) return g.winner;
    if (g.homeScore === null || g.homeScore === undefined) return null;
    if (g.awayScore === null || g.awayScore === undefined) return null;
    return g.homeScore > g.awayScore ? g.home : g.away;
  }
  function cssq(v) { return String(v).replace(/"/g, '\\"'); }

  /* Build the bracket as a tree from the final backwards, so every
     feeder sits right next to the game it feeds and no line crosses. */
  function bracketTree(po) {
    var games = (po.games || []).filter(function (g) { return g.round !== po.thirdPlaceRound && !g.consolation; });
    if (!games.length) return null;
    var order = (po.order || []).slice();
    games.forEach(function (g) { if (order.indexOf(g.round) === -1) order.push(g.round); });
    order = order.filter(function (rd) { return games.some(function (g) { return g.round === rd; }); });
    var R = order.length;
    var fin = games.filter(function (g) { return g.round === order[R - 1]; })[0];
    if (!fin) return null;

    function build(g, r) {
      var node = { type: "match", g: g, r: r, kids: [] };
      if (r > 0) {
        var prev = order[r - 1];
        [g.home, g.away].forEach(function (team) {
          var src = games.filter(function (x) { return x.round === prev && winnerOf(x) === team; })[0];
          if (src) node.kids.push(build(src, r - 1));
          else if (((po.byes && po.byes[prev]) || []).indexOf(team) !== -1)
            node.kids.push({ type: "bye", team: team, r: r - 1, kids: [] });
        });
      }
      return node;
    }
    return { root: build(fin, R - 1), order: order, R: R };
  }

  function brackets() {
    if (mTab === "all") return "";
    var y = +mTab, s = S[y];
    if (!s || !has((s.playoffs || {}).games)) return "";
    var po = s.playoffs, tree = bracketTree(po);
    if (!tree) return "";

    var W = 150, G = 34, ROW = 32, HEAD = 44, U = 84, CW = 156;
    var leaves = 0, nodes = [];
    (function place(n) {
      n.kids.forEach(place);
      if (!n.kids.length) { n.y = HEAD + U * (leaves + 0.5); leaves++; }
      else n.y = n.kids.reduce(function (a, k) { return a + k.y; }, 0) / n.kids.length;
      n.x = n.r * (W + G);
      nodes.push(n);
    })(tree.root);
    var H = HEAD + U * leaves + 8;
    var champX = tree.R * (W + G);
    var TW = champX + CW;
    var champ = winnerOf(tree.root.g);
    var weeks = po.weeks || {};

    function rowY(n, team) {
      if (n.type === "bye") return n.y;
      return team === n.g.home ? n.y - ROW / 2 : n.y + ROW / 2;
    }
    function av(team) {
      var m = mgr(teamManager(y, team) || "");
      var src = m.face || m.avatar;
      return has(src) ? '<img class="br-av" src="' + esc(src) + '" alt="">' : '<span class="br-av br-av-x"></span>';
    }
    function row(n, team, res) {
      return '<div class="br-row ' + (res || "") + '" data-team="' + esc(team) + '">' + av(team) +
        '<span class="br-nm">' + esc(team) + "</span>" + (n.type === "bye" ? "<em>Bye</em>" : "") + "</div>";
    }

    /* lines */
    var lines = '<svg class="br-lines" viewBox="0 0 ' + TW + " " + H + '" width="' + TW + '" height="' + H + '">';
    nodes.forEach(function (p) {
      p.kids.forEach(function (k) {
        var team = k.type === "bye" ? k.team : winnerOf(k.g);
        var sx = k.x + W, sy = k.y, ex = p.x, ey = rowY(p, team), mx = sx + G / 2;
        lines += '<path class="br-line' + (team === champ ? " champ" : "") + '" data-r="' + p.r +
          '" data-team="' + esc(team) + '" d="M' + sx + " " + sy + " H" + mx + " V" + ey + " H" + ex + '"/>';
      });
    });
    if (champ) {
      lines += '<path class="br-line champ" data-r="' + tree.R + '" data-team="' + esc(champ) +
        '" d="M' + (tree.root.x + W) + " " + tree.root.y + " H" + champX + '"/>';
    }
    lines += "</svg>";

    /* headers */
    var heads = "";
    tree.order.forEach(function (rd, i) {
      heads += '<div class="br-head" style="left:' + i * (W + G) + "px;width:" + W + 'px"><b>' + esc(rd) + "</b>" +
        (weeks[rd] ? "<span>Week " + weeks[rd] + "</span>" : "") + "</div>";
    });
    heads += '<div class="br-head" style="left:' + champX + "px;width:" + CW + 'px"><b>Champion</b></div>';

    /* slots */
    var slots = "";
    nodes.forEach(function (n) {
      if (n.type === "bye") {
        slots += '<div class="br-slot bye" data-r="' + n.r + '" style="left:' + n.x + "px;top:" + (n.y - ROW / 2) +
          "px;width:" + W + 'px">' + row(n, n.team, "") + "</div>";
        return;
      }
      var w = winnerOf(n.g);
      slots += '<div class="br-slot" data-r="' + n.r + '" style="left:' + n.x + "px;top:" + (n.y - ROW) +
        "px;width:" + W + 'px">' + row(n, n.g.home, w === n.g.home ? "w" : "l") +
        row(n, n.g.away, w === n.g.away ? "w" : "l") + "</div>";
    });

    var champCard = "";
    if (champ) {
      var cm = mgr(teamManager(y, champ) || "");
      champCard = '<div class="br-champ" data-team="' + esc(champ) + '" style="left:' + champX + "px;top:" +
        (tree.root.y - 58) + "px;width:" + CW + 'px">' +
        '<div class="br-champ-pic">' + (has(cm.face || cm.avatar) ? '<img src="' + esc(cm.face || cm.avatar) + '" alt="">' : "") +
        '<span class="br-champ-cup">' + trophySvg() + "</span></div>" +
        '<div class="br-champ-team">' + esc(champ) + "</div>" +
        '<div class="br-champ-mgr">' + esc(cm.name || "") + (cm.id ? flagFor(cm.id) : "") + "</div></div>";
    }

    var ed = edition(y);
    var h = '<section class="bracket-block" data-year="' + y + '">';
    h += '<h2 class="sec">' + seasonLogo(y, "sec-logo") + "Playoffs " + y +
      (ed ? " &middot; Buy-In Bowl " + ed : "") +
      '<button type="button" class="replay" data-replay>Replay</button></h2>';
    h += '<div class="br-card"><div class="br-scroll"><div class="br-canvas" style="width:' + TW + "px;height:" + H + 'px">' +
      lines + heads + slots + champCard + "</div></div></div>";
    h += '<p class="hint">Tap a team to follow its run. The bronze line is the champion\'s path.</p>';
    return h + "</section>";
  }

  /* ---------- Bracket choreography ---------- */
  function tableSource(team) {
    var cells = [].slice.call(root.querySelectorAll(".mteam"));
    for (var i = 0; i < cells.length; i++) {
      if (cells[i].textContent.indexOf(team) !== -1) return cells[i];
    }
    return null;
  }

  function flyIn(el, from, delay, dur) {
    var t2 = el.getBoundingClientRect();
    var dx = 0, dy = -36;
    if (from) {
      var f = from.getBoundingClientRect();
      dx = Math.max(-900, Math.min(900, (f.left + f.width / 2) - (t2.left + t2.width / 2)));
      dy = Math.max(-900, Math.min(900, (f.top + f.height / 2) - (t2.top + t2.height / 2)));
    }
    el.style.transition = "none";
    el.style.opacity = "0";
    el.style.transform = "translate(" + dx.toFixed(1) + "px," + dy.toFixed(1) + "px) scale(.94)";
    setTimeout(function () {
      el.style.transition = "transform " + dur + "ms cubic-bezier(.22,1,.36,1), opacity " +
        Math.round(dur * 0.55) + "ms ease";
      el.style.opacity = "1";
      el.style.transform = "none";
    }, delay);
  }

  function runBracket(block) {
    (block._timers || []).forEach(clearTimeout);
    var timers = block._timers = [];
    function at(ms, fn) { timers.push(setTimeout(fn, ms)); }

    var slots = [].slice.call(block.querySelectorAll(".br-slot"));
    var lines = [].slice.call(block.querySelectorAll(".br-line"));
    var champ = block.querySelector(".br-champ");
    var maxR = 0;
    slots.forEach(function (s) { maxR = Math.max(maxR, +s.getAttribute("data-r")); });

    slots.forEach(function (s) { s.classList.remove("shown", "decided"); });
    block.querySelectorAll(".br-row").forEach(function (r) {
      r.style.transition = "none"; r.style.opacity = "0"; r.style.transform = "none";
    });
    lines.forEach(function (l) {
      var len = l.getTotalLength ? l.getTotalLength() : 200;
      l.style.transition = "none";
      l.style.strokeDasharray = len;
      l.style.strokeDashoffset = len;
    });
    if (champ) champ.classList.remove("shown");

    var STEP = 1500, FLY = 850;
    for (var r = 0; r <= maxR; r++) {
      (function (r) {
        var base = r * STEP;
        lines.filter(function (l) { return +l.getAttribute("data-r") === r; }).forEach(function (l, i) {
          at(Math.max(0, base - 380) + i * 60, function () {
            l.style.transition = "stroke-dashoffset 560ms cubic-bezier(.22,1,.36,1)";
            l.style.strokeDashoffset = 0;
          });
        });
        slots.filter(function (s) { return +s.getAttribute("data-r") === r; }).forEach(function (s, si) {
          at(base, function () { s.classList.add("shown"); });
          [].slice.call(s.querySelectorAll(".br-row")).forEach(function (row, ri) {
            var team = row.getAttribute("data-team");
            var from = null;
            if (r === 0) from = tableSource(team);
            else {
              var prev = block.querySelectorAll('.br-slot[data-r="' + (r - 1) + '"] .br-row[data-team="' + cssq(team) + '"]');
              from = prev.length ? prev[prev.length - 1] : null;
            }
            flyIn(row, from, base + si * 150 + ri * 70, FLY);
          });
          at(base + FLY + 260 + si * 150, function () { s.classList.add("decided"); });
        });
      })(r);
    }
    var endT = (maxR + 1) * STEP;
    lines.filter(function (l) { return +l.getAttribute("data-r") === maxR + 1; }).forEach(function (l) {
      at(endT - 200, function () {
        l.style.transition = "stroke-dashoffset 560ms cubic-bezier(.22,1,.36,1)";
        l.style.strokeDashoffset = 0;
      });
    });
    at(endT + 250, function () { if (champ) champ.classList.add("shown"); });
  }

  function showBracketStatic(block) {
    block.querySelectorAll(".br-slot").forEach(function (s) { s.classList.add("shown", "decided"); });
    block.querySelectorAll(".br-row").forEach(function (r) { r.style.opacity = "1"; r.style.transform = "none"; });
    var c = block.querySelector(".br-champ");
    if (c) c.classList.add("shown");
  }

  function wireBrackets() {
    var blocks = [].slice.call(root.querySelectorAll(".bracket-block"));
    blocks.forEach(function (b) {
      if (REDUCE || !("IntersectionObserver" in window)) showBracketStatic(b);
      else {
        var io = new IntersectionObserver(function (en) {
          en.forEach(function (x) {
            if (!x.isIntersecting) return;
            io.unobserve(x.target);
            runBracket(x.target);
          });
        }, { threshold: 0.2 });
        io.observe(b);
      }

      var rp = b.querySelector("[data-replay]");
      if (rp) rp.addEventListener("click", function (e) {
        e.stopPropagation();
        b.classList.remove("tracing");
        b.querySelectorAll(".lit").forEach(function (x) { x.classList.remove("lit"); });
        runBracket(b);
      });

      b.addEventListener("click", function (e) {
        var s = e.target.closest ? e.target.closest("[data-team]") : null;
        b.querySelectorAll(".lit").forEach(function (x) { x.classList.remove("lit"); });
        if (!s || s.closest(".br-lines")) { b.classList.remove("tracing"); b.removeAttribute("data-lit"); return; }
        var team = s.getAttribute("data-team");
        if (b.getAttribute("data-lit") === team) {
          b.classList.remove("tracing"); b.removeAttribute("data-lit"); return;
        }
        b.classList.add("tracing");
        b.setAttribute("data-lit", team);
        b.querySelectorAll('[data-team="' + cssq(team) + '"]').forEach(function (x) {
          x.classList.add("lit");
          if (x.parentNode && x.parentNode.classList && x.parentNode.classList.contains("br-slot")) x.parentNode.classList.add("lit");
        });
        var id = teamManager(+b.getAttribute("data-year"), team);
        if (id) openProfile(id);
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
      ".plaque-sub, .eyebrow, .bullets li, .hero-img, .hint, .ticker, .bracket-block, .bracket-winner, .crew-card, .medalcard"
    ));
    if (REDUCE) {
      items.forEach(function (el) { el.classList.add("in"); });
      wireBrackets();
      wirePower();
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
      wirePower();
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
    wirePower();
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
    current = route === "table" ? "table" : route === "champions" ? "champions" : "home";
    root.innerHTML = current === "table" ? renderTable() :
                     current === "champions" ? renderChampions() : renderLanding();
    document.querySelectorAll("#nav [data-route]").forEach(function (b) {
      if (b.getAttribute("data-route") === current) b.setAttribute("aria-current", "page");
      else b.removeAttribute("aria-current");
    });
    if (!keepScroll) window.scrollTo(0, 0);
    enhance();
  }

  function navigate(route) {
    render(route);
    try {
      history.replaceState(null, "", route === "table" ? "#/table" : route === "champions" ? "#/champions" : "#/");
    } catch (e) { /* sandboxed */ }
  }

  function routeFromHash() {
    var hh = location.hash || "";
    return /#\/table/.test(hh) ? "table" : /#\/champions/.test(hh) ? "champions" : "home";
  }

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || !el.closest) return;

    var pf = el.closest("[data-profile]");
    if (pf) { e.preventDefault(); openProfile(pf.getAttribute("data-profile")); return; }

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

  document.addEventListener("keydown", function (e) {
    if (e.key !== "Enter" && e.key !== " ") return;
    var el = e.target;
    if (el && el.getAttribute && el.getAttribute("data-profile") && el.tagName !== "BUTTON") {
      e.preventDefault();
      openProfile(el.getAttribute("data-profile"));
    }
  });

  function buildNav() {
    document.getElementById("nav").innerHTML =
      '<button type="button" data-route="home">Home</button>' +
      '<button type="button" data-route="champions">Champions</button>' +
      '<button type="button" data-route="table">All-time</button>';
    var mark = document.getElementById("mark");
    mark.innerHTML = "The Buy-In <span>Bowl</span>";
    mark.setAttribute("data-route", "home");
    document.title = (L.name || "Archive") + " — Archive";
  }

  var rsz = null, lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(rsz);
    rsz = setTimeout(function () {
      if (current === "table" && measureCharts()) render("table", true);
    }, 250);
  });

  window.addEventListener("hashchange", function () { render(routeFromHash()); });
  buildNav();
  render(routeFromHash());
})();
