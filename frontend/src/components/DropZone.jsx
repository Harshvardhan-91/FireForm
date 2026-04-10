import { useState, useRef } from 'react'

export default function DropZone({ onFile, file }) {
  const [dragover, setDragover] = useState(false)
  const inputRef = useRef()

  function handleDrag(e) {
    e.preventDefault()
    e.stopPropagation()
  }

  function handleDragIn(e) {
    handleDrag(e)
    setDragover(true)
  }

  function handleDragOut(e) {
    handleDrag(e)
    setDragover(false)
  }

  function handleDrop(e) {
    handleDrag(e)
    setDragover(false)
    const f = e.dataTransfer?.files?.[0]
    if (f && f.name.toLowerCase().endsWith('.pdf')) {
      onFile(f)
    }
  }

  function handleChange(e) {
    const f = e.target.files?.[0]
    if (f) onFile(f)
  }

  const cls = `dropzone ${dragover ? 'dragover' : ''} ${file ? 'has-file' : ''}`

  return (
    <div
      className={cls}
      onClick={() => inputRef.current?.click()}
      onDragEnter={handleDragIn}
      onDragOver={handleDragIn}
      onDragLeave={handleDragOut}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleChange}
        style={{ display: 'none' }}
      />
      <svg
        className="dropzone-icon"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {file ? (
          <>
            <path d="M9 12l2 2 4-4" />
            <circle cx="12" cy="12" r="10" />
          </>
        ) : (
          <>
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </>
        )}
      </svg>
      <div className="dropzone-text">
        {file ? file.name : 'Drop your PDF template here'}
      </div>
      <div className="dropzone-sub">
        {file
          ? `${(file.size / 1024).toFixed(1)} KB — click to change`
          : 'or click to browse files'}
      </div>
    </div>
  )
}
