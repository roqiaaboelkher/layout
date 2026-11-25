import { useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import FileDrop from '../../Components/FileDrop'
import ImportReport from '../../Components/ImportReport'
import { useTerms } from '../../Context/useTerms'
import { defaultTerm, termDates } from '../../Utils/terms'
import { downloadTemplate } from '../../Utils/excel'
import { SCHEDULE_HEADERS, SCHEDULE_SAMPLE, parseSchedule } from '../../Utils/importers'
import { getKnownMajors, saveSchedule } from '../../Services/setupService'

export default function StepSchedule({ onBack, onNext }) {
  const { currentTerm, addTerm, updateTerm } = useTerms()
  const base = currentTerm ?? defaultTerm()
  const [year, setYear] = useState(base.year)
  const [semester, setSemester] = useState(base.semester)
  const [startDate, setStartDate] = useState(base.startDate)
  const [endDate, setEndDate] = useState(base.endDate)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [saving, setSaving] = useState(false)

  // اقتراح تواريخ تانية
  function changeTerm(nextYear, nextSemester) {
    setYear(nextYear)
    setSemester(nextSemester)
    const d = termDates(nextYear, nextSemester)
    setStartDate(d.startDate)
    setEndDate(d.endDate)
  }

  async function check(f) {
    setFile(f)
    setResult(null)
    setResult(await parseSchedule(f, await getKnownMajors()))
  }

  const termOk = year >= 2000 && startDate && endDate && startDate < endDate
  const canNext = termOk && result && result.errors.length === 0 && !saving

  async function handleNext() {
    setSaving(true)
    try {
      const term = { year, semester, startDate, endDate }
      let termId = currentTerm?.id
      if (termId) updateTerm(termId, term)
      else termId = addTerm(term)
      await saveSchedule(termId, result.slots)
      onNext()
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <PageTitle title="ارفع جدولك" subtitle="الخطوة 2 من 3: الجدول بتاعك بالمواد والمواعيد والفرقة والتخصص" />

      <div className="fw-bold mb-2">الترم</div>
      <div className="row g-3 mb-3">
        <div className="col-6 col-md-3">
          <label className="form-label">السنة</label>
          <input type="number" className="form-control" value={year}
            onChange={(e) => changeTerm(Number(e.target.value), semester)} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">الفصل</label>
          <select className="form-select" value={semester} onChange={(e) => changeTerm(year, e.target.value)}>
            <option value="first">الأول</option>
            <option value="second">الثاني</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">بداية الترم</label>
          <input type="date" className="form-control" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div className="col-6 col-md-3">
          <label className="form-label">نهاية الترم</label>
          <input type="date" className="form-control" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
      </div>

      <FileDrop
        title="اسحب ملف الجدول (Excel) هنا أو اختار ملف"
        hint={'الأعمدة: ' + SCHEDULE_HEADERS.join(' · ')}
        onFile={check}
        onTemplate={() => downloadTemplate('جدولي.xlsx', SCHEDULE_HEADERS, SCHEDULE_SAMPLE)}
      />

      <ImportReport
        fileName={file?.name}
        errors={result?.errors}
        warnings={result?.warnings}
        summary={result && (
          <div className="alert alert-success mt-2 mb-0">
            الملف سليم: {result.slots.length} مواعيد · {result.courses.length} مواد
          </div>
        )}
      />

      <div className="d-flex flex-wrap gap-2 justify-content-between mt-4">
        <button type="button" className="btn-navy" disabled={!canNext} onClick={handleNext}>
          التالي <i className="bi bi-chevron-left" />
        </button>
        <div className="d-flex gap-2">
          <button type="button" className="btn-outline-navy" disabled={!file} onClick={() => check(file)}>
            تحقق من الملف
          </button>
          <button type="button" className="btn-outline-navy" onClick={onBack}>رجوع</button>
        </div>
      </div>
    </>
  )
}