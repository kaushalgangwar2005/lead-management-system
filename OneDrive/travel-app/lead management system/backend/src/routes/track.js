const express = require('express');
const router = express.Router();
const store = require('../store');

// 1x1 GIF transparent
const pixelGif = Buffer.from(
  'R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=',
  'base64'
);

router.get('/open/:emailId', async (req, res) => {
  try {
    const { emailId } = req.params;
    await store.addEvent(emailId, { type: 'open' });

    res.set('Content-Type', 'image/gif');
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    return res.send(pixelGif);
  } catch (err) {
    console.error(err);
    res.status(500).end();
  }
});

router.get('/click/:emailId', async (req, res) => {
  try {
    const { emailId } = req.params;
    const url = req.query.url || process.env.FRONTEND_URL || 'https://example.com';
    await store.addEvent(emailId, { type: 'click', url });
    return res.redirect(url);
  } catch (err) {
    console.error(err);
    return res.redirect(process.env.FRONTEND_URL || 'https://example.com');
  }
});

module.exports = router;
