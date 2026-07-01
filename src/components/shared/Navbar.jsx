import { Link } from "react-router-dom";
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/config'
import useAuthStore from '@/store/useAuthStore'
import { Button } from '@/components/ui/button'
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const handleLogout = async () => {
    await signOut(auth)
    logout()
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="flex items-center w-full h-16 border-b border-border bg-background/80 backdrop-blur-sm px-8">
      {/* Left — Logo (flex-1 so it takes equal space to the right section) */}
      <div className="flex-1">
        <Link
          to="/"
          className="text-2xl font-black tracking-tight hover:opacity-80 transition-opacity"
        >
          CodeClash
        </Link>
      </div>

      {/* Center — Nav Links (absolutely centered) */}
      <div className="flex items-center gap-8 text-sm font-medium">
        <Link
          to="/"
          className={`transition-colors ${isActive('/') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Home
        </Link>
        <Link
          to="/leaderboard"
          className={`transition-colors ${isActive('/leaderboard') ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
        >
          Leaderboard
        </Link>
      </div>

      {/* Right — Auth (flex-1 so it's equal width to left, content pushed right) */}
      <div className="flex-1 flex items-center justify-end gap-3">
        {user ? (
          <div className="flex items-center gap-4">
            <Link
              to={`/profile/${user.uid}`}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {user.displayName}
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <Button size="sm" onClick={() => navigate('/auth')}>Log In</Button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
