import React from 'react'
import { submitLead } from '../api'

export default function LeadForm(){
  const [form, setForm] = React.useState({ fullName:'', email:'', phone:'', company:'', requirement:'' })
  const [status, setStatus] = React.useState(null)

  function update(e){
    const { name, value } = e.target
    setForm(f=>({...f,[name]:value}))
  }

  async function onSubmit(e){
    e.preventDefault()
    setStatus('sending')
    try{
      const res = await submitLead(form)
      setStatus('sent')
    }catch(err){
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <div style={{maxWidth:600}}>
      <h2>Capture Lead</h2>
      <form onSubmit={onSubmit}>
        <div><label>Full Name</label><br/><input name="fullName" value={form.fullName} onChange={update} required /></div>
        <div><label>Email</label><br/><input type="email" name="email" value={form.email} onChange={update} required /></div>
        <div><label>Phone</label><br/><input name="phone" value={form.phone} onChange={update} /></div>
        <div><label>Company</label><br/><input name="company" value={form.company} onChange={update} /></div>
        <div><label>Requirement</label><br/><textarea name="requirement" value={form.requirement} onChange={update} /></div>
        <div style={{marginTop:10}}><button type="submit">Submit</button></div>
      </form>
      <div style={{marginTop:12}}>
        {status === 'sending' && <span>Sending...</span>}
        {status === 'sent' && <span style={{color:'green'}}>Sent! Check your email (or console for preview).</span>}
        {status === 'error' && <span style={{color:'red'}}>Error sending.</span>}
      </div>
    </div>
  )
}
