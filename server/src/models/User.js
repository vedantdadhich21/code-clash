import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  email: String,
  photoURL: String,
  wins: { type: Number, default: 0 },
  losses: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)