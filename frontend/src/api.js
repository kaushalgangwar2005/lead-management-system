const BACKEND = import.meta.env.VITE_BACKEND_URL || 'https://lead-management-system-t1j6.onrender.com/'

export async function submitLead(payload){
  const res = await fetch(`${BACKEND}/api/leads`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  if (!res.ok) throw new Error('Failed')
  return res.json()
}

export async function fetchAnalytics(){
  const res = await fetch(`${BACKEND}/api/leads/analytics`)
  if(!res.ok) throw new Error('Failed')
  return res.json()
}

export async function fetchLeads(){
  const res = await fetch(`${BACKEND}/api/leads`)
  if(!res.ok) throw new Error('Failed')
  return res.json()
}
