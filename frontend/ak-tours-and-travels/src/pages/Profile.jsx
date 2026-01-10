// taking feedback from user and saving to backend database
import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SectionLoader from '../components/SectionLoader.jsx'
import SEO from '../components/SEO'
import { API_BASE_URL } from '../utils/api.js'

export default function Profile() {
  const [isLoading, setIsLoading] = useState(true)
  const [feedback, setFeedback] = useState({ rating: '', message: '', tags: '' })
  const [fbUser, setFbUser] = useState({ name: '' })
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)
  const [fbMsg, setFbMsg] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [autoSaveStatus, setAutoSaveStatus] = useState('')
  const [suggestedTags, setSuggestedTags] = useState([])
  const navigate = useNavigate()
  const galleryRef = useRef(null)
  const servicesRef = useRef(null)
  const feedbackFormRef = useRef(null)
  const autoSaveTimerRef = useRef(null)
  
  const scrollToFeedback = () => {
    if (feedbackFormRef.current) {
      const element = feedbackFormRef.current
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - 80 // 80px offset from top
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
      
      // Add a highlight effect to the form
      element.style.transition = 'box-shadow 0.3s ease'
      element.style.boxShadow = '0 0 30px rgba(254, 86, 17, 0.5)'
      setTimeout(() => {
        element.style.boxShadow = ''
      }, 2000)
    }
  }

  // Featured images for hero and gallery preview
  const featuredImages = [
    '/photos/_DSC0956.JPG',
    '/photos/_DSC0993.JPG',
    '/photos/_DSC1011.JPG',
    '/photos/IMG_7896.JPEG.jpg',
    '/photos/IMG_7905.JPEG.jpg',
    '/photos/_DSC1059.JPG'
  ]

  const galleryPreview = [
    '/photos/_DSC0959.JPG',
    '/photos/_DSC0984.JPG',
    '/photos/_DSC1012.JPG',
    '/photos/_DSC1014.JPG',
    '/photos/_DSC1070.JPG'
  ]

  const serviceHighlights = [
    {
      title: 'Luxury Travel',
      description: 'Premium vehicles for your comfort',
      image: '/photos/services/luxury-car-rental.jpg',
      icon: '🚗'
    },
    {
      title: 'Professional Service',
      description: 'Expert drivers and reliable service',
      image: '/photos/services/Profectional.jpg',
      icon: '⭐'
    },
    {
      title: '24/7 Available',
      description: 'Round-the-clock booking support',
      image: '/photos/services/car-rental-service.jpg',
      icon: '🕐'
    }
  ]

  useEffect(() => {
    const t = setTimeout(() => setIsLoading(false), 380)
    return () => clearTimeout(t)
  }, [])

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % featuredImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  // Scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed')
        }
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' })

    const elements = [galleryRef.current, servicesRef.current].filter(Boolean)
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

  function handleFbChange(e) {
    const { name, value } = e.target
    setFeedback(prev => ({ ...prev, [name]: value }))
    
    // Auto-save to localStorage
    if (name === 'message' || name === 'rating' || name === 'tags') {
      clearTimeout(autoSaveTimerRef.current)
      autoSaveTimerRef.current = setTimeout(() => {
        localStorage.setItem('feedback_draft', JSON.stringify({
          ...feedback,
          [name]: value,
          name: fbUser.name
        }))
        setAutoSaveStatus('💾 Auto-saved')
        setTimeout(() => setAutoSaveStatus(''), 2000)
      }, 1000)
    }
    
    // Auto-suggest tags based on message content
    if (name === 'message' && value.length > 20) {
      const message = value.toLowerCase()
      const newSuggestions = []
      if (message.includes('great') || message.includes('excellent') || message.includes('amazing')) {
        newSuggestions.push('great service')
      }
      if (message.includes('affordable') || message.includes('cheap') || message.includes('price')) {
        newSuggestions.push('affordable')
      }
      if (message.includes('friendly') || message.includes('helpful') || message.includes('kind')) {
        newSuggestions.push('friendly')
      }
      if (message.includes('comfortable') || message.includes('clean') || message.includes('nice')) {
        newSuggestions.push('comfortable')
      }
      if (message.includes('punctual') || message.includes('on time') || message.includes('timely')) {
        newSuggestions.push('punctual')
      }
      
      // Filter out tags that are already selected
      const currentTags = feedback.tags ? feedback.tags.split(',').map(t => t.trim().toLowerCase()) : []
      const filteredSuggestions = newSuggestions.filter(tag => 
        !currentTags.includes(tag.toLowerCase())
      )
      
      setSuggestedTags(filteredSuggestions)
    } else if (name === 'message' && value.length <= 20) {
      setSuggestedTags([])
    }
  }

  function handleFbUserChange(e) {
    const { name, value } = e.target
    setFbUser(prev => ({ ...prev, [name]: value }))
    
    // Auto-save name
    clearTimeout(autoSaveTimerRef.current)
    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem('feedback_draft', JSON.stringify({
        ...feedback,
        name: value
      }))
    }, 1000)
  }
  
  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem('feedback_draft')
    if (draft) {
      try {
        const parsed = JSON.parse(draft)
        if (parsed.message || parsed.rating || parsed.tags) {
          setFeedback(prev => ({
            ...prev,
            message: parsed.message || prev.message,
            rating: parsed.rating || prev.rating,
            tags: parsed.tags || prev.tags
          }))
          if (parsed.name) {
            setFbUser({ name: parsed.name })
          }
        }
      } catch (e) {
        console.error('Error loading draft:', e)
      }
    }
  }, [])
  
  // Clear draft after successful submission
  useEffect(() => {
    if (fbMsg && fbMsg.includes('successfully')) {
      localStorage.removeItem('feedback_draft')
    }
  }, [fbMsg])

  function handleMediaChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) {
      setMediaPreview(null)
      setMediaFile(null)
      return
    }

    setMediaFile(file)
    const reader = new FileReader()
    reader.onload = () => {
      setMediaPreview(reader.result)
    }
    reader.onerror = () => {
      setMediaPreview(null)
      setMediaFile(null)
    }
    reader.readAsDataURL(file)
  }

  async function handleSubmitFeedback(e) {
    e.preventDefault()
    
    if (!feedback.message.trim()) {
      setFbMsg('Please enter feedback message')
      setTimeout(() => setFbMsg(''), 1600)
      return
    }

    if (!feedback.rating) {
      setFbMsg('Please select a rating')
      setTimeout(() => setFbMsg(''), 1600)
      return
    }

    setIsSubmitting(true)

    try {
      const payload = {
        name: (fbUser.name && fbUser.name.trim()) || 'Anonymous',
        rating: Number(feedback.rating),
        message: feedback.message.trim(),
        tags: (feedback.tags || '').split(',').map(t => t.trim()).filter(Boolean),
        media: mediaPreview || null,
        mediaType: mediaFile ? (mediaFile.type.startsWith('video') ? 'video' : 'image') : null,
      }

      const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback')
      }

      setFeedback({ rating: '', message: '', tags: '' })
      setFbUser({ name: '' })
      setMediaPreview(null)
      setMediaFile(null)
      setFbMsg('Feedback submitted successfully! Awaiting admin approval.')
      setTimeout(() => setFbMsg(''), 3000)
    } catch (err) {
      console.error('Error submitting feedback:', err)
      setFbMsg('Error: ' + (err.message || 'Failed to submit feedback'))
      setTimeout(() => setFbMsg(''), 3000)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SectionLoader isLoading={isLoading} height="420px">
      <SEO
        title="Share Your Feedback - Customer Reviews"
        description="Share your travel experience with AK Tours & Travels. Your feedback helps us improve our services. Submit your review, rating, and photos of your journey with us."
        keywords="AK Tours & Travels feedback, customer reviews, travel experience, submit review, rate travel service"
        url="/profile"
      />
      <div className="profile-page container" style={{ paddingTop: 0, paddingBottom: 48 }}>
        {/* Hero Section with Background Images */}
        <div className="profile-hero-enhanced">
          <div className="hero-background-slider">
            {featuredImages.map((image, index) => (
              <div
                key={index}
                className={`hero-bg-slide ${index === currentImageIndex ? 'active' : ''}`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
          <div className="hero-overlay"></div>
          <div className="profile-hero-content">
            <button 
              className="hero-badge animate-pulse btn-share-experience" 
              onClick={scrollToFeedback}
              aria-label="Scroll to feedback form"
            >
              <span className="badge-icon">💬</span>
              <span>Share Your Experience</span>
            </button>
            <h1 className="profile-hero-title">
              We Value Your Feedback
            </h1>
            <p className="profile-hero-subtitle">
              Help us improve and share your journey with AK Tours & Travels. Your experience matters to us!
            </p>
            
            {/* Quick Navigation Buttons */}
            <div className="hero-quick-nav">
              <button 
                className="nav-card btn-animated" 
                onClick={() => navigate('/')}
              >
                <span className="nav-icon">🏠</span>
                <span className="nav-text">Home</span>
              </button>
              <button 
                className="nav-card btn-animated" 
                onClick={() => navigate('/services')}
              >
                <span className="nav-icon">🚌</span>
                <span className="nav-text">Services</span>
              </button>
              <button 
                className="nav-card btn-animated" 
                onClick={() => navigate('/gallery')}
              >
                <span className="nav-icon">📸</span>
                <span className="nav-text">Gallery</span>
              </button>
              <button 
                className="nav-card btn-animated" 
                onClick={() => navigate('/feedback')}
              >
                <span className="nav-icon">⭐</span>
                <span className="nav-text">Reviews</span>
              </button>
              <button 
                className="nav-card btn-animated" 
                onClick={() => navigate('/contact')}
              >
                <span className="nav-icon">📞</span>
                <span className="nav-text">Contact</span>
              </button>
            </div>
          </div>
        </div>

        {/* Service Highlights Section */}
        <div className="profile-services-showcase" ref={servicesRef}>
          <div className="showcase-header">
            <h2 className="showcase-title">Why Choose AK Tours & Travels?</h2>
            <p className="showcase-subtitle">Experience excellence in every journey</p>
          </div>
          <div className="services-grid-showcase">
            {serviceHighlights.map((service, index) => (
              <div key={index} className="service-showcase-card">
                <div className="service-image-wrapper">
                  <img src={service.image} alt={service.title} className="service-showcase-image" />
                  <div className="service-overlay"></div>
                  <div className="service-icon-badge">{service.icon}</div>
                </div>
                <div className="service-showcase-content">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Preview Section */}
        <div className="profile-gallery-preview" ref={galleryRef}>
          <div className="gallery-preview-header">
            <h2 className="gallery-preview-title">Explore Our Gallery</h2>
            <p className="gallery-preview-subtitle">See our fleet and travel experiences</p>
          </div>
          <div className="gallery-preview-grid">
            {galleryPreview.map((image, index) => (
              <div 
                key={index} 
                className="gallery-preview-item"
                onClick={() => navigate('/gallery')}
              >
                <img src={image} alt={`Gallery preview ${index + 1}`} />
                <div className="gallery-preview-overlay">
                  <span className="view-gallery-btn">View Gallery →</span>
                </div>
              </div>
            ))}
          </div>
          <div className="gallery-preview-cta">
            <button 
              className="btn-gallery-explore btn-animated" 
              onClick={() => navigate('/gallery')}
            >
              <span className="btn-icon">📸</span>
              <span>View Full Gallery</span>
            </button>
          </div>
        </div>

        <div className="profile-wrapper">
          {/* Feedback form centered below profile, wider */}
          <main ref={feedbackFormRef} className="profile-feedback card" aria-label="profile-feedback">
            <div className="feedback-head">
              <div>
                <h2 className="feedback-title">Send Your Feedback</h2>
                <p className="feedback-subtitle">Tell us about your experience with AK Tours & Travels</p>
              </div>
            </div>

            <form onSubmit={handleSubmitFeedback} className="feedback-form compact-form">
              {autoSaveStatus && (
                <div className="auto-save-indicator">{autoSaveStatus}</div>
              )}
              
              {/* Compact Two-Column Layout */}
              <div className="form-compact-grid">
                {/* Left Column */}
                <div className="form-left-column">
                  {/* Name and Rating in one row */}
                  <div className="form-row-compact">
                    <div className="form-field-compact">
                      <label className="form-label-compact">
                        <span className="label-icon-small">👤</span>
                        <span>Name</span>
                      </label>
                      <input 
                        name="name" 
                        value={fbUser.name} 
                        onChange={handleFbUserChange}
                        className="form-input-compact"
                        placeholder="Your name (optional)"
                      />
                    </div>
                    
                    <div className="form-field-compact">
                      <label className="form-label-compact">
                        <span className="label-icon-small">⭐</span>
                        <span>Rating</span>
                      </label>
                      <div className="star-rating-compact">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            className={`star-btn ${Number(feedback.rating) >= star ? 'active' : ''} ${hoveredRating >= star ? 'hovered' : ''}`}
                            onClick={() => setFeedback(prev => ({ ...prev, rating: String(star) }))}
                            onMouseEnter={() => setHoveredRating(star)}
                            onMouseLeave={() => setHoveredRating(0)}
                          >
                            ★
                          </button>
                        ))}
                        {feedback.rating && (
                          <span className="rating-text-compact">
                            {feedback.rating === '5' ? 'Excellent!' : 
                             feedback.rating === '4' ? 'Good!' : 
                             feedback.rating === '3' ? 'Average' : 
                             feedback.rating === '2' ? 'Below Avg' : 'Poor'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* File Upload Compact */}
                  <div className="form-field-compact">
                    <label className="form-label-compact">
                      <span className="label-icon-small">📎</span>
                      <span>Media (Optional)</span>
                    </label>
                    <div className="file-upload-compact">
                      <input 
                        type="file" 
                        accept="image/*,video/*" 
                        onChange={handleMediaChange}
                        id="media-upload-compact"
                        className="file-input"
                      />
                      <label htmlFor="media-upload-compact" className="file-upload-label-compact">
                        {mediaFile ? (
                          <span className="file-name-display">
                            <span className="file-icon">📄</span>
                            <span className="file-name-text">{mediaFile.name.length > 20 ? mediaFile.name.substring(0, 20) + '...' : mediaFile.name}</span>
                            <button
                              type="button"
                              className="remove-file-btn"
                              onClick={(e) => {
                                e.stopPropagation()
                                setMediaPreview(null)
                                setMediaFile(null)
                              }}
                            >
                              ✕
                            </button>
                          </span>
                        ) : (
                          <>
                            <span className="upload-icon-small">📤</span>
                            <span>Click to upload</span>
                          </>
                        )}
                      </label>
                      {mediaPreview && (
                        <div className="media-preview-compact">
                          {mediaPreview.startsWith('data:video') ? (
                            <video src={mediaPreview} controls className="preview-compact" />
                          ) : (
                            <div className="preview-wrapper-compact">
                              <img src={mediaPreview} alt="preview" className="preview-compact" />
                              <button
                                type="button"
                                className="remove-preview-compact"
                                onClick={() => {
                                  setMediaPreview(null)
                                  setMediaFile(null)
                                }}
                              >
                                ✕
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Tags with Auto-suggestions */}
                  <div className="form-field-compact">
                    <label className="form-label-compact">
                      <span className="label-icon-small">🏷️</span>
                      <span>Tags</span>
                    </label>
                    <div className="tags-input-compact">
                      <input 
                        name="tags" 
                        value={feedback.tags} 
                        onChange={handleFbChange} 
                        className="form-input-compact"
                        placeholder="Type or select tags..."
                      />
                      <div className="tag-suggestions-compact">
                        {[...suggestedTags, ...['great service', 'affordable', 'friendly', 'comfortable', 'punctual']]
                          .filter((tag, index, self) => self.indexOf(tag) === index)
                          .slice(0, 5)
                          .map(tag => {
                            const currentTags = feedback.tags ? feedback.tags.split(',').map(t => t.trim()) : []
                            const isSelected = currentTags.includes(tag)
                            const isAutoSuggested = suggestedTags.includes(tag)
                            return (
                              <button
                                key={tag}
                                type="button"
                                className={`tag-chip ${isSelected ? 'selected' : ''} ${isAutoSuggested ? 'auto-suggested' : ''}`}
                                onClick={() => {
                                  if (!isSelected) {
                                    setFeedback(prev => ({
                                      ...prev,
                                      tags: prev.tags ? `${prev.tags}, ${tag}` : tag
                                    }))
                                    setSuggestedTags(prev => prev.filter(t => t !== tag))
                                  } else {
                                    setFeedback(prev => ({
                                      ...prev,
                                      tags: prev.tags.split(',').map(t => t.trim()).filter(t => t !== tag).join(', ')
                                    }))
                                  }
                                }}
                              >
                                {tag}
                                {isAutoSuggested && <span className="auto-badge">✨</span>}
                              </button>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Message */}
                <div className="form-right-column">
                  <div className="form-field-compact">
                    <label className="form-label-compact">
                      <span className="label-icon-small">💬</span>
                      <span>Your Message</span>
                    </label>
                    <div className="textarea-wrapper-compact">
                      <textarea 
                        name="message" 
                        value={feedback.message} 
                        onChange={handleFbChange} 
                        rows={8}
                        className="form-textarea-compact"
                        placeholder="Share your experience... (Auto-saves as you type)"
                      />
                      <div className="textarea-footer">
                        <div className="char-count-compact">{feedback.message.length} chars</div>
                        {feedback.message.length > 50 && (
                          <div className="sentiment-indicator">
                            {feedback.message.toLowerCase().includes('great') || 
                             feedback.message.toLowerCase().includes('excellent') ||
                             feedback.message.toLowerCase().includes('amazing') ? '😊' : 
                             feedback.message.toLowerCase().includes('bad') ||
                             feedback.message.toLowerCase().includes('poor') ||
                             feedback.message.toLowerCase().includes('terrible') ? '😞' : '😐'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              {fbMsg && (
                <div className={`form-message-compact ${fbMsg.includes('Error') ? 'error' : 'success'}`}>
                  {fbMsg.includes('Error') ? '❌' : '✅'} {fbMsg}
                </div>
              )}

              <div className="form-actions-compact">
                <button 
                  className="btn-submit-compact btn-animated" 
                  type="submit"
                  disabled={isSubmitting || !feedback.message.trim() || !feedback.rating}
                >
                  <span className="btn-icon">{isSubmitting ? '⏳' : '📤'}</span>
                  <span>{isSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                </button>
                <button 
                  type="button" 
                  className="btn-reset-compact" 
                  onClick={() => {
                    setFeedback({ rating: '', message: '', tags: '' })
                    setFbUser({ name: '' })
                    setMediaPreview(null)
                    setMediaFile(null)
                    setFbMsg('')
                    setSuggestedTags([])
                    localStorage.removeItem('feedback_draft')
                  }}
                  disabled={isSubmitting}
                >
                  <span className="btn-icon">🔄</span>
                  <span>Clear</span>
                </button>
              </div>
            </form>
          </main>

          {/* Explore More Section */}
          <div className="profile-explore-section">
            <div className="explore-content">
              <div className="explore-header">
                <h3 className="explore-title">Ready to Start Your Journey?</h3>
                <p className="explore-subtitle">Discover our services, view our gallery, and book your next adventure with AK Tours & Travels</p>
              </div>
              <div className="explore-features">
                <div className="explore-feature">
                  <div className="feature-icon-large">🚌</div>
                  <h4>Our Services</h4>
                  <p>Explore our range of travel services</p>
                  <button 
                    className="btn-feature btn-animated" 
                    onClick={() => navigate('/services')}
                  >
                    View Services →
                  </button>
                </div>
                <div className="explore-feature">
                  <div className="feature-icon-large">📸</div>
                  <h4>Photo Gallery</h4>
                  <p>See our vehicles and travel experiences</p>
                  <button 
                    className="btn-feature btn-animated" 
                    onClick={() => navigate('/gallery')}
                  >
                    View Gallery →
                  </button>
                </div>
                <div className="explore-feature">
                  <div className="feature-icon-large">📞</div>
                  <h4>Contact Us</h4>
                  <p>Get in touch for bookings and inquiries</p>
                  <button 
                    className="btn-feature btn-animated" 
                    onClick={() => navigate('/contact')}
                  >
                    Contact Us →
                  </button>
                </div>
              </div>
              <div className="explore-buttons">
                <button 
                  className="btn-explore-primary btn-animated" 
                  onClick={() => navigate('/services')}
                >
                  <span className="btn-icon">🚌</span>
                  <span>View All Services</span>
                </button>
                <button 
                  className="btn-explore-whatsapp btn-animated" 
                  onClick={() => window.open('https://wa.me/919730825092', '_blank', 'noopener')}
                >
                  <span className="btn-icon">💬</span>
                  <span>Book via WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionLoader>
  )
}
