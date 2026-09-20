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
    playoffTeams: null
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
    { id: "johannes", name: "Johannes", teams: { 2025: "Handegg United", 2026: "Handegg United" }, avatar: "media/mgr-johannes.jpg" },
    { id: "gin", name: "David", teams: { 2025: "Gin&Jukes", 2026: "Gin&Jukes" }, avatar: "media/mgr-gin.jpg", note: "Commissioner, based in Djibouti" },
    { id: "hutmess", name: "Jessica", teams: { 2025: "HutMessXpress", 2026: "HutMessXpress" }, avatar: "media/mgr-hutmess.jpg" },
    { id: "twerk", name: "Jaina", teams: { 2025: "Twerk", 2026: "Twerk" }, avatar: "media/mgr-twerk.jpg" },
    { id: "ceedee", name: "Malte", teams: { 2025: "Cee Dees TeeDees", 2026: "Cee Dees TeeDees" }, avatar: "media/mgr-ceedee.jpg" },
    { id: "dinner", name: "Michael", teams: { 2025: "Take Me To Dinner First", 2026: "Take Me To Dinner First" }, avatar: "media/mgr-dinner.jpg" },
    { id: "tush", name: "Adam", teams: { 2025: "TUSH PUSH", 2026: "TUSH PUSH" }, avatar: "media/mgr-tush.jpg" },
    { id: "nathan", name: "Nathan", teams: { 2025: "David hat grosse manschaft", 2026: "Luckyballzz7" }, avatar: "media/mgr-nathan.jpg", note: "Renamed the team after season one; ran as David hat scheisse... mid-2025" },
    { id: "isaac", name: "Isaac", teams: { 2026: "Rush Mode Isaac" }, avatar: "media/mgr-isaac.jpg" },
    { id: "julius", name: "Julius", teams: { 2026: "Julius's Juicemen" }, avatar: "media/mgr-julius.jpg" },
    { id: "jason", name: "Jason", teams: { 2025: "Gamble Play Jason" }, avatar: "media/mgr-jason.jpg", note: "2-12 in 2025" },
    { id: "td", name: "John", teams: { 2025: "Touchdown Domination" }, avatar: "media/mgr-td.jpg" }
  ],

  /* All-time record book. Source: Yahoo > League > Record Book.
     Only all-time entries belong here — current-season records change weekly. */
  recordBook: {
    note: "All-time, through the end of Season 2025. Yahoo counts playoff games here, so totals run higher than the season standings.",
    groups: [
      {
        title: "Wins",
        rows: [
          { record: "Most wins in a season", holder: "Handegg United, 2025", value: "12" },
          { record: "Longest win streak", holder: "Gin&Jukes 2025, Cee Dees TeeDees 2025", value: "5" }
        ]
      },
      {
        title: "Losses",
        rows: [
          { record: "Most losses in a season", holder: "Gamble Play Jason, 2025", value: "13" },
          { record: "Longest losing streak", holder: "Gamble Play Jason, 2025", value: "7" }
        ]
      },
      {
        title: "Margin of victory",
        rows: [
          { record: "Largest, single week", holder: "HutMessXpress over Handegg United, Week 6 2025", value: "69.56" },
          { record: "Largest, season average", holder: "Gamble Play Jason, 2025", value: "31.40" },
          { record: "Smallest, single week", holder: "Twerk over HutMessXpress, Week 12 2025", value: "1.34" },
          { record: "Smallest, season average", holder: "Take Me To Dinner First, 2025", value: "17.49" }
        ]
      },
      {
        title: "Margin of defeat",
        rows: [
          { record: "Largest, single week", holder: "Handegg United, Week 6 2025", value: "69.56" },
          { record: "Largest, season average", holder: "Handegg United, 2025", value: "39.31" },
          { record: "Smallest, single week", holder: "HutMessXpress, Week 12 2025", value: "1.34" },
          { record: "Smallest, season average", holder: "HutMessXpress, 2025", value: "12.16" }
        ]
      },
      {
        title: "Strength of schedule",
        rows: [
          { record: "Hardest, weekly average", holder: "Twerk, 2025", value: "117.49" },
          { record: "Easiest, weekly average", holder: "Cee Dees TeeDees, 2025", value: "100.66" }
        ]
      }
    ]
  }
};
