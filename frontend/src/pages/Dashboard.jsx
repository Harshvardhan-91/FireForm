import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Dashboard() {
  const navigate = useNavigate()
  const [templateCount, setTemplateCount] = useState(null)

  useEffect(() => {
    api.getTemplates()
      .then((t) => setTemplateCount(t.length))
      .catch(() => setTemplateCount(0))
  }, [])

  return (
    <div>
      {/* ── Hero ── */}
      <div className="hero-v2">
        <div className="hero-dots" aria-hidden="true" />
        <div className="hero-v2-content">
          <div className="hero-v2-eyebrow">
            <span className="eyebrow-dot" />
            For first responders &amp; government agencies
          </div>
          <h1 className="hero-v2-title">
            Report Once,<br />
            <span className="hero-title-accent">File Everywhere.</span>
          </h1>
          <p className="hero-v2-sub">
            Describe an incident once in plain English.
            Mistral AI extracts the data and fills your PDF forms — offline, private, instant.
          </p>
          <div className="hero-v2-actions">
            <button className="btn btn-primary btn-lg" onClick={() => navigate('/templates/create')}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              New Template
            </button>
            <button className="btn btn-outline-white btn-lg" onClick={() => navigate('/fill')}>
              Fill a Form
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="hero-v2-right" aria-hidden="true">
          <div className="hero-terminal">
            <div className="ht-bar">
              <span className="ht-dot ht-red"/><span className="ht-dot ht-yellow"/><span className="ht-dot ht-green"/>
              <span className="ht-title">incident_report.txt</span>
            </div>
            <div className="ht-body">
              <div className="ht-line"><span className="ht-dim">›</span> Officer Smith responded at 14:32…</div>
              <div className="ht-line"><span className="ht-dim">›</span> Location: Building C, Floor 2</div>
              <div className="ht-line ht-blank"/>
              <div className="ht-line"><span className="ht-orange">✦</span> Extracting fields via Mistral…</div>
              <div className="ht-line ht-green-text">
                <span className="ht-check">✓</span> officer_name  → "Smith"
              </div>
              <div className="ht-line ht-green-text">
                <span className="ht-check">✓</span> location      → "Building C"
              </div>
              <div className="ht-line ht-green-text">
                <span className="ht-check">✓</span> time          → "14:32"
              </div>
              <div className="ht-line ht-blank"/>
              <div className="ht-line"><span className="ht-orange">↓</span> PDF written → <span className="ht-path">outputs/form_filled.pdf</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="stat-strip">
        <div className="stat-item">
          <div className="stat-num">{templateCount !== null ? templateCount : '—'}</div>
          <div className="stat-meta">
            <div className="stat-label">Templates</div>
            <div className="stat-sub">PDF forms registered</div>
          </div>
        </div>
        <div className="stat-divider"/>
        <div className="stat-item">
          <div className="stat-num">Mistral</div>
          <div className="stat-meta">
            <div className="stat-label">AI Model</div>
            <div className="stat-sub">via Ollama · local</div>
          </div>
        </div>
        <div className="stat-divider"/>
        <div className="stat-item">
          <div className="stat-num stat-num--green">●</div>
          <div className="stat-meta">
            <div className="stat-label">System</div>
            <div className="stat-sub">Online · operational</div>
          </div>
        </div>
        <div className="stat-divider"/>
        <div className="stat-item">
          <div className="stat-num">0ms</div>
          <div className="stat-meta">
            <div className="stat-label">Latency</div>
            <div className="stat-sub">No external API</div>
          </div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="section-header">
        <h2 className="section-title">Quick Actions</h2>
        <p className="section-sub">Jump straight into the workflow</p>
      </div>
      <div className="action-grid-v2">
        <button className="action-tile" onClick={() => navigate('/templates/create')}>
          <div className="action-tile-num">01</div>
          <div className="action-tile-label">Upload a Template</div>
          <div className="action-tile-desc">Register a PDF form and define the fields the AI should fill in.</div>
          <div className="action-tile-footer">
            <span className="action-tile-tag">Templates</span>
            <span className="action-tile-arrow">→</span>
          </div>
        </button>

        <button className="action-tile" onClick={() => navigate('/fill')}>
          <div className="action-tile-num">02</div>
          <div className="action-tile-label">Fill a Form with AI</div>
          <div className="action-tile-desc">Write an incident in plain English. Mistral extracts every field instantly.</div>
          <div className="action-tile-footer">
            <span className="action-tile-tag">AI Fill</span>
            <span className="action-tile-arrow">→</span>
          </div>
        </button>

        <button className="action-tile" onClick={() => navigate('/templates')}>
          <div className="action-tile-num">03</div>
          <div className="action-tile-label">Browse Templates</div>
          <div className="action-tile-desc">View, preview, or delete your registered form templates.</div>
          <div className="action-tile-footer">
            <span className="action-tile-tag">Manage</span>
            <span className="action-tile-arrow">→</span>
          </div>
        </button>
      </div>

      {/* ── How it works ── */}
      <div className="section-header" style={{ marginTop: 8 }}>
        <h2 className="section-title">How It Works</h2>
        <p className="section-sub">Three steps from raw text to government PDF</p>
      </div>
      <div className="workflow-steps">
        <div className="workflow-step">
          <div className="ws-num">01</div>
          <div className="ws-content">
            <div className="ws-title">Upload Template</div>
            <div className="ws-desc">Register a PDF form and define its field schema as a JSON object.</div>
          </div>
        </div>
        <div className="ws-connector"><div className="ws-line"/></div>
        <div className="workflow-step">
          <div className="ws-num">02</div>
          <div className="ws-content">
            <div className="ws-title">Write Your Report</div>
            <div className="ws-desc">Plain language only — no special format. Just describe what happened.</div>
          </div>
        </div>
        <div className="ws-connector"><div className="ws-line"/></div>
        <div className="workflow-step">
          <div className="ws-num">03</div>
          <div className="ws-content">
            <div className="ws-title">Download Filled PDF</div>
            <div className="ws-desc">AI extracts every field and writes them into your PDF. Ready to submit.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
