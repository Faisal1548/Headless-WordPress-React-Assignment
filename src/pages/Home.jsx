// Home page — this is yours to design.
// It should introduce your site and your chosen scenario.
// Consider: a hero section, featured content, a welcome message.
//
// You can fetch data here (e.g. latest posts) using the same
// pattern shown in BlogList.jsx, or keep it static.

import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import ApiError from '../components/ApiError'
import PostCard from '../components/PostCard'

const API = import.meta.env.VITE_WP_API_URL
const CPT = import.meta.env.VITE_CPT_SLUG

function Home() {
  const [posts, setPosts] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [postsResponse, menuResponse] = await Promise.all([
          fetch(`${API}/wp/v2/posts?_embed&per_page=3`),
          fetch(`${API}/${CPT}?_embed&per_page=3`),
        ])

        if (!postsResponse.ok) throw new Error(`Posts error: ${postsResponse.status}`)
        if (!menuResponse.ok) throw new Error(`Menu error: ${menuResponse.status}`)

        const latestPosts = await postsResponse.json()
        const latestMenu = await menuResponse.json()

        setPosts(latestPosts)
        setMenuItems(latestMenu)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <section className="home-page">
      <div className="home-hero">
        <div className="home-hero-text">
          <span className="eyebrow">Perth Bangla Cafe</span>
          <h1>Warm flavours, hand-crafted with care</h1>
          <p>
            Discover authentic Bangladeshi dishes made fresh every day in Perth.
            From fragrant biryanis to rich curries, our menu is built for locals who love bold tastes.
          </p>
          <div className="hero-actions">
            <Link to="/cpt" className="button button-primary">Explore the menu</Link>
            <Link to="/page/contact" className="button button-secondary">Book a table</Link>
          </div>
        </div>
      </div>

      <div className="section-intro">
        <h2>What makes us special</h2>
        <p>Traditional recipes, local ingredients and a warm dining atmosphere for every visit.</p>
      </div>

      <div className="feature-grid">
        <div className="feature-card">
          <h3>Fresh cafe menu</h3>
          <p>Seasonal favourites, house curries, street-food snacks and daily specials.</p>
        </div>
        <div className="feature-card">
          <h3>Stories from the cafe</h3>
          <p>Read about our kitchen, community and the flavours behind each dish.</p>
        </div>
        <div className="feature-card">
          <h3>Easy contact</h3>
          <p>Find opening hours, directions and booking details in one place.</p>
        </div>
      </div>

      {loading && <p className="loading">Loading latest blog posts and menu highlights...</p>}

      {error && <ApiError error={error} context="homepage content" />}

      {!loading && !error && (
        <>
          <section className="home-section">
            <div className="section-header">
              <h2>Latest from our blog</h2>
              <p>Stay up to date with new dishes, events and stories from the cafe.</p>
            </div>
            <div className="posts-grid">
              {posts.map(post => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </section>

          <section className="home-section">
            <div className="section-header">
              <h2>Menu highlights</h2>
              <p>Try our most-loved dishes from the Perth Bangla Cafe kitchen.</p>
            </div>
            <div className="menu-grid">
              {menuItems.map(item => {
                const featuredImage = item._embedded?.['wp:featuredmedia']?.[0]?.source_url
                const price = item.acf?.price || item.meta?.price || ''
                const description = item.excerpt?.rendered
                  ? item.excerpt.rendered.replace(/<\/?[^>]+(>|$)/g, '').slice(0, 120)
                  : ''

                return (
                  <div key={item.id} className="menu-card">
                    {featuredImage && <img src={featuredImage} alt={item.title.rendered} />}
                    <div className="menu-card-body">
                      <h3>{item.title.rendered}</h3>
                      {price && <p className="menu-price">${price}</p>}
                      <p>{description}</p>
                      <Link to={`/cpt/${item.id}`} className="read-more">View details →</Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </>
      )}
    </section>
  )
}

export default Home
