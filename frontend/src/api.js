const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, options)

  if (!res.ok) {
    let message = `Request failed (${res.status})`
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      const body = await res.json().catch(() => ({}))
      if (Array.isArray(body.detail)) {
        message = body.detail.map((d) => d.msg).join(', ')
      } else {
        message = body.detail || body.error || message
      }
    }
    throw new Error(message)
  }

  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    return res.json()
  }
  return res
}

export const api = {
  /* ---- Templates ---- */
  getTemplates: () => request('/templates'),

  createTemplate: (data) =>
    request('/templates/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }),

  uploadPdf: (file, directory) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('directory', directory)
    return request('/templates/upload', { method: 'POST', body: fd })
  },

  deleteTemplate: (id) =>
    request(`/templates/${id}`, { method: 'DELETE' }),

  previewUrl: (path) =>
    `${API_BASE}/templates/preview?path=${encodeURIComponent(path)}`,

  /* ---- Forms ---- */
  fillForm: (templateId, inputText) =>
    request('/forms/fill', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: templateId, input_text: inputText }),
    }),

  downloadUrl: (id) => `${API_BASE}/forms/${id}/download`,
}
