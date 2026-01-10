import '../styles/loading.css'

export default function SectionLoader({ isLoading, children, height = '400px' }) {
  if (!isLoading) return children

  return (
    <div className="section-loader-wrapper" style={{ minHeight: height }}>
      <div className="section-loader">
        <div className="pulse-loader">
          <div className="pulse"></div>
          <div className="pulse"></div>
          <div className="pulse"></div>
        </div>
        <p className="section-loader-text">Loading content...</p>
      </div>
    </div>
  )
}
