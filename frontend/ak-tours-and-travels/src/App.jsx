import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import Home from './pages/Home.jsx'
import Profile from './pages/Profile.jsx'
import LatestNews from './pages/LatestNews.jsx'
import Feedback from './pages/Feedback.jsx'
import About from './pages/About.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import Services from './pages/Services.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import NewsManagement from './pages/NewsManagement.jsx'

function ScrollToTopOnNavigate() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // If there's a hash, let the hash/anchor handler manage offset scrolling
    if (hash) {
      setTimeout(() => {
        if (window.__AK_scrollToHash) window.__AK_scrollToHash(hash, 'smooth')
      }, 80)
      return
    }

    // No hash: scroll to top of page (so new routes start at top)
    try {
      window.scrollTo({ top: 0, behavior: 'auto' })
    } catch (e) {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function App() {
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    // Hide loader when the window "load" event fires (assets ready)
    const onLoad = () => setInitialLoading(false)

    if (document.readyState === 'complete') {
      // already loaded
      setInitialLoading(false)
    } else {
      window.addEventListener('load', onLoad)
      // Fallback: ensure loader doesn't get stuck forever
      const fallback = setTimeout(() => setInitialLoading(false), 4000)
      return () => {
        window.removeEventListener('load', onLoad)
        clearTimeout(fallback)
      }
    }
  }, [])

  return (
    <PageLoader isLoading={initialLoading}>
      <div className="app">
        <Header />
        <ScrollToTopOnNavigate />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/latest-news" element={<LatestNews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/services" element={<Services />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />

            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin-news" element={<NewsManagement />} />

          </Routes>
        </main>
        <Footer />
      </div>
    </PageLoader>
  )
}


