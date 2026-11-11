// Tiny proxy so the browser never talks to ESPN directly (avoids CORS issues,
// lets us cache, and only allows four known routes).
const BASE = 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball';
const TTL = { scoreboard: 20, rankings: 900, teams: 86400, schedule: 600 }; // seconds

module.exports = async (req, res) => {
  const { path, dates, team } = req.query;
  let url;

  if (path === 'scoreboard') {
    const qs = new URLSearchParams({ groups: '50', limit: '400' }); // groups=50: Division I
    if (/^\d{8}$/.test(dates || '')) qs.set('dates', dates);
    url = `${BASE}/scoreboard?${qs}`;
  } else if (path === 'rankings') {
    url = `${BASE}/rankings`;
  } else if (path === 'teams') {
    url = `${BASE}/teams?limit=500`;
  } else if (path === 'schedule') {
    if (!/^\d{1,6}$/.test(team || '')) return res.status(400).json({ error: 'bad team id' });
    url = `${BASE}/teams/${team}/schedule`;
  } else {
    return res.status(400).json({ error: 'unknown path' });
  }

  try {
    const r = await fetch(url, { headers: { 'User-Agent': 'who-plays-today' } });
    if (!r.ok) throw new Error('ESPN answered ' + r.status);
    const data = await r.json();
    const ttl = TTL[path];
    res.setHeader('Cache-Control', `public, s-maxage=${ttl}, stale-while-revalidate=${ttl * 3}`);
    return res.status(200).json(data);
  } catch (e) {
    return res.status(502).json({ error: String(e.message || e) });
  }
};
