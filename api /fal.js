// Serverless proxy for fal.ai calls.
//
// This is a single, fixed-path function (no dynamic route segments —
// those aren't reliably supported outside a framework like Next.js on
// Vercel's zero-config static + functions setup, which is what caused
// the earlier 404).
//
// The browser calls:
//   POST /api/fal?path=fal-ai%2Fflux-pro%2Fkontext        (submit a job)
//   GET  /api/fal?url=<the exact status_url fal.ai returned>
//   GET  /api/fal?url=<the exact response_url fal.ai returned>
//
// FAL_KEY is read from the server environment and attached here — it is
// never sent to or visible in the browser.

module.exports = async (req, res) => {
  const falKey = process.env.FAL_KEY;

  if (!falKey) {
    res.status(500).json({ error: 'FAL_KEY is not configured on the server. Set it in Vercel project env vars.' });
    return;
  }

  let target;
  if (req.query.url) {
    target = req.query.url;
  } else if (req.query.path) {
    target = `https://queue.fal.run/${req.query.path}`;
  } else {
    res.status(400).json({ error: 'Missing "path" or "url" query parameter.' });
    return;
  }

  // Safety: only ever forward to fal.ai's queue domain.
  if (!target.startsWith('https://queue.fal.run/')) {
    res.status(400).json({ error: 'Refusing to forward to a non-fal.ai target.' });
    return;
  }

  try {
    const upstream = await fetch(target, {
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
