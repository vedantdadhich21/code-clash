import express from 'express'
import Match from '../models/Match.js'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// POST /api/matches — called from Results page to save match
router.post('/', verifyToken, async (req, res) => {
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
      User.findOneAndUpdate({ uid: winnerId }, { $inc: { wins: 1 } }),
      User.findOneAndUpdate({ uid: loserId },  { $inc: { losses: 1 } })
    ])

    res.status(201).json(match)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router