const mongoose = require('mongoose');

const EmailEventSchema = new mongoose.Schema({
  type: { type: String, enum: ['open', 'click'], required: true },
  url: String,
  createdAt: { type: Date, default: Date.now }
});

const LeadSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  company: String,
  requirement: String,
  createdAt: { type: Date, default: Date.now },
  emailSent: { type: Boolean, default: false },
  emailId: { type: String, index: true },
  events: [EmailEventSchema]
});

module.exports = mongoose.model('Lead', LeadSchema);
