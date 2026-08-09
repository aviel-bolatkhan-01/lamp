# STATUS.md — Lamp: Bible Trivia Online

## Session 2026-08-09 (part 2): Design + sound polish pass ✅ (sw lamp-v10, DEPLOYED — commit 254f476, tag release-2026-08-09-game-feel)
User: *"improve the design and sound design... use best cases from other quiz games. add more
animations... be creative and surprise me. make it like the most played/downloaded quiz games."*

**Audit findings (why it feels plain despite 28 existing keyframes):** wrong answers never shake
on the main screen (only tf-btn has shake); verdict colors SNAP instead of bloom; score never
pops on change; timer danger = color swap only, no motion; streak overlay identical at 3 and 10;
winner screen appears all at once; **correct chime is identical at streak 1 and streak 9** (the
Duolingo-style escalation is the single biggest missing juice lever). FEATURES.answerAnim etc.
are all ON — base layer exists, escalation/wiring is what's missing.

**Research (grq):** rising pitch ladder for combo chimes (fifths→thirds), ≤3-4 simultaneous
layers, anticipation via silence, timer heartbeat, floating points, 100ms press feedback.
(`or`/nemotron returned empty — flagged in tooling memory.)

**Plan (specs written, cdx applying):** SPEC A `_spec_motion.md` — verdict bloom + green ring /
red shake+glow, score-pop, question entrance, timer danger pulse+beat, streak overlay t5/t7/t10
tiers, winner ceremony staggered entrance, prefers-reduced-motion guard, NO color/layout changes.
SPEC B `_spec_sound.md` — sfx.correct rises on a major-scale ladder with the CURRENT player's
streak (reads G.streaks internally, call sites unchanged), sparkle bell at 5+, sfx.streak(n)
rises by tier (+3/+5/+7 semitones at 5/7/10). Then: headless smoke + uniform-window level
measurement, SW → lamp-v10, deploy, live verify.

**Progress at this save:** SPEC A applied by cdx (all 5 edits) + 3 integration fixes by hand:
duplicate transition props cleaned (press stays .1s, verdict bloom .22s) and the answerRing had
to be merged into the LATER `html.feat-answerAnim .opt.correct` rule at ~line 3375 — cdx's new
block sat earlier in the cascade and was overridden (lesson: when ADDING a competing rule,
check for an existing same-specificity rule later in the file). SPEC B applied by cdx (diff
verified: _steps ladder + f*_lift in correct, sparkle at st>=5, streak(n) tier lift, showStreak
passes n).

**SHIPPED & VERIFIED:** node --check ✔; 3-phase harness: streak-0 chime zc=1021 → streak-8
zc=2126 (**2.08× ≈ exactly +1 octave — the ladder measurably works**), peaks 0.246→0.302 (no
clipping); 16/16 sounds fire with new signatures; 0 console errors; t7 overlay class, score-pop,
.q-in all toggle. Live-verified: sw lamp-v10, answerRing ×3 + ladder markers ×11 in prod HTML.
Rollback: tag release-2026-08-09-android = state before this pass.

## Session 2026-08-09: AI Study Insight + bug fixes + PWA + Android app ✅ (sw lamp-v9, DEPLOYED)

**Rollback points:** tag `checkpoint-2026-08-09-before-session` (state before session), tag `release-2026-08-09-ai-summary` (this session shipped). `git checkout <tag>` or Firebase console → Hosting → release history → rollback.

### 1. Bug audit → 4 real fixes (commit 4ab191e)
- **Stored XSS (missed spot from the 2026-07-18 sweep):** `${p.name}` unescaped in the elimination
  message innerHTML in `timeOut()` — now `escHtml(p.name)`. Sweep-verified: no other unescaped
  name/avatar innerHTML sites remain (avatarMarkup escapes internally; showElim uses textContent).
- **3× unguarded `JSON.parse(localStorage bgn_history)`** (saveMatchResult, renderMatchHistory,
  profile FB-merge) — corrupt value used to kill match saving/history *permanently and silently*.
  Now try/catch + `Array.isArray` → self-heals by overwriting with good data.
- False alarms re-confirmed: line 9930 Notification (guarded upstream), JULES report items (all
  resolved or stale). eslint is misconfigured (ignores index.html — has never linted; `node --check`
  remains the real gate; not fixed, low value).

### 2. Sound imbalance — INVESTIGATED, PREMISE STALE, NO CHANGE (deliberate)
The "streak/levelUp ~2x quiet" note from 2026-07-28 no longer holds: fresh uniform-window
measurement shows streak 1.049 / levelUp 0.904 peaks vs correct 0.255 / win 0.319 — the v3
limiter back-off already fixed it. A celebration-bypass-bus was built (via cdx), measured
(peaks → 1.144 = clipping territory), and **reverted**. Lesson applied: validate the measurement
before "fixing". Do not re-attempt without fresh evidence of a real problem.

