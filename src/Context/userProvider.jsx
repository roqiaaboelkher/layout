import { useState } from 'react'
import { UserContext } from './userContext'



const KEY = 'attendance.user'

function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) } catch { return null }
}

export default function UserProvider({ children }) {
  const [user, setUser] = useState(load)

  function saveUser(next) {
    setUser(next)
    try { localStorage.setItem(KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }

  function clearUser() {
    setUser(null)
    try { localStorage.removeItem(KEY) } catch { /* ignore */ }
  }

  return (
    <UserContext.Provider value={{ user, saveUser, clearUser }}>
      {children}
    </UserContext.Provider>
  )
}


