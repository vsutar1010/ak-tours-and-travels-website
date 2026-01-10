import SEO from '../components/SEO'
import StructuredData from '../components/StructuredData'

export default function Contact() {

  const contactInfo = [
    {
      icon: '📞',
      title: 'Phone',
      details: '+91 9730825092',
      action: 'Call Now',
      link: 'tel:+919730825092'
    },
    {
      icon: '📍',
      title: 'Location',
      details: 'Pune, Maharashtra',
      action: 'View on Map',
      link: 'https://maps.app.goo.gl/K6QtsAfxD9mYKHdK8'
    },
    {
      icon: '💬',
      title: 'WhatsApp',
      details: 'Quick Response',
      action: 'Chat Now',
      link: 'https://wa.me/919730825092'
    },
    {
      icon: '⏰',
      title: 'Operating Hours',
      details: '24/7 Service',
      action: 'Always Available',
      link: '#'
    }
  ]

  const services = [
    'Pune-Mumbai Daily Service',
    'Airport Transfers',
    'Corporate Travel',
    'Group Bookings',
    'Luxury Vehicles',
    'Emergency Service'
  ]

  return (
    <>
      <SEO
        title="Contact Us - Get in Touch"
        description="Contact AK Tours & Travels for bookings and inquiries. Call +91 9730825092, WhatsApp us, or visit us at 1st Floor, Opp. City Center, Mysuru, Karnataka. 24/7 customer support available."
        keywords="contact AK Tours & Travels, phone number, address Mysuru, WhatsApp booking, travel booking contact"
        url="/contact"
      />
      <StructuredData type="ContactPage" />
      <div>
        {/* Hero Section */}
      <div className="contact-hero">
        <h1>Get in Touch</h1>
        <p>Ready to book your next journey? Contact us for reliable and comfortable travel between Pune and Mumbai.</p>
      </div>

      <div className="contact-layout">
        {/* Contact Information */}
        <div className="contact-info-section">
          <h2>Contact Information</h2>
          <div className="contact-cards">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-card">
                <div className="contact-icon">{info.icon}</div>
                <div className="contact-details">
                  <h3>{info.title}</h3>
                  <p>{info.details}</p>
                  <a href={info.link} className="contact-action" target="_blank" rel="noopener noreferrer">
                    {info.action}
                  </a>
                </div>
              </div>
            ))}
          </div>

          
        </div>

        {/* Contact Form removed per request */}
      </div>

      {/* Quick Contact */}
      <div className="quick-contact">
        <div className="quick-contact-content">
          <h3>Need Immediate Assistance?</h3>
          <p>Call us directly for instant booking and support</p>
          <div className="quick-actions">
            <a href="tel:+919730825092" className="btn-call">
              📞 Call Now: +91 9730825092
            </a>
            <a href="https://wa.me/919730825092" className="btn-whatsapp" target="_blank" rel="noopener noreferrer">
              💬 WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}


