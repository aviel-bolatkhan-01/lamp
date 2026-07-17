# 🪔 Lamp Game: Bug Report & Task List
**Generated on:** May 7, 2026
**Status:** Pending implementation (Waiting for Claude/Jules)

---

## 🛑 Critical Bug: Missing Sound Guards
The `G.cfg.sound` check is missing from several core audio functions. This causes sound to play even when disabled in settings.

**Location:** `index.html` (approx. line 10302)
**Required Fix:** Add `if(!G.cfg.sound) return;` to the following methods in the `sfx` object:
- [ ] `tap`
- [ ] `correct`
- [ ] `streak`
- [ ] `win` (already has guard but needs verification)
- [ ] `elim` (already has guard)

---

## 🏟️ Feature Gap: Online Team Mode
Team Mode is implemented for local "Pass & Play" but missing for "Online Rooms."

**Locations to Update:**
- [ ] `createRoom()` (line 7924): Add `teamMode` and `teams` object to the Firebase room creation.
- [ ] `online-settings` modal: Add UI buttons for "Team Gold" vs "Team Ruby."
- [ ] `renderWinScreen()`: Add logic to display team victory instead of individual winner when in team mode.

---

## 👻 Ghost Mode: Logic Cleanup
The question pool builder has a logic error that disables certain modes.

**Location:** `buildGhostPool` (line 9031)
**Current Code:** `if(mode==='classic'||mode==='lightning'||mode==='truefalse'&&false)`
**Fix:** Remove the `&&false` which is preventing `truefalse` from being handled correctly in that branch.

---

## 🗓️ "Eastern Mode" Clarification
The "Eastern Mode" bug mentioned in `STATUS.md` refers to the **Easter Season** logic (`getCurrentSeason()` returning `'easter'`). 
- **Action:** Verify if `playSeasonalQuestions('easter')` triggers any unique audio errors once the sound guards above are fixed.

---

## 🛠️ Instructions for Claude/Jules
When ready to implement, use this prompt:
> "Read JULES_BUG_REPORT.md and implement the fixes for the sound guards, clean up the Ghost Mode logic, and extend the Team Mode logic from Pass & Play to Online Rooms in index.html."
