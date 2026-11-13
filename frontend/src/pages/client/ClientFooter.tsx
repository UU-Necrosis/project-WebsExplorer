import { Link } from 'react-router-dom'
import './ClientFooter.css'

export default function ClientFooter() {
  return (
    <footer className="client-footer">
      <div className="client-footer__inner">
        <div className="client-footer__brand">
          <Link className="client-footer__wordmark" to="/">
            <span className="client-footer__mark" aria-hidden="true">W</span>
            <span>Web<span className="client-footer__wordmark-accent">Explorer</span></span>
          </Link>
          <p>Find useful corners of the web, shared by the people who use them.</p>
        </div>

        <nav className="client-footer__nav" aria-label="Explore">
          <h2>Explore</h2>
          <Link to="/discover">Discover websites</Link>
          <Link to="/categories">Browse categories</Link>
        </nav>

        <nav className="client-footer__nav" aria-label="Community">
          <h2>Community</h2>
          <Link to="/submit">Submit a website</Link>
          <Link to="/profile">Your profile</Link>
        </nav>
      </div>
      <div className="client-footer__bottom">
        <span>© {new Date().getFullYear()} WebExplorer</span>
        <span>Community-powered web discovery</span>
      </div>
    </footer>
  )
}