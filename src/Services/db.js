const PREFIX = 'attendance.db.'

export function read(name) {
  try { return JSON.parse(localStorage.getItem(PREFIX + name)) ?? [] } catch { return [] }
}

export function write(name, items) {
  try { localStorage.setItem(PREFIX + name, JSON.stringify(items)) } catch { /* ignore */ }
}