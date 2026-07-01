import express from 'express'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/auth.middleware.js'
const router = express.Router()

import crypto from 'crypto'

router.post('/', verifyToken, async (req, res,next) => {
  try {
    const { uid, email, picture } = req.user  // from Firebase token

    let user = await User.findOne({ uid })
    if (!user) {
      const randomSuffix = crypto.randomBytes(2).toString('hex').toUpperCase()
      user = await User.create({
        uid,
        email,
        displayName: `Coder_${randomSuffix}`,
        photoURL: picture || null
      })
    } else {
      user.email = email
      user.photoURL = picture || null
      await user.save()
    }
    
    const token = jwt.sign(
      { userId: user._id, firebaseUid: uid },
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    )  
    res.status(200).json({jwt:token,user})
  } catch (err) {
    next(err)
  }
})
// GET /api/users/:userId — get user profile
router.get('/:userId', authMiddleware, async (req, res,next) => {
  try {
    const user = await User.findOne({ uid: req.params.userId })
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (err) {
    next(err)
  }
 })

export default router