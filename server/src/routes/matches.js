import express from 'express'
import Match from '../models/Match.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.middleware.js'

const router = express.Router()

// POST /api/matches — called from Results page to save match
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      winnerId, loserId, 
      winnerDisplayName, loserDisplayName,
      problemId, winnerSolveTime, loserSolveTime,
      roomId 
    } = req.body

    

    // save match
    const match = await Match.create({
      winnerId, loserId,
      winnerDisplayName, loserDisplayName,
      problemId, winnerSolveTime, loserSolveTime,
      roomId
    })

    // update winner wins + loser losses at the same time
    await Promise.all([
      User.findOneAndUpdate({ uid: winnerId }, { $inc: { wins: 1, totalMatches: 1 } }),
      User.findOneAndUpdate({ uid: loserId },  { $inc: { losses: 1, totalMatches: 1 } })
    ])

    res.status(201).json(match)
  } catch (err) {
    // duplicate roomId — match already saved by the other player (or StrictMode double-fire)
    if (err.code === 11000) {
      const existing = await Match.findOne({ roomId: req.body.roomId })
      return res.status(200).json(existing)
    }
    res.status(500).json({ error: err.message })
  }
})

export default router