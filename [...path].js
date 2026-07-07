// Serverless proxy for fal.ai calls.
//
// The browser never sees FAL_KEY. It calls /api/fal/<...> instead of
// https://queue.fal.run/<...> directly, and this function re-attaches
// the real fal.ai endpoint + Authorization header before forwarding.
//
// Set FAL_KEY in Vercel → Project → Settings → Environment Variables.
// Do NOT put it in this file or in .env committed to git.

module.exports = async (req, res) => {
  const falKey = process.env.FAL_KEY;

  if (!falKey) {
    res.status(500).json({ error: 'FAL_KEY is not configured on the server. Set it in Vercel project env vars.' });
    return;
  }

  const segments = Array.isArray(req.query.path) ? req.query.path : [req.query.path];
  const falUrl = `https://queue.fal.run/${segments.join('/')}`;

  try {
    const upstream = await fetch(falUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Key ${falKey}`,
      },
      body: ['GET', 'HEAD'].includes(req.method) ? undefined : JSON.stringify(req.body),
    });

    const contentType = upstream.headers.get('content-type') || 'application/json';
    const bodyText = await upstream.text();

    res.status(upstream.status);
    res.setHeader('Content-Type', contentType);
    res.send(bodyText);
  } catch (err) {
    res.status(502).json({ error: 'Failed to reach fal.ai', detail: String(err) });
  }
};
