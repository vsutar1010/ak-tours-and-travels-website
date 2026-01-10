import { useState } from 'react'
import { services } from '../data/servicesData'
import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'
import LazyImage from '../components/LazyImage.jsx'

export default function Services() {
  const [selectedService, setSelectedService] = useState(null)
  const [selectedImage, setSelectedImage] = useState(null)

  const whyChooseUs = [
    {
      title: 'Safety First',
      description: 'All drivers are trained and certified with clean driving records',
      icon: '🛡️'
    },
    {
      title: 'Clean Vehicles',
      description: 'Regular sanitization and maintenance of all vehicles',
      icon: '🧽'
    },
    {
      title: 'GPS Tracking',
      description: 'Real-time tracking for your peace of mind',
      icon: '📍'
    },
    {
      title: '24/7 Support',
      description: 'Round-the-clock customer support and assistance',
      icon: '📞'
    }
  ]

  return (
    <>
      <SEO
        title="Our Services - Car Rental & Tour Packages"
        description="AK Tours & Travels offers comprehensive travel services including car rental, tempo traveller rental, tour packages (Ashtavinayak Darshan, Kokan Beach, Kolhapur, Lonavala, Satara), Pune airport pickup/drop, and local tours. Professional service in Mysuru, Karnataka."
        keywords="car rental services, tempo traveller rental, tour packages Mysuru, Ashtavinayak Darshan tour, Kokan Beach tour, Kolhapur tour, Lonavala tour, Satara tour, Pune airport pickup drop, local tours Karnataka"
        url="/services"
      />
      <StructuredData 
        type="Service" 
        data={{
          serviceType: 'Travel and Transportation Services',
          areaServed: ['Mysuru', 'Karnataka', 'Pune', 'Mumbai'],
          offers: services.map(s => ({
            '@type': 'Offer',
            name: s.name,
            description: s.description,
            price: s.price
          }))
        }}
      />
      <div>
        {/* Hero Section */}
      <div className="services-hero">
        <h1>Our Services</h1>
        <p>Professional transportation solutions for all your travel needs between Pune and Mumbai</p>
      </div>

      {/* Services Grid */}
      <div className="services-grid">
        {services.map((service) => (
          <div 
            key={service.id} 
            className={`service-card ${selectedService === service.id ? 'selected' : ''}`}
            onClick={() => setSelectedService(selectedService === service.id ? null : service.id)}
          >
            <div className="service-image">
              <LazyImage 
                src={service.image} 
                alt={`${service.name} - ${service.description} | AK Tours & Travels`}
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedImage(service.image)
                }}
                style={{ cursor: 'pointer' }}
              />
              <div className="service-icon">{service.icon}</div>
            </div>
            <div className="service-content">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-details">
                <div className="detail-item">
                  <span className="detail-label">Price:</span>
                  <span className="detail-value">{service.price}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{service.duration}</span>
                </div>
              </div>
              {selectedService === service.id && (
                <div className="service-features">
                  <h4>Features:</h4>
                  <ul>
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                  <a 
                    href={`https://wa.me/919730825092?text=Hello! I'm interested in booking: ${encodeURIComponent(service.name)}`}
                    className="btn-book"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Book Now
                  </a>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Why Choose Us */}
      <div className="why-choose-section">
        <h2>Why Choose AK Tours & Travels?</h2>
        <div className="features-grid">
          {whyChooseUs.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking CTA */}
      <div className="booking-cta">
        <div className="cta-content">
          <h2>Ready to Book Your Journey?</h2>
          <p>Contact us now for reliable and comfortable transportation services</p>
          <div className="cta-actions">
            <a href="tel:+919730825092" className="btn-call">
              📞 Call: +91 9730825092
            </a>
            <a href="https://wa.me/919730825092" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="AK Tours & Travels service - Enlarged view" />
            <button 
              className="close-modal"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  )
}


