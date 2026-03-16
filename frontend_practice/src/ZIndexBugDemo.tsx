import { useState } from 'react'
import './ZIndexBugDemo.css'

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">My App</div>
      <div className="navbar-links">
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </nav>
  )
}

function Sidebar() {
  const [count, setCount] = useState(0)

  return (
    <aside className="sidebar">
      <button className="sidebar-btn" onClick={() => setCount(c => c + 1)}>
        Click Me!
      </button>
      <button className="sidebar-btn danger" onClick={() => alert('Settings opened!')}>
        Open Settings
      </button>
      <p>Click count: {count}</p>
    </aside>
  )
}

export default function ZIndexBugDemo() {
  return (
    <div className="demo-layout">
      <Navbar />
      <div className="main-area">
        <Sidebar />
        <main className="content">
          <h2>Main Content</h2>
          <p>The sidebar buttons should be clickable, but something is wrong...</p>
          <p>Try clicking the "Click Me!" and "Open Settings" buttons in the sidebar.</p>
        </main>
      </div>
    </div>
  )
}
