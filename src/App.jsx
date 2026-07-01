import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Navbar from "@/components/shared/Navbar";
import ProtectedRoute from "@/components/shared/ProtectedRoute";
import Home from "@/pages/Home";
import Lobby from "@/pages/Lobby";
import Battle from "@/pages/Battle";
import Results from "@/pages/Results";
import Leaderboard from "@/pages/LeaderBoard";
import Profile from "@/pages/Profile";
import ErrorPage from "./ErrorPage";
import { useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase/config'
import useAuthStore from '@/store/useAuthStore'
import Auth from "@/pages/auth";
import { Toaster } from "@/components/ui/sonner"
import  api  from "@/api/api.js"
function Layout() {
  return (
   <div className="min-h-screen flex flex-col">
      <Navbar />
       <Toaster />
      <main className="flex-1 bg-background flex flex-col">
        <Outlet />
      </main>
    </div>
  );
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/leaderboard", element: <Leaderboard /> },
      {path: "/auth" , element: <Auth/>},
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/lobby/:roomId", element: <Lobby /> },
          { path: "/battle/:roomId", element: <Battle /> },
          { path: "/results/:roomId", element: <Results /> },
          { path: "/profile/:userId", element: <Profile /> },
        ],
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const firebaseToken = await firebaseUser.getIdToken()
        const { data } = await api.post('/users', {}, {
          headers: {Authorization: `Bearer ${firebaseToken}`}
        })
        useAuthStore.getState().setJwt(data.jwt)
        useAuthStore.getState().setUser(data.user)
        // console.log(data.user.uid);
      } else {
        useAuthStore.getState().logout()
      }
      useAuthStore.getState().setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return <RouterProvider router={router} />;
}
