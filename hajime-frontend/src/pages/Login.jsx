import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth'
import apiRequest from '../api/client'
import ErrorMessage from '../components/ErrorMessage'
import crest from '../assets/crest.svg'
import './Auth.css'

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { user, login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const response = await apiRequest('/api/auth/login', {
                method: 'POST',
                body: { email, password },
            })

            const { user: loggedInUser, token } = response.data
            login(loggedInUser, token)
            navigate(`/${loggedInUser.role}`)
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Already logged in: no need to see this page, go to the dashboard
    if (user) {
        return <Navigate to={`/${user.role}`} replace />
    }

    return(
        <main className="auth-page">
            <section className="auth-panel">
                <div className="auth-header">
                    <img className="auth-logo" src={crest} alt="" />
                    <h1>Portal login</h1>
                    <p className="auth-intro">
                        Sign in to access the school portal.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email address</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />

                    {error && <ErrorMessage message={error} />}

                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Log in'}
                    </button>
                </form>

                <p className="auth-switch">
                    New student? <Link to="/register">Create your account</Link>
                </p>
            </section>
        </main>
    )
}

export default Login
