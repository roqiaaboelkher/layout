import ExcelJS from 'exceljs'

const pad = (n) => String(n).padStart(2, '0')


export function asText(v) {
  if (v == null) return ''
  let s
  if (v instanceof Date) s = v.toISOString().slice(0, 10)
  else if (typeof v === 'object') {
    if (v.richText) s = v.richText.map((r) => r.text).join('')
    else if ('result' in v) s = String(v.result ?? '')
    else if ('text' in v) s = String(v.text)
    else s = ''
  } else s = String(v)
  return s.replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).trim()
}


export function asTime(v) {
  if (v instanceof Date) return v.toISOString().slice(11, 16)
  if (v && typeof v === 'object' && 'result' in v) v = v.result
  if (typeof v === 'number' && v >= 0 && v < 1) {
    const m = Math.round(v * 1440)
    return pad(Math.floor(m / 60)) + ':' + pad(m % 60)
  }
  const m = asText(v).match(/^(\d{1,2})[:.](\d{2})/)
  return m ? m[1].padStart(2, '0') + ':' + m[2] : ''
}


export async function readSheet(file) {
  const wb = new ExcelJS.Workbook()
  try {
    await wb.xlsx.load(await file.arrayBuffer())
  } catch {
    return null
  }
  const ws = wb.worksheets[0]
  const rows = []
  if (ws) ws.eachRow((row, line) => rows.push({ line, cells: row.values.slice(1) }))
  return rows
}

export async function downloadTemplate(fileName, headers, sample) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Sheet1', { views: [{ rightToLeft: true }] })
  ws.columns = headers.map((h) => ({ header: h, width: 20 }))
  sample.forEach((r) => ws.addRow(r))
  ws.getRow(1).font = { bold: true }

  const buffer = await wb.xlsx.writeBuffer()
  const url = URL.createObjectURL(new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }))
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  a.click()
  URL.revokeObjectURL(url)
}