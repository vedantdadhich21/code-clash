import express from 'express'
import User from '../models/User.js'

const router = express.Router()

// GET /api/leaderboard — public, no auth needed
router.get('/', async (req, res,next) => {
  try {
    const players = await User.find({ wins: { $gt: 0 } })  // only players with wins
      .sort({ wins: -1 })   // highest wins first
      .limit(10)
      .select('displayName photoURL wins losses totalMatches uid')  // only send these fields

    const leaderboard = players.map(p => ({
          ...p.toObject(),
          winRate: p.totalMatches > 0
            ? Math.round((p.wins / p.totalMatches) * 100)
            : 0
        }))
        res.json({ data: leaderboard })
  } catch (err) {
    next(err)
  }
})

export default router