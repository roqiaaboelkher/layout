import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../Components/PageTitle'
import { useUser } from '../../Context/useUser'
import { useTerms } from '../../Context/useTerms'
import { defaultTerm } from '../../Utils/terms'

const ROLES = [
  { value: 'doctor', label: 'دكتور', icon: 'bi-person-badge' },
  { value: 'assistant', label: 'معيد', icon: 'bi-person-workspace' },
]


export default function Setup() {
  const { user, saveUser } = useUser()
  const { currentTerm, addTerm } = useTerms()
  const navigate = useNavigate()
  const [name, setName] = useState(user?.name ?? '')
  const [role, setRole] = useState(user?.role ?? 'doctor')
  const cleanName = name.trim()

  function handleNext() {
    saveUser({ name: cleanName, role })
    if (!currentTerm) addTerm(defaultTerm())
    navigate('/') 
  }

  return (
    <div className="setup-card p-3 p-sm-4">
      <PageTitle title="أهلاً بيك! خلّينا نجهّز البرنامج" subtitle="الخطوة 1 من 3: عرّفنا بيك" />

      <label htmlFor="doctor-name" className="form-label fw-bold">اسمك</label>
      <input
        id="doctor-name"
        className="form-control"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="اكتب اسمك مع اللقب، زي: د. زهراء علي"
      />
      <div className="form-text mb-3">ده الاسم اللي هيظهر في البرنامج والتقارير. تقدر تغيّره بعدين.</div>

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

      <div className="setup-preview">هيظهرلك كده: أهلاً يا {cleanName || '...'}</div>

      <button type="button" className="btn-navy" disabled={!cleanName} onClick={handleNext}>
        التالي <i className="bi bi-chevron-left" />
      </button>
    </div>
  )
}