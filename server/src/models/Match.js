import mongoose from 'mongoose'

const matchSchema = new mongoose.Schema({
  winnerId: { type: String, required: true },
  loserId: { type: String, required: true },
  winnerDisplayName: String,
  loserDisplayName: String,
  problemId: String,
  winnerSolveTime: Number,
  loserSolveTime: Number,
  roomId: String,
  playedAt: { type: Date, default: Date.now }
})

export default mongoose.model('Match', matchSchema)