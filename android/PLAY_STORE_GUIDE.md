# Publishing Lamp to the Google Play Store — Step by Step

What you have in this folder:
- **app-release-bundle.aab** — the file you upload to the Play Store (this is the app)
- **app-release-signed.apk** — same app, installable directly on any Android phone for testing (send it to yourself via Telegram/Drive, open it on the phone, allow "install unknown apps")
- **android.keystore + signing-info.txt** — your signing key and its passwords. **Back both up somewhere safe (e.g. Google Drive). Never put them on GitHub.** They are already excluded from git.

The app is a "Trusted Web Activity" — a thin Android shell around thelampgame.com. The game itself always loads from your website, so **future game updates need no new app release** — you just deploy the site like always. You only rebuild the app if you change the icon, name, or Android-level settings.

---

## Part 1 — One-time account setup (~15 min + $25)

1. Go to https://play.google.com/console and sign in with your Google account.
2. Pay the one-time $25 registration fee.
3. Google will ask you to verify your identity (ID document). This can take a day or two — start it now.

## Part 2 — Create the app (~20 min)

1. In Play Console click **Create app** → name: `Lamp: Bible Trivia`, default language English, type **Game**, **Free**.
2. Go to **Test and release → Production → Create new release** (better: start with **Internal testing** first — same steps, zero risk).
3. When asked about signing, accept **Play App Signing** (recommended — Google keeps the master key so you can never lose it).
4. Upload **app-release-bundle.aab** from this folder.
5. Release name: `1.0.0`. Release notes: "First release — 9,231 Bible questions, multiplayer, challenges, AI study insights."

## Part 3 — IMPORTANT: link the app to your website (5 min, do right after first upload)

Because the app is a shell around your site, Android needs proof you own both. Half of this is already done (the proof file is live at thelampgame.com/.well-known/assetlinks.json). The other half needs one value only Google can give you:

1. In Play Console go to **Test and release → Setup → App signing** (name may vary slightly).
2. Under **App signing key certificate**, copy the **SHA-256 certificate fingerprint** (looks like `AB:CD:12:...`).
3. Give that fingerprint to Claude in your next session ("add this Play fingerprint to assetlinks and deploy") — or edit `.well-known/assetlinks.json` yourself: add it as a second entry in the `sha256_cert_fingerprints` list, then run the usual Firebase deploy.

Without this step the app opens with a browser address bar at the top. With it, it looks fully native.

## Part 4 — Store listing (~30 min)

**App details** (Grow → Store presence → Main store listing):

Short description (paste):
> Dive into a fun, faith-filled adventure with Lamp: Bible Trivia!

Full description (paste):
> 🌟 A Spiritual Journey Awaits! 🌟
>
> Embark on an exciting quest with Lamp: Bible Trivia, a game that combines fun and faith. Test your knowledge, grow closer to God's word, and enjoy a unique gaming experience!
>
> 🤔 Challenge Yourself:
> With over 9,000 questions, you'll never run out of challenges! Explore multiple choice, true/false, and complete-the-verse formats, covering every book of the Bible. From Genesis to Revelation, and even parables and miracles, there's something for every believer.
>
> 📖 Explore Categories:
> Dive deep into specific topics like Women of the Bible, Bible Geography, and more. With 19 categories, you can focus on your favorite stories or expand your knowledge across the entire Bible.
>
> 🔥 Ignite Your Faith:
> Progress through difficulty levels — Disciple, Apostle, and Scholar — as you grow in your understanding. Daily and weekly challenges keep you engaged, and seasonal events add a touch of surprise!
>
> 🤝 Play Together:
> Invite friends to private rooms using room codes, and engage in friendly 1v1 duels. Race against ghosts to beat high scores, and join Houses of Faith to compete on leaderboards.
>
> 🎯 Achieve and Learn:
> Earn achievements and unlock rewards. After each quiz, gain insights from AI-powered study tools, helping you reflect and grow. With beautiful themes and offline access, Lamp is always ready when you are.
>
> 🎁 A Gift for All:
> Lamp: Bible Trivia is free, with no ads to interrupt your journey. Download now and let your faith shine! 🌟

**Graphics you need:**
- App icon 512×512 → use `icon-512.png` from the project root ✔ (already have)
- Feature graphic 1024×500 → in `store-assets/` if generated, else make one in Canva ("Lamp: Bible Trivia" on the dark gold background)
- At least 2 phone screenshots → in `store-assets/` if generated, or take them on your phone at thelampgame.com

**Privacy policy URL:** `https://thelampgame.com/privacy.html` ✔ (already live)

## Part 5 — Questionnaires (~20 min)

- **Content rating**: category "Game". Answer honestly — no violence, no gambling, no user-generated content except **chat: YES** (the game has player chat). You'll likely get Everyone/PEGI 3-7.
- **Data safety**: the app connects to Firebase. Declare:
  - Collected: App activity (gameplay stats, scores), User IDs (anonymous account ID), User-generated content (chat messages, display name)
  - NOT collected: location, contacts, financial info, photos
  - Data is encrypted in transit: Yes. Users can request deletion: Yes (delete account in app settings if available, or via contact email).
- **Ads**: No. **Target audience**: 13+ is simplest (avoids extra children's policy rules).

## Part 6 — Submit

Click **Send for review**. First review usually takes 1-7 days. Start with Internal testing → promote the same release to Production once you've tried it on your own phone.

---

## Rebuilding the app later (only if icon/name/etc. change)

```
cd "~/My Projects/AI projects/Lamp - Bible Trivia Online/android"
export BUBBLEWRAP_KEYSTORE_PASSWORD=$(grep 'Store password' signing-info.txt | awk -F': ' '{print $2}')
export BUBBLEWRAP_KEY_PASSWORD="$BUBBLEWRAP_KEYSTORE_PASSWORD"
npx -y @bubblewrap/cli update --skipVersionUpgrade
npx -y @bubblewrap/cli build --skipPwaValidation
```
(Remember to raise `appVersionCode` by 1 in `twa-manifest.json` for every new Play upload.)
