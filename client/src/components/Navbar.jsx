import { Link } from 'react-router-dom'
import { useContext } from 'react'
import AuthContext from '../context/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          Personal Journal
        </Link>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>

          {isAuthenticated ? (
            // Show these links only when authenticated
            <>
              <li className="nav-item">
                <Link to="/journals" className="nav-link">
                  My Journals
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/journals/create" className="nav-link">
                  New Entry
                </Link>
              </li>
              <li className="nav-item">
                <span className="nav-user">Hello, {user?.name}</span>
              </li>
              <li className="nav-item">
                <button onClick={handleLogout} className="nav-link logout-btn">
                  Logout
                </button>
              </li>
            </>
          ) : (
            // Show these links when not authenticated
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
