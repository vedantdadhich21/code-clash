import express from 'express'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'
import jwt from 'jsonwebtoken'
import authMiddleware from '../middleware/auth.middleware.js'
const router = express.Router()

router.post('/', verifyToken, async (req, res) => {
  try {
    const { uid, email, name, picture } = req.user  // from Firebase token

    // upsert — create if new user, update if exists
    const user = await User.findOneAndUpdate(
      { uid },                          // find by firebase uid
      { uid, email,                     // update these fields
        displayName: name || email.split('@')[0],
        photoURL: picture || null },
      { upsert: true, new: true }       // create if not found, return new doc
    )
    const token = jwt.sign(
      { userId: user._id, firebaseUid: uid },
      process.env.JWT_SECRET,
      {expiresIn:'7d'}
    )  
    res.status(200).json({jwt:token,user})
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})
// GET /api/users/:userId — get user profile
router.get('/:userId', authMiddleware, async (req, res) => {
 try {
  const user = await User.findById(req.params.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(user)
 } catch (err) {
  res.status(500).json({ error: err.message }) }
 })

export default router