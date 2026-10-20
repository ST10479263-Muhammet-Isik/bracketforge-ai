# BracketForge AI - Technical Specification

## 1. System Architecture

BracketForge AI is built as a client-side Single-Page Application (SPA) designed to operate with zero server dependencies, instant reactivity, and offline capability. The application separates concerns into three distinct layers:

1. Conversational Intake Controller: A linear state machine that parses user inputs, extracts tournament parameters, performs input validation, and manages chat context.
2. Deterministic Tournament Engine: Pure mathematical and algorithmic routines responsible for bracket tree construction, schedule generation (Circle Method), fair bye tracking, and prize pool calculations.
3. Reactive Presentation Layer: DOM rendering modules supporting dynamic layout transformations (FIFA Bracket Tree, Normal Box Cards, Compact Match List), live theme styling, and instant state re-sorting without page reloads.

### Data Flow Execution Order

1. User Input Ingestion: Receives text strings or interactive button clicks from the chat interface.
2. State Machine Parsing: Extracts and validates tournament parameters (Name, Format, Prize Pool, Theme, Layout, and Rosters).
3. State Calculation:
   - Proportional prize pool distribution
   - Pairing schedule creation (Circle Method or Single Elimination ladder)
   - Dynamic rotating bye tracking
4. Viewport DOM Rendering:
   - Updates broadcast header and financial payout displays
   - Renders round navigation controls
   - Injects match cards based on selected layout (Brackets, Normal Box, or List)
   - Synchronizes live scoreboard standings

## 2. Technology Stack & Execution Environment

- Frontend Markup: Semantic HTML5
- Styling Framework: Vanilla modern CSS3 using custom CSS variables (--bg-dark, --card-bg, --accent, --border), CSS Grid, Flexbox, and fonts (Orbitron, Oswald, Rajdhani, Inter)
- Programming Language: Vanilla ECMAScript 6+ (ES6+) JavaScript
- Runtime Constraints: 100% client-side execution; zero external build tools, zero npm dependencies, zero external CDNs required for core functionality
- Version Control: Git, GitHub, Markdown engineering documentation

## 3. Data Schema & Memory Representation

The application state is maintained in a single global JavaScript object (tourneyData):

{
  "name": "Championship Series",
  "venue": "MAIN ARENA",
  "totalPool": 500,
  "prizes": {
    "first": 250,
    "second": 187.5,
    "third": 62.5
  },
  "format": "single-elimination",
  "theme": "cyber",
  "layout": "brackets",
  "players": ["Alpha", "Bravo", "Charlie", "Delta", "Echo"],
  "byeCounts": {
    "Alpha": 1,
    "Bravo": 0,
    "Charlie": 0,
    "Delta": 0,
    "Echo": 0
  },
  "rounds": [
    {
      "roundNum": 1,
      "title": "Round 1",
      "entrantCount": 5,
      "byePlayer": "Alpha",
      "matches": [
        {
          "id": "se_r1_m1",
          "roundNum": 1,
          "table": 1,
          "p1": "Bravo",
          "p2": "Charlie",
          "winner": null,
          "loser": null,
          "completed": false
        },
        {
          "id": "se_r1_m2",
          "roundNum": 1,
          "table": 2,
          "p1": "Delta",
          "p2": "Echo",
          "winner": null,
          "loser": null,
          "completed": false
        }
      ]
    }
  ],
  "thirdPlaceMatch": null,
  "points": {
    "win": 3,
    "draw": 1,
    "loss": 0
  }
}

## 4. Key Algorithms & Core Logic

### 4.1 Proportional Prize Pool Split
Given any positive numeric user entry for total prize pool P:

1. The first place payout is allocated exactly 50% of the entire pool:
   P_1st = P * 0.50

2. The remaining balance represents the secondary prize pool:
   P_remainder = P - P_1st = P * 0.50

3. The second place payout receives 75% of this remainder:
   P_2nd = P_remainder * 0.75 = P * 0.375

4. The third place payout receives the remaining 25% of this remainder:
   P_3rd = P_remainder * 0.25 = P * 0.125

Example (P = 500):
- 1st Place: 500 * 0.50 = 250
- 2nd Place: 250 * 0.75 = 187.50
- 3rd Place: 250 * 0.25 = 62.50

### 4.2 Fair Rotating Bye Selection
To ensure equitable pairings when the active entrant count N is an odd number:

1. State Tracking: An associative dictionary byeCounts tracks the cumulative number of automatic passes awarded to each participant throughout the competition.
2. Candidate Selection: For any round requiring a bye, the active entrant pool is queried for the minimum recorded bye value.
3. Tie-Breaking: If multiple candidates share the minimum count, selection prioritizes the participant with the lowest index in the active round pool.
4. Advance & Increment: The designated bye recipient advances automatically to the subsequent round, is credited with one regulation win (+3 points in standings), and increments their counter in byeCounts.
5. Pairing Residue: The remaining even set of N - 1 players are paired deterministically into balanced match cards.

### 4.3 Top-8 Bracket Transition Bridge
For Single-Elimination competitions initialized with rosters greater than 8 competitors:

1. Preliminary Filtering: When initial entrants N > 8, matches are rendered in either Normal Box or Compact List layout to prevent UI clutter and horizontal distortion.
2. Evaluation Cutoff: Upon completion of all matches within an elimination tier, the engine evaluates total survivors (Match Winners + Bye Recipient).
3. Threshold Trigger: Once survivor count S <= 8, the UI exposes the connected Top-8 Knockout Tree:
   - Quarter-Finals: S between 5 and 8 players (4 match slots)
   - Semi-Finals: S = 4 players (2 match slots)
   - Grand Final: S = 2 finalists
   - Third-Place Play-off: Formed dynamically between the two losing semi-finalists
4. Visual Connectors: Bracket columns establish CSS connector lines linking quarter-final pairs into their respective semi-final nodes, culminating in the Grand Final match card.
