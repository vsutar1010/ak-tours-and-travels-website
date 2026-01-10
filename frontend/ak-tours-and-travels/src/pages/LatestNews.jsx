import { useState, useEffect } from 'react'
import SEO from '../components/SEO'
import { API_BASE_URL } from '../utils/api.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function LatestNews() {
  const [activeTab, setActiveTab] = useState('offers')
  const [offers, setOffers] = useState([])
  const [updates, setUpdates] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [testimonialsLoading, setTestimonialsLoading] = useState(true)

  // Fetch all data on component mount
  useEffect(() => {
    fetchOffers()
    fetchUpdates()
    fetchTestimonials()
  }, [])

  async function fetchOffers() {
    try {
      const response = await fetch(`${API_BASE_URL}/news/category/offer`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch offers')
      }

      const data = await response.json()
      setOffers(data.data || [])
    } catch (err) {
      console.error('Error fetching offers:', err)
      setOffers([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchUpdates() {
    try {
      const response = await fetch(`${API_BASE_URL}/news/category/update`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch updates')
      }

      const data = await response.json()
      setUpdates(data.data || [])
    } catch (err) {
      console.error('Error fetching updates:', err)
      setUpdates([])
    }
  }

  async function fetchTestimonials() {
    try {
      setTestimonialsLoading(true)
      const response = await fetch(`${API_BASE_URL}/feedback/approved`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials')
      }

      const data = await response.json()
      setTestimonials(data.data || [])
    } catch (err) {
      console.error('Error fetching testimonials:', err)
      setTestimonials([])
    } finally {
      setTestimonialsLoading(false)
    }
  }

  // WhatsApp redirection function
  const handleWhatsAppRedirect = (offerTitle) => {
    const phoneNumber = '+919730825092' // Replace with your actual WhatsApp number
    const message = `Hi! I'm interested in booking the "${offerTitle}" offer. Please provide more details.`
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <>
      <SEO
        title="Latest News, Offers & Updates"
        description="Stay updated with the latest news, special offers, travel updates, and announcements from AK Tours & Travels. Get exclusive deals on car rentals, tour packages, and travel services."
        keywords="AK Tours & Travels news, travel offers, special deals, travel updates, car rental offers, tour package deals, travel announcements"
        url="/latest-news"
      />
      <div>
        {/* Hero Section */}
        <div className="news-hero">
        <h1>Latest News & Updates</h1>
        <p>Stay updated with our latest offers, route updates, and customer testimonials</p>
      </div>

      {/* Tab Navigation */}
      <div className="news-tabs">
        <div className="tab-buttons">
          <button 
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            Special Offers
          </button>
          <button 
            className={`tab-btn ${activeTab === 'updates' ? 'active' : ''}`}
            onClick={() => setActiveTab('updates')}
          >
            Company Updates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'testimonials' ? 'active' : ''}`}
            onClick={() => setActiveTab('testimonials')}
          >
            Customer Reviews
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'offers' && (
            <div className="offers-section">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading offers...</div>
              ) : offers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>No special offers available at the moment.</div>
              ) : (
                <div className="offers-grid">
                  {offers.map((offer) => (
                    <div key={offer._id} className="offer-card">
                      {offer.image && (
                        <div className="offer-image">
                          <img src={offer.image} alt={offer.title} />
                        </div>
                      )}
                      <div className="offer-content">
                        <h3>{offer.title}</h3>
                        <p>{offer.content}</p>
                        <div className="offer-footer">
                          <span className="valid-until">Posted: {formatDate(offer.date)}</span>
                          <button 
                            className="btn-offer" 
                            onClick={() => handleWhatsAppRedirect(offer.title)}
                          >
                            Inquire Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'updates' && (
            <div className="updates-section">
              {loading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading updates...</div>
              ) : updates.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>No company updates at the moment.</div>
              ) : (
                <div className="updates-grid">
                  {updates.map((update) => (
                    <div key={update._id} className="update-card">
                      {update.image && (
                        <div className="update-image">
                          <img src={update.image} alt={update.title} />
                        </div>
                      )}
                      <div className="update-content">
                        <div className="update-header">
                          <h3>{update.title}</h3>
                          <span className="update-date">{formatDate(update.date)}</span>
                        </div>
                        <p>{update.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="testimonials-section">
              {testimonialsLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Loading reviews...</div>
              ) : testimonials.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>No customer reviews available yet.</div>
              ) : (
                <div className="testimonials-grid">
                  {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card">
                      <div className="testimonial-header">
                        <h4>{testimonial.name}</h4>
                        <span className="location">{testimonial.location || 'Customer'}</span>
                      </div>
                      <div className="rating">
                        {[...Array(Number(testimonial.rating) || 5)].map((_, i) => (
                          <span key={i} className="star">⭐</span>
                        ))}
                      </div>
                      <p>"{testimonial.message || testimonial.comment}"</p>
                      {testimonial.media && !String(testimonial.media).startsWith('data:video') && (
                        <div style={{ marginTop: '10px' }}>
                          <img src={testimonial.media} alt={testimonial.name} style={{ maxWidth: '100%', borderRadius: '8px', maxHeight: '200px', objectFit: 'cover' }} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}


