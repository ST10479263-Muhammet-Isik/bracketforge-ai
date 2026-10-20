# BracketForge AI - Product Requirements Document (PRD)

## 1. Problem Statement
Organizing local tournaments—whether for chess, esports, or community sports—is hindered by cumbersome tournament software or fragile spreadsheets. Organizers frequently lack the technical or administrative time to configure complex pairing systems, calculate fair odd-player bye rotations, or manually balance multi-tier prize pools.

## 2. Target Users
- Campus & Society Organizers: Fast setup for weekly chess, FIFA, table tennis, or casual sporting events.
- Esports & Community Hosts: Zero-friction bracket generation for casual and competitive game nights.
- Tournament Arbiters: Fast score recording with instant, automated leaderboard recalculations.

## 3. User Stories
- US-1 (Conversational Setup): As an organizer, I want to answer simple conversational prompts so that I can generate a tournament dashboard without navigating confusing configuration menus.
- US-2 (Fair Bye Rotation): As a participant in an odd-numbered roster, I want the tournament engine to ensure that free passes/byes rotate fairly so that one person does not receive multiple passes while others receive none.
- US-3 (Automated Prize Splitting): As an organizer, I want to enter an arbitrary prize pool number and have 1st, 2nd, and 3rd place payouts automatically calculated according to established ratios.
- US-4 (Multiple Board Layouts): As a spectator or player, I want to switch between connected bracket trees, normal match boxes, and compact list views depending on screen size and tournament stage.
- US-5 (One-Click Match Scoring): As an arbiter, I want one-click match results that immediately recalculate standings without refreshing the browser.

## 4. Key Functional Requirements

| Feature | Priority | Implementation Status | Description |
| :--- | :--- | :--- | :--- |
| Conversational Agent | P0 (Must Have) | Complete | Guided interview parsing name, format, prize pool, theme, layout, and roster. |
| Rotating Bye Engine | P0 (Must Have) | Complete | Deterministic algorithm ensuring fair distribution of odd-roster byes. |
| Proportional Prize Engine | P0 (Must Have) | Complete | Dynamic 50% / 37.5% / 12.5% calculation on any numeric pool input. |
| Multi-Layout Visualizer | P0 (Must Have) | Complete | Support for Connected Brackets (Top 8), Normal Box Cards, and Compact List rows. |
| Dynamic Theme Switcher | P1 (Should Have) | Complete | Six responsive color themes (Cyber, Gold, Emerald, Crimson, Royal, Slate). |
| Fullscreen Presentation | P1 (Should Have) | Complete | Collapsible chat drawer for tournament display upon completion. |

## 5. Success Metrics
- Tournament configuration completed in under 60 seconds from first message.
- Zero duplicate byes awarded before all active participants have received one.
- 100% reactive state updates without server dependencies or page refreshes.
