import { Link, useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth'
import crest from '../assets/crest.svg'
import './Navbar.css'


function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return(
        <header className="site-header">
            <nav className="navbar">
                <Link className="navbar-brand" to="/">
                    <img className="navbar-crest" src={crest} alt="" />
                    <span className="navbar-brand-name">Hajime Academy</span>
                </Link>

                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>

                    {user ? (
                        <>
                            <Link to={`/${user.role}`}>Dashboard</Link>

                            <button className="register-link" 
                            type="button" 
                            onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link className="register-link" to="/register">
                            Register
                            </Link>
                        </>
                    )}
                </div>

            </nav>
        </header>
    )
}

export default Navbar