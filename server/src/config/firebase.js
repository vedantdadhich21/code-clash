import { initializeApp, cert } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getDatabase } from 'firebase-admin/database'
import serviceAccount from '../../serviceAccountKey.json' with { type: 'json' }

const app = initializeApp({
  credential: cert(serviceAccount),
  databaseURL: "https://code-clash-5e598-default-rtdb.asia-southeast1.firebasedatabase.app" 
})


export { getAuth,getDatabase }