import { useState } from 'react'
import PageTitle from '../../Components/PageTitle'
import { useUser } from '../../Context/useUser'

const ROLES = [
  { value: 'doctor', label: 'دكتور', icon: 'bi-person-badge' },
  { value: 'assistant', label: 'معيد', icon: 'bi-person-workspace' },
]

export default function StepUser({ onNext }) {
  const { user, saveUser } = useUser()
  const [name, setName] = useState(user?.name ?? '')
  const [role, setRole] = useState(user?.role ?? 'doctor')
  const cleanName = name.trim()

  function handleNext() {
    saveUser({ name: cleanName, role })
    onNext()
  }

  return (
    <>
      <PageTitle title="أهلاً بيك! " subtitle="الخطوة 1 من 3: عرّفنا بيك" />

      <label htmlFor="doctor-name" className="form-label fw-bold">اسمك</label>
      <input
        id="doctor-name"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اكتب اسمك مع اللقب "
      />
     
      <div className="form-label fw-bold">أنا</div>
      <div className="role-options">
        {ROLES.map((r) => (
          <button
            key={r.value}
            type="button"
            className={'role-option' + (role === r.value ? ' selected' : '')}
            onClick={() => setRole(r.value)}
          >
            <i className={'bi ' + r.icon} />
            <span>{r.label}</span>
          </button>
        ))}
      </div>

      <div className="setup-preview"> أهلاً يا د {cleanName || '...'}</div>

      <button type="button" className="btn-navy" disabled={!cleanName} onClick={handleNext}>
        التالي <i className="bi bi-chevron-left" />
      </button>
    </>
  )
}