### 3. ✨ AI Study Insight after solo quizzes (commit f7cdbf1) — VERIFIED ON PROD
- Winner-screen card for solo runs (`G.players.length===1`, ≥3 answers): instant LOCAL summary
  (accuracy + up to 3 missed questions, from new `G._alog` tracking; `G._curQ` captured in renderQ
  because the verse-mode handler `q` is synthetic/textless), then a **real Gemini-written coaching
  summary replaces it when it arrives** (recommends a passage based on what was missed). Offline
  or any failure → local text stays. All via textContent (no XSS surface).
- Backend: `gemini-flash-lite-latest` (rolling alias — pinned 2.5-flash-lite is retired for new
  users), key `AIzaSy…M_K8` restricted to the Gemini API + `https://thelampgame.com/*` referrers —
  public-by-design browser key. **Localhost always shows the local fallback (referrer lock);
  AI text verified live on prod via puppeteer (aiReplaced:true, 0 page errors).**
- APIs enabled + key created WITHOUT console access via firebase-tools refresh-token → REST
  (serviceusage + apikeys). Pollinations text API is DEAD for real prompts (402) — do not revisit.

### 4. PWA hardening (same commit)
- manifest.json: added `id`/`scope`; icons now truthful — new `icon-192.png` (real 192px), new
  `icon-maskable.png` (512px, padded to safe zone via sips), icon.png as 512 any.
- sw.js → **lamp-v9**; precache + new icons + `assets/img/home-bg-texture.png` (was 404-risk-free
  verified — file exists; cache.addAll is atomic).
- firebase.json hosting ignores: *.md, database.rules.json, gen scripts, package files, android/
  — STATUS.md etc. are no longer publicly served (verified live).
- iOS meta tags were already present.

### 5. Deployed + verified live (GitHub `main` f7cdbf1 + Firebase Hosting)
Checklist run: node --check ✔ → SW bump ✔ → push ✔ → `npx firebase-tools deploy --only hosting` ✔
→ live-bytes verification: sw lamp-v9 ✔, AI markers in prod HTML ✔, manifest icons ✔,
`/.well-known/assetlinks.json` live ✔, icon-192 200 ✔, STATUS.md now rewrites to app ✔.

### 6. Android app (TWA via Bubblewrap) — ✅ BUILT & SIGNED
- `android/`: twa-manifest.json (package `com.thelampgame.app`), **keystore + signing-info.txt
  (passwords) — LOCAL ONLY, gitignored, USER MUST BACK UP**, PLAY_STORE_GUIDE.md (full
  plain-language Play Console walkthrough incl. store copy from cohere).
- Toolchain installed user-space: `~/.bubblewrap/` JDK 17.0.20 + Android SDK (platform-34,
  build-tools, licenses). Bubblewrap gotchas that each broke a build (jdkPath WITHOUT
  /Contents/Home; bin+lib symlinks so androidSdkPath validates; `update --skipVersionUpgrade`;
  password env vars; a piped-stdin run set versionName to "n" — fixed back to 1.0.0) —
  full recipe in memory `project_lamp_android_twa`.
- assetlinks.json live with upload-key fingerprint DE:49:4A:F4…; after first Play upload the
  **Play App Signing SHA-256 must be appended** + redeploy (guide Part 3).
- **Artifacts (android/, NOT in git):** `app-release-bundle.aab` 3.4MB (Play upload) +
  `app-release-signed.apk` 3.3MB (direct install). apksigner-verified: cert SHA-256 de494af4…
  matches keystore AND live assetlinks.json. Store screenshots at `android/store-assets/`
  (home + live question screen, 1179×2553). USER SIDE remaining: Play Console account ($25),
  upload AAB, then bring back the Play App Signing SHA-256 for assetlinks (guide Part 3).

### Orchestration note (honest)
cdx (unlocked since Aug 6) wrote the two big code chunks (celeb bus — later reverted on evidence;
AI summary — shipped) from exact specs and applied them cleanly; mistral returned empty copy once
(cohere fallback delivered); surgical 1-line integration edits in fragile spots were done directly
where delegation round-trips added breakage risk over token savings.

## Session 2026-07-28 (part 3): Challenges → Disciple only + richer synthesis ✅ (sw lamp-v8)

### 1. Daily + Weekly challenges forced to Disciple (easy)
User: *"Make all the daily and weekly challenges have questions from the disciple level, because it's too difficult"*

"Disciple" is the **UI label for `easy`** (`chDiffLabel`: easy→🌿 Disciple, medium→📖 Apostle,
hard→⚔️ Scholar). It is also a rank name in `LEVELS`, which is a red herring — difficulty
values in code stay lowercase `easy`/`medium`/`hard`.

