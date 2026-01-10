// Global scroll fix to compensate for sticky header and default anchor behavior
// This file runs on import and installs handlers globally.
(function runScrollFix() {
  if (typeof window === 'undefined' || typeof document === 'undefined') return

  const getHeaderHeight = () => {
    const header = document.querySelector('header.header') || document.querySelector('.header')
    return header ? header.offsetHeight : 0
  }

  const scrollToHash = (hash, behavior = 'auto') => {
    if (!hash) return
    const id = hash.startsWith('#') ? hash.slice(1) : hash
    // try id first, then name
    let target = document.getElementById(id) || document.getElementsByName(id)[0]
    if (target) {
      const headerHeight = getHeaderHeight()
      const top = Math.max(0, target.getBoundingClientRect().top + window.scrollY - headerHeight - 8)
      try {
        window.scrollTo({ top, behavior })
      } catch (e) {
        window.scrollTo(0, top)
      }
      return true
    }
    return false
  }

  // Intercept clicks on same-page anchor links and apply offset scroll
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a')
    if (!a) return
    try {
      const url = new URL(a.href, window.location.href)
      const isSameOrigin = url.origin === window.location.origin
      const isSamePath = url.pathname === window.location.pathname
      if (isSameOrigin && a.hash && isSamePath) {
        // Prevent default and perform offset scroll
        e.preventDefault()
        history.pushState(null, '', a.hash)
        // try smooth scroll, fallback to auto if target not ready
        if (!scrollToHash(a.hash, 'smooth')) {
          // retry shortly to allow layout to settle
          setTimeout(() => scrollToHash(a.hash, 'smooth'), 80)
        }
      }
    } catch (err) {
      // ignore malformed hrefs
    }
  }, { passive: true })

  // On hashchange (back/forward or manual change) adjust scroll
  window.addEventListener('hashchange', () => {
    // small delay to allow new content to mount
    setTimeout(() => scrollToHash(location.hash, 'smooth'), 60)
  })

  // On initial load, if there's a hash, adjust scroll after layout
  window.addEventListener('load', () => {
    if (location.hash) {
      // multiple attempts for SPA-ish mounts
      const attempts = [20, 120, 350]
      attempts.forEach((delay) => setTimeout(() => scrollToHash(location.hash, 'auto'), delay))
    }
  })

  // Also expose utility for manual use
  window.__AK_scrollToHash = scrollToHash
})()
