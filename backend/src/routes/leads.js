const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const store = require('../store');
const { sendMail } = require('../utils/mailer');

const BACKEND_URL = process.env.BACKEND_URL || `http://localhost:${process.env.PORT||4000}`;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.post('/', async (req, res) => {
  try {
    const { fullName, email, phone, company, requirement } = req.body;
    if (!fullName || !email) return res.status(400).json({ error: 'name and email required' });

    const emailId = crypto.randomBytes(12).toString('hex');
    const lead = await store.createLead({ fullName, email, phone, company, requirement, emailId });

    // Build email content with tracking pixel and tracked link
    const openPixel = `${BACKEND_URL}/api/track/open/${emailId}`;
    const trackedLink = `${BACKEND_URL}/api/track/click/${emailId}?url=${encodeURIComponent(FRONTEND_URL)}`;

    const html = `
      <p>Hi ${fullName},</p>
      <p>Thanks for reaching out. We'll review your requirement:</p>
      <blockquote>${requirement || ''}</blockquote>
      <p><a href="${trackedLink}">View submission</a></p>
      <img src="${openPixel}" alt="" width="1" height="1" style="display:block;" />
    `;

    const info = await sendMail({
      from: process.env.SMTP_FROM || `no-reply@${process.env.SMTP_HOST || 'example.com'}`,
      to: email,
      subject: 'Thanks for your submission',
      html
    });

    await store.updateLeadById(lead._id, { emailSent: true });

    const response = { leadId: lead._id };
    if (info && info.messageId) response.messageId = info.messageId;
    if (info && info.previewUrl) response.previewUrl = info.previewUrl;

    return res.json(response);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

router.get('/', async (req, res) => {
  const leads = await store.findLeads();
  res.json(leads.slice(0,100));
});

router.get('/analytics', async (req, res) => {
  const total = await store.countDocuments({});
  const emailsSent = await store.countDocuments({ emailSent: true });
  const emailsOpened = await store.countDocuments({ 'events.type': 'open' });
  const clicks = await store.countClickEvents();
  const openRate = emailsSent ? (emailsOpened / emailsSent) : 0;
  const clickRate = emailsSent ? (clicks / emailsSent) : 0;

  res.json({ totalLeads: total, emailsSent, emailsOpened, openRate, linkClicks: clicks, clickRate });
});

module.exports = router;
