import { useLocation, useNavigate } from 'react-router-dom'
import { api } from '../api'

export default function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const { result, template } = location.state || {}

  if (!result) {
    return (
      <div>
        <h1 className="page-title">Results</h1>
        <div className="card empty-state">
          <svg
            className="empty-icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="8" y1="12" x2="16" y2="12" />
          </svg>
          <div className="empty-title">No results to display</div>
          <div className="empty-desc">
            Fill a form first to see the AI extraction results here.
          </div>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/fill')}
          >
            Go to Fill Form
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div
        className="flex justify-between items-center"
        style={{ marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}
      >
        <div>
          <h1 className="page-title">Form Results</h1>
          <p style={{ color: 'var(--c-500)', fontSize: '0.95rem' }}>
            AI has processed your input and filled the PDF form.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/fill')}
          >
            Fill Another
          </button>
          <a
            className="btn btn-primary"
            href={api.previewUrl(result.output_pdf_path)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Download PDF
          </a>
        </div>
      </div>

      {/* Submission Details */}
      <div className="result-card" style={{ marginBottom: '20px' }}>
        <div className="result-header">
          <span className="result-badge success">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Completed
          </span>
          <span className="text-sm text-muted">
            Submission #{result.id}
          </span>
        </div>

        <div className="result-field">
          <span className="result-key">Template</span>
          <span className="result-value">
            {template?.name || `Template #${result.template_id}`}
          </span>
        </div>
        <div className="result-field">
          <span className="result-key">Submission ID</span>
          <span className="result-value">#{result.id}</span>
        </div>
        <div className="result-field">
          <span className="result-key">Template ID</span>
          <span className="result-value">#{result.template_id}</span>
        </div>
        <div className="result-field">
          <span className="result-key">Output PDF</span>
          <span
            className="result-value"
            style={{ fontSize: '0.85rem', color: 'var(--c-500)' }}
          >
            {result.output_pdf_path}
          </span>
        </div>
      </div>

      {/* Input text that was submitted */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ marginBottom: '12px' }}>Input Text</h3>
        <div
          className="json-block"
          style={{ whiteSpace: 'pre-wrap', maxHeight: '240px' }}
        >
          {result.input_text}
        </div>
      </div>

      {/* PDF Preview */}
      <div className="card">
        <div
          className="flex justify-between items-center"
          style={{ marginBottom: '14px' }}
        >
          <h3>PDF Preview</h3>
          <a
            className="btn btn-ghost btn-sm"
            href={api.previewUrl(result.output_pdf_path)}
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: 'none' }}
          >
            Open in new tab
          </a>
        </div>
        <iframe
          className="pdf-frame"
          src={api.previewUrl(result.output_pdf_path)}
          title="Filled PDF Preview"
        />
      </div>
    </div>
  )
}
