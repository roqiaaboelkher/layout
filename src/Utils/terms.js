export const semesterLabel={
    first:' الأول' , second:' الثاني'
}

export const termLabel = (t) => `الفصل ${semesterLabel[t.semester]} من العام الدراسي ${t.year}`

export function defaultTerm( date = new Date()) {
    const year = date.getFullYear()
    const month = date.getMonth() 
  if (month >= 8) 
    return { 
  year: year, semester: 'first', startDate: `${year}-09-20`, endDate: `${year + 1}-01-20` 
}
  if (month === 0) return { year: year - 1, semester: 'first', startDate: `${year - 1}-09-20`, endDate: `${year}-01-20` }
  return { year: year - 1, semester: 'second', startDate: `${year}-02-07`, endDate: `${year}-06-20` }
}

// تواريخ للترم حسب السنة والفصل
export function termDates(year, semester) {
  return semester === 'first'
    ? { startDate: `${year}-09-20`, endDate: `${year + 1}-01-20` }
    : { startDate: `${year + 1}-02-07`, endDate: `${year + 1}-06-20` }
}