# Who Plays Today?

Women's college basketball: Top 25 games, TV networks, live scores, search, and a favorite-team picker.

## Files
- `index.html` – the whole app (no build step)
- `api/espn.js` – small server function that fetches ESPN's scoreboard, AP rankings and team list
- `package.json` – lets Vercel recognize the project

## Deploy (free, about 10 minutes)
1. Make a free account at vercel.com.
2. Put this folder in a GitHub repo (or use `npx vercel` from this folder).
3. In Vercel choose **Add New → Project**, import the repo, and click **Deploy**. No settings needed.
4. Open the link on your phone and use Share → **Add to Home Screen**.

## First-day checks (the ESPN feed is unofficial)
- Open `https://YOUR-SITE/api/espn?path=scoreboard` and confirm you see games. If the list looks like men's or other divisions, the `groups` value in `api/espn.js` is the thing to adjust.
- Open `https://YOUR-SITE/api/espn?path=teams`, copy any team's `id`, then open `.../api/espn?path=schedule&team=THAT_ID` to confirm a team's schedule loads (this powers the "next game" card).
- Confirm networks show on game cards and the AP badges match the latest poll.
- If ESPN ever changes its feed, only `normEvent()` in `index.html` needs updating.

## How friends pick their team
The first time someone opens the link, the app asks for a favorite team. It re-colors itself and pins that team's games on top. The choice is saved on their own device, so everyone gets their own version from the same link.
