import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/user.js'
import matchRoutes from './routes/matches.js'
import leaderboardRoutes from './routes/leaderboard.js'
import errorHandler from './middleware/error.middleware.js'   // ← add

dotenv.config()
await connectDB()

const app = express()

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use(errorHandler)   
app.listen(3000, () => console.log('Server on port 3000'))