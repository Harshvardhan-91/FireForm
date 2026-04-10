import { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { api } from '../api'
import { useToast } from '../components/Toast'

export default function FillForm() {
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const [templates, setTemplates] = useState([])
  const [selectedId, setSelectedId] = useState(
    location.state?.templateId?.toString() || ''
  )
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingTemplates, setLoadingTemplates] = useState(true)

  useEffect(() => {
    api
      .getTemplates()
      .then((data) => {
        setTemplates(data)
        if (!selectedId && data.length > 0) {
          setSelectedId(data[0].id.toString())
        }
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoadingTemplates(false))
  }, [])

  const selected = templates.find((t) => t.id === Number(selectedId))

  async function handleSubmit(e) {
    e.preventDefault()

    if (!selectedId || !inputText.trim()) {
      toast.error('Select a template and provide an incident description')
      return
    }

    setLoading(true)
    try {
      const result = await api.fillForm(Number(selectedId), inputText.trim())
      toast.success(`Form filled successfully (submission #${result.id})`)
      navigate('/results', { state: { result, template: selected } })
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="page-title">Fill Form</h1>
      <p className="page-desc">
        Select a template and describe the incident. AI will extract the fields
        automatically.
      </p>

      <div className="card" style={{ maxWidth: 720 }}>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Template</label>

            {loadingTemplates ? (
              <div
                className="flex items-center gap-2"
                style={{ padding: '10px 0' }}
              >
                <span
                  className="spinner"
                  style={{ color: 'var(--ff-orange)' }}
                />
                <span className="text-sm text-muted">
                  Loading templates...
                </span>
              </div>
            ) : templates.length === 0 ? (
              <div
                className="template-info"
                style={{
                  background: 'var(--c-error-bg)',
                  borderColor: '#fecaca',
                }}
              >
                <div
                  className="template-info-title"
                  style={{ color: 'var(--c-error)' }}
                >
                  No templates available
                </div>
                <p
                  className="text-sm"
                  style={{ color: 'var(--c-500)', marginTop: 4 }}
                >
                  You need to{' '}
                  <button
                    type="button"
                    style={{
                      color: 'var(--ff-orange)',
                      fontWeight: 600,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      font: 'inherit',
                      padding: 0,
                    }}
                    onClick={() => navigate('/templates/create')}
                  >
                    create a template
                  </button>{' '}
                  first before filling forms.
                </p>
              </div>
            ) : (
              <select
                className="form-input"
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
              >
                <option value="">— Select a template —</option>
                {templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (#{t.id})
                  </option>
                ))}
              </select>
            )}
          </div>

          {selected && (
            <div className="template-info">
              <div className="template-info-title">
                {selected.name} — {Object.keys(selected.fields || {}).length}{' '}
                fields to extract
              </div>
              <div className="template-info-fields">
                {Object.keys(selected.fields || {}).map((key) => (
                  <span key={key} className="field-tag">
                    {key}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Incident Description</label>
            <textarea
              className="form-input"
              rows="8"
              placeholder="Describe the incident in natural language. For example: On March 15, 2026, John Smith from the Engineering department reported a safety violation in Building C. His supervisor, Jane Doe, was notified immediately..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              required
            />
            <div className="form-hint">
              Write a detailed description. The AI will extract the relevant
              field values automatically.
            </div>
          </div>

          <button
            className="btn btn-primary"
            type="submit"
            disabled={loading || !selectedId}
            style={{ minWidth: 200 }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Processing with AI...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Fill Form with AI
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
