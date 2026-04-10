import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'
import DropZone from '../components/DropZone'

const DEFAULT_FIELDS = JSON.stringify(
  {
    "Employee's name": "string",
    "Employee's job title": "string",
    "Department supervisor": "string",
    "Phone number": "string",
    "Employee's email": "string",
    "Signature": "string",
    "Date": "string",
  },
  null,
  2
)

export default function CreateTemplate() {
  const navigate = useNavigate()
  const toast = useToast()

  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [directory, setDirectory] = useState('src/inputs')
  const [fields, setFields] = useState(DEFAULT_FIELDS)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!file) { toast.error('Please select a PDF file'); return }
    let parsedFields
    try { parsedFields = JSON.parse(fields) }
    catch { toast.error('Invalid JSON in fields — check your syntax'); return }

    setLoading(true)
    try {
      const upload = await api.uploadPdf(file, directory)
      const template = await api.createTemplate({ name, pdf_path: upload.pdf_path, fields: parsedFields })
      toast.success(`Template "${template.name}" created (ID: ${template.id})`)
      navigate('/templates')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-top-bar">
        <div>
          <h1 className="page-title">Create Template</h1>
          <p className="page-desc">Register a PDF form and define the fields the AI should extract.</p>
        </div>
      </div>

      <div className="create-layout">
        {/* ── Left: Form ── */}
        <div className="create-form-col">
          <form onSubmit={handleSubmit}>
            {/* Step 1 */}
            <div className="form-section">
              <div className="form-section-head">
                <span className="form-step-num">1</span>
                <div>
                  <div className="form-section-title">Upload PDF</div>
                  <div className="form-section-sub">Select the government form you want to register</div>
                </div>
              </div>
              <DropZone file={file} onFile={setFile} />
            </div>

            {/* Step 2 */}
            <div className="form-section">
              <div className="form-section-head">
                <span className="form-step-num">2</span>
                <div>
                  <div className="form-section-title">Name &amp; Location</div>
                  <div className="form-section-sub">Where should this template be stored?</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Template Name</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Incident Intake Form"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Storage Directory</label>
                <input
                  className="form-input"
                  type="text"
                  value={directory}
                  onChange={(e) => setDirectory(e.target.value)}
                  required
                />
                <div className="form-hint">Relative path within the project where the PDF will be saved.</div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="form-section">
              <div className="form-section-head">
                <span className="form-step-num">3</span>
                <div>
                  <div className="form-section-title">Field Schema</div>
                  <div className="form-section-sub">JSON object mapping field names to their types</div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Fields (JSON)</label>
                <textarea
                  className="form-input code-area"
                  rows="11"
                  value={fields}
                  onChange={(e) => setFields(e.target.value)}
                  spellCheck="false"
                  required
                />
                <div className="form-hint">
                  Keys = form field names exactly as they appear in the PDF. Values = expected data type.
                </div>
              </div>
            </div>

            <div className="form-submit-row">
              <button type="button" className="btn btn-secondary" onClick={() => navigate('/templates')}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={loading} style={{ minWidth: 180 }}>
                {loading ? (
                  <><span className="spinner" /> Creating template…</>
                ) : (
                  <>
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    Create Template
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* ── Right: Info panel ── */}
        <aside className="create-info-col">
          <div className="info-panel">
            <div className="info-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              About Field Schemas
            </div>
            <p className="info-panel-text">
              The field schema tells the AI which pieces of information to extract from your incident description.
            </p>
            <div className="info-panel-example">
              <div className="info-example-label">Example</div>
              <pre className="info-code">{`{
  "Officer name": "string",
  "Badge number": "string",
  "Incident date": "string",
  "Location": "string",
  "Injury type": "string"
}`}</pre>
            </div>
            <div className="info-tip">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Use exact field names that match the PDF form labels for best results.
            </div>
          </div>

          <div className="info-panel" style={{ marginTop: 16 }}>
            <div className="info-panel-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67z"/>
              </svg>
              AI Processing
            </div>
            <p className="info-panel-text">
              Mistral runs locally via Ollama — no data is sent to any external
              server. Your incident reports stay completely private.
            </p>
            <div className="info-tag-row">
              <span className="info-tag">Offline</span>
              <span className="info-tag">Private</span>
              <span className="info-tag">No API key needed</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
