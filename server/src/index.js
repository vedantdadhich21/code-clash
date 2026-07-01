import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import userRoutes from './routes/user.js'
import matchRoutes from './routes/matches.js'
import leaderboardRoutes from './routes/leaderboard.js'
import errorHandler from './middleware/error.middleware.js'   // ← add
import helmet from "helmet";
import rateLimit from 'express-rate-limit'
dotenv.config()
await connectDB()


const app = express()
const PORT = process.env.PORT || 3000;


app.use('/api/auth', rateLimit({ windowMs: 15 * 60 * 1000, max: 20 }))
app.use(helmet())
const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL,
  process.env.CLIENT_URL ? process.env.CLIENT_URL.replace(/\/$/, '') : null
].filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '10kb' }))

app.use('/api/users', userRoutes)
app.use('/api/matches', matchRoutes)
app.use('/api/leaderboard', leaderboardRoutes)

app.get('/api/health', (req, res) => res.json({ ok: true }))
app.use(errorHandler)   
app.listen(PORT, () => console.log(`Server on port ${PORT}`));