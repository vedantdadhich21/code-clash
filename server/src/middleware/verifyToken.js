import { getAuth } from '../config/firebase.js'
const verifyToken = async (req, res, next) => {
  // get token from header
  const authHeader = req.headers.authorization
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }

  const token = authHeader.split('Bearer ')[1]

  try {
    const decoded = await getAuth().verifyIdToken(token)
    req.user = decoded  // { uid, email, name, picture }
    next()  // move to the actual route handler
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' })
  }
}

export default verifyToken