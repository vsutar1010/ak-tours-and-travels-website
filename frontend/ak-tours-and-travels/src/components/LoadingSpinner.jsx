import '../styles/loading.css'

export default function LoadingSpinner({ size = 'medium', text = 'Loading...' }) {
  return (
    <div className={`loading-spinner loading-${size}`}>
      <div className="spinner"></div>
      {text && <p className="loading-text">{text}</p>}
    </div>
  )
}
