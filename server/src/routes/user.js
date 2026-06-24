import express from 'express'
import User from '../models/User.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// POST /api/users — called after login to save user to MongoDB
// protected — must be logged in
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

    res.status(200).json(user)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

export default router