# Groundwork: handoff

Calisthenics + mobility + fascia workout app. Built 2026-11-01 for Rubirosa.
Status: **v1 done, tested, installed on PC (zip) and live on phone (private link).**

---

## 1. Where everything is

| What | Where |
|---|---|
| App source (the only real code) | `app/index.html` (one file: HTML + CSS + JS, ~90 KB) |
| App icon | `app/icon.ico` |
| Windows installer | `Install.bat` → `install.ps1` |
| Uninstaller | `Uninstall.bat` → `uninstall.ps1` |
| User guide | `README.txt` |
| Feature list | `FEATURES.md` |
| Research notes + sources | `RESEARCH.md` |
| Phone build script | `dev/build-phone.py` |
| Browser tests | `dev/test-desktop.js`, `dev/test-timers.js`, `dev/test-phone.js` |
| PC download | `apps/groundwork.zip` (in the Claude project files) |
| Screenshots | `apps/groundwork-today.png`, `-workout.png`, `-skills.png`, `-progress.png` |
| Phone version | https://claude.ai/artifact/HyYoGGBzUD4k2jdj6XEmz6 (private, only you) |

## 2. GitHub repos

| Repo | Role | Groundwork code in it? |
|---|---|---|
| https://github.com/jrtorres13/ui-ux-pro-max-skill | Project repo. Design skill used to pick colors, fonts, style | **No.** Nothing was committed |
| https://github.com/nextlevelbuilder/ui-ux-pro-max-skill | Upstream of your fork | No |

- **Groundwork is not in any GitHub repo yet.** It only lives in the Claude project files and the zip.
- First thing on the terminal: download `groundwork.zip`, unzip, and (if you want) `git init` it or put it in a repo.

## 3. Decisions you already made

- **Name:** Groundwork.
- **Focus:** calisthenics + mobility + fascia, not gym/weights.
- **Research first**, then build (done: see `RESEARCH.md`).
- **Format:** same as your other apps (Morning Brief, JobSite CRM): one offline `index.html`, Windows installer, zip + screenshots.
- **Design:** from the ui-ux-pro-max skill: dark, energy orange + success green, Barlow Condensed / Barlow fonts, bold block style.
- **Simple, eye-catching, user-friendly UI.**
- **Phone support:** via a private claude.ai link (artifact), not an app store app.
- **Syncing PC ↔ phone:** manual **backup code** (copy/paste). No accounts, no cloud.
- **Data stays on the device** (localStorage). No API keys, no server.
- **Weekly plan:** Mon/Wed/Fri Full-Body Strength · Tue Fascia Flow · Thu Deep Mobility · Sat Core & Skills · Sun Rest + CARs.
- **Progression model:** start 3x5, +1 rep per session, at 3x8 a "Level up" button appears. Holds: 15s → 40s, +5s.
- **No auto-start at Windows sign-in** (unlike Morning Brief).

## 4. How it works (for the next dev)

- **Data:** `localStorage` key `groundwork.v1`
  ```json
  { "onboarded": true,
    "settings": { "sound":1, "voice":0, "rest":1, "theme":"dark|light|auto" },
    "lad":  { "push": { "lvl":2, "tgt":6 }, ... },
    "hist": [ { "id","date","wid","name","tag","dur","sets","reps","secs","partial" } ],
    "custom": [ { "id","n","cat","tag":"Custom","d","b":[{ "x","k","v","r" }] } ] }
  ```
  Backup code = this JSON.
- **Content tables in the JS:** `EX` (77 exercises), `LADDERS` (8 ladders, 42 steps), `RULE` (rep/hold targets), `START` (level presets), `WORKOUTS` (8 plans), `PLAN` (weekday → workout), `LEARN`, `SOURCES`.
- **Workout blocks:** `x` = exercise id or `L:<ladder>` (uses your current level), `k` = sets, `v` = reps/secs, `r` = rest secs.
- **Player:** `startWorkout()` → flat list of prep/work/rest steps → `finish()` saves history + updates ladders.
- **No `confirm()`/`alert()`:** uses the in-page `ask()` dialog (phones block native pop-ups).

## 5. Build, test, ship

```bash
# Run the tests (needs Node + Playwright with Chromium)
npm i -D playwright && npx playwright install chromium
node dev/test-desktop.js   # full workout, level-ups, custom builder, reload, theme
node dev/test-timers.js    # countdown, pause, level-up button
node dev/test-phone.js     # iPhone + small Android sizes, dialogs, backup/restore

# Make the phone copy, then publish it to the same artifact link
python3 dev/build-phone.py   # writes dev/groundwork-phone.html

# Rebuild the PC zip (from the apps folder)
zip -r groundwork.zip groundwork
```
- To update the **phone link**, ask Claude: "publish dev/groundwork-phone.html to https://claude.ai/artifact/HyYoGGBzUD4k2jdj6XEmz6".
- To update the **PC app**: unzip new version, run `Install.bat` again. Data is kept (`%LOCALAPPDATA%\Groundwork`).

## 6. Known issues / limits

- Streak breaks on the planned Sunday rest day.
- PC and phone data are separate until you paste a backup code.
- Exercise demos are YouTube search links, not built-in videos or animations.
- Google Fonts need internet the first time; offline it falls back to system fonts.
- The phone link needs a claude.ai login (private).
- `downloadBackup()` is still in the code but unused on the phone build.

## 7. What's left (ideas, none started)

1. Put Groundwork in a GitHub repo (your choice which).
2. Rest days shouldn't break the streak.
3. Exercise animations or images (stick figures or short clips).
4. Real sync between PC and phone (needs a small backend or a cloud store).
5. Standalone phone app (PWA on your own domain, or native).
6. Progress charts per ladder (reps over time), personal records.
7. Workout reminders / notifications.
8. Editing custom workouts (right now: create and delete only).
9. Warm-up / cool-down auto-added to custom workouts.

## 8. Starter prompt (paste into Claude Code)

```
I'm continuing work on Groundwork, my calisthenics + mobility + fascia app.
Read HANDOFF.md first, then RESEARCH.md and app/index.html.
Rules: keep it one offline index.html, keep my decisions in HANDOFF.md section 3,
use in-page dialogs (no confirm/alert), keep data in localStorage key groundwork.v1.
After any change: run the 3 tests in dev/, then run dev/build-phone.py.
Keep replies short and organized, no long paragraphs.
First task: <what you want next, e.g. "rest days shouldn't break the streak">
```
