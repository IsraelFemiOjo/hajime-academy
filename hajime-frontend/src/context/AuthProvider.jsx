import { useEffect, useState } from "react"
import AuthContext from "./AuthContext"
import apiRequest from "../api/client"

// Reads the saved user, but only if a login token was saved too
function readSavedUser() {
    try {
        const token = localStorage.getItem('hajimeToken')
        const savedUser = localStorage.getItem('hajimeUser')
        return token && savedUser ? JSON.parse(savedUser) : null
    } catch {
        return null
    }
}

function AuthProvider({ children }) {
    const [user, setUser] = useState(readSavedUser)

    // True while we ask the backend (/me) whether the saved login is still valid
    const [checking, setChecking] = useState(() => Boolean(readSavedUser()))

    // Called after a successful login or registration
    const login = (userData, token) => {
        localStorage.setItem('hajimeToken', token)
        localStorage.setItem('hajimeUser', JSON.stringify(userData))
        setUser(userData)
    }

    const logout = () => {
        localStorage.removeItem('hajimeToken')
        localStorage.removeItem('hajimeUser')
        setUser(null)
    }

    // When the app first loads, confirm the saved token with the backend
    useEffect(() => {
        if (!readSavedUser()) return

        let cancelled = false

        apiRequest('/api/auth/me')
            .then((response) => {
                if (cancelled) return
                const me = response.data
                const userData = {
                    id: me._id,
                    firstName: me.firstName,
                    lastName: me.lastName,
                    email: me.email,
                    role: me.role,
                }
                localStorage.setItem('hajimeUser', JSON.stringify(userData))
                setUser(userData)
            })
            .catch((error) => {
                if (cancelled) return
                // Token rejected (expired or invalid): log out.
                // If the server is just unreachable, keep the saved login.
                if (error.status === 401 || error.status === 404) {
                    localStorage.removeItem('hajimeToken')
                    localStorage.removeItem('hajimeUser')
                    setUser(null)
                }
            })
            .finally(() => {
                if (!cancelled) setChecking(false)
            })

        return () => {
            cancelled = true
        }
    }, [])

    return (
        <AuthContext.Provider value={{ user, checking, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider
