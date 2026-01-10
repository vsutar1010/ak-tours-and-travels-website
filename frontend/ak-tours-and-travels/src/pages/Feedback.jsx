// Review page showing customer feedbacks from database
import {
   useEffect, useMemo, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLoader from '../components/SectionLoader.jsx'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import '../styles/feedback.css'
import { API_BASE_URL } from '../utils/api.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function Feedback() {
  const [isLoading, setIsLoading] = useState(true)
  const [feedbacks, setFeedbacks] = useState([])
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const feedbackListRef = useRef(null)

  useEffect(() => {
    fetchApprovedFeedbacks()
  }, [])

  async function fetchApprovedFeedbacks() {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/feedback/approved`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks')
      }

      const data = await response.json()
      setFeedbacks(data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching feedbacks:', err)
      setError('Failed to load feedbacks')
      setFeedbacks([])
    } finally {
      setIsLoading(false)
    }
  }


  // Scroll reveal animation
  useEffect(() => {
    if (feedbacks.length > 0 && feedbackListRef.current) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('revealed')
            }, index * 100)
          }
        })
      }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

      const cards = feedbackListRef.current.querySelectorAll('.feedback-card')
      cards.forEach(card => {
        card.classList.add('scroll-reveal')
        observer.observe(card)
      })

      return () => {
        cards.forEach(card => observer.unobserve(card))
      }
    }
  }, [feedbacks])

  return (
    <SectionLoader isLoading={isLoading} height="640px">
      <SEO
        title="Customer Reviews & Testimonials"
        description="Read authentic customer reviews and testimonials for AK Tours & Travels. See what our customers say about our car rental services, tour packages, and travel experiences in Mysuru, Karnataka."
        keywords="AK Tours & Travels reviews, customer testimonials, travel service reviews, customer feedback, travel company ratings"
        url="/feedback"
      />
      <StructuredData 
        type="CollectionPage"
        data={{
          about: "Customer reviews and testimonials for AK Tours & Travels"
        }}
      />
      <div className="feedback-page container">
        <div className="page-head centered">
          <h1 className="page-title">Customer Reviews</h1>
          <p className="page-sub">Read authentic feedback from our valued customers</p>
        </div>

        <div className="fb-grid">
          <main className="fb-right" style={{ gridColumn: '1 / -1' }}>
            <section className="feedback-list" aria-live="polite" ref={feedbackListRef}>
              {error && <div className="empty">{error}</div>}
              {feedbacks.length === 0 && !error && (
                <div className="empty-state">
                  <div className="empty-icon">💬</div>
                  <h3>No reviews yet</h3>
                  <p>Be the first to share your experience!</p>
                  <button className="btn-primary btn-animated" onClick={() => navigate('/profile')}>
                    Leave a Review
                  </button>
                </div>
              )}
              {feedbacks.map((item, index) => (
                <article key={item._id || item.id} className="feedback-card card-hover">
                  <div className="card-left">
                    <div className="avatar large animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                      {item.name?.split(' ').map(n => n[0]).slice(0,2).join('')}
                    </div>
                  </div>

                  <div className="card-body">
                    <div className="card-header">
                      <div className="card-name">{item.name}</div>
                      <div className="card-meta">
                        <span className="card-rating" aria-label={`${item.rating} star`}>
                          {'★'.repeat(item.rating)}
                          <span className="rating-number">{item.rating}</span>
                        </span>
                        <span className="card-date">{formatDate(item.approvedAt || item.createdAt || item.date)}</span>
                      </div>
                    </div>

                    <div className="card-message">{item.message}</div>

                    {item.media && (
                      <div className="card-media">
                        {String(item.media).startsWith('data:video') || item.mediaType === 'video' ? (
                          <video 
                            src={item.media} 
                            controls 
                            className="media-content"
                            poster=""
                          />
                        ) : (
                          <img 
                            src={item.media} 
                            alt="Customer review attachment" 
                            className="media-content image-zoom"
                            loading="lazy"
                          />
                        )}
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="card-footer">
                        <div className="card-tags">
                          {item.tags.map((t, tagIndex) => (
                            <span key={tagIndex} className="tag pill">{t}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </section>
          </main>
        </div>
      </div>
    </SectionLoader>
  )
}
