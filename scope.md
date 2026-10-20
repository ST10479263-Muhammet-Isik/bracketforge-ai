# BracketForge AI - Project Scope

## Executive Summary
BracketForge AI is a lightweight, agentic web application designed to eliminate administrative friction in organizing tournaments. By interviewing the organizer via an intuitive chat interface, the agent parses tournament parameters and generates a complete, interactive tournament dashboard with automated pairings and live standings.

## In-Scope (Hackathon Proof-of-Concept)
1. **Conversational Setup Agent:**
   - Interactive questionnaire to extract:
     - Tournament Name
     - Tournament Format (Single Elimination or Round-Robin)
     - Participant Roster
     - Scoring System
2. **Automated Tournament Engine:**
   - Generation of dynamic match brackets and round-robin schedule fixtures.
   - Real-time score recording and automatic tie-break calculation.
   - Live-updating standings leaderboard table.
3. **Export & Shareability:**
   - Responsive mobile-friendly dashboard UI.
   - Client-side persistence using `localStorage`.

## Out-of-Scope (Future Iterations)
- Complex multi-stage hybrid playoffs.
- Automated entry-fee collection via payment gateways.
- SMS/WhatsApp automated participant notifications.
- Cloud database user accounts.

## Hackathon Delivery Timeline
- **Milestone 1:** Architecture design and AI specification documentation (`scope.md`, `prd.md`, `spec.md`).
- **Milestone 2:** Tournament bracket/fixture generation algorithms.
- **Milestone 3:** Interactive agent chat interface and real-time dashboard state synchronization.
- **Milestone 4:** Video recording and project submission.