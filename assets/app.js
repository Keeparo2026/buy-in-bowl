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

    var h = '<section class="hero"><div class="wrap"><div class="hero-grid"><div class="hero-txt">';
    h += statusChip();
    h += '<h1 class="hero-title">' + esc(has(lp.headline) ? lp.headline : (L.claim || "")) + "</h1>";
    h += '<p class="plaque-sub">' + esc(has(lp.intro) ? lp.intro :
      "Every win, every collapse, every ring \u2014 kept somewhere the group chat can't lose it.") + "</p>";
    if (has(lp.highlights)) h += bullets(lp.highlights);
    h += "</div>" + coinStack() + "</div>";

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

    h += topThree();
    h += ifSeasonEnded();
    h += lineup();
    h += '<div class="wordwall" aria-hidden="true"><span>BUY-IN BOWL</span></div>';
    return h;
  }

  /* One coin per season: the newest in front, older seasons stacked behind it */
  function coinStack() {
    var ys = years().filter(function (y) { return S[y] && has(S[y].logo); });
    if (!ys.length) return "";
    var n = ys.length;
    var h = '<div class="coins" style="--n:' + n + '"><div class="coins-tilt">';
    ys.slice().reverse().forEach(function (y, k) {
      var i = n - 1 - k, ed = edition(y);
      h += '<button type="button" class="coin' + (i === 0 ? " front" : "") + '" style="--i:' + i + '" ' +
        'data-route="table" data-tab="' + y + '" aria-label="Open season ' + y + '">' +
        '<img src="' + esc(S[y].logo) + '" alt="">' +
        '<span class="coin-tag">' + y + (ed ? " &middot; " + ed : "") + "</span></button>";
    });
    h += "</div></div>";
    return h;
  }

  /* The stack leans a little toward the pointer */
  function wireCoins() {
    var st = root.querySelector(".coins");
    if (!st) return;
    /* hovering a coin brings it to the front; the current season is in front by default */
    [].slice.call(st.querySelectorAll(".coin")).forEach(function (c) {
      c.addEventListener("pointerenter", function (e) {
        if (e.pointerType === "touch") return;
        st.querySelectorAll(".coin.up").forEach(function (x) { x.classList.remove("up"); });
        if (!c.classList.contains("front")) { c.classList.add("up"); st.classList.add("swapped"); }
        else st.classList.remove("swapped");
      });
      c.addEventListener("focus", function () {
        st.querySelectorAll(".coin.up").forEach(function (x) { x.classList.remove("up"); });
        if (!c.classList.contains("front")) { c.classList.add("up"); st.classList.add("swapped"); }
      });
    });
    st.addEventListener("pointerleave", function () {
      st.querySelectorAll(".coin.up").forEach(function (x) { x.classList.remove("up"); });
      st.classList.remove("swapped");
    });
    st.addEventListener("focusout", function (e) {
      if (st.contains(e.relatedTarget)) return;
      st.querySelectorAll(".coin.up").forEach(function (x) { x.classList.remove("up"); });
      st.classList.remove("swapped");
    });
    if (REDUCE) return;
    var hero = root.querySelector(".hero") || st;
    hero.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      var b = st.getBoundingClientRect();
      var x = (e.clientX - (b.left + b.width / 2)) / window.innerWidth;
      var y = (e.clientY - (b.top + b.height / 2)) / window.innerHeight;
      st.style.setProperty("--ry", (x * 16).toFixed(2) + "deg");
      st.style.setProperty("--rx", (-y * 12).toFixed(2) + "deg");
    });
    hero.addEventListener("pointerleave", function () {
      st.style.setProperty("--ry", "0deg"); st.style.setProperty("--rx", "0deg");
    });
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
        h += "</div>";
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
      h += "</div>";
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

  /* Home: the top three of the current season, straight from the standings */
  function topThree() {
    var y = years()[0], s = S[y];
    if (!s) return "";
    var rows = (s.standings || []).slice().sort(function (a, b) { return a.rank - b.rank; }).slice(0, 3);
    if (!rows.length) return "";
    var wk = weeksPlayed(y), live = !isDone(y);
    var h = '<div class="wrap"><section class="block top3">';
    h += '<h2 class="sec">' + (live ? "Top three right now" : "Final top three") + "</h2>";
    h += '<div class="table-scroll"><table class="champs-table top3-table"><thead><tr>' +
      "<th>#</th><th>Manager</th><th>W-L</th><th>Points</th></tr></thead><tbody>";
    rows.forEach(function (r) {
      var m = mgr(r.manager), cls = ["gold", "silver", "bronze"][r.rank - 1] || "";
      h += '<tr data-profile="' + esc(r.manager) + '" tabindex="0">' +
        '<td class="t3-rank"><span class="dot ' + cls + '"></span>' + r.rank + "</td>" +
        '<td><div class="cwho">' +
          (has(m.face || m.avatar) ? '<img class="avatar" src="' + esc(m.face || m.avatar) + '" alt="">' : "") +
          '<span class="mtxt"><span class="mname">' + esc(m.name || r.team) + flagFor(r.manager) + "</span>" +
          '<span class="mteam">' + esc(r.team) + "</span></span></div></td>" +
        '<td class="t3-num">' + r.w + "-" + r.l + (r.t ? "-" + r.t : "") + "</td>" +
        '<td class="t3-num">' + num(r.pf, 2) + "</td></tr>";
    });
    h += "</tbody></table></div>";
    h += '<div class="t3-foot"><span>' + (wk ? "After week " + wk + " &middot; " : "") + "Buy-In Bowl " + (edition(y) || y) + "</span>" +
      '<button type="button" class="tm-more t3-link" data-route="table" data-tab="' + y + '">Full standings</button></div>';
    h += "</section></div>";
    return h;
  }

  /* ---------- Stats ---------- */
  var stYear = null, stFocus = null;

  function mcolor(id) { return (mgr(id).color) || "#9AA3AD"; }

  /* Final place per manager: finished seasons from the career table, running season from the standings */
  function placeMap(y) {
    var out = {};
    if (isDone(y)) {
      careers(String(y)).forEach(function (r) { if (r.place && r.place < 999) out[r.id] = r.place; });
    }
    ((S[y] || {}).standings || []).forEach(function (r) { if (!out[r.manager]) out[r.manager] = r.rank; });
    return out;
  }

  /* All weekly games of a season, by manager */
  function seasonGames(y) {
    var out = [];
    ((S[y] || {}).weeks || []).forEach(function (w) {
      (w.matchups || []).forEach(function (m) {
        var hs = +m.homeScore, as = +m.awayScore;
        if (!(hs > 0 || as > 0)) return;
        out.push({ week: w.week, a: teamManager(y, m.home), as: hs, b: teamManager(y, m.away), bs: as });
      });
    });
    return out;
  }

  function scoreWeeks(y) {
    var byWeek = {};
    seasonGames(y).forEach(function (g) {
      var w = byWeek[g.week] || (byWeek[g.week] = {});
      w[g.a] = g.as; w[g.b] = g.bs;
    });
    return Object.keys(byWeek).map(Number).sort(function (a, b) { return a - b; })
      .map(function (k) { return { week: k, s: byWeek[k] }; });
  }

  function who(id, small) {
    var m = mgr(id);
    return '<span class="st-who' + (small ? " sm" : "") + '" data-profile="' + esc(id) + '">' +
      (has(m.face) ? '<img src="' + esc(m.face) + '" alt="">' : "") + "<b>" + esc(m.name || id) + "</b></span>";
  }

  function stCard(title, sub, body) {
    return '<section class="st-card"><div class="st-head"><h3>' + title + "</h3>" +
      (sub ? "<p>" + sub + "</p>" : "") + "</div>" + body + "</section>";
  }

  /* 1. Points for against the final place */
  function chartPointsVsFinish(y) {
    var st = ((S[y] || {}).standings || []).filter(function (r) { return r.pf; });
    if (!st.length) return "";
    var place = placeMap(y), done = isDone(y);
    var rows = st.slice().sort(function (a, b) { return b.pf - a.pf; });
    var max = rows[0].pf, min = rows[rows.length - 1].pf;
    var lo = Math.max(0, min - (max - min) * 0.6);
    var body = '<div class="st-bars">' + rows.map(function (r, i) {
      var p = place[r.manager], w = ((r.pf - lo) / (max - lo)) * 100;
      var champ = done && p === 1;
      return '<div class="st-bar-row' + (champ ? " champ" : "") + '">' +
        '<span class="st-rank">' + (i + 1) + "</span>" + who(r.manager) +
        '<span class="st-track"><span class="st-fill" style="width:' + w.toFixed(1) + "%;background:" + (champ ? "var(--accent)" : mcolor(r.manager)) + '"></span>' +
        '<span class="st-val">' + num(r.pf, 0) + "</span></span>" +
        '<span class="st-place' + (p <= 3 ? " top" : "") + '">' + (p ? ordinal(p) : "–") + "</span></div>";
    }).join("") + "</div>";
    return stCard("Points vs. " + (done ? "final place" : "current place"),
      "Bars sorted by points scored" + (done ? ", champion in bronze" : "") + ". Right column: " + (done ? "where they finished." : "where they stand now."), body);
  }

  /* 3. Draft slot against the finish, as a slope chart */
  function chartDraftSlope(y) {
    var d = (S[y] || {}).draftBoard;
    if (!d || !d.order) return "";
    var place = placeMap(y), n = d.order.length, done = isDone(y);
    var W = 360, top = 24, gap = 30, H = top + gap * (n - 1) + 24, x1 = 118, x2 = W - 118;
    var svg = '<svg class="st-slope" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Draft slot against finish">';
    svg += '<text x="' + x1 + '" y="12" class="st-ax" text-anchor="middle">Pick</text>' +
      '<text x="' + x2 + '" y="12" class="st-ax" text-anchor="middle">' + (done ? "Finish" : "Now") + "</text>";
    d.order.forEach(function (id, i) {
      var p = place[id]; if (!p) return;
      var ya = top + i * gap, yb = top + (p - 1) * gap, m = mgr(id);
      var up = p < i + 1, col = up ? "#A9791C" : p > i + 1 ? "#C4C7CC" : "#5B6068";
      svg += '<g class="st-sl" data-profile="' + esc(id) + '">' +
        '<line x1="' + x1 + '" y1="' + ya + '" x2="' + x2 + '" y2="' + yb + '" style="stroke:' + col + ";stroke-width:" + (up ? 2.4 : 1.4) + '"/>' +
        '<circle cx="' + x1 + '" cy="' + ya + '" r="4" fill="' + mcolor(id) + '"/><circle cx="' + x2 + '" cy="' + yb + '" r="4" fill="' + mcolor(id) + '"/>' +
        '<text x="' + (x1 - 10) + '" y="' + (ya + 4) + '" text-anchor="end" class="st-lbl">' + esc(m.name || id) + " " + (i + 1) + "</text>" +
        '<text x="' + (x2 + 10) + '" y="' + (yb + 4) + '" class="st-lbl">' + p + " " + esc(m.name || id) + "</text></g>";
    });
    svg += "</svg>";
    return stCard("Draft slot vs. " + (done ? "finish" : "standing"),
      "Left: round one pick. Right: " + (done ? "final place" : "current place") + ". Bronze lines climbed, grey lines fell.", svg);
  }

  /* 5. Luck: actual wins against all-play wins */
  function chartLuck(y) {
    var weeks = scoreWeeks(y);
    if (!weeks.length) return "";
    var t = {};
    function row(id) { return t[id] || (t[id] = { id: id, w: 0, l: 0, aw: 0, al: 0 }); }
    seasonGames(y).forEach(function (g) {
      if (g.as > g.bs) { row(g.a).w++; row(g.b).l++; } else if (g.bs > g.as) { row(g.b).w++; row(g.a).l++; }
    });
    weeks.forEach(function (wk) {
      var ids = Object.keys(wk.s);
      ids.forEach(function (a) {
        ids.forEach(function (b) {
          if (a === b) return;
          if (wk.s[a] > wk.s[b]) row(a).aw++; else if (wk.s[a] < wk.s[b]) row(a).al++;
        });
      });
    });
    var rows = Object.keys(t).map(function (k) {
      var r = t[k], g = r.w + r.l, ag = r.aw + r.al;
      r.exp = ag ? (r.aw / ag) * g : 0; r.luck = r.w - r.exp; return r;
    }).sort(function (a, b) { return b.luck - a.luck; });
    var maxAbs = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.luck); })) || 1;
    var body = '<div class="st-luck">' + rows.map(function (r) {
      var w = (Math.abs(r.luck) / maxAbs) * 50;
      return '<div class="st-luck-row">' + who(r.id) +
        '<span class="st-luck-track"><span class="st-luck-mid"></span>' +
        '<span class="st-luck-bar ' + (r.luck >= 0 ? "pos" : "neg") + '" style="width:' + w.toFixed(1) + '%"></span></span>' +
        '<span class="st-luck-v">' + (r.luck >= 0 ? "+" : "&minus;") + Math.abs(r.luck).toFixed(1) + "</span>" +
        '<span class="st-luck-rec">Real ' + r.w + "-" + r.l + " <small>&middot; vs everyone " + r.aw + "-" + r.al + "</small></span></div>";
    }).join("") + "</div>" +
      '<div class="st-luck-scale"><span>&larr; Unlucky</span><span>Lucky &rarr;</span></div>';
    return stCard("Luck index",
      "Each week your score is also compared with all nine other teams, as if you had played everyone. " +
      "That gives a fair record (\u201cvs everyone\u201d). The number shows how many wins the real schedule gave or took compared with it.", body);
  }

  /* 6. Points per week, one line per manager plus the league average */
  function chartWeekly(y) {
    var weeks = scoreWeeks(y);
    if (!weeks.length) return "";
    var ids = Object.keys(weeks[0].s);
    var all = []; weeks.forEach(function (w) { ids.forEach(function (id) { if (w.s[id] != null) all.push(w.s[id]); }); });
    var lo = Math.floor(Math.min.apply(null, all) / 10) * 10 - 10, hi = Math.ceil(Math.max.apply(null, all) / 10) * 10 + 10;
    var narrow = window.innerWidth < 560;
    var W = narrow ? 360 : 640, H = narrow ? 240 : 300, L0 = 34, R0 = 12, T0 = 14, B0 = 28;
    var n = weeks.length;
    function X(i) { return n === 1 ? (L0 + W - R0) / 2 : L0 + (i / (n - 1)) * (W - L0 - R0); }
    function Y(v) { return T0 + (1 - (v - lo) / (hi - lo)) * (H - T0 - B0); }
    var svg = '<svg class="st-lines' + (stFocus ? " focus" : "") + '" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Points per week">';
    for (var v = lo; v <= hi; v += 20) {
      svg += '<line x1="' + L0 + '" x2="' + (W - R0) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" class="st-gl"/>' +
        '<text x="' + (L0 - 6) + '" y="' + (Y(v) + 4) + '" text-anchor="end" class="st-ax">' + v + "</text>";
    }
    weeks.forEach(function (w, i) {
      var anc = n > 1 && i === 0 ? "start" : n > 1 && i === n - 1 ? "end" : "middle";
      svg += '<text x="' + X(i) + '" y="' + (H - 8) + '" text-anchor="' + anc + '" class="st-ax">Wk ' + w.week + "</text>";
    });
    var avg = weeks.map(function (w) { var v2 = ids.map(function (id) { return w.s[id]; }); return v2.reduce(function (a, b) { return a + b; }, 0) / v2.length; });
    svg += '<polyline class="st-avg" points="' + avg.map(function (v2, i) { return X(i) + "," + Y(v2); }).join(" ") + '"/>';
    ids.forEach(function (id) {
      var pts = weeks.map(function (w, i) { return w.s[id] != null ? X(i) + "," + Y(w.s[id]) : null; }).filter(Boolean);
      var on = stFocus === id;
      svg += '<g class="st-ln' + (on ? " on" : "") + '" style="--c:' + mcolor(id) + '">' +
        '<polyline points="' + pts.join(" ") + '"/>' +
        pts.map(function (p) { var q = p.split(","); return '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="3.5"/>'; }).join("") + "</g>";
    });
    svg += "</svg>";
    var legend = '<div class="st-legend">' + ids.map(function (id) {
      return '<button type="button" class="st-chip' + (stFocus === id ? " on" : "") + '" data-stfocus="' + esc(id) + '" style="--c:' + mcolor(id) + '">' +
        "<i></i>" + esc(mgr(id).name || id) + "</button>";
    }).join("") + '<span class="st-chip avg"><i></i>League average</span></div>';
    return stCard("Points per week", "Tap a name to highlight one manager.", legend + svg);
  }

  /* 7. Consistency: average against spread */
  function chartConsistency(y) {
    var weeks = scoreWeeks(y);
    if (!weeks.length) return "";
    if (weeks.length < 3) {
      return stCard("Consistency", "Average score against how much it swings, from steady to wild card.",
        '<p class="st-wait">Unlocks after week 3. Two weeks of scores are not enough to tell steady from lucky.</p>');
    }
    var ids = Object.keys(weeks[0].s);
    var pts = ids.map(function (id) {
      var v = weeks.map(function (w) { return w.s[id]; }).filter(function (x) { return x != null; });
      var mean = v.reduce(function (a, b) { return a + b; }, 0) / v.length;
      var sd = Math.sqrt(v.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0) / v.length);
      return { id: id, mean: mean, sd: sd };
    });
    var narrow = window.innerWidth < 560;
    var W = narrow ? 360 : 640, H = narrow ? 280 : 320, L0 = 30, R0 = 60, T0 = 16, B0 = 36;
    var mx = pts.map(function (p) { return p.mean; }), sx = pts.map(function (p) { return p.sd; });
    var xlo = Math.floor(Math.min.apply(null, mx) / 5) * 5 - 5, xhi = Math.ceil(Math.max.apply(null, mx) / 5) * 5 + 5;
    var yhi = Math.ceil(Math.max.apply(null, sx) / 5) * 5 + 5;
    function X(v) { return L0 + ((v - xlo) / (xhi - xlo)) * (W - L0 - R0); }
    function Y(v) { return T0 + (1 - v / yhi) * (H - T0 - B0); }
    var svg = '<svg class="st-scatter" viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Consistency">';
    svg += '<text x="' + (W - R0) + '" y="' + (H - 8) + '" text-anchor="end" class="st-ax">Average points &rarr;</text>' +
      '<text x="' + (L0 + 4) + '" y="' + (T0 + 10) + '" class="st-ax">&uarr; Swing</text>' +
      '<line x1="' + L0 + '" x2="' + (W - R0) + '" y1="' + (H - B0) + '" y2="' + (H - B0) + '" class="st-gl"/>' +
      '<line x1="' + L0 + '" x2="' + L0 + '" y1="' + T0 + '" y2="' + (H - B0) + '" class="st-gl"/>';
    pts.forEach(function (p) {
      svg += '<g class="st-dot" data-profile="' + esc(p.id) + '"><circle cx="' + X(p.mean) + '" cy="' + Y(p.sd) + '" r="7" fill="' + mcolor(p.id) + '"/>' +
        '<text x="' + (X(p.mean) + 11) + '" y="' + (Y(p.sd) + 4) + '" class="st-lbl">' + esc(mgr(p.id).name || p.id) + "</text></g>";
    });
    svg += "</svg>";
    return stCard("Consistency", "Right is more points, up is bigger swings. Bottom right is the team you want.", svg);
  }

  /* Played games per manager from the weekly scores: wins, losses, points for and against */
  function gameTotals(y) {
    var t = {};
    function r(id) { return t[id] || (t[id] = { id: id, w: 0, l: 0, pf: 0, pa: 0, g: 0, cw: 0, cl: 0 }); }
    seasonGames(y).forEach(function (g) {
      var A = r(g.a), B = r(g.b), close = Math.abs(g.as - g.bs) < 10;
      A.pf += g.as; A.pa += g.bs; B.pf += g.bs; B.pa += g.as; A.g++; B.g++;
      if (g.as > g.bs) { A.w++; B.l++; if (close) { A.cw++; B.cl++; } }
      else if (g.bs > g.as) { B.w++; A.l++; if (close) { B.cw++; A.cl++; } }
    });
    return t;
  }

  function barRows(rows, opts) {
    var max = Math.max.apply(null, rows.map(function (r) { return r.v; }));
    var min = Math.min.apply(null, rows.map(function (r) { return r.v; }));
    var lo = opts.zero ? 0 : Math.max(0, min - (max - min) * 0.6);
    var hi = Math.max(max, opts.mark || 0);
    return '<div class="st-bars">' + rows.map(function (r, i) {
      var w = ((r.v - lo) / (hi - lo)) * 100;
      return '<div class="st-bar-row">' + '<span class="st-rank">' + (i + 1) + "</span>" + who(r.id) +
        '<span class="st-track"><span class="st-fill" style="width:' + Math.max(2, w).toFixed(1) + "%;background:" + (r.color || mcolor(r.id)) + '"></span>' +
        (opts.mark ? '<span class="st-mark" style="left:' + (((opts.mark - lo) / (hi - lo)) * 100).toFixed(1) + '%"></span>' : "") +
        '<span class="st-val">' + r.label + "</span></span>" +
        '<span class="st-place">' + (r.side || "") + "</span></div>";
    }).join("") + "</div>";
  }

  /* Strength of schedule: points scored against each manager */
  function chartSchedule(y) {
    var t = gameTotals(y), ids = Object.keys(t);
    if (!ids.length) return "";
    var rows = ids.map(function (id) { return { id: id, v: t[id].pa, label: num(t[id].pa, 0), side: num(t[id].pa / t[id].g, 1) }; })
      .sort(function (a, b) { return b.v - a.v; });
    return stCard("Strength of schedule", "Points scored against each manager so far, toughest first. Right: per game.", barRows(rows, {}));
  }

  /* Close games: decided by less than 10 points */
  function chartClose(y) {
    var t = gameTotals(y), ids = Object.keys(t);
    if (!ids.length) return "";
    var rows = ids.map(function (id) { return t[id]; })
      .sort(function (a, b) { return (b.cw - b.cl) - (a.cw - a.cl) || b.cw - a.cw; });
    var any = rows.some(function (r) { return r.cw + r.cl; });
    var body = '<div class="st-close">' + rows.map(function (r) {
      var n = r.cw + r.cl;
      return '<div class="st-close-row">' + who(r.id) + '<span class="st-close-dots">' +
        new Array(r.cw + 1).join('<i class="w"></i>') + new Array(r.cl + 1).join('<i class="l"></i>') + "</span>" +
        '<span class="st-close-rec">' + (n ? r.cw + "-" + r.cl : '<span class="muted">none yet</span>') + "</span></div>";
    }).join("") + "</div>";
    return stCard("Close games", "Record in games decided by less than 10 points. Bronze is a win." + (any ? "" : " None so far."), body);
  }

  /* Pace: current points per game over a full regular season, against the record */
  function chartPace(y) {
    var t = gameTotals(y), ids = Object.keys(t);
    if (!ids.length || isDone(y)) return "";
    var reg = regWeeks(y), rec = null;
    years().forEach(function (yy) {
      var pl = (S[yy] || {}).pointsLeader;
      if (yy !== y && pl && pl.points && (!rec || pl.points > rec.points)) rec = { points: +pl.points, id: pl.manager, y: yy };
    });
    var rows = ids.map(function (id) { var p = t[id].pf / t[id].g * reg; return { id: id, v: p, label: num(p, 0) }; })
      .sort(function (a, b) { return b.v - a.v; });
    var sub = "Points per game so far, stretched over " + reg + " weeks." +
      (rec ? " The line is the season record: " + num(rec.points, 2) + " by " + esc(mgr(rec.id).name || "") + " in " + rec.y + "." : "");
    return stCard("On pace for", sub, barRows(rows, { mark: rec ? rec.points : 0 }));
  }

  /* Year over year: points per game against the season before */
  function chartForm(y) {
    var ys = years().slice().sort(function (a, b) { return a - b; }), i = ys.indexOf(y);
    if (i < 1) return "";
    var prev = ys[i - 1];
    function ppg(yy) {
      var out = {}, t = gameTotals(yy);
      if (Object.keys(t).length) { Object.keys(t).forEach(function (id) { out[id] = t[id].pf / t[id].g; }); return out; }
      ((S[yy] || {}).standings || []).forEach(function (r) {
        var g = (+r.w || 0) + (+r.l || 0) + (+r.t || 0); if (g && r.pf) out[r.manager] = r.pf / g;
      });
      return out;
    }
    var a = ppg(prev), b = ppg(y);
    var rows = Object.keys(b).filter(function (id) { return a[id]; })
      .map(function (id) { return { id: id, a: a[id], b: b[id], d: b[id] - a[id] }; })
      .sort(function (x, z) { return z.d - x.d; });
    if (!rows.length) return "";
    var max = Math.max.apply(null, rows.map(function (r) { return Math.abs(r.d); })) || 1;
    var body = '<div class="st-luck">' + rows.map(function (r) {
      var w = (Math.abs(r.d) / max) * 50;
      return '<div class="st-luck-row">' + who(r.id) +
        '<span class="st-luck-track"><span class="st-luck-mid"></span>' +
        '<span class="st-luck-bar ' + (r.d >= 0 ? "pos" : "neg") + '" style="width:' + w.toFixed(1) + '%"></span></span>' +
        '<span class="st-luck-v">' + (r.d >= 0 ? "+" : "&minus;") + Math.abs(r.d).toFixed(1) + "</span>" +
        '<span class="st-luck-rec">' + num(r.a, 1) + " &rarr; " + num(r.b, 1) + " <small>per game</small></span></div>";
    }).join("") + "</div>";
    return stCard("Form: " + prev + " vs. " + y, "Points per game compared with the season before, for everyone who played both.", body);
  }

  /* The first player taken at each position */
  function chartFirsts(y) {
    var d = (S[y] || {}).draftBoard;
    if (!d || !d.order) return "";
    var n = d.order.length, first = {}, rounds = 0;
    d.order.forEach(function (id) { rounds = Math.max(rounds, (d.picks[id] || []).length); });
    for (var r = 0; r < rounds; r++) {
      d.order.forEach(function (id, slot) {
        var p = (d.picks[id] || [])[r]; if (!p || !p[1]) return;
        var pos = p[1].split(" ")[0], ov = r * n + (r % 2 ? n - slot : slot + 1);
        if (!first[pos] || ov < first[pos].ov) first[pos] = { ov: ov, name: p[0], id: id };
      });
    }
    var body = '<div class="st-firsts">' + ["QB", "RB", "WR", "TE", "K", "DEF"].filter(function (p) { return first[p]; }).map(function (p) {
      var f = first[p];
      return '<div class="st-first"><span class="dr-p p-' + p + '">' + p + "</span>" +
        '<span class="st-first-n"><b>' + esc(f.name) + "</b><small>Pick " + f.ov + "</small></span>" + who(f.id, true) + "</div>";
    }).join("") + "</div>";
    return stCard("First off the board", "The first player taken at each position.", body);
  }

  /* League-wide: how many of each position went in each round */
  function chartHeat(y) {
    var d = (S[y] || {}).draftBoard;
    if (!d || !d.order) return "";
    var P = ["QB", "RB", "WR", "TE", "K", "DEF"], rounds = 0, c = [];
    d.order.forEach(function (id) { rounds = Math.max(rounds, (d.picks[id] || []).length); });
    for (var r = 0; r < rounds; r++) {
      c[r] = {};
      d.order.forEach(function (id) {
        var p = (d.picks[id] || [])[r]; if (!p || !p[1]) return;
        var pos = p[1].split(" ")[0]; c[r][pos] = (c[r][pos] || 0) + 1;
      });
    }
    var n = d.order.length;
    var h = '<table class="st-heat"><thead><tr><th>Rd</th>' + P.map(function (p) { return "<th>" + p + "</th>"; }).join("") + "</tr></thead><tbody>";
    c.forEach(function (row, r) {
      h += "<tr><th>" + (r + 1) + "</th>" + P.map(function (p) {
        var v = row[p] || 0, a = v / n;
        return '<td class="p-' + p + '"' + (v ? ' style="--a:' + (0.25 + a * 0.75).toFixed(2) + '"' : ' style="--a:0"') + ">" + (v || "") + "</td>";
      }).join("") + "</tr>";
    });
    h += "</tbody></table>";
    return stCard("Position runs", "How many of each position went in every round, league-wide.", h);
  }

  /* ---------- Playoff odds: simulate the rest of the regular season ---------- */
  var oddsCache = {};

  function regWeeks(y) {
    var pw = ((S[y] || {}).playoffs || {}).weeks || {};
    var first = Math.min.apply(null, Object.keys(pw).map(function (k) { return +pw[k]; }).filter(function (v) { return v > 0; }));
    return isFinite(first) ? first - 1 : 14;
  }

  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  function playoffOdds(y) {
    var weeks = scoreWeeks(y);
    var key = y + ":" + weeks.length;
    if (oddsCache[key]) return oddsCache[key];
    var t = gameTotals(y), ids = Object.keys(t);
    if (!ids.length) return null;
    var reg = regWeeks(y), played = weeks.length ? weeks[weeks.length - 1].week : 0;
    var spots = ((L.format || {}).playoffTeams) || 6, byes = 2;

    /* Team strength: own average pulled toward the league average while the sample is small */
    var all = [], sq = 0;
    weeks.forEach(function (w) { ids.forEach(function (id) { if (w.s[id] != null) all.push(w.s[id]); }); });
    var lg = all.reduce(function (a, b) { return a + b; }, 0) / all.length;
    var mean = {};
    ids.forEach(function (id) {
      var n = t[id].g, avg = t[id].pf / n, K = 4;
      mean[id] = (n * avg + K * lg) / (n + K);
      weeks.forEach(function (w) { if (w.s[id] != null) sq += Math.pow(w.s[id] - avg, 2); });
    });
    var sdObs = Math.sqrt(sq / Math.max(1, all.length - ids.length));
    var sd = weeks.length >= 4 ? Math.max(15, sdObs) : 22;

    /* Known future matchups from the weeks list, random pairings otherwise */
    var sched = {};
    ((S[y] || {}).weeks || []).forEach(function (w) {
      if (w.week > played && w.week <= reg && (w.matchups || []).length) {
        sched[w.week] = w.matchups.map(function (m) { return [teamManager(y, m.home), teamManager(y, m.away)]; });
      }
    });
    var knownSched = Object.keys(sched).length === reg - played;

    var R = rng(9001 + played * 131), N = 10000;
    function gauss() { var u = R() || 1e-9, v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
    var res = {}; ids.forEach(function (id) { res[id] = { po: 0, bye: 0, wins: 0 }; });
    var byWins = {};

    for (var s = 0; s < N; s++) {
      var W = {}, PF = {};
      ids.forEach(function (id) { W[id] = t[id].w; PF[id] = t[id].pf; });
      for (var wk = played + 1; wk <= reg; wk++) {
        var pairs = sched[wk];
        if (!pairs) {
          var sh = ids.slice();
          for (var i = sh.length - 1; i > 0; i--) { var j = Math.floor(R() * (i + 1)), tmp = sh[i]; sh[i] = sh[j]; sh[j] = tmp; }
          pairs = []; for (var k = 0; k + 1 < sh.length; k += 2) pairs.push([sh[k], sh[k + 1]]);
        }
        pairs.forEach(function (p) {
          var a = mean[p[0]] + sd * gauss(), b = mean[p[1]] + sd * gauss();
          PF[p[0]] += a; PF[p[1]] += b;
          if (a > b) W[p[0]]++; else W[p[1]]++;
        });
      }
      var order = ids.slice().sort(function (a, b) { return W[b] - W[a] || PF[b] - PF[a]; });
      order.forEach(function (id, rank) {
        var made = rank < spots;
        if (made) res[id].po++;
        if (rank < byes) res[id].bye++;
        res[id].wins += W[id];
        var b = byWins[W[id]] || (byWins[W[id]] = [0, 0]);
        b[1]++; if (made) b[0]++;
      });
    }
    var out = {
      rows: ids.map(function (id) {
        return { id: id, w: t[id].w, l: t[id].l, po: res[id].po / N, bye: res[id].bye / N, pw: res[id].wins / N };
      }).sort(function (a, b) { return b.po - a.po || b.bye - a.bye; }),
      byWins: byWins, spots: spots, reg: reg, played: played, knownSched: knownSched
    };
    oddsCache[key] = out;
    return out;
  }

  function pct(p) {
    if (p >= 0.995 && p < 1) return ">99%";
    if (p > 0 && p < 0.005) return "<1%";
    return Math.round(p * 100) + "%";
  }

  function chartPlayoffOdds(y) {
    if (isDone(y)) return "";
    var o = playoffOdds(y);
    if (!o) return "";
    var body = '<div class="st-odds">' +
      '<div class="st-odds-row head"><span></span><span>W-L</span><span>Playoffs</span><span>Bye</span><span>Proj.</span></div>' +
      o.rows.map(function (r, i) {
        return '<div class="st-odds-row' + (i === o.spots - 1 ? " cut" : "") + '">' + who(r.id) +
          '<span class="st-odds-rec">' + r.w + "-" + r.l + "</span>" +
          '<span class="st-odds-bar"><span class="st-odds-fill" style="width:' + (r.po * 100).toFixed(1) + '%"></span><b>' + pct(r.po) + "</b></span>" +
          '<span class="st-odds-bye">' + pct(r.bye) + "</span>" +
          '<span class="st-odds-pw">' + num(r.pw, 1) + "&ndash;" + num(o.reg - r.pw, 1) + "</span></div>";
      }).join("") + "</div>";
    var sub = "10,000 simulated seasons from week " + (o.played + 1) + " to " + o.reg + ". Top " + o.spots + " make it, top 2 get a bye. " +
      (o.knownSched ? "Uses the real schedule." : "The remaining schedule isn't on file, so opponents are drawn at random.");
    return stCard("Playoff odds", sub, body);
  }

  /* What a given final record was worth across all simulations, plus the real cut lines */
  function chartWinsNeeded(y) {
    if (isDone(y)) return "";
    var o = playoffOdds(y);
    if (!o) return "";
    var ks = Object.keys(o.byWins).map(Number).sort(function (a, b) { return a - b; })
      .filter(function (k) { return o.byWins[k][1] >= 50; });
    function pr(k) { return o.byWins[k][0] / o.byWins[k][1]; }
    var lowK = ks.filter(function (k) { return pr(k) < 0.005; }).pop();
    var highK = ks.filter(function (k) { return pr(k) >= 0.995; })[0];
    ks = ks.filter(function (k) { return (lowK == null || k >= lowK) && (highK == null || k <= highK); });
    var safe = ks.filter(function (k) { return pr(k) >= 0.95; })[0];
    var body = (safe != null ? '<p class="st-need-lead"><b>' + safe + " wins</b> is the safe line: " + pct(pr(safe)) + " of those seasons ended in the playoffs.</p>" : "") +
      '<div class="st-need">' + ks.map(function (k) {
      var b = o.byWins[k], p = b[0] / b[1];
      return '<div class="st-need-c' + (p >= 0.9 ? " safe" : p >= 0.5 ? " likely" : "") + '">' +
        "<b>" + k + "</b><small>wins</small><span>" + pct(p) + "</span></div>";
    }).join("") + "</div>";
    var hist = years().filter(function (yy) { return isDone(yy); }).map(function (yy) {
      var st = ((S[yy] || {}).standings || []).slice().sort(function (a, b) { return a.rank - b.rank; });
      var last = st[o.spots - 1], out = st[o.spots];
      return last ? "In " + yy + " the last team in went " + last.w + "-" + last.l +
        (out ? ", the first team out " + out.w + "-" + out.l : "") + "." : "";
    }).filter(Boolean).join(" ");
    return stCard("How many wins are enough?",
      "Share of simulated seasons where a " + o.reg + "-week record made the playoffs." + (hist ? " " + hist : ""), body);
  }

  function renderStats() {
    var ys = years();
    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">Stats</h1>' +
      '<p class="page-kicker">How much was skill, how much was the schedule.</p></div>';
    if (!ys.length) return h + nothing("No seasons on file yet.") + "</div>";
    if (ys.indexOf(stYear) === -1) stYear = ys[0];
    h += '<div class="tabs">' + ys.map(function (y) {
      var ed = edition(y);
      return '<button type="button" class="tab has-logo' + (y === stYear ? " on" : "") + '" data-styear="' + y + '">' +
        seasonLogo(y, "tab-logo") + '<span class="tab-txt"><b>' + y + "</b><small>Buy-In Bowl" +
        (ed ? ' <span class="rn">' + ed + "</span>" : "") + "</small></span></button>";
    }).join("") + "</div>";

    var y = stYear, weekly = scoreWeeks(y).length > 0;
    if (weekly && !isDone(y)) {
      h += '<h2 class="sec">Playoff race</h2><div class="st-grid">' + chartPlayoffOdds(y) + chartWinsNeeded(y) + "</div>";
    }
    h += '<h2 class="sec">Luck and the table</h2><div class="st-grid">';
    h += chartPointsVsFinish(y);
    h += weekly ? chartLuck(y) : stCard("Luck index", "Real wins against the all-play record.",
      '<p class="st-wait">Needs weekly scores, and the ' + y + " weeks aren't on file.</p>");
    if (weekly) h += chartSchedule(y) + chartClose(y);
    h += "</div>";

    if (weekly) {
      h += '<h2 class="sec">Week by week</h2><div class="st-grid">' + chartWeekly(y) + chartConsistency(y) + chartPace(y) + chartForm(y) + "</div>";
    }

    if ((S[y] || {}).draftBoard) {
      h += '<h2 class="sec">The draft</h2><div class="st-grid">' + chartDraftSlope(y) + chartFirsts(y) + chartHeat(y) + "</div>";
    }

    return h + "</div>";
  }

  /* ---------- Drafts ---------- */
  var dYear = null;

  function draftYears() {
    return years().filter(function (y) { var d = (S[y] || {}).draftBoard; return d && d.order && d.order.length; });
  }

  /* "Ja'Marr Chase" -> "J. Chase"; defenses and single names stay as they are */
  function shortName(n, pos) {
    if (!n || /^DEF/.test(pos || "")) return n || "";
    var i = n.indexOf(" ");
    return i > 0 ? n.charAt(0) + ". " + n.slice(i + 1) : n;
  }

  function renderDrafts() {
    var ys = draftYears();
    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">Drafts</h1>' +
      '<p class="page-kicker">Who picked when, and who they took.</p></div>';
    if (!ys.length) return h + nothing("No drafts on file yet.") + "</div>";
    if (ys.indexOf(dYear) === -1) dYear = ys[0];

    h += '<div class="tabs">' + ys.map(function (y) {
      var ed = edition(y);
      return '<button type="button" class="tab has-logo' + (y === dYear ? " on" : "") + '" data-dyear="' + y + '">' +
        seasonLogo(y, "tab-logo") + '<span class="tab-txt"><b>' + y + "</b><small>Buy-In Bowl" +
        (ed ? ' <span class="rn">' + ed + "</span>" : "") + "</small></span></button>";
    }).join("") + "</div>";

    var s = S[dYear], d = s.draftBoard, meta = s.draft || {};
    var n = d.order.length, rounds = 0;
    d.order.forEach(function (id) { rounds = Math.max(rounds, (d.picks[id] || []).length); });

    if (has(meta.date) || has(meta.location)) {
      h += '<p class="dr-meta">' + [esc(meta.date || ""), esc(meta.location || "")].filter(function (x) { return x; }).join(" &middot; ") + "</p>";
    }

    /* Draft order: the round one slots */
    h += '<section class="block"><h2 class="sec">Draft order</h2><ol class="dr-order">';
    d.order.forEach(function (id, i) {
      var m = mgr(id);
      h += '<li data-profile="' + esc(id) + '" tabindex="0"><span class="dr-slot">' + (i + 1) + "</span>" +
        (has(m.face) ? '<img src="' + esc(m.face) + '" alt="">' : "") +
        '<span class="dr-who"><b>' + esc(m.name || id) + flagFor(id) + "</b><small>" + esc((m.teams || {})[dYear] || "") + "</small></span></li>";
    });
    h += "</ol></section>";

    /* The board: rounds down, teams across in draft order, snake shown by the pick numbers */
    h += '<section class="block"><h2 class="sec">Board</h2>';
    h += '<div class="dr-legend">' + ["QB", "RB", "WR", "TE", "K", "DEF"].map(function (p) {
      return '<span class="dr-p p-' + p + '">' + p + "</span>";
    }).join("") + "<span>Snake draft, " + rounds + " rounds</span></div>";
    h += '<div class="table-scroll dr-scroll"><table class="dr-board"><thead><tr><th class="dr-rh">Rd</th>';
    d.order.forEach(function (id) {
      var m = mgr(id);
      h += '<th data-profile="' + esc(id) + '">' + (has(m.face) ? '<img src="' + esc(m.face) + '" alt="">' : "") +
        "<span>" + esc(m.name || id) + "</span></th>";
    });
    h += "</tr></thead><tbody>";
    for (var r = 0; r < rounds; r++) {
      h += '<tr><th class="dr-rh">' + (r + 1) + '<span class="dr-dir">' + (r % 2 ? "&larr;" : "&rarr;") + "</span></th>";
      d.order.forEach(function (id, slot) {
        var p = (d.picks[id] || [])[r] || ["", ""];
        var overall = r * n + (r % 2 ? n - slot : slot + 1);
        var pos = String(p[1] || "").split(" ")[0];
        if (!has(p[0])) {
          h += '<td class="dr-cell empty" title="Pick ' + overall + '"><i>Missed</i><small>#' + overall + "</small></td>";
        } else {
          h += '<td class="dr-cell p-' + esc(pos) + '" title="' + esc(p[0]) + " &middot; " + esc(p[1]) + " &middot; pick " + overall + '">' +
            "<b>" + esc(shortName(p[0], p[1])) + "</b><small>" + esc(pos) + " &middot; #" + overall + "</small></td>";
        }
      });
      h += "</tr>";
    }
    h += "</tbody></table></div></section>";
    return h + "</div>";
  }

  /* ---------- Former members ---------- */
  function renderFormer() {
    var cur = years()[0];
    var list = (L.managers || []).filter(function (m) {
      return m.teams && !m.teams[cur] && Object.keys(m.teams).length;
    });
    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">Former members</h1>' +
      '<p class="page-kicker">They played, they paid in, they left their mark.</p></div>';
    if (!list.length) return h + nothing("Nobody has left the league yet.") + "</div>";
    h += '<div class="fm-grid">';
    list.forEach(function (m) {
      var ys = Object.keys(m.teams).sort();
      var car = careers("all").filter(function (r) { return r.id === m.id; })[0] || {};
      h += '<article class="fm-card" data-profile="' + esc(m.id) + '" tabindex="0">';
      h += '<div class="fm-img">' + (has(m.card) ? '<img src="' + esc(m.card) + '" alt="" loading="lazy">' : "") + "</div>";
      h += '<div class="fm-body"><div class="fm-name">' + esc(m.name || "") + flagFor(m.id) + "</div>";
      h += '<div class="fm-teams">' + ys.map(function (y) {
        var st = (S[y].standings || []).filter(function (r) { return r.manager === m.id; })[0];
        var fin = finishOf(y, m.id);
        return '<div class="fm-season"><b>' + y + "</b><span>" + esc(m.teams[y]) + "</span>" +
          (fin ? '<em>' + fin + "</em>" : "") + "</div>";
      }).join("") + "</div>";
      h += '<div class="fm-stats">' +
        '<div><small>Record</small><b>' + (car.games ? car.wins + "-" + car.losses + (car.t ? "-" + car.t : "") : "–") + "</b></div>" +
        '<div><small>Points</small><b>' + (car.pf ? Math.round(car.pf).toLocaleString("en-US") : "–") + "</b></div>" +
        "</div>";
      if (has(m.farewell)) h += '<p class="fm-note">' + esc(m.farewell) + "</p>";
      h += "</div></article>";
    });
    return h + "</div></div>";
  }

  /* Final place of a manager in a finished season, e.g. "5th of 10" */
  function finishOf(y, id) {
    if (!isDone(y)) return "";
    var s = S[y], n = (s.standings || []).length;
    var pod = podiumOf(y);
    var i = pod.indexOf(id);
    if (i !== -1) return ["Champion", "2nd", "3rd"][i] + " of " + n;
    if (s.lastPlace && s.lastPlace.manager === id) return "Last of " + n;
    var car = careers(String(y)).filter(function (r) { return r.id === id; })[0];
    return car && car.place && car.place < 999 ? ordinal(car.place) + " of " + n : "";
  }
  function ordinal(n) {
    var s = ["th", "st", "nd", "rd"], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  /* ---------- Home: if the season ended today ---------- */
  function ifSeasonEnded() {
    var y = years()[0], s = S[y] || {};
    if (isDone(y)) return "";
    var st = (s.standings || []).slice().sort(function (a, b) { return a.rank - b.rank; });
    var spots = ((L.format || {}).playoffTeams) || 6;
    if (st.length < spots) return "";
    var wk = weeksPlayed(y);
    if (!wk) return "";
    var pw = (s.playoffs || {}).weeks || {};
    var seed = st.slice(0, spots);
    var odds = scoreWeeks(y).length ? playoffOdds(y) : null;
    var oddsOf = {};
    if (odds) odds.rows.forEach(function (r) { oddsOf[r.id] = r.po; });

    function team(r, n, bye) {
      var m = mgr(r.manager);
      return '<div class="ie-row" data-profile="' + esc(r.manager) + '"><span class="ie-seed">' + n + "</span>" +
        (has(m.face) ? '<img src="' + esc(m.face) + '" alt="">' : "") +
        '<span class="ie-nm"><b>' + esc(m.name || r.team) + "</b><small>" + esc(r.team) + "</small></span>" +
        (bye ? '<span class="ie-bye">Bye</span>' : "") +
        '<span class="ie-rec">' + r.w + "-" + r.l + (r.t ? "-" + r.t : "") + "</span></div>";
    }
    function tbd(txt) { return '<div class="ie-row tbd"><span class="ie-seed"></span><span class="ie-nm"><b>' + txt + "</b></span></div>"; }
    function game(a, b) { return '<div class="ie-game">' + a + b + "</div>"; }

    var h = '<div class="wrap"><section class="block ie">';
    h += '<h2 class="sec">If the season ended today</h2>';
    h += '<p class="ie-sub">Seeds after week ' + wk + ". Top " + spots + " make the playoffs, the top two sit out the first round.</p>";
    h += '<div class="ie-cols">';

    h += '<div class="ie-col"><div class="ie-head"><b>Quarterfinals</b><span>Week ' + (pw.Quarterfinals || 15) + "</span></div>";
    h += game(team(seed[2], 3), team(seed[5], 6)) + game(team(seed[3], 4), team(seed[4], 5));
    h += "</div>";

    h += '<div class="ie-col"><div class="ie-head"><b>Semifinals</b><span>Week ' + (pw.Semifinals || 16) + "</span></div>";
    h += game(team(seed[0], 1, true), tbd("Winner 4 vs 5")) + game(team(seed[1], 2, true), tbd("Winner 3 vs 6"));
    h += '<div class="ie-head ie-fin"><b>Final</b><span>Week ' + (pw.Final || 17) + "</span></div>";
    h += '<div class="ie-game final">' + tbd("Two semifinal winners") + "</div></div>";

    /* The first teams on the outside */
    var out = st.slice(spots, spots + 2), last = seed[spots - 1];
    if (out.length) {
      h += '<div class="ie-col ie-out"><div class="ie-head"><b>On the outside</b><span>Chasing seed ' + spots + "</span></div>";
      out.forEach(function (r, i) {
        var gap = (last.w - r.w);
        var note = gap > 0 ? gap + (gap === 1 ? " win" : " wins") + " behind " + esc(mgr(last.manager).name || last.team)
          : "Level on wins, " + num(Math.max(0, last.pf - r.pf), 2) + " points behind";
        h += '<div class="ie-game out">' + team(r, spots + 1 + i) + '<div class="ie-note">' + note +
          (oddsOf[r.manager] != null ? " &middot; playoff odds " + pct(oddsOf[r.manager]) : "") + "</div></div>";
      });
      h += "</div>";
    }
    h += "</div></section></div>";
    return h;
  }

  /* ---------- Wall of Shame ---------- */
  function weeksPlayed(y) {
    var first = ((S[y] || {}).standings || [])[0];
    return first ? (+first.w || 0) + (+first.l || 0) + (+first.t || 0) : 0;
  }

  /* Fewest points in the regular season — the counterpart to most points */
  function fewestPoints(y) {
    var low = null;
    ((S[y] || {}).standings || []).forEach(function (r) {
      if (r.pf === undefined || r.pf === null || r.pf === "") return;
      if (!low || +r.pf < +low.pf) low = r;
    });
    return low;
  }

  /* The possible punishments, shown inside the portrait frame of the running season */
  function punishMenu(y) {
    var opts = [];
    ((S[y] || {}).stakes || []).forEach(function (st) {
      (st.body || []).forEach(function (b) {
        var m = /^(\d+)\s*[—–-]\s*([^:]+):/.exec(b);
        if (m) opts.push({ n: m[1], title: m[2] });
      });
    });
    if (!opts.length) return '<div class="cc-portrait cc-q"><span>?</span></div>';
    return '<div class="cc-portrait sc-menu"><div class="sc-menu-k">Possible punishments</div>' +
      opts.map(function (o) {
        return '<div class="sc-menu-o"><span>' + esc(o.n) + "</span>" + esc(o.title) + "</div>";
      }).join("") + "</div>";
  }

  function renderShame() {
    var h = '<div class="wrap page shame-page">';
    h += '<div class="page-head"><h1 class="page-title">Wall of Shame</h1>' +
      '<p class="page-kicker">Every last place, and what it cost them.</p></div>';

    if (!years().length) return h + nothing("No seasons on file yet.") + "</div>";

    var done = years().filter(function (y) { var lp = S[y].lastPlace; return lp && has(lp.team); });

    h += '<div class="cc-row">';
    years().slice().sort(function (a, b) { return a - b; }).forEach(function (yy) {
      var s = S[yy], lp = s.lastPlace, n = (s.standings || []).length || 10;
      var ed = edition(yy);
      h += '<div class="cc-col">';

      if (!(lp && has(lp.team) && lp.manager)) {
        /* Running season: nobody sentenced yet, but somebody is holding the spot */
        var bottom = (s.standings || []).slice().sort(function (a, b) { return b.rank - a.rank; })[0];
        var wk = weeksPlayed(yy);
        h += '<div class="shamecard tbd"><div class="cc-year">' + yy + "</div>" +
          '<div class="sc-ribbon"><span>Last place</span></div>' +
          '<div class="cc-inner">' + punishMenu(yy) +
          '<div class="cc-first">To be decided</div><div class="cc-team">TBD</div></div>';
        if (bottom && wk) {
          var bm = mgr(bottom.manager);
          h += '<div class="sc-hook" data-profile="' + esc(bottom.manager) + '" tabindex="0">' +
            (has(bm.face) ? '<img src="' + esc(bm.face) + '" alt="">' : "") +
            '<span><small>On the hook after week ' + wk + "</small>" +
            "<b>" + esc(bm.name || bottom.team) + flagFor(bottom.manager) + "</b>" +
            esc(bottom.team) + " &middot; " + bottom.w + "-" + bottom.l + (bottom.t ? "-" + bottom.t : "") + "</span></div>";
        } else {
          h += '<div class="cc-note">Sentenced in<br>week ' + (((s.playoffs || {}).weeks || {}).Final || 17) + "</div>";
        }
        h += "</div></div>";
        return;
      }

      var mm = mgr(lp.manager);
      var rec = seasonRecord(yy, lp.manager);
      var img = has(lp.image) ? lp.image : has(mm.portrait) ? mm.portrait : (mm.card || mm.avatar);
      h += '<div class="shamecard">';
      h += '<div class="cc-year">' + yy + "</div>";
      h += '<div class="sc-ribbon"><span>Last place</span></div>';
      h += '<div class="cc-inner" data-profile="' + lp.manager + '">';
      if (has(img)) {
        h += '<div class="cc-portrait"><img src="' + esc(img) + '" alt=""></div>';
      }
      h += '<div class="cc-first">' + esc(mm.name || "") + flagFor(lp.manager) + "</div>";
      h += '<div class="cc-team">' + esc(lp.team) + "</div></div>";
      h += '<div class="sc-sentence"><div class="cc-k">The sentence</div>' +
        (has(lp.punishment) ? '<div class="sc-p">' + esc(lp.punishment) + "</div>"
          : '<div class="sc-p none">Not on file</div>') +
        (has(lp.proof) ? '<div class="sc-proof"><img src="' + esc(lp.proof) + '" alt="Proof"></div>' : "") + "</div>";
      h += '<div class="cc-stats">' +
        '<div class="cc-stat"><div class="cc-k">Record</div><div class="cc-v">' +
          (rec ? rec.wins + "-" + rec.losses + (rec.t ? "-" + rec.t : "") : "–") + "</div></div>" +
        '<div class="cc-stat"><div class="cc-k">Avg points</div><div class="cc-v">' +
          (function () {
            var r = (s.standings || []).filter(function (x) { return x.manager === lp.manager; })[0];
            var g = r ? (+r.w || 0) + (+r.l || 0) + (+r.t || 0) : 0;
            return g && r.pf ? (+r.pf / g).toFixed(1) : "–";
          })() + "</div></div></div>";
      if (has(lp.note)) h += '<div class="cc-note">' + esc(lp.note) + "</div>";
      h += "</div></div>";
    });
    h += "</div>";

    if (!done.length) return h + "</div>";

    /* One row per finished season */
    h += '<section class="block"><h2 class="sec">Season bottoms</h2>';
    h += '<div class="table-scroll"><table class="champs-table shame-table"><thead><tr>' +
      "<th>Year</th><th>Last place</th><th>Fewest points</th><th>Sentence</th></tr></thead><tbody>";
    done.slice().sort(function (a, b) { return b - a; }).forEach(function (yy) {
      var lp = S[yy].lastPlace, low = fewestPoints(yy);
      function cell(id, sub) {
        if (!id) return "<td>–</td>";
        var mm = mgr(id);
        return '<td><div class="cwho">' +
          (has(mm.face || mm.avatar) ? '<img class="avatar" src="' + esc(mm.face || mm.avatar) + '" alt="">' : "") +
          '<span class="mtxt"><span class="mname">' + esc(mm.name || id) + flagFor(id) + "</span>" +
          '<span class="mteam">' + sub + "</span></span></div></td>";
      }
      var ed = edition(yy);
      var lowId = low ? (low.manager || teamManager(yy, low.team)) : null;
      h += '<tr><td class="cyear"><b>' + yy + "</b>" + (ed ? '<span class="bb">Buy-In Bowl <span class="rn">' + ed + "</span></span>" : "") + "</td>" +
        cell(lp.manager, esc(lp.team)) +
        cell(lowId, low ? num(low.pf, 2) + " pts" : "") +
        "<td>" + (has(lp.punishment) ? esc(lp.punishment) : '<span class="muted">Not on file</span>') + "</td></tr>";
    });
    h += "</tbody></table></div></section>";

    return h + "</div>";
  }

  /* ---------- Records ---------- */
  function isDone(y) { var s = S[y]; return s && s.status !== "live" && s.status !== "laufend"; }

  /* every game with a final score: weekly matchups and playoffs */
  function allGames() {
    var out = [];
    years().forEach(function (y) {
      var s = S[y];
      (s.weeks || []).forEach(function (w) {
        (w.matchups || []).forEach(function (m) {
          if (m.homeScore == null || m.awayScore == null) return;
          out.push({ y: y, when: "Week " + w.week + ", " + y, a: m.home, as: +m.homeScore, b: m.away, bs: +m.awayScore });
        });
      });
      var po = s.playoffs || {};
      (po.games || []).forEach(function (g) {
        if (g.homeScore == null || g.awayScore == null) return;
        var wk = (po.weeks || {})[g.round];
        out.push({ y: y, when: g.round + (wk ? " (Week " + wk + ")" : "") + ", " + y,
          a: g.home, as: +g.homeScore, b: g.away, bs: +g.awayScore });
      });
    });
    return out;
  }

  function recCard(title, value, ids, when, detail, fmt) {
    ids = [].concat(ids || []).filter(function (x) { return x; });
    var who = ids.map(function (id) {
      var m = mgr(id);
      var img = m.face || m.avatar;
      return '<div class="rc-who" data-profile="' + id + '">' +
        (has(img) ? '<img class="avatar" src="' + esc(img) + '" alt="">' : "") +
        '<span class="mtxt"><span class="mname">' + esc(m.name || id) + flagFor(id) + "</span>" +
        '<span class="mteam">' + esc(teamOf(id, when)) + "</span></span></div>";
    }).join("");
    var v = typeof value === "number" ? (fmt === 0 ? String(value) : num(value, fmt === undefined ? 2 : fmt)) : value;
    return '<div class="rc"><div class="rc-t">' + esc(title) + '</div><div class="rc-v">' + v + "</div>" + who +
      (when || detail ? '<div class="rc-when">' + [esc(when || ""), esc(detail || "")].filter(function (x) { return x; }).join(" · ") + "</div>" : "") +
      "</div>";
  }

  /* team name a manager had in the season mentioned in "when" */
  function teamOf(id, when) {
    var m = mgr(id), yrs = Object.keys(m.teams || {}).sort();
    var hit = String(when || "").match(/(20\d\d)/);
    if (hit && m.teams && m.teams[hit[1]]) return m.teams[hit[1]];
    return yrs.length ? m.teams[yrs[yrs.length - 1]] : "";
  }

  function book(key) { return (L.records || []).filter(function (r) { return r.key === key; })[0]; }

  function renderRecords() {
    var h = '<div class="wrap page">';
    h += '<div class="page-head"><h1 class="page-title">Records</h1>' +
      '<p class="page-kicker">The best, the worst and the closest. Tap a name for the profile.</p></div>';

    /* --- single game --- */
    var games = allGames(), hi = null, lo = null, big = null, close = null;
    games.forEach(function (g) {
      [[g.a, g.as], [g.b, g.bs]].forEach(function (p) {
        if (!hi || p[1] > hi.v) hi = { v: p[1], team: p[0], y: g.y, when: g.when };
        if (!lo || p[1] < lo.v) lo = { v: p[1], team: p[0], y: g.y, when: g.when };
      });
      var diff = Math.abs(g.as - g.bs), win = g.as > g.bs ? g.a : g.b, lose = g.as > g.bs ? g.b : g.a;
      if (!big || diff > big.v) big = { v: diff, team: win, opp: lose, y: g.y, when: g.when };
      if (!close || diff < close.v) close = { v: diff, team: win, opp: lose, y: g.y, when: g.when };
    });
    function fromGame(r) { return r ? teamManager(r.y, r.team) : null; }
    var bB = book("blowout"), bC = book("closest");
    var blow = bB && (!big || bB.value >= big.v) ? { v: bB.value, id: bB.manager, when: bB.when, d: bB.detail }
      : big ? { v: big.v, id: fromGame(big), when: big.when, d: "over " + big.opp } : null;
    var clos = bC && (!close || bC.value <= close.v) ? { v: bC.value, id: bC.manager, when: bC.when, d: bC.detail }
      : close ? { v: close.v, id: fromGame(close), when: close.when, d: "over " + close.opp } : null;

    h += '<section class="block"><h2 class="sec">Single game</h2><div class="rc-grid">';
    if (hi) h += recCard("Highest score", hi.v, fromGame(hi), hi.when, "");
    if (lo) h += recCard("Lowest score", lo.v, fromGame(lo), lo.when, "");
    if (blow) h += recCard("Biggest blowout", blow.v, blow.id, blow.when, blow.d);
    if (clos) h += recCard("Closest game", clos.v, clos.id, clos.when, clos.d);
    h += "</div>";
    h += '<p class="hint">Weekly scores are on file from 2026 on. Blowout and closest game include Yahoo\'s record book for 2025.</p></section>';

    /* --- season (completed seasons only) --- */
    var done = years().filter(isDone);
    var mostPf = null, leastPf = null, mostW = null, mostL = null;
    done.forEach(function (y) {
      (S[y].standings || []).forEach(function (r) {
        var pf = +r.pf || 0;
        if (!mostPf || pf > mostPf.v) mostPf = { v: pf, id: r.manager, y: y };
        if (!leastPf || pf < leastPf.v) leastPf = { v: pf, id: r.manager, y: y };
      });
      careers(String(y)).forEach(function (r) {
        if (!mostW || r.wins > mostW.v) mostW = { v: r.wins, id: r.id, y: y, rec: r.wins + "-" + r.losses };
        if (!mostL || r.losses > mostL.v) mostL = { v: r.losses, id: r.id, y: y, rec: r.wins + "-" + r.losses };
      });
    });
    h += '<section class="block"><h2 class="sec">Season</h2><div class="rc-grid">';
    if (mostW) h += recCard("Most wins", mostW.v, mostW.id, String(mostW.y), mostW.rec + " incl. playoffs", 0);
    if (mostL) h += recCard("Most losses", mostL.v, mostL.id, String(mostL.y), mostL.rec + " incl. playoffs", 0);
    ["winstreak", "losestreak"].forEach(function (k) {
      var b = book(k);
      if (b) h += recCard(k === "winstreak" ? "Longest win streak" : "Longest losing streak", b.value, b.manager, b.when, b.detail, 0);
    });
    if (mostPf) h += recCard("Most points, regular season", mostPf.v, mostPf.id, String(mostPf.y), "");
    if (leastPf) h += recCard("Fewest points, regular season", leastPf.v, leastPf.id, String(leastPf.y), "");
    var mv = book("moves");
    if (mv) h += recCard("Most moves, season", mv.value, mv.manager, mv.when, mv.detail, 0);
    ["hardsched", "easysched"].forEach(function (k) {
      var b = book(k);
      if (b) h += recCard(k === "hardsched" ? "Hardest schedule" : "Easiest schedule", b.value, b.manager, b.when, b.detail);
    });
    h += "</div></section>";

    /* --- most points per season (the medal) --- */
    h += '<section class="block"><h2 class="sec">Most points per season</h2>';
    h += '<div class="table-scroll"><table class="champs-table"><thead><tr><th>Year</th><th>Winner</th>' +
      '<th class="num">Points</th></tr></thead><tbody>';
    years().slice().sort(function (a, b) { return b - a; }).forEach(function (y) {
      var pl = S[y].pointsLeader, ed = edition(y);
      var yc = '<td class="cyear"><b>' + y + "</b>" + (ed ? '<span class="bb">Buy-In Bowl <span class="rn">' + ed + "</span></span>" : "") + "</td>";
      if (pl && has(pl.team)) {
        var id = pl.manager || teamManager(y, pl.team), mm = mgr(id);
        h += "<tr>" + yc + '<td><div class="cwho" data-profile="' + id + '"><span class="rc-medal">' + medalSvg() + "</span>" +
          (has(mm.face || mm.avatar) ? '<img class="avatar" src="' + esc(mm.face || mm.avatar) + '" alt="">' : "") +
          '<span class="mtxt"><span class="mname">' + esc(mm.name || id) + flagFor(id) + '</span><span class="mteam">' +
          esc(pl.team) + '</span></span></div></td><td class="num">' + (pl.points ? num(pl.points, 2) : "–") + "</td></tr>";
      } else {
        h += "<tr>" + yc + '<td class="tbd-cell">To be decided after the regular season</td><td class="num">–</td></tr>';
      }
    });
    h += "</tbody></table></div></section>";

    /* --- all-time --- */
    var car = careers("all");
    function top(key, low) {
      var best = null;
      car.forEach(function (r) {
        if (key === "pct" && r.games < 10) return;
        var v = r[key] || 0;
        if (!best || (low ? v < best.v : v > best.v)) best = { v: v, id: r.id, r: r };
      });
      return best;
    }
    var tT = top("titles"), tW = top("wins"), tP = top("pf"), tPct = top("pct");
    h += '<section class="block"><h2 class="sec">All-time</h2><div class="rc-grid">';
    if (tT && tT.v) h += recCard("Most titles", tT.v, tT.id, "", "", 0);
    if (tW) h += recCard("Most wins", tW.v, tW.id, "", tW.r.wins + "-" + tW.r.losses + " incl. playoffs", 0);
    if (tPct) h += recCard("Best win rate", (tPct.v * 100).toFixed(1) + "%", tPct.id, "", tPct.r.games + " games");
    if (tP) h += recCard("Most points", tP.v, tP.id, "", tP.r.seasons + (tP.r.seasons === 1 ? " season" : " seasons"));
    h += "</div>";
    h += '<p class="hint">All-time includes the current season.</p></section>';

    return h + "</div>";
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
    wireCoins();
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
    current = ["table", "champions", "shame", "records", "stats", "drafts", "former"].indexOf(route) !== -1 ? route : "home";
    root.innerHTML = current === "table" ? renderTable() :
                     current === "champions" ? renderChampions() :
                     current === "shame" ? renderShame() :
                     current === "stats" ? renderStats() :
                     current === "drafts" ? renderDrafts() :
                     current === "former" ? renderFormer() :
                     current === "records" ? renderRecords() : renderLanding();
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
      history.replaceState(null, "", route === "home" ? "#/" : "#/" + route);
    } catch (e) { /* sandboxed */ }
  }

  function routeFromHash() {
    var hh = location.hash || "";
    return /#\/table/.test(hh) ? "table" : /#\/champions/.test(hh) ? "champions" :
           /#\/records/.test(hh) ? "records" : /#\/shame/.test(hh) ? "shame" :
           /#\/stats/.test(hh) ? "stats" : /#\/drafts/.test(hh) ? "drafts" : /#\/former/.test(hh) ? "former" : "home";
  }

  document.addEventListener("click", function (e) {
    var el = e.target;
    if (!el || !el.closest) return;

    var pf = el.closest("[data-profile]");
    if (pf) { e.preventDefault(); openProfile(pf.getAttribute("data-profile")); return; }

    var r = el.closest("[data-route]");
    if (r) {
      e.preventDefault();
      if (r.getAttribute("data-tab")) { mTab = r.getAttribute("data-tab"); mSort = defaultSort(mTab); }
      navigate(r.getAttribute("data-route"));
      return;
    }

    var sy = el.closest("[data-styear]");
    if (sy) { e.preventDefault(); stYear = +sy.getAttribute("data-styear"); stFocus = null; render(current, true); return; }

    var sf = el.closest("[data-stfocus]");
    if (sf) { e.preventDefault(); var f = sf.getAttribute("data-stfocus"); stFocus = stFocus === f ? null : f; render(current, true); return; }

    var dy = el.closest("[data-dyear]");
    if (dy) { e.preventDefault(); dYear = +dy.getAttribute("data-dyear"); render(current, true); return; }

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
      '<button type="button" data-route="shame">Shame</button>' +
      '<button type="button" data-route="records">Records</button>' +
      '<button type="button" data-route="table">All-time</button>' +
      '<button type="button" data-route="stats">Stats</button>' +
      '<button type="button" data-route="drafts">Drafts</button>' +
      '<button type="button" data-route="former">Former</button>';
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
      if (current === "stats") render("stats", true);
    }, 250);
  });

  window.addEventListener("hashchange", function () { render(routeFromHash()); });
  buildNav();
  render(routeFromHash());
})();
