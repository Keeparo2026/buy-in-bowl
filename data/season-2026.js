/* ============================================================
   SEASON 2026 — "The Buy-In Bowl II"
   Live. Weekly job: add an entry to weeks[].
   ============================================================ */

window.SEASONS = window.SEASONS || {};
window.SEASONS[2026] = {
  year: 2026,
  title: "The Buy-In Bowl II",
  status: "live", // "live" | "complete"
  buyIn: 250,  // per manager, in $
  logo: "media/season-2026.jpg",

  // Set at the end of the season
  champion: null,      // { team: "", manager: "", record: "", note: "" }
  runnerUp: null,      // { team: "", manager: "" }
  lastPlace: null,     // { team: "", manager: "", punishment: "" }
  pointsLeader: null,  // { team: "", manager: "", points: 0 } — most points, regular season

  recap: "", // one or two sentences, written at the end

  draft: {
    date: "Aug 22, 2026",
    location: "Online — 12:00 PST / 15:00 EST / 21:00 Germany / 22:00 Djibouti",
    notes: "Year one of the keeper rule, so still a clean-slate draft.",
    highlights: []
  },
  /* Draft board: order = round 1 slots 1-10 (snake draft), picks = one line per team, rounds 1-15,
     each pick ["Player", "POS NFL"]; ["", ""] marks a missed pick */
  draftBoard: {
    order: ["gin", "hutmess", "isaac", "dinner", "julius", "tush", "ceedee", "johannes", "twerk", "nathan"],
    picks: {
      gin: [["Jahmyr Gibbs", "RB DET"], ["A.J. Brown", "WR NE"], ["Omarion Hampton", "RB LAC"], ["Lamar Jackson", "QB BAL"], ["Colston Loveland", "TE CHI"], ["Garrett Wilson", "WR NYJ"], ["Jameson Williams", "WR DET"], ["Rico Dowdle", "RB PIT"], ["Parker Washington", "WR JAX"], ["Chuba Hubbard", "RB CAR"], ["Caleb Williams", "QB CHI"], ["Harrison Mevis", "K LAR"], ["Chargers", "DEF LAC"], ["Wan'Dale Robinson", "WR TEN"], ["Rachaad White", "RB WAS"]],
      hutmess: [["Jaxon Smith-Njigba", "WR SEA"], ["Chase Brown", "RB CIN"], ["George Pickens", "WR DAL"], ["Jadarian Price", "RB SEA"], ["Fernando Mendoza", "QB LV"], ["Davante Adams", "WR LAR"], ["Jaylen Warren", "RB PIT"], ["Tony Pollard", "RB TEN"], ["Isaiah Likely", "TE NYG"], ["Courtland Sutton", "WR DEN"], ["Jake Ferguson", "TE DAL"], ["Matthew Stafford", "QB LAR"], ["Cam Little", "K JAX"], ["Eagles", "DEF PHI"], ["Harrison Butker", "K KC"]],
      isaac: [["Bijan Robinson", "RB ATL"], ["Brock Bowers", "TE LV"], ["Xavier Gipson", "WR PHI"], ["Dylan Laube", "RB LV"], ["Cam Skattebo", "RB NYG"], ["Jayden Daniels", "QB WAS"], ["Marvin Harrison Jr.", "WR ARI"], ["Rhamondre Stevenson", "RB NE"], ["DK Metcalf", "WR PIT"], ["Travis Kelce", "TE KC"], ["Ka'imi Fairbairn", "K HOU"], ["Seahawks", "DEF SEA"], ["Quentin Johnston", "WR LAC"], ["Jared Goff", "QB DET"], ["Keenan Allen", "WR IND"]],
      dinner: [["Ja'Marr Chase", "WR CIN"], ["Kenneth Walker III", "RB KC"], ["Drake London", "WR ATL"], ["Breece Hall", "RB NYJ"], ["D'Andre Swift", "RB CHI"], ["Drake Maye", "QB NE"], ["Quinshon Judkins", "RB CLE"], ["Kyle Pitts Sr.", "TE ATL"], ["Carnell Tate", "WR TEN"], ["Chris Godwin Jr.", "WR TB"], ["Stefon Diggs", "WR WAS"], ["Cameron Dicker", "K LAC"], ["Broncos", "DEF DEN"], ["Tank Bigsby", "RB PHI"], ["Brock Purdy", "QB SF"]],
      julius: [["Puka Nacua", "WR LAR"], ["De'Von Achane", "RB MIA"], ["Nico Collins", "WR HOU"], ["Josh Jacobs", "RB GB"], ["DeVonta Smith", "WR PHI"], ["Rome Odunze", "WR CHI"], ["Jalen Hurts", "QB PHI"], ["Harold Fannin Jr.", "TE CLE"], ["Jonathon Brooks", "RB CAR"], ["Blake Corum", "RB LAR"], ["Josh Downs", "WR IND"], ["Matthew Golden", "WR GB"], ["Keaton Mitchell", "RB LAC"], ["Ravens", "DEF BAL"], ["Tyler Loop", "K BAL"]],
      tush: [["Christian McCaffrey", "RB SF"], ["Derrick Henry", "RB BAL"], ["Kyren Williams", "RB LAR"], ["Emeka Egbuka", "WR TB"], ["Luther Burden III", "WR CHI"], ["Ladd McConkey", "WR LAC"], ["DJ Moore", "WR BUF"], ["Sam LaPorta", "TE DET"], ["Dak Prescott", "QB DAL"], ["George Kittle", "TE SF"], ["RJ Harvey", "RB DEN"], ["Alec Pierce", "WR IND"], ["Texans", "DEF HOU"], ["Makai Lemon", "WR PHI"], ["Chase McLaughlin", "K TB"]],
      ceedee: [["Amon-Ra St. Brown", "WR DET"], ["Saquon Barkley", "RB PHI"], ["Trey McBride", "TE ARI"], ["Malik Nabers", "WR NYG"], ["David Montgomery", "RB HOU"], ["Jaylen Waddle", "WR DEN"], ["Mike Evans", "WR SF"], ["Brandon Aubrey", "K DAL"], ["Jacory Croskey-Merritt", "RB WAS"], ["Justin Herbert", "QB LAC"], ["De'Zhaun Stribling", "WR SF"], ["Trevor Lawrence", "QB JAX"], ["Chris Rodriguez Jr.", "RB JAX"], ["Cyrus Allen", "WR KC"], ["Patriots", "DEF NE"]],
      johannes: [["CeeDee Lamb", "WR DAL"], ["Ashton Jeanty", "RB LV"], ["Jeremiyah Love", "RB ARI"], ["Rashee Rice", "WR KC"], ["Bucky Irving", "RB TB"], ["Terry McLaurin", "WR WAS"], ["Bhayshul Tuten", "RB JAX"], ["Brian Thomas Jr.", "WR JAX"], ["Dalton Kincaid", "TE BUF"], ["Jaxson Dart", "QB NYG"], ["Kyle Monangai", "RB CHI"], ["Kenny Gainwell", "RB TB"], ["Tyler Allgeier", "RB ARI"], ["Jake Bates", "K DET"], ["Titans", "DEF TEN"]],
      twerk: [["Josh Allen", "QB BUF"], ["Justin Jefferson", "WR MIN"], ["Javonte Williams", "RB DAL"], ["Tyler Warren", "TE IND"], ["Travis Etienne Jr.", "RB NO"], ["Tetairoa McMillan", "WR CAR"], ["Christian Watson", "WR GB"], ["Rams", "DEF LAR"], ["J.K. Dobbins", "RB DEN"], ["Jason Myers", "K SEA"], ["Aaron Jones Sr.", "RB MIN"], ["Michael Pittman Jr.", "WR PIT"], ["Mark Andrews", "TE BAL"], ["Bo Nix", "QB DEN"], ["Khalil Shakir", "WR BUF"]],
      nathan: [["Jonathan Taylor", "RB IND"], ["James Cook III", "RB BUF"], ["Chris Olave", "WR NO"], ["Zay Flowers", "WR BAL"], ["Tucker Kraft", "TE GB"], ["Tee Higgins", "WR CIN"], ["Joe Burrow", "QB CIN"], ["TreVeyon Henderson", "RB NE"], ["Michael Wilson", "WR ARI"], ["KC Concepcion Jr.", "WR CLE"], ["Jordan Mason", "RB MIN"], ["Jordan Addison", "WR MIN"], ["Romeo Doubs", "WR NE"], ["Chris Boswell", "K PIT"], ["Jaguars", "DEF JAX"]]
    }
  },


  // What's on the line this season — keep lines short
  stakes: [
    {
      title: "Last place punishment",
      body: [
        "Pick one of three, done before keeper picks are due (end of July 2027)",
        "1 — Half marathon: registered timed race, bib shared in advance, finisher photo + medal as proof",
        "2 — Djibouti pilgrimage: fly out and visit Gin&Jukes, flights go roughly once a week",
        "3 — 12-hour bar sentence: beer cuts 30 min, shot cuts 45 min, league witness required, surprise video calls, no leaving",
        "The commissioner calls it the toilet bowl"
      ]
    }
  ],

  /* Rank after every week, for the weekly power lines.
     Each week: add one line with the team names in Yahoo's standings order.
     The "Pre" column is built automatically from last season's final standings,
     with new managers starting at the bottom. */
  totalWeeks: 17,
  rankHistory: [
    { week: 1, order: ["Twerk", "Luckyballzz7", "Handegg United", "Cee Dees TeeDees", "TUSH PUSH",
      "Take Me To Dinner First", "Rush Mode Isaac", "Julius's Juicemen", "Gin&Jukes", "HutMessXpress"] },
    { week: 2, order: ["Twerk", "TUSH PUSH", "Handegg United", "HutMessXpress", "Luckyballzz7",
      "Take Me To Dinner First", "Cee Dees TeeDees", "Gin&Jukes", "Julius's Juicemen", "Rush Mode Isaac"] }
  ],

  // Standings, currently after week 2
  standings: [
    { rank: 1, team: "Twerk", manager: "twerk", w: 2, l: 0, t: 0, pf: 263.88 },
    { rank: 2, team: "TUSH PUSH", manager: "tush", w: 2, l: 0, t: 0, pf: 233.56 },
    { rank: 3, team: "Handegg United", manager: "johannes", w: 2, l: 0, t: 0, pf: 223.90 },
    { rank: 4, team: "HutMessXpress", manager: "hutmess", w: 1, l: 1, t: 0, pf: 239.28 },
    { rank: 5, team: "Luckyballzz7", manager: "nathan", w: 1, l: 1, t: 0, pf: 235.94 },
    { rank: 6, team: "Take Me To Dinner First", manager: "dinner", w: 1, l: 1, t: 0, pf: 232.18 },
    { rank: 7, team: "Cee Dees TeeDees", manager: "ceedee", w: 1, l: 1, t: 0, pf: 212.64 },
    { rank: 8, team: "Gin&Jukes", manager: "gin", w: 0, l: 2, t: 0, pf: 208.16 },
    { rank: 9, team: "Julius's Juicemen", manager: "julius", w: 0, l: 2, t: 0, pf: 200.48 },
    { rank: 10, team: "Rush Mode Isaac", manager: "isaac", w: 0, l: 2, t: 0, pf: 192.40 }
  ],

  playoffs: {
    order: ["Quarterfinals", "Semifinals", "Final"],
    weeks: { Quarterfinals: 15, Semifinals: 16, Final: 17 },
    byes: {},
    thirdPlaceRound: "Third place",
    // { round: "Semifinals", home: "", away: "", homeScore: 0, awayScore: 0 }
    games: []
  },

  /* Week by week. One entry per week.
     Unknown scores stay null — the site shows them as open. */
  weeks: [
    {
      week: 1,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Rush Mode Isaac", homeScore: 124.20, awayScore: 112.16 },
        { home: "Twerk", away: "Gin&Jukes", homeScore: 148.36, awayScore: 100.86 },
        { home: "Cee Dees TeeDees", away: "Julius's Juicemen", homeScore: 109.46, awayScore: 106.52 },
        { home: "Luckyballzz7", away: "Take Me To Dinner First", homeScore: 130.26, awayScore: 124.10 },
        { home: "TUSH PUSH", away: "HutMessXpress", homeScore: 105.60, awayScore: 96.60 }
      ],
      notes: [
        "Winners: Handegg United, Cee Dees TeeDees, LuckyBallzz7, Twerk, Tush Push",
        "Biggest blowout: Twerk over Gin&Jukes by 47.50",
        "Closest game: Cee Dees TeeDees over Julius's Juicemen by 2.94",
        "Week 1 projections: LuckyBallzz7 108.80, Julius's Juicemen 107.08, Gin&Jukes 107.01, Take Me To Dinner First 104.70, Cee Dees TeeDees 103.78, Twerk 101.08, Handegg United 100.06, Tush Push 99.96, HutMessXpress 99.54, Rush Mode Isaac 96.53",
        "Handegg United: Trevor Lawrence 4 TD, Ashton Jeanty 147 total yards and 2 TD, Dalton Kincaid 130 yards",
        "Titans D/ST lost 10-23 to the Jets"
      ],
      quotes: []
    },
    {
      week: 2,
      headline: "",
      matchups: [
        { home: "Handegg United", away: "Julius's Juicemen", homeScore: 99.70, awayScore: 93.96 },
        { home: "HutMessXpress", away: "Luckyballzz7", homeScore: 142.68, awayScore: 105.68 },
        { home: "TUSH PUSH", away: "Gin&Jukes", homeScore: 127.96, awayScore: 107.30 },
        { home: "Twerk", away: "Rush Mode Isaac", homeScore: 115.52, awayScore: 80.24 },
        { home: "Take Me To Dinner First", away: "Cee Dees TeeDees", homeScore: 108.08, awayScore: 103.18 }
      ],
      notes: [
        "Julius starts three replacements: Josh Jacobs on the Commissioner's Exempt List, Nico Collins out, Steelers D instead of Ravens",
        "Handegg swaps the Titans for the Packers defense just before kickoff"
      ],
      quotes: []
    }
  ],

  trades: [
    // { date: "", teams: ["", ""], gave: "", got: "", verdict: "" }
  ],

  awards: [
    // { title: "Manager of the year", winner: "", detail: "" }
  ],

  /* Straight from the group chat: only the funny stuff and the blunders.
     type "blunder": title + optional quote { text, by }; type "quote": text, by, optional reply */
  quotes: [
    { type: "quote", date: "2026-07-26", by: "johannes", text: "100% of Buy-In Bowl titles currently live at my place. Prep accordingly." },
    { type: "blunder", date: "2026-08-11", by: "nathan", title: "Didn't read the pinned keeper rules",
      quote: { text: "Oh I ain't reading that novel.", by: "nathan" } },
    { type: "quote", date: "2026-08-13", by: "gin", text: "We don't reward losers 🙃 It's called Managed Democracy." },
    { type: "quote", date: "2026-08-14", by: "nathan", text: "I think we punish the winner. That's the most hated person in the league after all." },
    { type: "quote", date: "2026-08-14", by: "isaac", text: "Punishment idea: fly to Germany, order a beer and criticize their pour." },
    { type: "quote", date: "2026-08-22", by: "julius", text: "I have no idea what I'm doing but let's go 🍻" },
    { type: "blunder", date: "2026-09-16", by: "hutmess", title: "Drafted Fernando Mendoza, got roasted, dropped him three weeks later",
      quote: { text: "I'm drilled for drafting Mendoza 😅", by: "hutmess" } },
    { type: "quote", date: "2026-09-15", by: "gin", text: "I vote to recalculate week 1 without TEs." },
    { type: "quote", date: "2026-09-15", by: "gin", text: "9th place. Seems familiar from last year… 🤔" },
    { type: "blunder", date: "2026-09-20", by: "johannes", title: "Up 30 in the projection, losing twenty minutes later",
      quote: { text: "Idk how all you veterans handle the emotional roller coaster every weekend 😂", by: "johannes" } }
  ],

  // Screenshots and photos. Files go in /media.
  gallery: [
    // { file: "media/2026-week01.png", caption: "" }
  ],

  // Post-draft rosters — the snapshot that pays off later
  rosters: [
    { team: "Handegg United",
      starters: ["QB J. Dart NYG", "RB A. Jeanty LV", "RB J. Love ARI", "WR C. Lamb DAL", "WR R. Rice KC", "TE D. Kincaid BUF", "FLEX B. Irving TB", "K J. Bates DET", "DEF Titans"],
      bench: ["T. McLaurin WAS", "B. Tuten JAX", "B. Thomas Jr. JAX", "K. Monangai CHI", "T. Allgeier ARI", "C. Douglas MIA"] },
    { team: "Rush Mode Isaac",
      starters: ["QB J. Daniels WAS", "RB B. Robinson ATL", "RB C. Skattebo NYG", "WR D. Metcalf PIT", "WR K. Allen IND", "TE B. Bowers LV", "FLEX R. Stevenson NE", "K K. Fairbairn HOU", "DEF Seahawks"],
      bench: ["D. Laube LV", "M. Harrison Jr. ARI", "X. Gipson NYG", "T. Kelce KC", "Q. Johnston LAC", "J. Goff DET"] },
    { team: "Gin&Jukes",
      starters: ["QB L. Jackson BAL", "RB J. Gibbs DET", "RB O. Hampton LAC", "WR A. Brown NE", "WR G. Wilson NYJ", "TE C. Loveland CHI", "FLEX J. Williams DET", "K E. McPherson CIN", "DEF Chargers"],
      bench: ["R. Dowdle PIT", "P. Washington JAX", "C. Hubbard CAR", "C. Williams CHI", "W. Robinson TEN", "R. White WAS"] },
    { team: "Twerk",
      starters: ["QB J. Allen BUF", "RB J. Williams DAL", "RB T. Etienne Jr. NO", "WR J. Jefferson MIN", "WR T. McMillan CAR", "TE T. Warren IND", "FLEX C. Watson GB", "K J. Myers SEA", "DEF Rams"],
      bench: ["J. Dobbins DEN", "A. Jones Sr. MIN", "M. Pittman Jr. PIT", "M. Andrews BAL", "B. Nix DEN", "K. Shakir BUF"] },
    { team: "LuckyBallzz7",
      starters: ["QB J. Burrow CIN", "RB J. Taylor IND", "RB J. Cook III BUF", "WR C. Olave NO", "WR Z. Flowers BAL", "TE T. Kraft GB", "FLEX T. Higgins CIN", "K C. Boswell PIT", "DEF Jaguars"],
      bench: ["T. Henderson NE", "M. Wilson ARI", "J. Mason MIN", "J. Addison MIN", "R. Doubs NE", "M. Washington Jr. LV"] },
    { team: "Take Me To Dinner First",
      starters: ["QB D. Maye NE", "RB K. Walker III KC", "RB B. Hall NYJ", "WR J. Chase CIN", "WR D. London ATL", "TE K. Pitts Sr. ATL", "FLEX D. Swift CHI", "K C. Dicker LAC", "DEF Broncos"],
      bench: ["Q. Judkins CLE", "C. Tate TEN", "C. Godwin Jr. TB", "S. Diggs WAS", "T. Bigsby PHI", "B. Purdy SF"] },
    { team: "Cee Dees TeeDees",
      starters: ["QB J. Herbert LAC", "RB S. Barkley PHI", "RB D. Montgomery HOU", "WR A. St. Brown DET", "WR M. Nabers NYG", "TE T. McBride ARI", "FLEX J. Waddle DEN", "K B. Aubrey DAL", "DEF Patriots"],
      bench: ["M. Evans SF", "J. Croskey-Merritt WAS", "D. Stribling SF", "T. Lawrence JAX", "C. Rodriguez Jr. JAX", "C. Allen KC"] },
    { team: "Julius's Juicemen",
      starters: ["QB J. Hurts PHI", "RB D. Achane MIA", "RB J. Jacobs GB", "WR P. Nacua LAR", "WR N. Collins HOU", "TE H. Fannin Jr. CLE", "FLEX D. Smith PHI", "K T. Loop BAL", "DEF Ravens"],
      bench: ["R. Odunze CHI", "J. Brooks CAR", "B. Corum LAR", "J. Downs IND", "M. Golden GB", "M. Lloyd GB"] },
    { team: "HutMessXpress",
      starters: ["QB M. Stafford LAR", "RB C. Brown CIN", "RB J. Warren PIT", "WR J. Smith-Njigba SEA", "WR G. Pickens DAL", "TE I. Likely NYG", "FLEX D. Adams LAR", "K C. Little JAX", "DEF Eagles"],
      bench: ["J. Price SEA", "F. Mendoza LV", "T. Pollard TEN", "C. Sutton DEN", "J. Ferguson DAL", "H. Butker KC"] },
    { team: "Tush Push",
      starters: ["QB D. Prescott DAL", "RB C. McCaffrey SF", "RB D. Henry BAL", "WR E. Egbuka TB", "WR L. Burden III CHI", "TE S. LaPorta DET", "FLEX K. Williams LAR", "K C. McLaughlin TB", "DEF Texans"],
      bench: ["L. McConkey LAC", "D. Moore BUF", "G. Kittle SF", "R. Harvey DEN", "A. Pierce IND", "M. Lemon PHI"] }
  ]
};
