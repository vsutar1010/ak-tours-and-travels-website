import { useState, useEffect } from "react";
import SectionLoader from "../components/SectionLoader.jsx";
import { useNavigate } from "react-router-dom";
import "../styles/feedback.css";
import { API_BASE_URL } from '../utils/api.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [feedbacks, setFeedbacks] = useState([]);
  const [approvedFeedbacks, setApprovedFeedbacks] = useState([]);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState('');
  const [isActioning, setIsActioning] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is logged in
    const token = sessionStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin-login')
      return
    }
    fetchPendingFeedbacks()
    fetchApprovedFeedbacks()
  }, [navigate])

  async function fetchPendingFeedbacks() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/pending`)

      if (!response.ok) {
        throw new Error('Failed to fetch pending feedbacks')
      }

      const data = await response.json()
      setFeedbacks(data.data || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching pending feedbacks:', err)
      setError('Failed to load pending feedbacks')
      setFeedbacks([])
    }
  }

  async function fetchApprovedFeedbacks() {
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/approved`)

      if (!response.ok) {
        throw new Error('Failed to fetch approved feedbacks')
      }

      const data = await response.json()
      setApprovedFeedbacks(data.data || [])
    } catch (err) {
      console.error('Error fetching approved feedbacks:', err)
      setApprovedFeedbacks([])
    } finally {
      setLoading(false)
    }
  }

  async function handleApproveFeedback(feedbackId) {
    setIsActioning(true)
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/approve/${feedbackId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to approve feedback')
      }

      setActionMsg('Feedback approved successfully!')
      // Remove from pending list
      setFeedbacks(prev => prev.filter(f => f._id !== feedbackId))
      setTimeout(() => setActionMsg(''), 2000)
    } catch (err) {
      console.error('Error approving feedback:', err)
      setActionMsg('Error: ' + (err.message || 'Failed to approve'))
      setTimeout(() => setActionMsg(''), 2000)
    } finally {
      setIsActioning(false)
    }
  }

  async function handleRejectFeedback(feedbackId) {
    if (!confirm('Are you sure you want to reject this feedback?')) {
      return
    }

    setIsActioning(true)
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/reject/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reject feedback')
      }

      setActionMsg('Feedback rejected and deleted!')
      // Remove from pending list
      setFeedbacks(prev => prev.filter(f => f._id !== feedbackId))
      setTimeout(() => setActionMsg(''), 2000)
    } catch (err) {
      console.error('Error rejecting feedback:', err)
      setActionMsg('Error: ' + (err.message || 'Failed to reject'))
      setTimeout(() => setActionMsg(''), 2000)
    } finally {
      setIsActioning(false)
    }
  }

  async function handleDeleteApprovedFeedback(feedbackId) {
    if (!confirm('Are you sure you want to delete this published review? This action cannot be undone.')) {
      return
    }

    setIsActioning(true)
    try {
      const response = await fetch(`${API_BASE_URL}/feedback/delete/${feedbackId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ feedbackId }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete feedback')
      }

      setActionMsg('Review deleted successfully!')
      // Remove from approved list
      setApprovedFeedbacks(prev => prev.filter(f => f._id !== feedbackId))
      setTimeout(() => setActionMsg(''), 2000)
    } catch (err) {
      console.error('Error deleting feedback:', err)
      setActionMsg('Error: ' + (err.message || 'Failed to delete'))
      setTimeout(() => setActionMsg(''), 2000)
    } finally {
      setIsActioning(false)
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token')
    navigate('/admin-login')
  }

  return (
    <SectionLoader isLoading={loading} height="640px">
      <div className="feedback-page container" style={{ paddingTop: 20, paddingBottom: 40 }}>
        <div className="page-head centered">
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-sub">Manage feedback submissions and published reviews</p>
        </div>

        <div style={{ textAlign: 'right', marginBottom: 20, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          <button
            className="btn-primary"
            onClick={() => navigate('/admin-news')}
            style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer' }}
          >
            📰 Manage News
          </button>
          <button
            className="btn-link"
            onClick={handleLogout}
            style={{ color: '#d32f2f', cursor: 'pointer', padding: '8px 16px', fontSize: '14px' }}
          >
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          marginBottom: '20px',
          borderBottom: '2px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          <button
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'pending' ? '#1976d2' : 'transparent',
              color: activeTab === 'pending' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'pending' ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            Pending Feedbacks ({feedbacks.length})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === 'approved' ? '#1976d2' : 'transparent',
              color: activeTab === 'approved' ? 'white' : '#333',
              border: 'none',
              borderRadius: '4px 4px 0 0',
              cursor: 'pointer',
              fontWeight: activeTab === 'approved' ? 'bold' : 'normal',
              fontSize: '14px'
            }}
          >
            Published Reviews ({approvedFeedbacks.length})
          </button>
        </div>

        <div className="fb-grid">
          <aside className="fb-left">
            <div className="sticky-filter">
              <div className="stats-compact">
                <div className="count">
                  <div className="count-big">{activeTab === 'pending' ? feedbacks.length : approvedFeedbacks.length}</div>
                  <div className="count-label">{activeTab === 'pending' ? 'Pending' : 'Published'}</div>
                </div>
              </div>
            </div>
          </aside>

          <main className="fb-right">
            <section className="feedback-list" aria-live="polite">
              {activeTab === 'pending' && (
                <>
                  {error && <div className="empty" style={{ color: '#d32f2f' }}>{error}</div>}
                  {feedbacks.length === 0 && !error && (
                    <div className="empty">No pending feedbacks to review.</div>
                  )}

                  {feedbacks.map(item => (
                    <article key={item._id} className="feedback-card" style={{ position: 'relative' }}>
                      <div className="card-left">
                        <div className="avatar large">
                          {item.name?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-header">
                          <div className="card-name">{item.name}</div>
                          <div className="card-meta">
                            <span className="card-rating" aria-label={`${item.rating} star`}>
                              {'★'.repeat(item.rating)}
                            </span>
                            <span className="card-date">{formatDate(item.createdAt)}</span>
                          </div>
                        </div>

                        <div className="card-message">{item.message}</div>

                        {item.media && (
                          <div style={{ marginTop: 10 }}>
                            {item.mediaType === 'video' ? (
                              <video src={item.media} controls style={{ maxWidth: '100%', borderRadius: 8 }} />
                            ) : (
                              <img src={item.media} alt="attachment" style={{ maxWidth: '420px', borderRadius: 8 }} />
                            )}
                          </div>
                        )}

                        <div className="card-footer">
                          <div className="card-tags">
                            {item.tags?.map(t => <span key={t} className="tag pill">{t}</span>)}
                          </div>
                        </div>

                        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                          <button
                            className="btn-primary"
                            onClick={() => handleApproveFeedback(item._id)}
                            disabled={isActioning}
                            style={{ flex: 1, padding: '8px 12px', fontSize: '14px' }}
                          >
                            ✓ Approve
                          </button>
                          <button
                            className="btn-link"
                            onClick={() => handleRejectFeedback(item._id)}
                            disabled={isActioning}
                            style={{ 
                              flex: 1, 
                              padding: '8px 12px', 
                              fontSize: '14px',
                              color: '#d32f2f',
                              border: '1px solid #d32f2f'
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </>
              )}

              {activeTab === 'approved' && (
                <>
                  {approvedFeedbacks.length === 0 && (
                    <div className="empty">No published reviews yet.</div>
                  )}

                  {approvedFeedbacks.map(item => (
                    <article key={item._id} className="feedback-card" style={{ position: 'relative' }}>
                      <div className="card-left">
                        <div className="avatar large">
                          {item.name?.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      </div>

                      <div className="card-body">
                        <div className="card-header">
                          <div className="card-name">{item.name}</div>
                          <div className="card-meta">
                            <span className="card-rating" aria-label={`${item.rating} star`}>
                              {'★'.repeat(item.rating)}
                            </span>
                            <span className="card-date">{formatDate(item.approvedAt || item.createdAt)}</span>
                          </div>
                        </div>

                        <div className="card-message">{item.message}</div>

                        {item.media && (
                          <div style={{ marginTop: 10 }}>
                            {item.mediaType === 'video' ? (
                              <video src={item.media} controls style={{ maxWidth: '100%', borderRadius: 8 }} />
                            ) : (
                              <img src={item.media} alt="attachment" style={{ maxWidth: '420px', borderRadius: 8 }} />
                            )}
                          </div>
                        )}

                        <div className="card-footer">
                          <div className="card-tags">
                            {item.tags?.map(t => <span key={t} className="tag pill">{t}</span>)}
                          </div>
                        </div>

                        <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                          <button
                            className="btn-link"
                            onClick={() => handleDeleteApprovedFeedback(item._id)}
                            disabled={isActioning}
                            style={{ 
                              flex: 1, 
                              padding: '8px 12px', 
                              fontSize: '14px',
                              color: '#d32f2f',
                              border: '1px solid #d32f2f'
                            }}
                          >
                            🗑️ Delete Review
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </>
              )}
            </section>

            {actionMsg && (
              <div style={{ 
                position: 'fixed', 
                bottom: 20, 
                right: 20, 
                backgroundColor: '#4caf50', 
                color: 'white', 
                padding: '12px 20px', 
                borderRadius: '4px',
                zIndex: 1000
              }}>
                {actionMsg}
              </div>
            )}
          </main>
        </div>
      </div>
    </SectionLoader>
  );
}
