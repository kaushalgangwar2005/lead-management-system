import React from 'react'
import Dashboard from './components/Dashboard'
import LeadForm from './components/LeadForm'

export default function App(){
  const [view, setView] = React.useState('form')
  return (
    <div style={{padding:20,fontFamily:'Arial,Helvetica,sans-serif'}}>
      <header style={{display:'flex',gap:10,marginBottom:20}}>
        <button onClick={()=>setView('form')}>Lead Form</button>
        <button onClick={()=>setView('dashboard')}>Analytics Dashboard</button>
      </header>
      {view === 'form' ? <LeadForm /> : <Dashboard />}
    </div>
  )
}
