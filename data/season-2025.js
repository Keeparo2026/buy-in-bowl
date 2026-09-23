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

  recap: "Won from the 2 seed, 120.03 to 107.76 over HutMessXpress in the final.",

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
        homeScore: 121.35, awayScore: 120.98, winner: "Twerk" },

      /* Consolation bracket for places 7-10, weeks 16 and 17.
         Results follow from the final placings (7 Dinner, 8 Jason, 9 Nathan, 10 Adam)
         and match Yahoo's record book (Jason 13 losses). Pairings by seed 7v10, 8v9. */
      { round: "Consolation semifinals", home: "David hat grosse manschaft", away: "Gamble Play Jason",
        homeScore: null, awayScore: null, winner: "Gamble Play Jason", consolation: true },
      { round: "Consolation semifinals", home: "TUSH PUSH", away: "Take Me To Dinner First",
        homeScore: null, awayScore: null, winner: "Take Me To Dinner First", consolation: true },
      { round: "7th place", home: "Take Me To Dinner First", away: "Gamble Play Jason",
        homeScore: null, awayScore: null, winner: "Take Me To Dinner First", consolation: true },
      { round: "9th place", home: "David hat grosse manschaft", away: "TUSH PUSH",
        homeScore: null, awayScore: null, winner: "David hat grosse manschaft", consolation: true }
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
