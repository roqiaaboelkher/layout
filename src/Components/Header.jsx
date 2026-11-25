import { Link } from 'react-router-dom'
import { roleLabels } from '../Utils/roles'
import { termLabel } from '../Utils/terms'
import { useTerms } from '../Context/useTerms'


export default function Header({ user = null, backTo = null, withMenu = false }) {
  const { terms, currentTerm, selectTerm } = useTerms()

  return (
    <header className="app-header py-2 px-2 px-sm-4">
      <div className="brand">
        {withMenu && (
          <button type="button" className="menu-btn d-lg-none" data-bs-toggle="offcanvas" data-bs-target="#sidebar" aria-label="القايمة">
            <i className="bi bi-list" />
          </button>
        )}
        <span className="brand-icon"><i className="bi bi-qr-code" /></span>
        <div>
          <div className="brand-title">نظام الحضور والغياب</div>
          <div className="brand-sub d-none d-sm-block">برنامج الدكتور</div>
        </div>
      </div>

      <div className="header-actions gap-2 gap-sm-3">
        {user && currentTerm && (
          <div className="dropdown">
            <button className="semester-btn dropdown-toggle" type="button" data-bs-toggle="dropdown">
              <i className="bi bi-calendar3 ms-2" />
              {termLabel(currentTerm)}
            </button>
            <ul className="dropdown-menu">
              {terms.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    className={'dropdown-item' + (t.id === currentTerm.id ? ' active' : '')}
                    onClick={() => selectTerm(t.id)}
                  >
                    {termLabel(t)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {user && (
          <div className="header-user">
            <div className="d-none d-sm-block">
              <strong>{user.name}</strong>
              <small>{roleLabels[user.role]}</small>
            </div>
            <span className="avatar">{user.name.replace('د. ', '')[0]}</span>
          </div>
        )}
        {backTo && (
          <Link to={backTo} className="back-link">
            <i className="bi bi-chevron-right ms-1" />
            رجوع للرئيسية
          </Link>
        )}
      </div>
    </header>
  )
}