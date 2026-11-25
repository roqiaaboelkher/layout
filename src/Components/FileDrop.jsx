import { useRef, useState } from 'react'

export default function FileDrop({ title, hint, onFile, onTemplate }) {
  const input = useRef(null)
  const [over, setOver] = useState(false)

  return (
    <div
      className={'file-drop' + (over ? ' over' : '')}
      onDragOver={(e) => { e.preventDefault(); setOver(true) }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setOver(false)
        if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0])
      }}
    >
      <i className="bi bi-cloud-arrow-up file-drop-icon" />
      <div className="fw-bold mb-2">{title}</div>
      <button type="button" className="btn-navy" onClick={() => input.current.click()}>
        <i className="bi bi-folder2-open ms-1" /> اختيار ملف
      </button>
      {hint && <div className="form-text mt-2">{hint}</div>}
      <input
        ref={input}
        type="file"
        accept=".xlsx"
        hidden
        onChange={(e) => {
          if (e.target.files[0]) onFile(e.target.files[0])
          e.target.value = '' //اختيار نفس الملف تاني
        }}
      />
      {onTemplate && (
        <div>
          <button type="button" className="btn btn-link" onClick={onTemplate}>
            <i className="bi bi-download ms-1" /> تحميل القالب
          </button>
        </div>
      )}
    </div>
  )
}