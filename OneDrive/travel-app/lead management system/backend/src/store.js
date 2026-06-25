const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function ensureDb(){
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) fs.writeFileSync(DB_FILE, JSON.stringify({ leads: [] }, null, 2));
}

function readDb(){ ensureDb(); return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
function writeDb(obj){ fs.writeFileSync(DB_FILE, JSON.stringify(obj, null, 2)); }

async function createLead(data){
  const db = readDb();
  const id = crypto.randomBytes(12).toString('hex');
  const lead = {
    _id: id,
    fullName: data.fullName,
    email: data.email,
    phone: data.phone || '',
    company: data.company || '',
    requirement: data.requirement || '',
    createdAt: new Date().toISOString(),
    emailSent: !!data.emailSent,
    emailId: data.emailId || crypto.randomBytes(12).toString('hex'),
    events: []
  };
  db.leads.push(lead);
  writeDb(db);
  return lead;
}

async function findLeads(){
  const db = readDb();
  return db.leads.sort((a,b)=> new Date(b.createdAt) - new Date(a.createdAt));
}

async function findLeadByEmailId(emailId){
  const db = readDb();
  return db.leads.find(l => l.emailId === emailId);
}

async function updateLeadById(id, patch){
  const db = readDb();
  const idx = db.leads.findIndex(l => l._id === id || l.emailId === id);
  if (idx === -1) return null;
  db.leads[idx] = { ...db.leads[idx], ...patch };
  writeDb(db);
  return db.leads[idx];
}

async function countDocuments(filter){
  const db = readDb();
  if (!filter || Object.keys(filter).length === 0) return db.leads.length;
  // simple filter only for emailSent and events
  if (filter.emailSent !== undefined) return db.leads.filter(l => l.emailSent === filter.emailSent).length;
  if (filter['events.type']) return db.leads.filter(l => (l.events||[]).some(e=>e.type===filter['events.type'])).length;
  return db.leads.length;
}

async function countClickEvents(){
  const db = readDb();
  let clicks = 0;
  for (const l of db.leads){
    (l.events||[]).forEach(e => { if(e.type === 'click') clicks++; });
  }
  return clicks;
}

async function addEvent(emailId, event){
  const db = readDb();
  const l = db.leads.find(x => x.emailId === emailId || x._id === emailId);
  if (!l) return null;
  l.events = l.events || [];
  l.events.push({ ...event, createdAt: new Date().toISOString() });
  writeDb(db);
  return l;
}

module.exports = {
  createLead,
  findLeads,
  findLeadByEmailId,
  updateLeadById,
  countDocuments,
  countClickEvents,
  addEvent
};
