import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase/config'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from 'firebase/auth'
import useAuthStore from '@/store/useAuthStore'
import { nanoid } from 'nanoid'

const getErrorMessage = (code) => {
  switch (code) {
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    case 'auth/user-not-found':
      return 'No account with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'Account already exists. Login instead.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-email':
      return 'Please enter a valid email.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/user-disabled':
      return 'This account has been disabled.';
    case 'auth/operation-not-allowed':
      return 'Email/password sign-in is not enabled.';
    case 'auth/popup-closed-by-user':
      return ''; // Or a message like 'Sign-in cancelled.'
    default:
      return 'Something went wrong. Please try again.';
  }
};


const Auth = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setError('')
    setIsLoading(true)
      // console.log('attempting login with:', email, password) 
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (err) {
        console.log(err.code)
      setError(getErrorMessage(err.code))
      
    } finally {
      setIsLoading(false)
      
    }
  }

  const handleSignup = async () => {
    setError('')
    setIsLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      const randomName = `Coder_${nanoid(4).toUpperCase()}`
      await updateProfile(auth.currentUser, { displayName: randomName })
      await auth.currentUser.reload() 
      useAuthStore.getState().setUser({ ...auth.currentUser, displayName: randomName })
      navigate('/')
    } catch (err) {
      console.log(err)
      setError(getErrorMessage(err.code))
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      setError(getErrorMessage(err.code))
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen">
      <Card className="w-full max-w-md ">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Welcome to CodeClash</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">

          <Button variant="outline" className="w-full" onClick={handleGoogle}>
            Continue with Google
          </Button>

          <div className="flex items-center gap-2">
            <hr className="flex-1 border-border" />
            <small>or</small>
            <hr className="flex-1 border-border" />
          </div>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-red-400 text-sm">
            {error}
            </p>}

          <div className="flex gap-2">
            <Button className="flex-1" onClick={handleLogin} disabled={isLoading}>
              Login
            </Button>
            <Button className="flex-1" variant="outline" onClick={handleSignup} disabled={isLoading}>
              Sign Up
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}

export default Auth