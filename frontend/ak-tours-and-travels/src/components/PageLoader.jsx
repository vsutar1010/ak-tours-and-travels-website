import { useState, useEffect } from 'react'
import '../styles/loading.css'

export default function PageLoader({ isLoading, children }) {
  const [showLoader, setShowLoader] = useState(isLoading)

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
    } else {
      const timer = setTimeout(() => setShowLoader(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  return (
    <>
      {showLoader && (
        <div className={`page-loader ${!isLoading ? 'fade-out' : ''}`}> 
          <div className="loader-content">
            <img src="/Logo.png" alt="AK Tours & Travels" className="loader-logo" />
            <div className="loader-caption">Preparing your experience</div>
          </div>
        </div>
      )}
      <div className={`page-content ${showLoader ? 'loading' : ''}`}>
        {children}
      </div>
    </>
  )
}
