import { useEffect } from 'react'

/**
 * SEO Component for dynamic meta tags
 * Usage: <SEO title="Page Title" description="Page description" />
 */
export default function SEO({
  title = 'AK Tours & Travels - Premium Travel Services in Mysuru',
  description = 'AK Tours & Travels offers premium car rental, tour packages, and travel services in Mysuru, Karnataka. Book your journey with us for comfortable and reliable travel experiences.',
  keywords = 'AK Tours & Travels, car rental Mysuru, travel services Karnataka, tour packages, tempo traveller rental, airport pickup drop Pune, luxury car rental',
  image = '/Logo.png',
  url = '',
  type = 'website',
  noindex = false
}) {
  const siteName = 'AK Tours & Travels'
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl
  const imageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`

  useEffect(() => {
    // Update document title
    document.title = fullTitle

    // Update or create meta tags
    const updateMetaTag = (name, content, attribute = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`)
      if (!element) {
        element = document.createElement('meta')
        element.setAttribute(attribute, name)
        document.head.appendChild(element)
      }
      element.setAttribute('content', content)
    }

    // Basic meta tags
    updateMetaTag('description', description)
    updateMetaTag('keywords', keywords)
    updateMetaTag('author', siteName)
    updateMetaTag('robots', noindex ? 'noindex, nofollow' : 'index, follow')

    // Open Graph tags
    updateMetaTag('og:title', fullTitle, 'property')
    updateMetaTag('og:description', description, 'property')
    updateMetaTag('og:image', imageUrl, 'property')
    updateMetaTag('og:url', fullUrl, 'property')
    updateMetaTag('og:type', type, 'property')
    updateMetaTag('og:site_name', siteName, 'property')
    updateMetaTag('og:locale', 'en_IN', 'property')

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image')
    updateMetaTag('twitter:title', fullTitle)
    updateMetaTag('twitter:description', description)
    updateMetaTag('twitter:image', imageUrl)

    // Additional meta tags
    updateMetaTag('theme-color', '#FE5611')
    updateMetaTag('mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-capable', 'yes')
    updateMetaTag('apple-mobile-web-app-status-bar-style', 'black-translucent')

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.setAttribute('rel', 'canonical')
      document.head.appendChild(canonical)
    }
    canonical.setAttribute('href', fullUrl)

  }, [fullTitle, description, keywords, imageUrl, fullUrl, type, noindex, siteName])

  return null
}

