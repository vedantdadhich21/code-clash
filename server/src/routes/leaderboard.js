import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET /api/leaderboard — public, no auth needed
router.get('/', async (req, res) => {
  try {
    const players = await User.find({ wins: { $gt: 0 } })  // only players with wins
      .sort({ wins: -1 })   // highest wins first
      .limit(10)
      .select('displayName photoURL wins losses uid')  // only send these fields

    res.json(players)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router