import { Link } from 'react-router-dom'

function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand">
          <Link to="/" className="brand-link">
            Perth Bangla Cafe
          </Link>
          <p className="brand-tagline">Authentic Bangladeshi flavours in Perth</p>
        </div>

        <nav className="site-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/cpt">Menu</Link></li>
            <li><Link to="/blog">Blog</Link></li>
            <li><Link to="/page/contact">Contact</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default Header