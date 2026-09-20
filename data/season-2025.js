/* ============================================================
   SEASON 2025 — "The Buy-In Bowl I"
   To be backfilled. Anything you can't find stays empty —
   the site marks gaps as open, nothing breaks.

   Where to get it:
   - Yahoo app > League > History > 2025
   - Standings, playoff bracket and draft results live there
   - League chat: scroll back and screenshot the good lines,
     those can't be reconstructed later
   ============================================================ */

window.SEASONS = window.SEASONS || {};
window.SEASONS[2025] = {
  year: 2025,
  title: "The Buy-In Bowl I",
  status: "complete",
  logo: "media/season-2025.png",

  champion: {
    team: "Handegg United",
    manager: "johannes",
    record: "10-4, 2 seed",
    note: "$1,500 and the Buy-In Bowl I Championship Ring"
  },
  runnerUp: { team: "HutMessXpress", manager: "hutmess" },
  lastPlace: { team: "TUSH PUSH", manager: "tush", punishment: "" },
  pointsLeader: { team: "Twerk", points: 1668.82 },

  recap: "Won from the 2 seed, 120.03 to 107.76 over HutMessXpress in the final.",

  // 14-game regular season, 10 teams, playoffs weeks 15-17.
  // Yahoo's record book counts playoff games, so its totals run higher than the standings below.

  draft: { date: "", location: "", notes: "", highlights: [] },

  standings: [
    { rank: 1, team: "Handegg United", manager: "johannes", w: 10, l: 4, t: 0, pf: 1508.32 },
    { rank: 2, team: "HutMessXpress", manager: "hutmess", w: 7, l: 7, t: 0, pf: 1573.16 },
    { rank: 3, team: "Twerk", manager: "twerk", w: 7, l: 7, t: 0, pf: 1668.82 },
    { rank: 4, team: "Cee Dees TeeDees", manager: "ceedee", w: 10, l: 4, t: 0, pf: 1592.36 },
    { rank: 5, team: "Gin&Jukes", manager: "gin", w: 8, l: 6, t: 0, pf: 1523.42 },
    { rank: 6, team: "Touchdown Domination", manager: "td", w: 7, l: 7, t: 0, pf: 1623.72 },
    { rank: 7, team: "Take Me To Dinner First", manager: "dinner", w: 6, l: 8, t: 0, pf: 1507.24 },
    { rank: 8, team: "Gamble Play Jason", manager: "jason", w: 2, l: 12, t: 0, pf: 1354.52 },
    { rank: 9, team: "David hat grosse manschaft", manager: "nathan", w: 7, l: 7, t: 0, pf: 1566.46 },
    { rank: 10, team: "TUSH PUSH", manager: "tush", w: 6, l: 8, t: 0, pf: 1536.24 }
  ],

  playoffs: {
    order: ["Quarterfinals", "Semifinals", "Final"],
    byes: { Quarterfinals: ["Cee Dees TeeDees", "Handegg United"] },
    thirdPlaceRound: "Third place",
    games: [
      { round: "Quarterfinals", home: "Gin&Jukes", away: "Twerk",
        homeScore: null, awayScore: null, winner: "Twerk" },
      { round: "Quarterfinals", home: "Touchdown Domination", away: "HutMessXpress",
        homeScore: null, awayScore: null, winner: "HutMessXpress" },
      { round: "Semifinals", home: "Handegg United", away: "Twerk",
        homeScore: null, awayScore: null, winner: "Handegg United" },
      { round: "Semifinals", home: "HutMessXpress", away: "Cee Dees TeeDees",
        homeScore: null, awayScore: null, winner: "HutMessXpress" },
      { round: "Final", home: "HutMessXpress", away: "Handegg United",
        homeScore: 107.76, awayScore: 120.03, winner: "Handegg United" },
      { round: "Third place", home: "Twerk", away: "Cee Dees TeeDees",
        homeScore: 121.35, awayScore: 120.98, winner: "Twerk" }
    ]
  },

  weeks: [
    // { week: 1, headline: "", matchups: [{ home:"", away:"", homeScore:0, awayScore:0 }], notes: [], quotes: [] }
  ],

  stakes: [
    {
      title: "Notes on the bracket",
      body: [
        "Byes into the semifinals: Cee Dees TeeDees (1 seed) and Handegg United (2 seed)",
        "Consolation bracket seeds 7-10: David hat grosse manschaft, TUSH PUSH, Take Me To Dinner First, Gamble Play Jason",
        "Final placing came out of the brackets, not the records — Gamble Play Jason went 2-12 and still finished 8th",
        "Semifinals reconstructed from the bracket: Handegg beat Twerk, HutMessXpress beat Cee Dees. Scores still missing."
      ]
    }
  ],
  trades: [],
  awards: [],
  quotes: [],
  gallery: [],
  rosters: []
};
