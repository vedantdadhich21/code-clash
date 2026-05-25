import { Link } from "react-router";
import Navbar from "./components/shared/Navbar";
import { useRouteError } from 'react-router-dom'
import { Button } from "./components/ui/button";
const ErrorPage = () => {
  const error = useRouteError()

  return (
    <div className="min-h-screen bg-background text-foreground ">
      <Navbar />                    {/* manually add Navbar here */}
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <h1>Something went wrong</h1>
        <p>{error?.statusText || error?.message}</p>
        <Link to="/">
          <Button size="lg">Go Home</Button>
        </Link>
      </div>
    </div>
  )
}
export default ErrorPage;