import { read, write } from './db'

export async function getStudents() {
  return read('students')
}

// كل التخصصات المعروفة (من المواعيد والطلاب المحفوظين)
export async function getKnownMajors() {
  const fromSlots = read('slots').flatMap((s) => s.majors)
  const fromStudents = read('students').map((s) => s.major)
  return [...new Set([...fromSlots, ...fromStudents])]
}

// ربط كل طالب بالمواد بتاعته له 
function rebuildEnrollments() {
  const students = read('students')
  const courses = read('courses')
  const slots = read('slots')
  const manual = read('enrollments').filter((e) => e.source === 'manual')
  const auto = []
  courses.forEach((c) => {
    const courseSlots = slots.filter((s) => s.courseId === c.id)
    students.forEach((st) => {
      const match = courseSlots.some(
        (s) => s.year === st.year && (s.majors.length === 0 || s.majors.includes(st.major)),
      )
      if (match) auto.push({ id: `${c.id}|${st.id}`, courseId: c.id, studentId: st.id, source: 'auto' })
    })
  })
  write('enrollments', [...manual, ...auto])
}

//بيستبدل مواد ومواعيد الترم ده بالجدد
export async function saveSchedule(termId, rows) {
  const courseIds = new Map()
  const courses = []
  rows.forEach((r) => {
    if (!courseIds.has(r.name)) {
      const id = `${termId}:${courseIds.size + 1}`
      courseIds.set(r.name, id)
      courses.push({ id, termId, name: r.name, code: r.code })
    }
  })
  const slots = rows.map((r, i) => ({
    id: `${termId}:slot${i + 1}`, courseId: courseIds.get(r.name),
    type: r.type, year: r.year, majors: r.majors, day: r.day, from: r.from, to: r.to, room: r.room,
  }))
  write('courses', [...read('courses').filter((c) => c.termId !== termId), ...courses])
  write('slots', [...read('slots').filter((s) => !s.courseId.startsWith(termId + ':')), ...slots])
  rebuildEnrollments()
}

// الطالب الموجود بيتحدث و الطالب الجديد بيتضاف
export async function saveStudents(rows) {
  const byCode = new Map(read('students').map((s) => [s.universityCode, s]))
  rows.forEach((r) => {
    const old = byCode.get(r.universityCode)
    byCode.set(r.universityCode, { ...old, ...r, id: old?.id ?? 's_' + r.universityCode })
  })
  write('students', [...byCode.values()])
  rebuildEnrollments()
}