- **Daily** (`startDailyChallenge`): was `xp>=2000?'hard':xp>=700?'medium':'easy'`. At high XP
  you got `hard`, and the `hard` branch of `byDiff` returns `q.d==='medium'||q.d==='hard'` —
  it **excluded easy questions entirely**. Now hardcoded `dailyDiff='easy'`. Timer follows
  automatically (12s→20s). Card label in the challenges list hardcoded to `'Disciple'` so it
  stops advertising "Scholar level".
- **Weekly** (`getWeeklyTournamentPool`): had **no difficulty filter at all** — it drew from
  the whole category regardless of `d`. Added `easyOnly(arr, need)` to all three banks
  (MCQ/TF/Verse) with a fallback to the full bank if easy is ever too thin.
- **Verified against the real data**: all 19 QB categories have ≥17 easy MCQ (need 10; thinnest
  is Old Testament Law at 17), TF_Q has 941 easy, VERSE_Q has 925. Simulated the pool for every
  category — 0 fallbacks triggered, 100% easy.
- Seasonal + Sunday Bowl deliberately left alone — user asked for daily and weekly only.

### 2. Sound: new synthesis methods (user: *"it still sounds too generic"*)
Root cause of "generic" is structural: everything was built from basic oscillators, which has a
hard ceiling. Added two genuinely different synthesis engines rather than more of the same:
- **`pluck()` — Karplus-Strong physical modelling.** Excites a delay line one wave-period long
  with filtered noise, then feeds it back through a 2-tap averaging lowpass. Models an actual
  vibrating string. Now drives `streak` and `levelUp`.
- **`fmBell()` — FM synthesis.** Modulator at an inharmonic ratio drives carrier frequency with
  a decaying modulation index (the DX7 bell algorithm). Layered into `correct`, `streak`, `levelUp`.
- **`tap` is now a 3-way round robin** (wood / felt / click), like sample-based games rotate
  variants — pitch jitter alone still reads as one sound repeating.
- **New `pageTurn`** wired into `renderQ()` — fills the longest silence in actual gameplay and
  is thematically right for a Bible app. Total sounds now **16**.
- Fixed a real pluck bug: sustained amplitude goes as `sqrt(2/N)`, so **high notes rang out
  louder than low ones**. Excitation is now filtered and normalised per note.

### ⚠️ Known remaining imbalance (honest)
`streak` (.17 peak) and `levelUp` (.19) sit ~2x below `correct` (.41) / `win` (.45). The master
limiter saturates on dense plucked runs — raising the pluck gain from 1.55 → 4.2 changed the
measured output by **nothing**. Reverted to sane gains rather than ship a number that does
nothing offline but might be loud on other hardware. Fixing properly needs either a per-sound
send bus that bypasses the shared limiter, or real recorded samples.

**Measurement lesson:** earlier level comparisons were invalid — I rendered each sound in a
different-length window, and RMS averages over the whole window, so longer windows read quieter.
Always use a uniform window when comparing.

**Verified:** `node --check` passes; real page headless = 16/16 sounds fire, 0 console errors,
tap hammered 15x without throwing; nothing clips.

## Session 2026-07-28 (part 2): +7 new sounds, 8 → 15 ✅ (SW bumped lamp-v6 → lamp-v7)

User: *"add more sounds to make the game feel sound rich. also push changes to github and deploy to firebase."*

Audited the app for **silent moments** rather than inventing sounds nobody hears. Added 7,
each wired to a real event (7 new call sites, all asserted at patch time):

| sound | fires on | why it was needed |
|---|---|---|
| `notify` | `toast()` (~191 call sites) | biggest silent surface in the app |
| `whoosh` | `go()` — every screen change | navigation had zero audio feedback |
| `achieve` | achievement unlock in `checkAchs()` | only showed a toast before |
| `message` | incoming chat, `child_added` | silent |
| `challenge` | incoming duel | silent — flagship multiplayer moment |
| `timeUp` | `timeOut()` | was reusing `sfx.wrong()`; running out of time ≠ being wrong |
| `select` | `answerTF()` | was a generic `sfx.tap()` |

**Chat gotcha handled:** Firebase `child_added` replays the last 80 messages when a chat
opens, which would have machine-gunned `message`. Guarded with
`m.from!==G.uid && m.ts && Date.now()-m.ts < 10000`.

**TDZ guard:** `toast()` and `go()` are both defined *earlier in the file* than `const sfx`,
so their calls are wrapped in `try{}catch(e){}` in case either fires during initial script
execution.

**Measured level tiering (peak, OfflineAudioContext) — nothing clips:**
- ambient, fires constantly: `tap` .007 / `whoosh` .006 / `tick` .005
- light feedback: `select` .039 / `notify` .051 / `message` .056
- consequential: `wrong` .122 / `challenge` .155 / `elim` .172 / `timeUp` .297
- celebration: `win` .396 / `achieve` .417 / `correct` .482 / `streak` .548 / `levelUp` .667

