import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/user.js'
import matchRoutes from './routes/matches.js'
import leaderboardRoutes from './routes/leaderboard.js'
import errorHandler from './middleware/error.middleware.js'   // ← add
import helmet from "helmet";
dotenv.config()
await connectDB()


const app = express()
const rateLimit = require('express-rate-limit')
const PORT = process.env.PORT || 3000;


app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
app.use(helmet())
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '10kb' }))

app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use(errorHandler)   
app.listen(PORT, () => console.log(`Server on port ${PORT}`));