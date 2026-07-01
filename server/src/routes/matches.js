import express from 'express'
import Match from '../models/Match.js'
import User from '../models/User.js'
import authMiddleware from '../middleware/auth.middleware.js'
import { body } from 'express-validator'
import validate from '../middleware/validate.js'
import { getDatabase } from '../config/firebase.js'
import determineWinner from './determineWinner.js'

const router = express.Router()

router.post('/', authMiddleware, 
  [
    body('roomId').notEmpty().withMessage("Room Id is required")
  ],
  validate,
  async (req, res, next) => {
    try {
      const { roomId } = req.body
      const callerUid = req.user.firebaseUid


      const roomSnapshot = await getDatabase()
        .ref(`rooms/${roomId}`)
        .once('value')
      
      const roomData = roomSnapshot.val()
      if (!roomData) {
        return res.status(404).json({ error: 'Room not found' })
      }
      
      const playerUids = [
        roomData.player1?.uid,
        roomData.player2?.uid
      ].filter(Boolean)
      
      if (!playerUids.includes(callerUid)) {
        return res.status(403).json({ error: 'You are not a participant in this room' })
      }

      const result = determineWinner(roomData)
      if (!result) {
        return res.status(400).json({ error: 'No clear winner (draw/timeout)' })
      }

      const { winner, loser } = result


      const match = await Match.create({
        winnerId: winner.uid,
        loserId: loser.uid,
        winnerDisplayName: winner.displayName,
        loserDisplayName: loser.displayName,
        problemId: roomData.problem?.problem_id || null,
        winnerSolveTime: winner.solveTime || null,
        loserSolveTime: loser.solveTime || null,
        roomId
      })

      await Promise.all([
        User.findOneAndUpdate({ uid: winner.uid }, { $inc: { wins: 1, totalMatches: 1 } }),
        User.findOneAndUpdate({ uid: loser.uid },  { $inc: { losses: 1, totalMatches: 1 } })
      ])

      res.status(201).json(match)
    } catch (err) {
      if (err.code === 11000) {
        const existing = await Match.findOne({ roomId: req.body.roomId })
        return res.status(200).json({ data: existing })
      }
      next(err)
    }
  }
)


router.get('/:userId',
  authMiddleware,
  async (req, res, next) => {
    try {
      const { userId } = req.params
      const page = parseInt(req.query.page) || 1
      const limit = parseInt(req.query.limit) || 10
      const skip = (page - 1) * limit 
      const [matches, totalCount] = await Promise.all([
        Match.find({
          $or: [{ winnerId: userId }, { loserId: userId }]
        })
          .sort({ playedAt: -1 })
          .skip(skip)
          .limit(limit),
        Match.countDocuments({
           $or: [{ winnerId: userId }, { loserId: userId }]
        })
      ])
      res.json({
        data: matches,
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit) 
      })
    }
    catch (err) {
      next(err)
    }
 }
)

export default router