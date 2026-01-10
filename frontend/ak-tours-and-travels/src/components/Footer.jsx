import { useNavigate } from 'react-router-dom';

export default function Footer() {
  const navigate = useNavigate();

  const handleAdminAccess = () => {
    navigate('/admin-login');
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h4>Follow Us</h4>
          <p><a href="https://wa.me/919730825092" target="_blank" rel="noreferrer">WhatsApp</a></p>
          <p><a href="https://www.instagram.com/aktoursandtravels3693?utm_source=qr&igsh=Z3hhbGRqZGJzdnUz" target="_blank" rel="noreferrer">Instagram</a></p>
          <p><a href="tel:+919730825092">+91 97308 25092</a></p>
          <p><a href="mailto:Aktourstravels3693@gmail.com">Aktourstravels3693@gmail.com</a></p>
        </div>
        <div className="footer-column">
          <h4>Navigate</h4>
          <p><a href="/">Home</a></p>
          <p><a href="/services">Services</a></p>
          <p><a href="/gallery">Gallery</a></p>
          <p><a href="/contact">Contact</a></p>
          <p>24/7 Support Available</p>
        </div>
        <div className="footer-column">
          <h4>Visit Us</h4>
          <p>AK Tours &amp; Travels</p>
          <p>Yashvantraw chavhan trust, Shop No 1, near Sant Tukaram Garden Road, Sector 27A,</p>
          <p>Pradhikaran, Nigdi, Pimpri-Chinchwad, Maharashtra 411044</p>
          <p>Opening: Mon - Sat, 9:00 AM</p>
          <p>Closing: Mon - Sat, 6:00 PM</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p onClick={handleAdminAccess} style={{ cursor: 'pointer' }}>© {new Date().getFullYear()} AK Tours &amp; Travels. All rights reserved.</p>
      </div>
    </footer>
  )
}
