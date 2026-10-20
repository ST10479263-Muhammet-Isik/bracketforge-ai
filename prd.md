# BracketForge AI - Product Requirements Document (PRD)

## 1. Problem Statement
Organizing local tournaments—whether for chess, esports, padel, or campus sports—is hindered by cumbersome tournament software or brittle spreadsheets. Organizers frequently lack the technical or administrative expertise to configure complex tournament pairing systems, resulting in delayed rounds, dispute-prone manual scoring, and poor participant experience.

## 2. Target Users
- **Campus & School Club Organizers:** Fast setup for weekly chess, FIFA, or table tennis events.
- **Casual Community Event Hosts:** Quick game-night brackets with zero setup overhead.
- **Local Sports Coordinators:** Fast fixture generation without recurring software subscription costs.

## 3. User Stories
- **US-1 (Quick Setup):** As an organizer, I want to answer 3–4 natural-language prompts so that I don't have to navigate a complicated configuration dashboard.
- **US-2 (Visual Brackets & Tables):** As a participant, I want to see clearly who I am playing against and track live standings after each match.
- **US-3 (Dynamic Score Entry):** As an organizer or table arbiter, I want to enter match scores in real time and have the leaderboard update automatically without page refreshes.

## 4. Key Functional Requirements
| Feature | Priority | Description |
| :--- | :--- | :--- |
| **Agent Interview UI** | P0 (Must Have) | Step-by-step guided dialogue capturing format, player count, names, and scoring. |
| **Bracket / Fixture Engine**| P0 (Must Have) | Deterministic generation of tournament matchups. |
| **Interactive Standings** | P0 (Must Have) | Real-time sorting by Points, Wins, and Match Differentials. |
| **Direct State Persistence** | P1 (Should Have) | Saves tournament progress in the browser (`localStorage`). |

## 5. Success Metrics
- Tournament generation time: Under 60 seconds from prompt start to live bracket.
- Zero server errors during score updates.
- 100% responsive display on mobile screens.