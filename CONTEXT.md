# Shared Context — Lamp: Bible Trivia Online
# Auto-updated each session. All AI tools read this before working.

## Project
- Name: Lamp — Bible Trivia Online
- Live: https://thelampgame.com
- Stack: Single HTML file (index.html, ~52k lines), Firebase Realtime DB, vanilla JS
- Path: /Users/abzal.bolatkhan.01/AI projects/Lamp - Bible Trivia Online

## Current Status
- Last deploy: 2026-03-28
- What's live: SEO-optimized index.html, 19 trivia category pages (/trivia/), daily streak share card, PWA
- In progress: nothing
- Up next: onboarding flow, email capture, push notification timing improvement

## Architecture Rules (follow exactly)
- Global state: `G = {}` object — never redeclare
- Screen navigation: `show(id)` / `hide(id)` / `go('screen-name')`
- `buildPool()` filters questions by difficulty
- Difficulty values MUST be lowercase: "easy" "medium" "hard" — never capitalized
- Validate JS after every edit: extract <script> → node --check /tmp/game_script.js
- `];` not `]];` — never double-bracket question arrays

## Question Banks
- QB (Classic MCQ): 3,012 questions, 19 categories
- TF_Q (True/False): 3,219 questions
- VERSE_Q (Fill-in-Verse): 3,000 questions
- Total: 9,231 questions

## Brand
- Primary accent: gold #E0A860 / #C4842A — NOT green
- Dark bg: #1A1A20 | Card: #242430 | Text: #EDEDEC
- Buttons: class .btn + modifier (btn-gold, btn-ruby, btn-blue, btn-ghost)
- 4 themes: Dark (default), Green, Warmth, Light

## Deploy Sequence
git add <files> && git commit -m "Description — YYYY-MM-DD HH:MM"
git push origin dev
git checkout main && git merge dev && git push origin main
firebase deploy --only hosting
git checkout dev
