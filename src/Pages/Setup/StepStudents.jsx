import { useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import FileDrop from '../../Components/FileDrop'
import ImportReport from '../../Components/ImportReport'
import StatBox from '../../Components/StatBox'
import { downloadTemplate } from '../../Utils/excel'
import { STUDENT_HEADERS, STUDENT_SAMPLE, parseStudents } from '../../Utils/importers'
import { getKnownMajors, getStudents, saveStudents } from '../../Services/setupService'

export default function StepStudents({ onBack, onDone }) {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  async function check(f) {
    setFile(f)
    setResult(null)
    setResult(await parseStudents(f, await getStudents(), await getKnownMajors()))
  }

  const canImport = result && result.errors.length === 0 && !saving

  async function handleImport() {
    setSaving(true)
    try {
      await saveStudents(result.students)
      onDone()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageTitle title="ارفع طلابك" subtitle="الخطوة 3 من 3: شيت الفورم اللي الطلاب ملوه" />

      <FileDrop
        title="اسحب شيت الطلاب (Excel) هنا أو اختار ملف"
        hint="الأعمدة: الاسم · الكود الجامعي · الفرقة · التخصص · الإيميل (اختياري)"
        onFile={check}
        onTemplate={() => downloadTemplate('طلابي.xlsx', STUDENT_HEADERS, STUDENT_SAMPLE)}
      />

      <ImportReport
        fileName={file?.name}
        errors={result?.errors}
        warnings={result?.warnings}
        summary={result && (
          <>
            <div className="row g-2 mt-2">
              <div className="col-4"><StatBox value={result.toAdd} label="هيتضاف" tone="present" /></div>
              <div className="col-4"><StatBox value={result.toUpdate} label="هيتحدّث" tone="info" /></div>
              <div className="col-4"><StatBox value={result.toSkip} label="هيتخطّى" tone="pending" /></div>
            </div>
            <div className="alert alert-info mt-2 mb-0">الطلاب بيتضافوا للمواد تلقائي حسب الفرقة والتخصص.</div>
          </>
        )}
      />

      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mt-4">
        <button type="button" className="btn-navy" disabled={!canImport} onClick={handleImport}>
          <i className="bi bi-check-lg ms-1" /> ابدأ استخدام البرنامج
        </button>
        <div className="d-flex gap-3 align-items-center">
          <button type="button" className="btn btn-link" onClick={onDone}>هرفعهم بعدين</button>
          <button type="button" className="btn-outline-navy" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </>
  )
}