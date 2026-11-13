import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import './css/GuestAuthLayout.css'

type GuestAuthLayoutProps = {
  title: string
  children: ReactNode
}

export default function GuestAuthLayout({ title, children }: GuestAuthLayoutProps) {
  return (
    <div className="guest-auth-layout" data-theme="client">
      <header className="guest-auth-topbar" aria-label="Browser header">
        <div className="guest-auth-topbar__left">
          <button type="button" className="guest-auth-topbar__icon" aria-label="Back">
            <span className="material-symbols-outlined">WebExplore</span>
          </button>
          <button type="button" className="guest-auth-topbar__icon" aria-label="Forward">
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
          <button type="button" className="guest-auth-topbar__icon" aria-label="Refresh">
            <span className="material-symbols-outlined">refresh</span>
          </button>
        </div>

        <div className="guest-auth-topbar__right">
          <button type="button" className="guest-auth-topbar__icon" aria-label="Favorites">
            <span className="material-symbols-outlined">star</span>
          </button>
          <button type="button" className="guest-auth-topbar__icon" aria-label="More actions">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="guest-auth-main">
        <div className="guest-auth-shell">
          <div className="guest-auth-shell__header">
            <h1 className="guest-auth-shell__title">{title}</h1>
            <Link to="/guest" className="guest-auth-shell__link">Back home</Link>
          </div>

          {children}

        </div>
      </main>

      <footer className="guest-auth-bottombar" aria-label="Browser footer">
            <div className="guest-auth-shell__footer-top">
              <div className="guest-auth-shell__footer-brand-block">
                <span className="guest-auth-shell__footer-brand">Web Explorer</span>
                <p>Discover trusted websites, compare listings, and browse verified digital experiences.</p>
              </div>

              <nav className="guest-auth-shell__footer-links" aria-label="Guest auth links">
                <div>
                  <span>Company</span>
                  <Link to="/guest">About</Link>
                  <Link to="/guest">Blog</Link>
                  <Link to="/guest">Contact</Link>
                </div>
                <div>
                  <span>Support</span>
                  <Link to="/guest">Help Center</Link>
                  <Link to="/guest">Privacy</Link>
                  <Link to="/guest">Terms</Link>
                </div>
              </nav>
            </div>

            <div className="guest-auth-shell__footer-meta">
              <span className="guest-auth-shell__footer-copy">© 2026 Web Explorer</span>
            </div>
      </footer>
    </div>
  )
}
