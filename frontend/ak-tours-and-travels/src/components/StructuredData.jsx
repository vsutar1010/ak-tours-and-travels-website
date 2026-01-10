import { useEffect } from 'react'

/**
 * Structured Data Component for JSON-LD schema markup
 * Usage: <StructuredData type="LocalBusiness" data={businessData} />
 */
export default function StructuredData({ type = 'LocalBusiness', data = {} }) {
  useEffect(() => {
    // Remove existing structured data script if any
    const existingScript = document.getElementById('structured-data')
    if (existingScript) {
      existingScript.remove()
    }

    // Default LocalBusiness schema
    const defaultBusinessData = {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: 'AK Tours & Travels',
      description: 'Premium car rental, tour packages, and travel services in Mysuru, Karnataka. Offering comfortable and reliable travel experiences with professional service.',
      image: typeof window !== 'undefined' ? `${window.location.origin}/Logo.png` : '/Logo.png',
      url: typeof window !== 'undefined' ? window.location.origin : '',
      telephone: '+919730825092',
      email: 'Aktourstravels3693@gmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '1st Floor, Opp. City Center',
        addressLocality: 'Mysuru',
        addressRegion: 'Karnataka',
        postalCode: '570001',
        addressCountry: 'IN'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '12.2958',
        longitude: '76.6394'
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
          opens: '09:00',
          closes: '18:00'
        }
      ],
      priceRange: '$$',
      areaServed: {
        '@type': 'City',
        name: 'Mysuru'
      },
      sameAs: [
        'https://www.instagram.com/aktoursandtravels3693',
        'https://wa.me/919730825092'
      ],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.8',
        reviewCount: '50'
      }
    }

    // Merge with provided data
    const structuredData = {
      ...defaultBusinessData,
      ...data,
      '@context': 'https://schema.org',
      '@type': type
    }

    // Create and append script tag
    const script = document.createElement('script')
    script.id = 'structured-data'
    script.type = 'application/ld+json'
    script.text = JSON.stringify(structuredData, null, 2)
    document.head.appendChild(script)

    return () => {
      const scriptToRemove = document.getElementById('structured-data')
      if (scriptToRemove) {
        scriptToRemove.remove()
      }
    }
  }, [type, data])

  return null
}

