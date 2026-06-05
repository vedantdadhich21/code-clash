import { ref, set, update, onValue, remove, onDisconnect, get } from 'firebase/database'
import { db } from '@/firebase/config'
import { problems } from '@/data/problems'

export const createRoom = async (roomId, user) => {
  await set(ref(db, `rooms/${roomId}`), {
    status: 'waiting',
    problem: null,
    createdAt: Date.now(),
    player1: {
      uid: user.uid,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL || null,
      status: 'waiting'
    },
    player2: null
  })
}

export const joinRoom = async (roomId, user) => {

  const snapshot =
    await get(ref(db, `rooms/${roomId}`))

  if (!snapshot.exists()) {
    
    return false
  }

  await update(ref(db, `rooms/${roomId}`), {
    player2: {
      uid: user.uid,
      displayName: user.displayName || user.email,
      photoURL: user.photoURL || null,
      status: 'waiting'
    }
  })
  return true
}

export const onRoomUpdate = (roomId, callback) => {
  const roomRef = ref(db, `rooms/${roomId}`)
  const unsubscribe = onValue(roomRef, (snapshot) => {
    callback(snapshot.val())
  })
  return unsubscribe
}

export const updatePlayerStatus = async (roomId, playerKey, status) => {
  await update(ref(db, `rooms/${roomId}/${playerKey}`), { status })
}

export const startBattle = async (roomId) => {
 await update(ref(db, `rooms/${roomId}`), {
  status: 'active',
  startTime: Date.now(),
  problem: problems[0],
})
}