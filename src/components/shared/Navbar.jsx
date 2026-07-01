import { Link, Navigate } from "react-router-dom";
import { signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase/config'
import useAuthStore from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
    const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)


  const handleLogout = async () => {
    await signOut(auth)
    logout()
  }
 
  return (
    <nav className="flex items-center justify-between w-full h-18 border-b-2 bg-navbar px-8">
      {/* Left — Logo */}
      <Link
        to="/"
        className="text-4xl font-bold tracking-tight hover:opacity-80 transition-opacity"
      >
        CodeClash
      </Link>

      {/* Center — Nav Links */}
      <div className="flex items-center gap-8 text-base font-medium text-muted-foreground">
        <Link to="/" className="hover:text-foreground transition-colors">
          Home
        </Link>
        <Link
          to="/leaderboard"
          className="hover:text-foreground transition-colors"
        >
          Leaderboard
        </Link>
      </div>

      {/* Right — Auth */}
      <div className="flex items-center gap-3">
      {user ? (
        <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.uid}`} 
              className="text-sm font-bold text-muted-foreground" > {user.displayName}</Link>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      ) : (
        <Button onClick={() => navigate('/auth')}>Log In</Button>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
