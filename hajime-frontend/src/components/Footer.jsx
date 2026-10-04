import { Link } from 'react-router'
import useAuth from '../hooks/useAuth'
import './Footer.css'

function Footer() {
  const { user } = useAuth()

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="footer-copy">© 2026 Hajime Academy</p>

        <nav className="footer-links">
          <Link to="/about">About</Link>
          {user ? (
            <Link to={`/${user.role}`}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login">Portal login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
