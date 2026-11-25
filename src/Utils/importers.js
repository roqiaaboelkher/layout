import { readSheet, asText, asTime } from './excel'

export const SCHEDULE_HEADERS = ['المادة', 'كود المادة', 'النوع', 'الفرقة', 'التخصص', 'اليوم', 'من', 'إلى', 'القاعة']
export const SCHEDULE_SAMPLE = [['الرياضيات المتقطعة', 'MA301', 'محاضرة', 3, 'حاسب، رياضيات', 'الإثنين', '10:00', '12:00', 'مدرج A']]
export const STUDENT_HEADERS = ['الاسم', 'الكود الجامعي', 'الفرقة', 'التخصص', 'الإيميل']
export const STUDENT_SAMPLE = [['أحمد سامي', 'CS2026001', 3, 'حاسب', 'ahmed@univ.edu']]

const TYPES = { 'محاضرة': 'lecture', 'سكشن': 'section', 'معمل': 'lab' }
const DAYS = {
  'السبت': 'sat', 'الأحد': 'sun', 'الاحد': 'sun', 'الإثنين': 'mon', 'الاثنين': 'mon',
  'الثلاثاء': 'tue', 'الأربعاء': 'wed', 'الاربعاء': 'wed', 'الخميس': 'thu',
}


const splitMajors = (text) =>
  text.split(/\s*[،,/]\s*|\s+و\s*(?=\S)/).map((m) => m.trim()).filter(Boolean)

const blank = (cells) => cells.every((v) => !asText(v))

function sheetProblem(rows, firstHeader) {
  if (!rows) return 'مقدرتش أقرا الملف. اتأكدي إنه Excel بصيغة xlsx.'
  if (!rows.length || asText(rows[0].cells[0]) !== firstHeader) {
    return 'الملف مش على شكل القالب. حمّلي القالب واملي نفس الأعمدة.'
  }
  return null
}

export async function parseSchedule(file, knownMajors = []) {
  const rows = await readSheet(file)
  const problem = sheetProblem(rows, SCHEDULE_HEADERS[0])
  if (problem) return { slots: [], courses: [], errors: [problem], warnings: [] }

  const errors = []
  const slots = []
  rows.slice(1).forEach(({ line, cells }) => {
    if (blank(cells)) return
    const c = (i) => asText(cells[i])
    const slot = {
      name: c(0), code: c(1), type: TYPES[c(2)], year: Number(c(3)), majors: splitMajors(c(4)),
      day: DAYS[c(5)], from: asTime(cells[6]), to: asTime(cells[7]), room: c(8),
    }
    const bad = (msg) => errors.push(`صف ${line}: ${msg}`)
    if (!slot.name) bad('اسم المادة ناقص')
    if (!slot.type) bad('النوع لازم يكون محاضرة أو سكشن أو معمل')
    if (!Number.isInteger(slot.year) || slot.year < 1 || slot.year > 4) bad('الفرقة لازم تكون رقم من 1 لـ 4')
    if (!slot.day) bad('اليوم مش مفهوم (من السبت للخميس)')
    if (!slot.from || !slot.to || slot.from >= slot.to) bad('الوقت غلط: "من" لازم يكون قبل "إلى"')
    if (!slot.room) bad('القاعة ناقصة')
    slots.push(slot)
  })
  if (slots.length === 0 && errors.length === 0) errors.push('الملف مفيهوش مواعيد.')

  const courses = [...new Set(slots.map((s) => s.name))]
  const newMajors = [...new Set(slots.flatMap((s) => s.majors))].filter((m) => !knownMajors.includes(m))
  const warnings = newMajors.length
    ? [`هيتضاف تخصصات جديدة: ${newMajors.join('، ')}. راجعي الأسماء لو فيها غلطة إملائية.`]
    : []
  return { slots, courses, errors, warnings }
}

export async function parseStudents(file, existing = [], knownMajors = []) {
  const rows = await readSheet(file)
  const problem = sheetProblem(rows, STUDENT_HEADERS[0])
  if (problem) return { students: [], errors: [problem], warnings: [], toAdd: 0, toUpdate: 0, toSkip: 0 }

  const byCode = new Map(existing.map((s) => [s.universityCode, s]))
  const seen = new Set()
  const errors = []
  const students = []
  rows.slice(1).forEach(({ line, cells }) => {
    if (blank(cells)) return
    const c = (i) => asText(cells[i])
    const s = { name: c(0), universityCode: c(1).toUpperCase(), year: Number(c(2)), major: c(3), email: c(4) }
    const bad = (msg) => errors.push(`صف ${line}: ${msg}`)
    if (!s.name) bad('الاسم ناقص')
    if (!s.universityCode) bad('الكود الجامعي ناقص')
    else if (seen.has(s.universityCode)) bad(`الكود الجامعي مكرر في الملف (${s.universityCode})`)
    seen.add(s.universityCode)
    if (!Number.isInteger(s.year) || s.year < 1 || s.year > 4) bad('الفرقة لازم تكون رقم من 1 لـ 4')
    if (!s.major) bad('التخصص ناقص')
    students.push(s)
  })
  if (students.length === 0 && errors.length === 0) errors.push('الملف مفيهوش طلاب.')

  let toAdd = 0
  let toUpdate = 0
  let toSkip = 0
  students.forEach((s) => {
    const old = byCode.get(s.universityCode)
    if (!old) toAdd++
    else if (old.name === s.name && old.year === s.year && old.major === s.major && (!s.email || old.email === s.email)) toSkip++
    else toUpdate++
  })

  const newMajors = [...new Set(students.map((s) => s.major))].filter((m) => m && !knownMajors.includes(m))
  const warnings = newMajors.length ? [`تخصص جديد هيتضاف: ${newMajors.join('، ')}. تأكدي إنه مكتوب صح.`] : []
  return { students, errors, warnings, toAdd, toUpdate, toSkip }
}