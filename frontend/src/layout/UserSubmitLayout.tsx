import type { ReactNode } from 'react'

export default function UserSubmitLayout({ children }: { children: ReactNode }) {
  return (
    <div className="user-submit">
      <div className="user-submit__shell">
        <header className="user-submit__header">
          <div className="user-submit__eyebrow">Community submission • open for all</div>
          <h1>
            Suggest a <span>New Website</span>
          </h1>
          <p>
            Found a hidden gem, indie tool, or game-changing web app? Share it with
            the community and help members discover something worth bookmarking.
          </p>
        </header>

        {children}

        <footer className="user-submit__footer">
          <div>WebExplorer</div>
          <div>Community-driven discovery</div>
        </footer>
      </div>
    </div>
  )
}
