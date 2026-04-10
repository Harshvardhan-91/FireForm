import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'

export default function Templates() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => { loadTemplates() }, [])

  async function loadTemplates() {
    try {
      setLoading(true)
      const data = await api.getTemplates()
      setTemplates(data)
    } catch (err) {
      toast.error('Failed to load templates: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this template?')) return
    try {
      await api.deleteTemplate(id)
      toast.success('Template deleted')
      loadTemplates()
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <div>
      {/* Page header */}
      <div className="page-top-bar">
        <div>
          <h1 className="page-title">Templates</h1>
          <p className="page-desc">Your registered PDF form templates</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/templates/create')}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Template
        </button>
      </div>

      {/* Count bar */}
      {!loading && templates.length > 0 && (
        <div className="templates-meta-bar">
          <span className="templates-count-badge">{templates.length}</span>
          <span style={{ color: 'var(--c-500)', fontSize: '0.9rem' }}>
            {templates.length === 1 ? 'template registered' : 'templates registered'}
          </span>
        </div>
      )}

      {loading ? (
        <div className="loading-block">
          <div className="spinner" style={{ width: 32, height: 32, color: 'var(--ff-orange)' }} />
          <span style={{ color: 'var(--c-500)', fontSize: '0.9rem' }}>Loading templates…</span>
        </div>
      ) : templates.length === 0 ? (
        <div className="empty-state-card">
          <div className="empty-state-icon-wrap">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="9" y1="13" x2="15" y2="13" />
              <line x1="9" y1="17" x2="13" y2="17" />
            </svg>
          </div>
          <div className="empty-state-title">No templates yet</div>
          <div className="empty-state-desc">
            Upload your first PDF form template to start using AI-powered form filling.
          </div>
          <button className="btn btn-primary" onClick={() => navigate('/templates/create')}>
            Create your first template
          </button>
        </div>
      ) : (
        <div className="template-cards-grid">
          {templates.map((t, idx) => {
            const fieldKeys = Object.keys(t.fields || {})
            const colors = ['#f97316', '#6366f1', '#10b981', '#3b82f6', '#ec4899', '#f59e0b']
            const accent = colors[idx % colors.length]
            return (
              <div className="tcard" key={t.id} style={{ '--tcard-accent': accent }}>
                <div className="tcard-accent-bar" />
                <div className="tcard-body">
                  <div className="tcard-header">
                    <span className="tcard-id">#{t.id}</span>
                    <span className="tcard-field-count">{fieldKeys.length} fields</span>
                  </div>
                  <div className="tcard-name">{t.name}</div>
                  <div className="tcard-path" title={t.pdf_path}>{t.pdf_path}</div>
                  <div className="tcard-fields">
                    {fieldKeys.slice(0, 4).map((k) => (
                      <span className="tcard-chip" key={k}>{k}</span>
                    ))}
                    {fieldKeys.length > 4 && (
                      <span className="tcard-chip tcard-chip--more">+{fieldKeys.length - 4} more</span>
                    )}
                  </div>
                </div>
                <div className="tcard-footer">
                  <button
                    className="tcard-btn"
                    onClick={() => window.open(api.previewUrl(t.pdf_path), '_blank')}
                    title="Preview PDF"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    Preview
                  </button>
                  <button
                    className="tcard-btn tcard-btn--fill"
                    onClick={() => navigate('/fill', { state: { templateId: t.id } })}
                    title="Fill this form"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    Fill Form
                  </button>
                  <button
                    className="tcard-btn tcard-btn--delete"
                    onClick={() => handleDelete(t.id)}
                    title="Delete template"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
          {/* Ghost "add" card */}
          <button className="tcard tcard--add" onClick={() => navigate('/templates/create')}>
            <div className="tcard-add-inner">
              <div className="tcard-add-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
              <div className="tcard-add-label">Add Template</div>
            </div>
          </button>
        </div>
      )}
    </div>
  )
}
