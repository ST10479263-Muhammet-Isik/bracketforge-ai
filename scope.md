# BracketForge AI - Project Scope

## Executive Summary
BracketForge AI is a lightweight, agentic web application designed to eliminate administrative friction in organizing competitive tournaments. By interviewing the organizer through an interactive chat interface, the agent parses tournament parameters and generates a complete, real-time tournament dashboard with automated pairings, rotating bye allocations, custom prize splits, and live standings.

## In-Scope (Hackathon Deliverables)
1. Conversational Setup Agent
   - Step-by-step natural language questionnaire extracting tournament name, format, custom prize pool, color themes, display styles, and rosters.
   - Interactive quick-reply chips for fast configuration.
   - Live conversational command overrides (e.g., prize, venue, color, style, add player).
   - Collapsible drawer interface allowing clean transition to fullscreen tournament view upon typing "done".

2. Tournament Scheduling & Pairing Engine
   - Round-Robin schedule generator powered by the Circle Method.
   - Single-Elimination knockout bracket engine with automated winner advancement.
   - Fair rotating pass mechanism tracking historical bye allocations so no participant receives duplicate free passes while others have none.
   - Logic bridge activating a connected Top-8 bracket tree once eight or fewer competitors remain.
   - Automated 3rd place playoff match creation following semi-final rounds.

3. Automated Financial Engine
   - Proportional prize pool distribution calculating 50% for 1st place, 37.5% for 2nd place, and 12.5% for 3rd place from any custom user-defined amount.

4. UI & Broadcast Presentation
   - Six distinct esports color themes (Cyber Cyan, Broadcast Gold, Pitch Emerald, Crimson Red, Royal Purple, and Clean Slate Dark).
   - Three layout views: Connected Brackets Tree, Normal Box Cards, and Compact Match List.
   - Real-time reactive leaderboard sorting by points, wins, and head-to-head records without full page reloads.

## Out-of-Scope (Future Iterations)
- Real-time multiplayer synchronization over external WebSockets.
- Automated SMS and WhatsApp participant notification dispatching.
- Direct entry-fee processing through commercial payment gateway APIs.
- Persistent cloud user accounts and remote SQL database storage.

## Hackathon Delivery Timeline
- Milestone 1: AI-assisted specification and planning documentation (scope.md, prd.md, spec.md).
- Milestone 2: Core pairing algorithms, rotating bye data structures, and proportional prize math.
- Milestone 3: Conversational state machine and reactive UI implementation.
- Milestone 4: Fullscreen presentation mode, documentation synchronization, and repository deployment.
