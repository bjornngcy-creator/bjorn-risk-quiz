import { appendToSheet } from '../../lib/sheets'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, phone, score, profile, coachingInterest, answers } = req.body

  if (!name || !email || !score || !profile) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  try {
    const timestamp = new Date().toLocaleString('en-SG', { timeZone: 'Asia/Singapore' })

    await appendToSheet([
      timestamp,
      name,
      email,
      phone || '',
      score,
      profile,
      coachingInterest ? 'Yes' : 'No',
      ...(answers || []),
    ])

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error('Sheets error:', err)
    return res.status(500).json({ error: 'Failed to save submission' })
  }
}
