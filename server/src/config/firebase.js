import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'

let serviceAccount

if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  } catch (err) {
    console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY env var:', err)
  }
} else {
  try {
    const { default: localKey } = await import('../../serviceAccountKey.json', { with: { type: 'json' } })
    serviceAccount = localKey
  } catch (err) {
    console.error('Failed to load local serviceAccountKey.json. Please set FIREBASE_SERVICE_ACCOUNT_KEY env var.', err)
  }
}

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://code-clash-5e598-default-rtdb.asia-southeast1.firebasedatabase.app"
})

export { getAuth, getDatabase }