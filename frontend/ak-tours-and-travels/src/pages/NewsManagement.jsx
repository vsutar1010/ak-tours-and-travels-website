import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/feedback.css";
import { API_BASE_URL } from '../utils/api.js'

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

export default function NewsManagement() {
  const [activeTab, setActiveTab] = useState('offers');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');
  const [isActioning, setIsActioning] = useState(false);
  const navigate = useNavigate();
  
  // Form states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'offer',
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    // Check if admin is logged in
    const token = sessionStorage.getItem('admin_token')
    if (!token) {
      navigate('/admin-login')
      return
    }
    fetchNews()
  }, [activeTab, navigate]);

  async function fetchNews() {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/news/category/${activeTab}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news');
      }

      const data = await response.json();
      setNews(data.data || []);
    } catch (err) {
      console.error('Error fetching news:', err);
      setActionMsg('Error loading news');
      setTimeout(() => setActionMsg(''), 3000);
    } finally {
      setLoading(false);
    }
  }

  function handleImageSelect(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: reader.result,
          imagePreview: reader.result,
        });
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleAddNews() {
    if (!formData.title.trim() || !formData.content.trim()) {
      setActionMsg('Title and content are required');
      setTimeout(() => setActionMsg(''), 3000);
      return;
    }

    setIsActioning(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title.trim(),
          content: formData.content.trim(),
          category: activeTab,
          image: formData.image,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add news');
      }

      setActionMsg('News added successfully!');
      setFormData({ title: '', content: '', category: 'offer', image: null, imagePreview: null });
      setShowForm(false);
      fetchNews();
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error('Error adding news:', err);
      setActionMsg('Error: ' + (err.message || 'Failed to add news'));
      setTimeout(() => setActionMsg(''), 3000);
    } finally {
      setIsActioning(false);
    }
  }

  async function handleDeleteNews(newsId) {
    if (!confirm('Are you sure you want to delete this news? This action cannot be undone.')) {
      return;
    }

    setIsActioning(true);
    try {
      const response = await fetch(`${API_BASE_URL}/news/delete/${newsId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete news');
      }

      setActionMsg('News deleted successfully!');
      setNews(prev => prev.filter(n => n._id !== newsId));
      setTimeout(() => setActionMsg(''), 3000);
    } catch (err) {
      console.error('Error deleting news:', err);
      setActionMsg('Error: ' + (err.message || 'Failed to delete news'));
      setTimeout(() => setActionMsg(''), 3000);
    } finally {
      setIsActioning(false);
    }
  }

  function handleLogout() {
    sessionStorage.removeItem('admin_token')
    navigate('/admin-login')
  }

  const categoryTitle = activeTab === 'offer' ? 'Special Offers' : 'Company Updates';

  return (
    <div className="feedback-page container" style={{ paddingTop: 20, paddingBottom: 40 }}>
      <div className="page-head centered">
        <h1 className="page-title">Manage Latest News</h1>
        <p className="page-sub">Add, edit, and delete news for your travel agency</p>
      </div>

      {/* Navigation Buttons */}
      <div style={{ textAlign: 'right', marginBottom: 20, display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
        <button
          className="btn-link"
          onClick={() => navigate('/admin-dashboard')}
          style={{ padding: '8px 16px', fontSize: '14px', cursor: 'pointer', color: '#1976d2', border: '1px solid #1976d2', borderRadius: '4px' }}
        >
          ← Back to Dashboard
        </button>
        <button
          className="btn-link"
          onClick={handleLogout}
          style={{ color: '#d32f2f', cursor: 'pointer', padding: '8px 16px', fontSize: '14px', border: '1px solid #d32f2f', borderRadius: '4px' }}
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
          onClick={() => setActiveTab('offer')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'offer' ? '#1976d2' : 'transparent',
            color: activeTab === 'offer' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'offer' ? 'bold' : 'normal',
            fontSize: '14px'
          }}
        >
          Special Offers ({news.filter(n => n.category === 'offer').length})
        </button>
        <button
          onClick={() => setActiveTab('update')}
          style={{
            padding: '10px 20px',
            backgroundColor: activeTab === 'update' ? '#1976d2' : 'transparent',
            color: activeTab === 'update' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer',
            fontWeight: activeTab === 'update' ? 'bold' : 'normal',
            fontSize: '14px'
          }}
        >
          Company Updates ({news.filter(n => n.category === 'update').length})
        </button>
      </div>

      {/* Add News Button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add New ' + (activeTab === 'offer' ? 'Offer' : 'Update')}
        </button>
      </div>

      {/* Add News Form */}
      {showForm && (
        <div style={{
          backgroundColor: '#1e1e1e',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #333'
        }}>
          <h3 style={{ color: '#ffffff', marginBottom: '20px' }}>
            {activeTab === 'offer' ? 'Add New Special Offer' : 'Add New Company Update'}
          </h3>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff' }}>
              Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder={activeTab === 'offer' ? 'e.g., Summer Discount' : 'e.g., New Route Launched'}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '14px',
                boxSizing: 'border-box',
                backgroundColor: '#2d2d2d',
                color: '#ffffff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff' }}>
              Description/Content *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={activeTab === 'offer' ? 'Describe the special offer...' : 'Describe the company update...'}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '14px',
                minHeight: '100px',
                fontFamily: 'Arial, sans-serif',
                boxSizing: 'border-box',
                resize: 'vertical',
                backgroundColor: '#2d2d2d',
                color: '#ffffff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#ffffff' }}>
              Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              style={{
                padding: '8px',
                border: '1px solid #444',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: '#2d2d2d',
                color: '#ffffff'
              }}
            />
            {formData.imagePreview && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData.imagePreview} 
                  alt="preview" 
                  style={{ maxWidth: '300px', maxHeight: '200px', borderRadius: '4px' }}
                />
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleAddNews}
              disabled={isActioning}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: isActioning ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: 'bold',
                opacity: isActioning ? 0.6 : 1
              }}
            >
              {isActioning ? 'Adding...' : 'Add ' + (activeTab === 'offer' ? 'Offer' : 'Update')}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setFormData({ title: '', content: '', category: 'offer', image: null, imagePreview: null });
              }}
              disabled={isActioning}
              style={{
                padding: '10px 20px',
                backgroundColor: '#9e9e9e',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* News List */}
      <div className="fb-grid">
        <main className="fb-right" style={{ marginLeft: 0 }}>
          <section className="feedback-list">
            {loading ? (
              <div className="empty">Loading {categoryTitle.toLowerCase()}...</div>
            ) : news.length === 0 ? (
              <div className="empty">No {categoryTitle.toLowerCase()} yet. Click above to add one!</div>
            ) : (
              news.map(item => (
                <article key={item._id} className="feedback-card" style={{ position: 'relative' }}>
                  {item.image && (
                    <div style={{
                      width: '120px',
                      height: '120px',
                      overflow: 'hidden',
                      borderRadius: '8px',
                      marginRight: '15px',
                      flexShrink: 0
                    }}>
                      <img 
                        src={item.image} 
                        alt={item.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                  )}
                  
                  <div className="card-body" style={{ flex: 1 }}>
                    <div className="card-header">
                      <div className="card-name">{item.title}</div>
                      <div className="card-meta">
                        <span className="card-date">{formatDate(item.date)}</span>
                      </div>
                    </div>

                    <div className="card-message">{item.content}</div>

                    <div style={{ marginTop: 15, display: 'flex', gap: 10 }}>
                      <button
                        className="btn-link"
                        onClick={() => handleDeleteNews(item._id)}
                        disabled={isActioning}
                        style={{ 
                          padding: '8px 12px', 
                          fontSize: '14px',
                          color: '#d32f2f',
                          border: '1px solid #d32f2f',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          backgroundColor: 'transparent'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </article>
              ))
            )}
          </section>
        </main>
      </div>

      {actionMsg && (
        <div style={{ 
          position: 'fixed', 
          bottom: 20, 
          right: 20, 
          backgroundColor: actionMsg.includes('Error') ? '#d32f2f' : '#4caf50', 
          color: 'white', 
          padding: '12px 20px', 
          borderRadius: '4px',
          zIndex: 1000
        }}>
          {actionMsg}
        </div>
      )}
    </div>
  );
}
