import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import LazyImage from '../components/LazyImage.jsx'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const servicesRef = useRef(null)
  const newsRef = useRef(null)
  const galleryRef = useRef(null)
  
  const heroImages = [
    '/photos/_DSC0956.JPG',
    '/photos/_DSC0993.JPG',
    '/photos/_DSC1011.JPG',
    '/photos/1720554775809.jpg',
    '/photos/IMG_7896.JPEG.jpg',
    '/photos/IMG_7905.JPEG.jpg'
  ]

  const infoCards = [
    {
      id: 1,
      title: 'Professional Services',
      description: 'Expert solutions tailored to your needs with the highest quality standards.',
      icon: '⚡',
      image: '/photos/services/Profectional.jpg'
    },
    {
      id: 2,
      title: '24/7 Support',
      description: 'Round-the-clock assistance whenever you need help or have questions.',
      icon: '🛠️',
      image: '/photos/services/car-rental-service.jpg'
    },
    {
      id: 3,
      title: 'Premium Quality',
      description: 'Top-notch services delivered with attention to detail and excellence.',
      icon: '⭐',
      image: '/photos/services/luxury-car-rental.jpg'
    }
  ]

  const newsItems = [
    {
      id: 1,
      title: 'New Service Launch',
      description: 'We are excited to announce our latest premium service package.',
      icon: '📢',
      image: '/photos/_DSC0956.JPG'
    },
    {
      id: 2,
      title: 'Company Expansion',
      description: 'Opening new branches in three major cities this quarter.',
      icon: '🏢',
      image: '/photos/IMG_7910.JPEG.jpg'
    },
    {
      id: 3,
      title: 'Award Recognition',
      description: 'Proud to receive the Best Service Provider award for 2024.',
      icon: '🏆',
      image: '/photos/_DSC1059.JPG'
    }
  ]

  // Unique gallery images for home page (not used in hero, info cards, or news)
  const galleryImages = [
   '/photos/_DSC0956.JPG',
   '/photos/_DSC0959.JPG',
    '/photos/_DSC0984.JPG',
    '/photos/_DSC0993.JPG',
    '/photos/_DSC1011.JPG',
    '/photos/_DSC1012.JPG',
    '/photos/_DSC1014.JPG',
    '/photos/_DSC1059.JPG',
    '/photos/_DSC1070.JPG',
    '/photos/_DSC1075.JPG',
    '/photos/_DSC1131.JPG',
  ]

  // Preload all hero images for smooth transitions
  useEffect(() => {
    heroImages.forEach((imageSrc) => {
      const img = new Image()
      img.src = imageSrc
    })
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Scroll reveal observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, observerOptions)

    const elements = [servicesRef.current, newsRef.current, galleryRef.current].filter(Boolean)
    elements.forEach((el) => {
      if (el) {
        el.classList.add('scroll-reveal')
        observer.observe(el)
      }
    })

    return () => {
      elements.forEach((el) => {
        if (el) observer.unobserve(el)
      })
    }
  }, [])

  const navigate = useNavigate()

  return (
    <>
      <SEO
        title="Home"
        description="AK Tours & Travels - Premium travel services in Nigdi, Pimpri-Chinchwad, Maharashtra . Car rental, tour packages, tempo traveller rental, and airport pickup/drop services. Book your journey with us for comfortable and reliable travel experiences."
        keywords="AK Tours & Travels, car rental Pune, travel services Nigdi, Pimpri-Chinchwad, tour packages, tempo traveller rental, airport pickup drop, luxury car rental, Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra travel agency"
        url="/"
      />
      <StructuredData type="LocalBusiness" />
      <div>
        {/* Hero Section Container */}
      <div className="hero-section-wrapper">
        {/* Hero Slider - Background Images */}
        <div className="hero-slider">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${image})` }}
              aria-hidden={index !== currentSlide}
            />
          ))}
        </div>

        {/* Hero caption and CTAs - Text Content (always on top) */}
        <div className="hero-caption">
          <div className="hero-caption-inner">
            <h1>Explore Unforgettable Journeys</h1>
            <p>Travel with AK Tours &amp; Travels — memories made easy. Experience premium car rental services, comfortable tour packages, and reliable transportation solutions in Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra. We offer professional drivers, well-maintained vehicles, and 24/7 customer support for all your travel needs.</p>
            <div className="hero-cta">
              <button className="btn-primary btn-animated" onClick={() => navigate('/feedback')}>Feedback</button>
              <button className="btn-whatsapp btn-animated" onClick={() => window.open('https://wa.me/919730825092', '_blank', 'noopener')}>Book via WhatsApp</button>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="services-section" ref={servicesRef}>
        <div className="services-header">
          <h2>Our Services</h2>
        </div>
        <div className="info-cards">
          {infoCards.map((card) => (
            <div key={card.id} className="info-card">
              <div className="info-card-image">
                <LazyImage src={card.image} alt={`${card.title} - ${card.description}`} />
              </div>
              <div className="info-card-content">
                <h3>{card.title}</h3>
                <p>{card.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="services-view-more">
          <a href="/services" className="btn-secondary btn-animated">View More</a>
        </div>
      </div>

      {/* Latest News */}
      <div className="news-section news-section-tight" ref={newsRef}>
        <div className="news-header">
          <h2>Latest News</h2>
        </div>
        <div className="news-cards">
          {newsItems.map((news) => (
            <div key={news.id} className="news-card">
              <div className="news-image">
                <LazyImage src={news.image} alt={`${news.title} - ${news.description}`} />
              </div>
              <div className="news-content">
                <h3>{news.title}</h3>
                <p>{news.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="news-view-more">
          <a href="/latest-news" className="btn-secondary btn-animated">View All</a>
        </div>
      </div>

      {/* Gallery Section */}
      <div className="gallery-section" ref={galleryRef}>
        <div className="gallery-header">
          <h2>Gallery</h2>
        </div>
        <div className="image-slider-container">
          <div className="image-slider">
            {/* Duplicate for seamless loop animation, but each image appears only once in visible area */}
            {[...galleryImages, ...galleryImages].map((image, index) => (
              <div key={`${image}-${index}`} className="slider-image">
                <img src={image} alt={`AK Tours & Travels travel experience and vehicle gallery - Image ${(index % galleryImages.length) + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </div>
        <div className="gallery-cta">
          <button className="btn-secondary btn-animated" onClick={() => navigate('/gallery')}>Explore More</button>
        </div>
      </div>
    </div>
    </>
  )
}


