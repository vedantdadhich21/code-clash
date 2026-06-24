// src/middleware/auth.middleware.js
import jwt from 'jsonwebtoken'

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded  // { userId, firebaseUid, iat, exp }
    next()
  } catch (err) {
    console.log(err)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export default authMiddleware
