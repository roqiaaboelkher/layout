import { useState } from 'react'
import { TermContext } from './termContext'

const KEY = 'attendance.terms'
const EMPTY = { terms: [], currentId: null }

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? EMPTY } catch { return EMPTY }
}

// بيحتفظ بكل الترمات والترم الحالي
export default function TermProvider({ children }) {
  const [state, setState] = useState(load)

  function persist(next) {
    setState(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  // ترم جديد بيتضاف ويبقى هو الحالي
function addTerm(term) {
  const id = 't' + Date.now()
  persist({ terms: [...state.terms, { ...term, id }], currentId: id })
  return id 
}

  function updateTerm(id, fields) {
    persist({ ...state, terms: state.terms.map((t) => (t.id === id ? { ...t, ...fields } : t)) })
  }

  // اختار ترم معين
  function selectTerm(id) {
    persist({ ...state, currentId: id })
  }

  const terms = [...state.terms].sort((a, b) => b.startDate.localeCompare(a.startDate))
  const currentTerm = state.terms.find((t) => t.id === state.currentId) ?? null

  return (
    <TermContext.Provider value={{ terms, currentTerm, addTerm, updateTerm, selectTerm }}>
      {children}
    </TermContext.Provider>
  )
}