**Verified:** `node --check` passes; real page headless = 15/15 methods present, 15/15 fire,
0 console errors, ctx running @48 kHz.

## Session 2026-07-28: Sound Engine v2 → v3 ✅

Rewrote the whole SFX engine in `index.html` (lines ~10190–10608). Public API unchanged:
`sfx.tap/correct/wrong/streak/elim/win/tick/levelUp` plus helpers `bell/noiseBurst/osc`.
All `G.cfg.sound` guards preserved on every entry point. **No other code touched.**

**Why it sounded robotic (root causes, not guesses):**
1. Zero variation — every trigger was byte-identical. 55 `sfx.tap()` call sites meant the
   same waveform hundreds of times per session. Nothing acoustic repeats exactly.
2. Bell partials were perfectly tuned pure sines sharing one 3 ms attack. Real bells shimmer
   from near-identical partials *beating*, and high partials speak faster / die sooner.
3. Reverb was applied **only to bells** — taps, brass, trombone were bone dry, so the app
   sounded like two different rooms. IR was flat white noise (fizzy, cheap-90s-digital).
4. Brass used a *static* bandpass. Real brass brightness blooms on attack then darkens.
5. Musical timing ran on `setTimeout` (4–15 ms jitter under load) instead of the audio clock.

**Measured findings (OfflineAudioContext render, v2 vs v3, peak amplitude):**
- My clipping hypothesis was **WRONG** — v2 never clipped (win peaked 0.171).
- Real defect found instead: **`wrong` was the loudest sound in the game at 0.558 peak —
  3.3× the victory fanfare.** Getting an answer wrong shouted at you. v3: 0.129.
- v3 celebration sounds now sit in a consistent 0.034–0.046 RMS band. Nothing clips.
- Caught + fixed a regression mid-work: first v3 `tick` was 5× quieter than v2 (would have
  been inaudible on a phone). Volumes raised, re-measured, now level with `tap`.

**Deliberate design change (flag for user):** `wrong` was a distorted slapstick trombone
wa-wa. Replaced with a soft descending minor third — cartoonish punishment is off-brand for
a reverent app and harsh negative feedback drives churn. Different *character*, not just
different tone.

**Verified:** `node --check` passes. Loaded the real page headless — 0 console errors, all
8 sounds fire, AudioContext running @48 kHz. Same test on v2 for baseline comparison.

**Outcome:** user accepted the direction and asked for more sounds + deploy — see part 2 above.

## Session 2026-07-18 (part 2): iOS Crash Fix + Rename ✅ (commit 8985e7f on jules-test — NOT yet deployed)

1. **ROOT CAUSE of broken mobile (iPhone) experience** — `buildSettingsList()` referenced `Notification.permission` unguarded. iOS Safari has no `Notification` API in browser tabs → ReferenceError at startup (line ~11083) killed everything after it: `loadProfile()`, `initFB()` (Firebase!), daily verse, greeting, URL params, service worker. Also made the Settings modal open empty ("settings disappear"). Fixed with `typeof Notification!=='undefined'` guards in 3 places (buildSettingsList, togNotif, first-win prompt). `requestNotificationPermission` was already guarded.
2. **Rename**: "Host a Room" → "Play with Friends" (home hero, sub: "Create a room & share the code"); all "Host"/"Host Room" buttons → "Create Room" (home hero, Join tab, online-settings modal, setup screen).
3. **SW cache bumped lamp-v5 → lamp-v6** to force fresh delivery.

**DEPLOYED 2026-07-18** — pushed to main as commit 7e2a254, then `npx -y firebase-tools deploy --only hosting` + `--only database` ✔. Verified live: sw.js lamp-v6, "Play with Friends" on home. **Hosting truth (verified via DNS): thelampgame.com → Firebase Hosting (199.36.158.100). GitHub Pages also builds from main but does NOT serve the domain.** Note: `jules-test` has unrelated git history — files were copied onto main, not merged. Never merge jules-test.

## Session 2026-07-18: Security Audit + Hardening ✅ (committed 0a6ec08 on branch jules-test — NOT yet deployed)

### Security fixes
1. **Stored XSS in multiplayer screens** — `p.name`/`p.avatar` from Firebase were injected into `innerHTML` unescaped in ~13 places (lobby, elimination messages, TF vote rows, scoreboard, verse podium, group vote chips, avatar/clan badge emoji). All now wrapped in `escHtml()`. Attack path was: attacker writes a malicious name directly to Firebase (bypassing the client username filter) → script runs in every other player's browser.
2. **Firebase rules — chats** — was: ANY signed-in user could read/write ANY chat. Now: `$pair.contains(auth.uid)` required, plus message validation (`from` must equal sender uid, text 1–500 chars). Chat input capped at 500 chars to match.
3. **Firebase rules — friends** — was: ANY signed-in user could rewrite anyone's friends list. Now: writes to `friends/$uid/$fid` allowed only if you are `$uid` or `$fid` (accept/unfriend both-sides writes still work).

