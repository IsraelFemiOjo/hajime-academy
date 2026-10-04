import { Navigate } from "react-router"
import useAuth from "../hooks/useAuth"
import Loading from "./Loading"

function ProtectedRoute({ children, requiredRole }) {
    const { user, checking } = useAuth()

    // Wait while the saved login is being confirmed with the backend
    if (checking) {
        return <Loading message="Checking your login..." />
    }

    if (!user) {
        return <Navigate to="/login" replace />
    }

    // Logged in, but on another role's dashboard: send them to their own
    if (user.role !== requiredRole) {
        return <Navigate to={`/${user.role}`} replace />
    }

    return children
}

export default ProtectedRoute
