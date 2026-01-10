import { useState, useEffect } from 'react'
import SectionLoader from '../components/SectionLoader.jsx'
import SEO from '../components/SEO'
import LazyImage from '../components/LazyImage.jsx'

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // All unique photos - removing duplicates and organizing
  const allPhotos = [
    '/photos/_DSC0956.JPG',
    '/photos/_DSC0984.JPG',
    '/photos/_DSC0993.JPG',
    '/photos/_DSC1014.JPG',
    '/photos/_DSC1059.JPG',
    '/photos/_DSC1070.JPG',
    '/photos/_DSC1075.JPG',
    '/photos/_DSC1131.JPG',
    '/photos/1720554775809.jpg',
    '/photos/1720607725685.jpg',
    '/photos/1720609518831.jpg',
    '/photos/1720629043291.jpg',
    '/photos/1720705430663.jpg',    
    '/photos/_DSC1011.JPG',
    '/photos/20240602_141154.jpg',
    '/photos/IMG_7896.JPEG.jpg',
    '/photos/IMG_7900.JPEG.jpg',
    '/photos/IMG_7901.JPEG.jpg',
    '/photos/IMG_7903.JPEG.jpg',
    '/photos/IMG_7905.JPEG.jpg',
    '/photos/IMG_7906.JPEG.jpg',
    '/photos/IMG_7910.JPEG.jpg',
    '/photos/IMG_7912.JPEG.jpg',    
    '/photos/_DSC0959.JPG',
    '/photos/IMG_7915.JPEG.jpg',    
    '/photos/_DSC1012.JPG'
  ]

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  return (
    <>
      <SEO
        title="Photo Gallery - Travel Memories"
        description="Explore our photo gallery showcasing AK Tours & Travels vehicles, travel experiences, and memorable journeys. View our fleet, destinations, and customer experiences in Mysuru, Karnataka."
        keywords="AK Tours & Travels gallery, travel photos, vehicle images, travel memories, fleet photos, tour pictures"
        url="/gallery"
      />
      <div>
        <div className="gallery-header">
        <h2>Photo Gallery</h2>
        <p className="muted">Explore our collection of travel memories and experiences</p>
      </div>
      
      <SectionLoader isLoading={isLoading} height="600px">
        <div className="gallery-grid">
        {allPhotos.map((photo, index) => (
          <div 
            key={index} 
            className="gallery-item"
            onClick={() => setSelectedImage(photo)}
          >
            <LazyImage 
              src={photo} 
              alt={`AK Tours & Travels vehicle and travel experience - Gallery image ${index + 1}`}
            />
          </div>
        ))}
        </div>
      </SectionLoader>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content">
            <img src={selectedImage} alt="AK Tours & Travels gallery - Enlarged view" />
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


