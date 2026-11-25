
export default function ImportReport({ fileName, errors, warnings = [], summary }) {
  if (!fileName) return null
  if (!errors) return <div className="mt-3 text-muted">جاري فحص الملف...</div>

  const ok = errors.length === 0
  return (
    <div className="mt-3">
      <div className="file-row">
        <i className="bi bi-file-earmark-excel" />
        <span className="flex-grow-1">{fileName}</span>
        <i className={'bi ' + (ok ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger')} />
      </div>

      {ok && summary}

      {warnings.length > 0 && (
        <div className="alert alert-warning mt-2 mb-0">
          <strong>تنبيهات (مش بتمنع الاستيراد):</strong>
          <ul className="mb-0">{warnings.map((w, i) => <li key={i}>{w}</li>)}</ul>
        </div>
      )}

      {!ok && (
        <div className="alert alert-danger mt-2 mb-0">
          <strong>{errors.length} أخطاء لازم تتصلّح قبل الاستيراد:</strong>
          <ul className="mb-0">{errors.slice(0, 10).map((e, i) => <li key={i}>{e}</li>)}</ul>
          {errors.length > 10 && <div>و {errors.length - 10} أخطاء تانية</div>}
        </div>
      )}
    </div>
  )
}