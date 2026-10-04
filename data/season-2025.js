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
  buyIn: 250,  // per manager, in $
  logo: "media/season-2025.jpg",

  champion: {
    team: "Handegg United",
    manager: "johannes",
    record: "10-4, 2 seed",
    note: "$1,500 and the Buy-In Bowl I Championship Ring",
    image: "media/champ-2025.jpg"   // picture for the champion card
  },
  runnerUp: { team: "HutMessXpress", manager: "hutmess" },
  lastPlace: {
    team: "TUSH PUSH", manager: "tush",
    punishment: "Walked free. Season one had no punishment",
    image: "media/shame-tush-2025.jpg"   // picture for the Wall of Shame card
  },
  pointsLeader: { team: "Twerk", manager: "twerk", points: 1668.82 },  // Most points, regular season

  recap: "Won from the 2 seed, 117.62 to 111.98 over HutMessXpress in the final.",

  // 14-game regular season, 10 teams, playoffs weeks 15-17.
  // Yahoo's record book counts playoff games, so its totals run higher than the standings below.

  draft: { date: "", location: "", notes: "", highlights: [] },

  /* Draft board: order = round 1 slots 1-10 (snake draft), picks = one line per team, rounds 1-15,
     each pick ["Player", "POS NFL"]; ["", ""] marks a missed pick */
  draftBoard: {
    order: ["dinner", "td", "jason", "tush", "johannes", "ceedee", "hutmess", "twerk", "gin", "nathan"],
    picks: {
      dinner: [["Ja'Marr Chase", "WR CIN"], ["A.J. Brown", "WR NE"], ["Ashton Jeanty", "RB LV"], ["Davante Adams", "WR LAR"], ["Omarion Hampton", "RB LAC"], ["Courtland Sutton", "WR DEN"], ["Bo Nix", "QB DEN"], ["Tony Pollard", "RB TEN"], ["Tucker Kraft", "TE GB"], ["Jerry Jeudy", "WR CLE"], ["Stefon Diggs", "WR WAS"], ["Justin Fields", "QB KC"], ["Ka'imi Fairbairn", "K HOU"], ["Josh Downs", "WR IND"], ["Vikings", "DEF MIN"]],
      td: [["Bijan Robinson", "RB ATL"], ["Brian Thomas Jr.", "WR JAX"], ["Jonathan Taylor", "RB IND"], ["Marvin Harrison Jr.", "WR ARI"], ["Mike Evans", "WR SF"], ["Dak Prescott", "QB DAL"], ["Mark Andrews", "TE BAL"], ["Jaylen Waddle", "WR DEN"], ["Evan Engram", "TE DEN"], ["Broncos", "DEF DEN"], ["Wil Lutz", "K DEN"], ["Braelon Allen", "RB NYJ"], ["Cooper Kupp", "WR SEA"], ["Bhayshul Tuten", "RB JAX"], ["Caleb Williams", "QB CHI"]],
      jason: [["Saquon Barkley", "RB PHI"], ["Tee Higgins", "WR CIN"], ["Joe Burrow", "QB CIN"], ["Sam LaPorta", "TE DET"], ["Younghoe Koo", "K NYG"], ["T.J. Hockenson", "TE MIN"], ["Eagles", "DEF PHI"], ["Jared Goff", "QB DET"], ["Cameron Dicker", "K LAC"], ["Ricky Pearsall", "WR SF"], ["Tyrone Tracy Jr.", "RB NYG"], ["Tank Bigsby", "RB PHI"], ["Michael Penix Jr.", "QB ATL"], ["Drake Maye", "QB NE"], ["Jayden Reed", "WR GB"]],
      tush: [["Justin Jefferson", "WR MIN"], ["Chase Brown", "RB CIN"], ["Lamar Jackson", "QB BAL"], ["James Cook III", "RB BUF"], ["Garrett Wilson", "WR NYJ"], ["Terry McLaurin", "WR WAS"], ["DeVonta Smith", "WR PHI"], ["Kaleb Johnson", "RB GB"], ["Jameson Williams", "WR DET"], ["Aaron Jones Sr.", "RB MIN"], ["Tyler Warren", "TE IND"], ["Keon Coleman", "WR BUF"], ["Steelers", "DEF PIT"], ["Chase McLaughlin", "K TB"], ["Blake Corum", "RB LAR"]],
      johannes: [["Jahmyr Gibbs", "RB DET"], ["Brock Bowers", "TE LV"], ["Jalen Hurts", "QB PHI"], ["Tyreek Hill", "WR MIA"], ["Brandon Aiyuk", "WR SF"], ["Rhamondre Stevenson", "RB NE"], ["Najee Harris", "RB NYG"], ["Zay Flowers", "WR BAL"], ["Jakobi Meyers", "WR JAX"], ["", ""], ["Joe Mixon", "RB HOU"], ["Harrison Butker", "K KC"], ["Bills", "DEF BUF"], ["Rashid Shaheed", "WR SEA"], ["Cam Skattebo", "RB NYG"]],
      ceedee: [["CeeDee Lamb", "WR DAL"], ["Drake London", "WR ATL"], ["De'Von Achane", "RB MIA"], ["George Kittle", "TE SF"], ["Kenneth Walker III", "RB KC"], ["Breece Hall", "RB NYJ"], ["Brock Purdy", "QB SF"], ["George Pickens", "WR DAL"], ["Rashee Rice", "WR KC"], ["Brandon Aubrey", "K DAL"], ["Jauan Jennings", "WR MIN"], ["Dalton Kincaid", "TE BUF"], ["Texans", "DEF HOU"], ["J.J. McCarthy", "QB MIN"], ["Chiefs", "DEF KC"]],
      hutmess: [["Nico Collins", "WR HOU"], ["Jaxon Smith-Njigba", "WR SEA"], ["Trey McBride", "TE ARI"], ["Patrick Mahomes", "QB KC"], ["David Montgomery", "RB HOU"], ["Chuba Hubbard", "RB CAR"], ["Isiah Pacheco", "RB DET"], ["Chris Olave", "WR NO"], ["Emeka Egbuka", "WR TB"], ["Jordan Mason", "RB MIN"], ["Marvin Mims Jr.", "WR DEN"], ["Kyler Murray", "QB MIN"], ["Jacory Croskey-Merritt", "RB WAS"], ["Evan McPherson", "K CIN"], ["Lions", "DEF DET"]],
      twerk: [["Josh Allen", "QB BUF"], ["Puka Nacua", "WR LAR"], ["Josh Jacobs", "RB GB"], ["DK Metcalf", "WR PIT"], ["Travis Kelce", "TE KC"], ["D'Andre Swift", "RB CHI"], ["Ravens", "DEF BAL"], ["Jake Bates", "K DET"], ["Deebo Samuel Sr.", "WR SF"], ["Rome Odunze", "WR CHI"], ["Khalil Shakir", "WR BUF"], ["Travis Etienne Jr.", "RB NO"], ["Justin Herbert", "QB LAC"], ["Michael Pittman Jr.", "WR PIT"], ["Jake Elliott", "K PHI"]],
      gin: [["Christian McCaffrey", "RB SF"], ["Derrick Henry", "RB BAL"], ["Jayden Daniels", "QB WAS"], ["Ladd McConkey", "WR LAC"], ["James Conner", "RB ARI"], ["DJ Moore", "WR BUF"], ["Alvin Kamara", "RB NO"], ["Tetairoa McMillan", "WR CAR"], ["David Njoku", "TE LAC"], ["Calvin Ridley", "WR TEN"], ["Jordan Addison", "WR MIN"], ["J.K. Dobbins", "RB DEN"], ["Matt Gay", "K LV"], ["Dallas Goedert", "TE PHI"], ["49ers", "DEF SF"]],
      nathan: [["Amon-Ra St. Brown", "WR DET"], ["Malik Nabers", "WR NYG"], ["Bucky Irving", "RB TB"], ["Kyren Williams", "RB LAR"], ["TreVeyon Henderson", "RB NE"], ["Xavier Worthy", "WR KC"], ["Baker Mayfield", "QB TB"], ["RJ Harvey", "RB DEN"], ["Matthew Golden", "WR GB"], ["Travis Hunter", "WR JAX"], ["Jaylen Warren", "RB PIT"], ["Zach Charbonnet", "RB SEA"], ["Colston Loveland", "TE CHI"], ["Chris Boswell", "K PIT"], ["Cardinals", "DEF ARI"]]
    }
  },

  // Tabellenplatz nach jeder Woche (W1–14 reguläre Saison, W17 = Endplatzierung)
  rankHistory: [
    { week: 1, order: ["Twerk", "Handegg United", "Gin&Jukes", "Cee Dees TeeDees", "HutMessXpress", "TUSH PUSH", "Touchdown Domination", "David hat grosse manschaft", "Gamble Play Jason", "Take Me To Dinner First"] },
    { week: 2, order: ["Twerk", "Handegg United", "HutMessXpress", "David hat grosse manschaft", "Gin&Jukes", "Cee Dees TeeDees", "Touchdown Domination", "TUSH PUSH", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 3, order: ["HutMessXpress", "Handegg United", "David hat grosse manschaft", "Twerk", "Touchdown Domination", "Cee Dees TeeDees", "TUSH PUSH", "Gin&Jukes", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 4, order: ["Twerk", "David hat grosse manschaft", "HutMessXpress", "Handegg United", "Cee Dees TeeDees", "TUSH PUSH", "Touchdown Domination", "Gin&Jukes", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 5, order: ["David hat grosse manschaft", "Handegg United", "Twerk", "HutMessXpress", "TUSH PUSH", "Touchdown Domination", "Cee Dees TeeDees", "Gin&Jukes", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 6, order: ["Touchdown Domination", "TUSH PUSH", "HutMessXpress", "David hat grosse manschaft", "Handegg United", "Twerk", "Cee Dees TeeDees", "Take Me To Dinner First", "Gin&Jukes", "Gamble Play Jason"] },
    { week: 7, order: ["HutMessXpress", "Handegg United", "Twerk", "Touchdown Domination", "TUSH PUSH", "David hat grosse manschaft", "Cee Dees TeeDees", "Gin&Jukes", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 8, order: ["Handegg United", "Touchdown Domination", "HutMessXpress", "Cee Dees TeeDees", "Twerk", "TUSH PUSH", "David hat grosse manschaft", "Take Me To Dinner First", "Gin&Jukes", "Gamble Play Jason"] },
    { week: 9, order: ["Cee Dees TeeDees", "Handegg United", "TUSH PUSH", "Touchdown Domination", "David hat grosse manschaft", "HutMessXpress", "Twerk", "Take Me To Dinner First", "Gin&Jukes", "Gamble Play Jason"] },
    { week: 10, order: ["Cee Dees TeeDees", "Handegg United", "Touchdown Domination", "HutMessXpress", "David hat grosse manschaft", "TUSH PUSH", "Gin&Jukes", "Twerk", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 11, order: ["Handegg United", "Touchdown Domination", "Cee Dees TeeDees", "David hat grosse manschaft", "HutMessXpress", "Gin&Jukes", "Twerk", "TUSH PUSH", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 12, order: ["Cee Dees TeeDees", "Handegg United", "Touchdown Domination", "David hat grosse manschaft", "Gin&Jukes", "Twerk", "HutMessXpress", "TUSH PUSH", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 13, order: ["Cee Dees TeeDees", "Handegg United", "Gin&Jukes", "Touchdown Domination", "David hat grosse manschaft", "Twerk", "HutMessXpress", "TUSH PUSH", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 14, order: ["Cee Dees TeeDees", "Handegg United", "Gin&Jukes", "Twerk", "Touchdown Domination", "HutMessXpress", "David hat grosse manschaft", "TUSH PUSH", "Take Me To Dinner First", "Gamble Play Jason"] },
    { week: 17, order: ["Handegg United", "HutMessXpress", "Twerk", "Cee Dees TeeDees", "Gin&Jukes", "Touchdown Domination", "Take Me To Dinner First", "Gamble Play Jason", "David hat grosse manschaft", "TUSH PUSH"] }
  ],

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
    weeks: { Quarterfinals: 15, Semifinals: 16, Final: 17 },
    byes: { Quarterfinals: ["Cee Dees TeeDees", "Handegg United"] },
    thirdPlaceRound: "Third place",
    games: [
      { round: "Quarterfinals", home: "Gin&Jukes", away: "HutMessXpress",
        homeScore: 90.94, awayScore: 114.26, winner: "HutMessXpress" },
      { round: "Quarterfinals", home: "Touchdown Domination", away: "Twerk",
        homeScore: 123.06, awayScore: 158.72, winner: "Twerk" },
      { round: "Semifinals", home: "Handegg United", away: "Twerk",
        homeScore: 120.00, awayScore: 99.10, winner: "Handegg United" },
      { round: "Semifinals", home: "Cee Dees TeeDees", away: "HutMessXpress",
        homeScore: 91.96, awayScore: 106.40, winner: "HutMessXpress" },
      { round: "Final", home: "Handegg United", away: "HutMessXpress",
        homeScore: 117.62, awayScore: 111.98, winner: "Handegg United" },
      { round: "Third place", home: "Twerk", away: "Cee Dees TeeDees",
        homeScore: 97.98, awayScore: 95.90, winner: "Twerk" },

      /* Consolation bracket for places 7-10, weeks 16 and 17 (scores from Yahoo's scoreboard). */
      { round: "Consolation semifinals", home: "David hat grosse manschaft", away: "Gamble Play Jason",
        homeScore: 90.38, awayScore: 119.72, winner: "Gamble Play Jason", consolation: true },
      { round: "Consolation semifinals", home: "Take Me To Dinner First", away: "TUSH PUSH",
        homeScore: 147.26, awayScore: 129.12, winner: "Take Me To Dinner First", consolation: true },
      { round: "7th place", home: "Take Me To Dinner First", away: "Gamble Play Jason",
        homeScore: 130.98, awayScore: 82.92, winner: "Take Me To Dinner First", consolation: true },
      { round: "9th place", home: "David hat grosse manschaft", away: "TUSH PUSH",
        homeScore: 115.16, awayScore: 102.22, winner: "David hat grosse manschaft", consolation: true }
    ]
  },

  weeks: [
    {
      week: 1,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "TUSH PUSH", homeScore: 122.58, awayScore: 100.16 },
        { home: "Gin&Jukes", away: "Take Me To Dinner First", homeScore: 112.82, awayScore: 68.14 },
        { home: "Touchdown Domination", away: "Twerk", homeScore: 99.22, awayScore: 124.46 },
        { home: "David hat grosse manschaft", away: "Cee Dees TeeDees", homeScore: 96.18, awayScore: 103.68 },
        { home: "Gamble Play Jason", away: "HutMessXpress", homeScore: 77.22, awayScore: 99.52 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Twerk, Cee Dees TeeDees, HutMessXpress",
        "Top score: Twerk 124.46",
        "Biggest win: Gin&Jukes over Take Me To Dinner First by 44.68"
      ],
      quotes: []
    },
    {
      week: 2,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Gamble Play Jason", homeScore: 113.94, awayScore: 72.64 },
        { home: "Gin&Jukes", away: "HutMessXpress", homeScore: 102.70, awayScore: 107.68 },
        { home: "Take Me To Dinner First", away: "Twerk", homeScore: 99.18, awayScore: 125.22 },
        { home: "Touchdown Domination", away: "Cee Dees TeeDees", homeScore: 93.54, awayScore: 90.12 },
        { home: "David hat grosse manschaft", away: "TUSH PUSH", homeScore: 146.30, awayScore: 100.60 }
      ],
      notes: [
        "Winners: Handegg United, HutMessXpress, Twerk, Touchdown Domination, David hat grosse manschaft",
        "Top score: David hat grosse manschaft 146.30",
        "Biggest win: David hat grosse manschaft over TUSH PUSH by 45.70"
      ],
      quotes: []
    },
    {
      week: 3,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Gin&Jukes", homeScore: 116.44, awayScore: 81.32 },
        { home: "Take Me To Dinner First", away: "Touchdown Domination", homeScore: 117.42, awayScore: 133.74 },
        { home: "Twerk", away: "HutMessXpress", homeScore: 90.02, awayScore: 118.26 },
        { home: "David hat grosse manschaft", away: "Gamble Play Jason", homeScore: 107.02, awayScore: 96.62 },
        { home: "Cee Dees TeeDees", away: "TUSH PUSH", homeScore: 95.52, awayScore: 131.12 }
      ],
      notes: [
        "Winners: Handegg United, Touchdown Domination, HutMessXpress, David hat grosse manschaft, TUSH PUSH",
        "Top score: Touchdown Domination 133.74",
        "Biggest win: TUSH PUSH over Cee Dees TeeDees by 35.60"
      ],
      quotes: []
    },
    {
      week: 4,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Twerk", homeScore: 113.20, awayScore: 148.36 },
        { home: "Gin&Jukes", away: "David hat grosse manschaft", homeScore: 99.04, awayScore: 115.16 },
        { home: "Take Me To Dinner First", away: "HutMessXpress", homeScore: 124.44, awayScore: 105.90 },
        { home: "Touchdown Domination", away: "TUSH PUSH", homeScore: 104.48, awayScore: 124.78 },
        { home: "Cee Dees TeeDees", away: "Gamble Play Jason", homeScore: 143.78, awayScore: 87.42 }
      ],
      notes: [
        "Winners: Twerk, David hat grosse manschaft, Take Me To Dinner First, TUSH PUSH, Cee Dees TeeDees",
        "Top score: Twerk 148.36",
        "Biggest win: Cee Dees TeeDees over Gamble Play Jason by 56.36"
      ],
      quotes: []
    },
    {
      week: 5,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Take Me To Dinner First", homeScore: 117.80, awayScore: 114.42 },
        { home: "Gin&Jukes", away: "Cee Dees TeeDees", homeScore: 98.84, awayScore: 93.68 },
        { home: "Touchdown Domination", away: "HutMessXpress", homeScore: 134.68, awayScore: 132.14 },
        { home: "Twerk", away: "David hat grosse manschaft", homeScore: 109.22, awayScore: 121.96 },
        { home: "Gamble Play Jason", away: "TUSH PUSH", homeScore: 79.72, awayScore: 125.96 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Touchdown Domination, David hat grosse manschaft, TUSH PUSH",
        "Top score: Touchdown Domination 134.68",
        "Biggest win: TUSH PUSH over Gamble Play Jason by 46.24"
      ],
      quotes: []
    },
    {
      week: 6,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "HutMessXpress", homeScore: 65.92, awayScore: 135.48 },
        { home: "Gin&Jukes", away: "TUSH PUSH", homeScore: 105.44, awayScore: 115.86 },
        { home: "Take Me To Dinner First", away: "David hat grosse manschaft", homeScore: 98.90, awayScore: 96.34 },
        { home: "Touchdown Domination", away: "Gamble Play Jason", homeScore: 139.06, awayScore: 92.74 },
        { home: "Twerk", away: "Cee Dees TeeDees", homeScore: 104.10, awayScore: 123.46 }
      ],
      notes: [
        "Winners: HutMessXpress, TUSH PUSH, Take Me To Dinner First, Touchdown Domination, Cee Dees TeeDees",
        "Top score: Touchdown Domination 139.06",
        "Biggest win: HutMessXpress over Handegg United by 69.56"
      ],
      quotes: []
    },
    {
      week: 7,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Touchdown Domination", homeScore: 128.24, awayScore: 117.56 },
        { home: "Gin&Jukes", away: "Gamble Play Jason", homeScore: 129.54, awayScore: 80.58 },
        { home: "Take Me To Dinner First", away: "Cee Dees TeeDees", homeScore: 120.12, awayScore: 137.86 },
        { home: "Twerk", away: "TUSH PUSH", homeScore: 129.90, awayScore: 106.62 },
        { home: "David hat grosse manschaft", away: "HutMessXpress", homeScore: 112.52, awayScore: 138.54 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Cee Dees TeeDees, Twerk, HutMessXpress",
        "Top score: HutMessXpress 138.54",
        "Biggest win: Gin&Jukes over Gamble Play Jason by 48.96"
      ],
      quotes: []
    },
    {
      week: 8,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "David hat grosse manschaft", homeScore: 108.16, awayScore: 101.04 },
        { home: "Gin&Jukes", away: "Touchdown Domination", homeScore: 55.42, awayScore: 123.02 },
        { home: "Take Me To Dinner First", away: "TUSH PUSH", homeScore: 140.98, awayScore: 121.60 },
        { home: "Twerk", away: "Gamble Play Jason", homeScore: 123.62, awayScore: 147.18 },
        { home: "Cee Dees TeeDees", away: "HutMessXpress", homeScore: 108.68, awayScore: 79.56 }
      ],
      notes: [
        "Winners: Handegg United, Touchdown Domination, Take Me To Dinner First, Gamble Play Jason, Cee Dees TeeDees",
        "Top score: Gamble Play Jason 147.18",
        "Biggest win: Touchdown Domination over Gin&Jukes by 67.60"
      ],
      quotes: []
    },
    {
      week: 9,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Cee Dees TeeDees", homeScore: 75.56, awayScore: 126.32 },
        { home: "Gin&Jukes", away: "Twerk", homeScore: 139.24, awayScore: 129.32 },
        { home: "Take Me To Dinner First", away: "Gamble Play Jason", homeScore: 105.98, awayScore: 103.66 },
        { home: "Touchdown Domination", away: "David hat grosse manschaft", homeScore: 86.00, awayScore: 114.94 },
        { home: "TUSH PUSH", away: "HutMessXpress", homeScore: 107.26, awayScore: 88.30 }
      ],
      notes: [
        "Winners: Cee Dees TeeDees, Gin&Jukes, Take Me To Dinner First, David hat grosse manschaft, TUSH PUSH",
        "Top score: Gin&Jukes 139.24",
        "Biggest win: Cee Dees TeeDees over Handegg United by 50.76"
      ],
      quotes: []
    },
    {
      week: 10,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "TUSH PUSH", homeScore: 103.32, awayScore: 100.14 },
        { home: "Gin&Jukes", away: "Take Me To Dinner First", homeScore: 112.88, awayScore: 70.10 },
        { home: "Touchdown Domination", away: "Twerk", homeScore: 162.90, awayScore: 110.54 },
        { home: "David hat grosse manschaft", away: "Cee Dees TeeDees", homeScore: 135.22, awayScore: 149.50 },
        { home: "Gamble Play Jason", away: "HutMessXpress", homeScore: 104.70, awayScore: 113.52 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Touchdown Domination, Cee Dees TeeDees, HutMessXpress",
        "Top score: Touchdown Domination 162.90",
        "Biggest win: Touchdown Domination over Twerk by 52.36"
      ],
      quotes: []
    },
    {
      week: 11,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Gamble Play Jason", homeScore: 91.80, awayScore: 69.34 },
        { home: "Gin&Jukes", away: "HutMessXpress", homeScore: 132.56, awayScore: 122.14 },
        { home: "Take Me To Dinner First", away: "Twerk", homeScore: 90.38, awayScore: 142.68 },
        { home: "Touchdown Domination", away: "Cee Dees TeeDees", homeScore: 105.32, awayScore: 91.40 },
        { home: "David hat grosse manschaft", away: "TUSH PUSH", homeScore: 98.40, awayScore: 86.12 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Twerk, Touchdown Domination, David hat grosse manschaft",
        "Top score: Twerk 142.68",
        "Biggest win: Twerk over Take Me To Dinner First by 52.30"
      ],
      quotes: []
    },
    {
      week: 12,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Gin&Jukes", homeScore: 146.26, awayScore: 148.02 },
        { home: "Take Me To Dinner First", away: "Touchdown Domination", homeScore: 139.08, awayScore: 118.86 },
        { home: "Twerk", away: "HutMessXpress", homeScore: 99.22, awayScore: 97.88 },
        { home: "David hat grosse manschaft", away: "Gamble Play Jason", homeScore: 123.22, awayScore: 106.46 },
        { home: "Cee Dees TeeDees", away: "TUSH PUSH", homeScore: 93.26, awayScore: 89.72 }
      ],
      notes: [
        "Winners: Gin&Jukes, Take Me To Dinner First, Twerk, David hat grosse manschaft, Cee Dees TeeDees",
        "Top score: Gin&Jukes 148.02",
        "Biggest win: Take Me To Dinner First over Touchdown Domination by 20.22"
      ],
      quotes: []
    },
    {
      week: 13,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Twerk", homeScore: 88.00, awayScore: 76.52 },
        { home: "Gin&Jukes", away: "David hat grosse manschaft", homeScore: 106.56, awayScore: 101.22 },
        { home: "Take Me To Dinner First", away: "HutMessXpress", homeScore: 132.14, awayScore: 121.44 },
        { home: "Touchdown Domination", away: "TUSH PUSH", homeScore: 109.70, awayScore: 121.94 },
        { home: "Cee Dees TeeDees", away: "Gamble Play Jason", homeScore: 123.54, awayScore: 90.58 }
      ],
      notes: [
        "Winners: Handegg United, Gin&Jukes, Take Me To Dinner First, TUSH PUSH, Cee Dees TeeDees",
        "Top score: Take Me To Dinner First 132.14",
        "Biggest win: Cee Dees TeeDees over Gamble Play Jason by 32.96"
      ],
      quotes: []
    },
    {
      week: 14,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Take Me To Dinner First", homeScore: 117.10, awayScore: 85.96 },
        { home: "Gin&Jukes", away: "Cee Dees TeeDees", homeScore: 99.04, awayScore: 111.56 },
        { home: "Touchdown Domination", away: "HutMessXpress", homeScore: 95.64, awayScore: 112.80 },
        { home: "Twerk", away: "David hat grosse manschaft", homeScore: 155.64, awayScore: 96.94 },
        { home: "Gamble Play Jason", away: "TUSH PUSH", homeScore: 145.66, awayScore: 104.36 }
      ],
      notes: [
        "Winners: Handegg United, Cee Dees TeeDees, HutMessXpress, Twerk, Gamble Play Jason",
        "Top score: Twerk 155.64",
        "Biggest win: Twerk over David hat grosse manschaft by 58.70"
      ],
      quotes: []
    }
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
  /* Straight from the group chat: only the funny stuff and the blunders.
     type "blunder": title (what went wrong) + optional quote { text, by }
     type "quote":   text, by, optional reply { text, by } */
  quotes: [
    { type: "blunder", date: "2025-09-16", by: "johannes", title: "Dropped Brock Bowers by accident and asked to get him back",
      quote: { text: "No free passes, this is a cutthroat league.", by: "tush" } },
    { type: "quote", date: "2025-09-16", by: "nathan", text: "A participation trophy is still a trophy.",
      reply: { text: "Only 1st place gets a trophy.", by: "gin" } },
    { type: "blunder", date: "2025-09-22", by: "ceedee", title: "Lost CeeDee Lamb after three weeks of draft prep",
      quote: { text: "Guys can we re-draft? My employer paid me for no reason.", by: "ceedee" } },
    { type: "blunder", date: "2025-10-05", by: "johannes", title: "Left the Texans on the bench while they went off",
      quote: { text: "On my bench 😂😂😂", by: "johannes" } },
    { type: "blunder", date: "2025-10-20", by: "dinner", title: "Dropped Bo Nix",
      quote: { text: "In hindsight dropping Bo Nix may have been a mistake…", by: "dinner" } },
    { type: "quote", date: "2025-10-27", by: "gin", text: "The point of the game is to get the least amount of points, right? If so, I'm crushing it.",
      reply: { text: "When it says 1% chance of winning, it's rounding up.", by: "nathan" } },
    { type: "quote", date: "2025-11-03", by: "ceedee", text: "Someone needs a QB? Pros: top 5 QB last season. Cons: currently only one functional arm. Slight pro: not his throwing arm.",
      reply: { text: "Worst trade of the season potential.", by: "johannes" } },
    { type: "blunder", date: "2025-11-09", by: "hutmess", title: "Star player sat on the bench in the big week",
      quote: { text: "That's what I get for picking up new players! Rookie mistake. Can I get a mulligan?", by: "hutmess" } },
    { type: "quote", date: "2025-12-09", by: "tush", text: "Get a job Malte. Next year we put a time limit on the waiver wire.",
      reply: { text: "Had way too much time in the office. If they knew, they'd request a share.", by: "ceedee" } },
    { type: "blunder", date: "2025-12-22", by: "dinner", title: "Scored more than anyone in the playoffs, after being knocked out",
      quote: { text: "I should have just benched my team.", by: "dinner" } },
    { type: "blunder", date: "2025-12-29", by: "tush", title: "Suggested a marathon as the last place punishment, then finished last",
      quote: { text: "A marathon, whose stupid idea was that? 🤔", by: "tush" } },
    { type: "blunder", date: "2025-12-30", by: "ceedee", title: "91 moves on the wire, no podium",
      quote: { text: "All that for nothing 😂", by: "ceedee" } }
  ],
  gallery: [],
  rosters: []
};
