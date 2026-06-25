import React from 'react'
import { fetchAnalytics } from '../api'

export default function Dashboard(){
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  React.useEffect(()=>{ load() }, [])
  async function load(){
    setLoading(true)
    try{
      const d = await fetchAnalytics()
      setData(d)
    }catch(e){ console.error(e) }
    setLoading(false)
  }

  if(loading) return <div>Loading...</div>
  if(!data) return <div>No data</div>

  return (
    <div style={{maxWidth:800}}>
      <h2>Analytics Dashboard</h2>
      <ul>
        <li><strong>Total Leads:</strong> {data.totalLeads}</li>
        <li><strong>Emails Sent:</strong> {data.emailsSent}</li>
        <li><strong>Emails Opened:</strong> {data.emailsOpened}</li>
        <li><strong>Open Rate:</strong> {(data.openRate*100).toFixed(2)}%</li>
        <li><strong>Link Clicks:</strong> {data.linkClicks}</li>
        <li><strong>Click Rate:</strong> {(data.clickRate*100).toFixed(2)}%</li>
      </ul>
    </div>
  )
}
