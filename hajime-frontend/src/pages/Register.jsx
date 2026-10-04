import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth'
import apiRequest from '../api/client'
import ErrorMessage from '../components/ErrorMessage'
import crest from '../assets/crest.svg'
import './Auth.css'

function Register() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const { user, login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.')
            return
        }

        setLoading(true)

        try {
            // No role is sent: every public registration is a student account
            const response = await apiRequest('/api/auth/register', {
                method: 'POST',
                body: { firstName, lastName, email, password },
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
                    <h1>Student registration</h1>
                    <p className="auth-intro">
                        Create your student account.
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    <label htmlFor="firstName">First name</label>
                    <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    />

                    <label htmlFor="lastName">Last name</label>
                    <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    />

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
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    />

                    <label htmlFor="confirmPassword">Confirm password</label>
                    <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    />

                    {error && <ErrorMessage message={error} />}

                    <button className="auth-button" type="submit" disabled={loading}>
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account? <Link to="/login">Log in</Link>
                </p>
            </section>
        </main>
    )
}

export default Register
