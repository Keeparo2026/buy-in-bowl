/* ============================================================
   LEAGUE MASTER DATA
   Rarely changes. Empty strings / null = still open.
   ============================================================ */

window.LEAGUE = {
  name: "The Buy-In Bowl",
  claim: "Ten managers. Three continents. $2,500 on the table.",
  platform: "Yahoo Fantasy Football",
  founded: 2025,
  teamCount: 10,
  commissioner: "Gin&Jukes",

  /* LANDING PAGE — fill this in and the front page uses it.
     Leave empty and it falls back to the claim above. */
  landing: {
    headline: "",          // big line at the top
    intro: "",             // one or two sentences underneath
    highlights: [],        // short bullets, e.g. ["Since 2025", "10 managers"]
    image: ""              // optional, e.g. "media/league-photo.jpg"
  },

  format: {
    starter: "QB / RB / RB / WR / WR / TE / W-R-T / K / DEF",
    bench: 6,
    scoring: "",
    playoffTeams: 6
  },

  money: {
    buyIn: "$250",
    pot: "$2,500",
    collection: [
      "Collected by the commissioner via Venmo or PayPal",
      "Paid out at the end of the season",
      "Cash was a problem in Season I — too many countries"
    ],
    payouts: [
      { place: "1st", amount: "$1,500 + Championship Ring" },
      { place: "2nd", amount: "$500" },
      { place: "3rd", amount: "$250" },
      { place: "Most points, regular season", amount: "$250" }
    ]
  },

  /* Rules. Keep every line short — bullets, not paragraphs. */
  rules: [
    {
      title: "Keeper rule, since 2026",
      body: [
        "Keep one player from your final roster each year",
        "First keep costs the round he was drafted in",
        "Each consecutive year the cost drops one round",
        "Example: R1 pick in 2026 → R1 in 2027, R2 in 2028, R3 in 2029",
        "2026 was year one, so the draft itself was a clean slate"
      ]
    },
    {
      title: "Money",
      body: [
        "$250 buy-in per manager",
        "Venmo or PayPal, settled after the season"
      ]
    }
  ],

  /* Managers. id is referenced from the season files.
     name = real name (still to fill in), teams = team name per season. */
  managers: [
    { id: "johannes", country: "DE", name: "Johannes", teams: { 2025: "Handegg United", 2026: "Handegg United" }, avatar: "media/jersey-johannes.jpg", card: "media/card-johannes.jpg", portrait: "media/portrait-johannes.jpg", color: "#2F6B3F", face: "media/face-johannes.jpg" },
    { id: "gin", role: "Commissioner", country: "US", name: "David", teams: { 2025: "Gin&Jukes", 2026: "Gin&Jukes" }, avatar: "media/jersey-gin.jpg", card: "media/card-gin.jpg", portrait: "media/portrait-gin.jpg", color: "#E07A2E", face: "media/face-gin.jpg", note: "Commissioner, based in Djibouti" },
    { id: "hutmess", country: "US", name: "Jessica", teams: { 2025: "HutMessXpress", 2026: "HutMessXpress" }, avatar: "media/jersey-hutmess.jpg", card: "media/card-hutmess.jpg", portrait: "media/portrait-hutmess.jpg", color: "#C8413B", face: "media/face-hutmess.jpg" },
    { id: "twerk", country: "US", name: "Jaina", teams: { 2025: "Twerk", 2026: "Twerk" }, avatar: "media/jersey-twerk.jpg", card: "media/card-twerk.jpg", portrait: "media/portrait-twerk.jpg", color: "#8C7B6B", face: "media/face-twerk.jpg" },
    { id: "ceedee", country: "DE", name: "Malte", teams: { 2025: "Cee Dees TeeDees", 2026: "Cee Dees TeeDees" }, avatar: "media/jersey-ceedee.jpg", card: "media/card-ceedee.jpg", portrait: "media/portrait-ceedee.jpg", color: "#7A4A2A", face: "media/face-ceedee.jpg" },
    { id: "dinner", country: "US", name: "Michael", teams: { 2025: "Take Me To Dinner First", 2026: "Take Me To Dinner First" }, avatar: "media/jersey-dinner.jpg", card: "media/card-dinner.jpg", portrait: "media/portrait-dinner.jpg", color: "#E3A21A", face: "media/face-dinner.jpg" },
    { id: "tush", country: "US", name: "Adam", teams: { 2025: "TUSH PUSH", 2026: "TUSH PUSH" }, avatar: "media/jersey-tush.jpg", card: "media/card-tush.jpg", portrait: "media/portrait-tush.jpg", color: "#2C3E73", face: "media/face-tush.jpg" },
    { id: "nathan", country: "US", name: "Nathan", teams: { 2025: "David hat grosse manschaft", 2026: "Luckyballzz7" }, avatar: "media/jersey-nathan.jpg", card: "media/card-nathan.jpg", portrait: "media/portrait-nathan.jpg", color: "#3A3A3A", face: "media/face-nathan.jpg", note: "Renamed the team after season one; ran as David hat scheisse... mid-2025" },
    { id: "isaac", country: "US", name: "Isaac", teams: { 2026: "Rush Mode Isaac" }, avatar: "media/jersey-isaac.jpg", card: "media/card-isaac.jpg", portrait: "media/portrait-isaac.jpg", color: "#6D3FB5", face: "media/face-isaac.jpg" },
    { id: "julius", country: "DE", name: "Julius", teams: { 2026: "Julius's Juicemen" }, avatar: "media/jersey-julius.jpg", card: "media/card-julius.jpg", portrait: "media/portrait-julius.jpg", color: "#8DBA2C", face: "media/face-julius.jpg" },
    { id: "jason", country: "US", name: "Jason", teams: { 2025: "Gamble Play Jason" }, avatar: "media/jersey-jason.jpg", card: "media/card-jason.jpg", portrait: "media/portrait-jason.jpg", face: "media/face-jason.jpg", color: "#B06A35", note: "2-12 in 2025" },
    { id: "td", country: "US", name: "John", teams: { 2025: "Touchdown Domination" }, avatar: "media/jersey-td.jpg", card: "media/card-td.jpg", portrait: "media/portrait-td.jpg", face: "media/face-td.jpg", color: "#9AA3AD" }
  ],

  /* Records from Yahoo's record book that can't be computed from our data.
     Everything else (high scores, season points, all-time marks) is computed live.
     If a computed value beats one of these, the computed one wins automatically. */
  records: [
    { key: "blowout", value: 69.56, manager: "hutmess", when: "Week 6, 2025", detail: "over Handegg United" },
    { key: "closest", value: 1.34, manager: "twerk", when: "Week 12, 2025", detail: "over HutMessXpress" },
    { key: "winstreak", value: 5, manager: ["gin", "ceedee"], when: "2025" },
    { key: "losestreak", value: 7, manager: "jason", when: "2025" },
    { key: "hardsched", value: 117.49, manager: "twerk", when: "2025", detail: "opponent points per week" },
    { key: "easysched", value: 100.66, manager: "ceedee", when: "2025", detail: "opponent points per week" }
  ]
};