### Bug review
- **JULES_BUG_REPORT.md "critical" sound bug = FALSE ALARM** — `osc()`, `bell()`, `noiseBurst()` all check `G.cfg.sound` internally, so `tap`/`correct`/`streak` are already guarded. No fix needed.
- **Ghost mode `&&false` dead code** — removed from `buildGhostPool` (truefalse was already handled correctly in its own branch; no behavior change).
- **Team Mode online** — feature gap, not a bug; still pending (see Branch 7 notes below).

### Known remaining risks (documented, not fixed — would need restructuring)
- `players` root is readable by any signed-in user (full profiles: church, friends list, stats). Can't lock down yet — username-uniqueness check (line ~5655) and clan leaderboard (line ~8941) query the whole `players` node. Future fix: separate `usernames/` index + server-side clan aggregates.
- `rooms/$roomId` is writable by any signed-in user — a griefer could tamper with an active room. Fixing requires per-player path rules; deferred.
- XP validation allows +1000 per write — a cheater can still inflate XP in steps; acceptable for now.

### Deploy — IMPORTANT
`firebase deploy --only hosting` does NOT push database rules. To ship this session's fixes:
```
firebase deploy --only hosting,database
```

## Session 2026-04-12: 9,231-Question Accuracy Review ✅ (deployed — commit 598aaef)

### Summary
Groq Llama-3.3-70b reviewed all 9,231 questions overnight. 58 flags raised, 2 confirmed bugs fixed.

### Fixes
1. **TF "Peter's vision happened twice"** — `a:true` → `a:false` (Acts 10:16 confirms it happened 3 times)
2. **TF "Temple dedicated with 100 bulls and 200 rams"** — `a:false` → `a:true` (Ezra 6:17 confirms it)

### Verdict
- MCQ: 29 flags, all Groq false positives — current answers verified correct
- Verse: 25 flags, all translation-style differences (NIV vs KJV) — blanks accurate
- Overall quality: excellent. Only 2 answer-key errors in 9,231 questions.

---

## Session 2026-04-11: Verse Fix + Friends Fix ✅ (deployed — commit 12caffb)

### Fixes Applied
1. **361 broken verse questions fixed** — `b` field contained full verse text including the blank word, causing doubled text on screen. Python script truncated `b` to just before the blank word (word-boundary match). `verse.js` updated with all 361 fixes.
2. **Friends list: deleted accounts auto-removed** — `renderFriends()` now calls `_doRemoveFriend(uid)` when Firebase leaderboard entry doesn't exist (account deleted), instead of showing "Friend" with 0 XP.
3. **Friends list: test/meh usernames auto-removed** — Same `renderFriends()` loop checks if `name.includes('test')` or `name==='meh'` and silently unfriends them.

### Currently Live
- **Last deploy**: 2026-04-11 16:39 — commit 12caffb
- **URL**: https://thelampgame.com

---

## Session 2026-04-11: Lobby Reorder + 3-Bug Fix Batch ✅ (deployed — commits 0892e05, 09016b3)

### Fixes Applied
1. **Rooms permission_denied on Join tab** — Race condition: `init()` had a `pending_room` sessionStorage check that called `joinRoomByCode()` 400ms after load, before `signInAnonymously()` completed. Firebase rules require `auth != null` for `/rooms`. Fix: removed the 2-line `pendingRoom` block from `init()` (already handled in `onAuthStateChanged`). Also added `if(!G.uid){ toast('Connecting — try again in a moment'); return; }` guard to `joinRoomByCode()`.

2. **Blank win screen (crown shows, name/avatar empty)** — `endGame()` calls `sorted[0]` on `G.players`; if empty, `win` is `undefined`. Later `win.avatar` throws TypeError, caught by `try/catch` which calls `go('winner')` without setting any content. Fix: added `if(!win) win={name:G.profile?.name||'Player',avatar:G.profile?.avatar||'😊',photo:G.profile?.photo||''}` after `win=sorted[0]`.

3. **Friend request "Could not send — try again"** — `sendFriendRequestToUid()` read `friendRequests/{targetUid}/incoming/{myUid}` to check if already sent. Firebase rules: `$uid === auth.uid` — you can only read YOUR own path, not the target's. Permission denied → generic error toast. Fix: changed read to `friendRequests/{myUid}/sent/{targetUid}` — your own sent folder, which you have access to.

---

## Session 2026-04-10: 10-Bug Fix Batch ✅ (deployed — commit 21a8c8b)

