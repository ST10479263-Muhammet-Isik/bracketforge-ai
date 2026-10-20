# BracketForge AI

> An agentic tournament engine that transforms natural conversational setup into live, interactive competition dashboards, automated brackets, and real-time leaderboards.

![Project Status](https://img.shields.io/badge/status-active-success)
![License](https://img.shields.io/badge/license-MIT-blue)
![Stack](https://img.shields.io/badge/tech-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-purple)

---

## Overview

Organizing local tournaments—for esports, chess clubs, or campus leagues—is often slowed down by clunky registration software, fragile spreadsheets, or paywalled platforms.

**BracketForge AI** solves this with an intelligent setup agent. In under 60 seconds, an organizer answers a quick natural-language dialogue, and the engine automatically:
- Partitions custom prize pools using a proportional ratio model (50% to 1st, 37.5% to 2nd, 12.5% to 3rd).
- Implements a deterministic rotating pass/bye algorithm so odd-numbered rosters rotate free passes fairly across participants.
- Dynamically generates single-elimination trees, round-robin schedules, or compact league lists.
- Activates a live Top-8 connected bracket visualization when 8 or fewer competitors remain.
- Recalculates match standings and live leaderboards in real time without page reloads.

---

## Features

- **Conversational Setup Agent:** Step-by-step interview capturing tournament name, format, prize pool, visual themes, and participant rosters.
- **Fair Rotating Bye Engine:** Enforces a minimum-pass algorithm across all rounds. No single entrant receives duplicate byes while others have none.
- **Proportional Prize Pool Calculator:** Accepts any custom pool amount and automatically divides it (50% champion, 37.5% runner-up, 12.5% third place).
- **Multiple Board Views:**
  - **Connected Brackets:** Top-8 bracket visualization with match connector paths, live/final indicators, and 3rd place playoff cards.
  - **Normal Box Cards:** Arena-style match cards with one-click win or draw resolution.
  - **List View:** Compact league rows for high-density tournament monitoring.
- **Dynamic Color Customizer:** Live switching between Cyber Cyan, Broadcast Gold, Pitch Emerald, Crimson Red, Royal Purple, and Clean Slate themes.
- **Zero Overhead:** Pure client-side application with zero external runtime dependencies.

---

## Specification Documents

This project was architected using AI developer workflows and structured engineering specifications:
- [`scope.md`](./scope.md) - Project scope, deliverables, and hackathon constraints.
- [`prd.md`](./prd.md) - Product Requirements Document with target user personas and user stories.
- [`spec.md`](./spec.md) - Technical specification, data schema, state machines, and algorithmic pairing definitions.

---

## Getting Started

1. Clone or download the repository:
   ```bash
   git clone [https://github.com/ST10479263-Muhammet-Isik/bracketforge-ai.git](https://github.com/ST10479263-Muhammet-Isik/bracketforge-ai.git)