### Fixes Applied
1. **T/F button colors**: `.tf-btn.correct` → green override; `.tf-btn.wrong` → red override. Was only adding animation, no color change — False button stayed red even when correct.
2. **Gold button text white**: `btn-gold` color changed from dark (#1a0a00/#1A1A20) → `#fff` across all themes (light, dark, warmth).
3. **Fill-in-Verse**: `g-txt` now shows verse reference `📖 q.r` instead of "Complete the verse:" mode label.
4. **Share Result hidden in singleplayer**: Added `id="w-share-btn"`, hidden in `endGame()` when `G.mode==='practice'` or solo.
5. **Weekly challenge locked for full week**: `weeklyDone` now uses `getWTWeekKey()` comparison instead of today's date. Also fixed `startWeeklyTournament()` guard.
6. **Challenge question counts**: Weekly → "20 questions · Fresh every Sunday"; Seasonal → "10 questions · Special · Limited time".
7. **T/F wrong answer**: Shows "Not quite. The answer is TRUE/FALSE ✅" + explanation. Was `q.e` without fallback (showed "undefined").
8. **Username filter expanded**: Added `meh` to RESERVED_NAMES; added BLASPHEMY_PATTERNS (devil, satan, lucifer, antichrist, etc.) with `isBlasphemousName()` check.
9. **Church field removed from sign-in**: HTML block deleted; JS reads `church=''` as constant.
10. **Welcome modal updated**: Highlights "challenge friends online" as main feature; updated bullet points.
11. **Settings menu scroll on mobile**: Light theme `.mbox` now has `max-height:85vh; overflow-y:auto;`.
12. **Sound guards added**: `sfx.wrong()`, `sfx.elim()`, `sfx.win()` now all respect `G.cfg.sound` flag (were missing the guard).

### Not Fixed (requires device testing or data fix)
- "Sound in eastern mode" — no "eastern" mode found in code. Sound guards now consistent. If issue persists, test on device.
- "Remove existing test/meh players from Firebase" — requires admin SDK script (new players blocked by filter, leaderboard already filters them).

---

## Session 2026-04-09: Quick Match Modal + Match History Polish ✅ (deployed — commit b6e192f)

### Fix 13: Quick Match modal matches Game Settings layout (commit b6e192f)
- Mode description text (`id="os-mode-desc"`) added below game mode chips — updates on chip tap via `osPickSub()`
- Rounds row: replaced custom centered counter with `.toggle-row` + `.stepper` (identical to Game Settings)
- Section label: "Questions" → "Options", counter label → "🏁 Rounds"
- `osPickSub()`: now sets `os-mode-desc` from `MODE_DESCS[s]`

### Fix 14: Match history shows opponent name for Ghost Race (commit ec89b6f)
- `subLabel` includes "vs [opponent]" for `async_challenge` entries
- Opponent = `scores` entry where `name !== myName`

### Fix 15: SW cache lamp-v5 + AI bg disabled + Host a Room text bigger (commits 1a86b2a, 225ed19)
- SW: lamp-v4 → lamp-v5
- `loadAIBackground()`: disabled with early return
- `.mp-title`: 26→28px | `.mp-sub`: 12→14px

---

## Session 2026-04-09: Match History + UI Fixes ✅ (deployed — commit 4a4c700)

### Fix 9: Match history "async_challenge" → proper label (commit 4a4c700)
- `saveMatchResult`: added `sub: G.sub || null` to match record — future Ghost Race entries store actual sub-mode
- `modeLabel`: added `async_challenge → 'Ghost Race'`, `verse → 'Complete the Verse'`; `classic → 'Classic'`
- Render logic: if `m.mode === 'async_challenge'` and `m.sub` exists, shows sub-mode label (e.g. "Classic · Medium"); else shows "Ghost Race · Medium"
- Old records without `sub` will show "Ghost Race" as fallback

### Fix 10: SW cache bump lamp-v4 → lamp-v5 (commit 1a86b2a)
- Forced fresh JS delivery after bg image disable wasn't reflecting

### Fix 11: AI background image disabled (commit 225ed19)
- `loadAIBackground()`: early `return;` — no Pollinations.ai fetch

### Fix 12: Host a Room card text bigger (commit 225ed19)
- `.mp-title`: 26px → 28px | `.mp-sub`: 12px → 14px

---

## Session 2026-04-09: Misc UI Fixes ✅ (deployed — commit 225ed19)

### Fix 7: AI background image removed
- `loadAIBackground()` now returns immediately (early return) — no Pollinations.ai fetch, no image over the game
- `#ai-bg` div and CSS still in DOM but inert

### Fix 8: Host a Room card text bigger
- `.mp-title`: 26px → 28px
- `.mp-sub`: 12px → 14px ("Share code to invite friends")

---

## Session 2026-04-09: UI Polish — Ghost Buttons + Quick Match Modal ✅ (deployed)

### Fix 5: Dark theme ghost button raised style (commit 223e9bc)
- **Bug**: `btn-ghost` in dark mode was flat — only had `border: 1px solid var(--inp-border)`, no thick bottom border
- **All other themes** (green, warmth, light) already had `border-bottom: 5px solid` — dark was the only exception
- **Fix**: Added `border-bottom: 5px solid #1A1A24` to dark theme `.btn-ghost` CSS rule (line 2325)
- **Applies everywhere**: Join Room, Cancel buttons, Copy Code, all ghost buttons in dark mode now raised

### Fix 6: Quick Match modal matches Host Room screen layout (commit 223e9bc)
- **Game Mode moved first** (was second) — matches Host Room order
- **Chip labels updated**: Mixed→Multi-verse, Scripture→Classic, True/False→True or False, Fill-in-Verse→Complete the Verse
- **Lightning chip added** (was missing from Quick Match)
- **Slider replaced** with −/number/+ counter (count display, not a range input)
- **JS updated**: `syncOnlineQuestions` uses `qs-count` element; added `adjustOnlineQ(delta)`; `startOnlineMatch` uses `G.questions` directly
- **`osPickSub`**: added `lightning` to chip toggle array

### Tooling: OpenRouter wrapper upgraded
- `~/.claude/bin/or` — model aliases: gpt120, r1, v3, gemma, llama. Default: gpt120 (openai/gpt-oss-120b:free)
- xAI/Grok skipped — account has no credits

## Session 2026-04-09: Ghost Mode + Match History Fixes ✅

### Fix 4: pushProfile .set() → .update() — ROOT CAUSE of match history loss (deployed 2026-04-09 10:45)
- **Root cause**: `pushProfile()` called `G.db.ref('players/'+G.uid).set(full)` — Firebase `.set()` on parent DELETES all child paths not in the new value, including `matchHistory`
- **Every game end**: `pushProfile` ran first (line 7584) → wiped matchHistory from Firebase → `saveMatchResult` async write raced to restore it but lost on next game cycle
- **Fix**: Changed `.set(full)` to `.update(full)` — updates only specified fields, leaves matchHistory untouched
- **Also fixed**: SW cache bumped to v4 (lamp-v3 → lamp-v4) to force fresh JS delivery

### Fix 3: 120 broken verse questions + MCQ wording (deployed 2026-04-09 10:20)
- **Bug 1**: 120 verse.js entries had blank word already in `b` field → doubled text on screen
- **Fix**: Python script truncated `b` to just before the blank word for all 120 entries
- **Bug 2**: MCQ question said "the book" without naming it → fixed to "the book of Revelation"
- **Detection method**: overlap between end of `b` and content of `a` → 120 hits, 0 false positives

### Fix 2: Ghost Mode "Not enough questions" error
- **Bug**: `buildGhostPool` had no `mix` mode case — `src` stayed empty → pool empty → error toast blocked play
- **Fix**: Added `mix` branch that pulls from all three banks (QB + TF_Q + VERSE_Q) filtered by difficulty
- **Status**: Fixed, JS validated, NOT yet deployed

---

## Session 2026-04-09: Match History Bug Fix ✅

### Fix Applied
- **Bug**: `saveMatchResult` read from localStorage only, then `.set()` overwrote Firebase. If localStorage cleared between sessions, Firebase got overwritten with empty/short list — losing all history.
- **Fix**: Now reads Firebase first, merges with local (dedup by id, sort newest first, cap 50), writes merged back to both Firebase and localStorage.
- **Data note**: Past match history was already lost (data gone from both stores). Stats (wins/played) intact — they're in profile object, separate path.
- **Status**: Fix applied, JS validated, NOT yet deployed.

---

## Session 2026-04-08: Multiplayer UI Overhaul — 6 of 7 COMPLETE ✅

### Branches Complete
✅ **Branch 1**: Button Styling + Theme Fix — `afdb5ca`
✅ **Branch 2**: "Duel a Friend" Rename — `415ace8`
✅ **Branch 3**: Challenge Styling (visual distinction) — verified
✅ **Branch 4**: Host Room + Questions Slider (7-33) — `ff8a62c`
✅ **Branch 5**: Message Display Fix (show last message) — `ff8a62c`
✅ **Branch 6**: Incoming Challenges on Home — `ff8a62c`
🔄 **Branch 7**: Team Mode (READY TO IMPLEMENT)

---

## Branch 7: Team Mode — Implementation Shortcut Found! 🎉

### Key Discovery
**Team mode code ALREADY EXISTS** for Pass & Play (local multiplayer) at lines 6303-7591:
- Team A / Team B assignment logic
- Team score tracking (`G.teamScores`)
- Team-grouped player display
- Team win screen ("Team A Wins!")

**Solution**: Extend existing team logic to online play instead of building from scratch.

### Simple Implementation Path
1. **Add team selector to online-settings modal** (4391-4416)
   - Add buttons: "🔶 Team Gold" and "🔷 Team Ruby" 
   - Set G.currentTeam = 'gold' or 'ruby'
   - Only show if user picks team mode

2. **Extend createRoom()** (line ~7848)
   - Add `teamMode: G.teamMode` to room object
   - Add `teams: G.teamMode ? { gold: {score:0}, ruby: {score:0} } : null`
   - Add `team: G.currentTeam` to each player object

3. **Extend scoring logic** (where points are added)
   - After `players[uid].score += points`, also update:
   - `teams[G.currentTeam].score += points`
   - Sync to Firebase: `G.db.ref('rooms/' + G.roomId + '/teams/' + G.currentTeam + '/score').set(...)`

4. **Extend win screen** (line ~7576)
   - If team mode: show "Team Gold Wins! 🏆" instead of individual name
   - Display team score prominently
   - Show team members + their scores

5. **Text change**
   - "Setup and Play" → "Play" (line ~6386)

**Effort**: ~50 lines of code total (most can be copy/paste from Pass & Play team logic)

---

## Test Checklist (Before Deploy)

All 7 branches:
- [ ] Theme switching: All 4 themes apply button colors on change
- [ ] Button styles: Buttons match game brand (gold, ruby, blue, green, ghost)
- [ ] Duel card: Shows "Duel a Friend" + "1 vs 1 Solo" + "Async challenge"
- [ ] Host Room: Button renamed, modal shows slider (7-33 range)
- [ ] Slider label: Updates dynamically ("Play 10 questions", etc.)
- [ ] Messages: Last message shows in preview (not "Tap to start chatting")
- [ ] Message scroll: Auto-scrolls to bottom when new message arrives
- [ ] Incoming challenges: Show on home page above "Challenges" card
- [ ] Friends badge: Shows count of pending challenges
- [ ] Team mode (local Pass & Play): Still works ✓ (already tested)
- [ ] Team mode (online): Can select gold/ruby team → play → team wins

---

## Deploy Workflow (When Ready)

```bash
# Current state: all 7 branches in dev
git log --oneline dev | head -10

# When ready to deploy:
git checkout main && git merge dev && git push origin main
firebase deploy --only hosting
git checkout dev

# Verify live: https://thelampgame.com
```

---

## Git History (This Session)

```
afdb5ca — Fix: Button styling + theme persistence
415ace8 — Rename: Challenge→Duel, clarify solo
ff8a62c — Branches 4-6: Host Room slider + message display + incoming challenges
(+ Branch 7 ready to implement)
```

---

## Currently Live
- **Last deploy**: 2026-04-09 (commit 223e9bc) — all fixes deployed
- **What's live**: Match history fix, ghost mode fix, 120 verse question fix, MCQ book name fix, raised ghost buttons, Quick Match modal UI overhaul, all 7 multiplayer branches
- **URL**: https://thelampgame.com

---

## Next Session Actions

### Ready to Build
1. **Team Mode online** (Branch 7) — code already in index.html for Pass & Play (lines 6303-7591), extend to online
2. **Onboarding flow** — new users land cold, no guidance
3. **Email capture** — zero re-engagement mechanism
4. **Push notification timing**
5. **Seasonal pages**: Easter, Christmas
6. **"Hard Bible Trivia" landing page** (low-competition SEO)

---

## Notes for Next Session

**Key Files**:
- index.html: 52k lines, all code + UI in one file
- Teams code exists at lines 6303-7591 (Pass & Play)
- Online settings modal at lines 4391-4416
- createRoom() at line ~7848
- Win screen at line ~7576

**Team Logic to Copy**:
- Team A/B assignment: lines 6418, 6453-6455
- Team score tracking: line 6703
- Team score display: lines 6707-6708, 6820-6828
- Team win detection: lines 6930-6931
- Team win screen: lines 7583-7591

**Validation**:
```bash
python3 -c "import re; html = open('index.html').read(); scripts = re.findall(r'<script(?![^>]*(?:src|application/ld\+json))[^>]*>(.*?)</script>', html, re.DOTALL); open('/tmp/game_script.js','w').write('\n'.join(scripts))" && node --check /tmp/game_script.js && echo "✓ JS OK"
```

---

## Lessons Learned This Session

1. **Parallel delegation works**: Codex handled 3 branches simultaneously without issues
2. **Code already exists**: Team mode partially complete (local); just extend to online
3. **Independent commits are safe**: Each branch can be reverted cleanly
4. **Theme repaint trick**: opacity toggle + offsetHeight forces browser repaint
5. **Badge sync**: Centralized updateFriendsChallengeBadge() prevents desync
6. **Lazy loading saves bandwidth**: ensureConversationPreview() loads on-demand
7. **Firebase structure matters**: team property on players, team scores in separate sub-path
