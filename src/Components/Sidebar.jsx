
import { useEffect } from 'react'
import { NavLink, useLocation } from 'react-router-dom'

const main = [
  { to: '/', label: 'الرئيسية', icon: 'bi-house-door-fill', end: true },
  { to: '/attendance', label: 'أخد الحضور', icon: 'bi-check2-circle' },
  { to: '/sessions', label: 'كشوف الجلسات', icon: 'bi-list-check' },
  { to: '/my-reports', label: 'تقارير موادي', icon: 'bi-bar-chart-fill' },
]
const setup = [
  { to: '/courses', label: 'المواد وطلابها', icon: 'bi-book' },
  { to: '/students', label: 'الطلاب', icon: 'bi-people-fill' },
  { to: '/cards', label: 'الكارنيهات', icon: 'bi-person-vcard' },
  { to: '/schedule', label: 'الجدول والإجازات', icon: 'bi-calendar-week' },
  { to: '/settings', label: 'الإعدادات', icon: 'bi-gear-fill' },
]

function Item({ to, label, icon, end }) {
  const { pathname } = useLocation()

useEffect(() => {
  const nav = document.getElementById('sidebar')
  if (nav?.classList.contains('show')) {
    nav.querySelector('.btn-close')?.click()
  }
}, [pathname])
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) => 'sidebar-link' + (isActive ? ' active' : '')}
    >
      <i className={'bi ' + icon} />
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <nav id="sidebar" className="app-sidebar offcanvas-lg offcanvas-start" tabIndex="-1" aria-labelledby="sidebar-title">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title" id="sidebar-title">القايمة</h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" data-bs-target="#sidebar" aria-label="إغلاق" />
      </div>
      <div className="offcanvas-body flex-column p-0">
        {main.map((i) => <Item key={i.to} {...i} />)}
        <div className="sidebar-section">الإعداد</div>
        {setup.map((i) => <Item key={i.to} {...i} />)}
      </div>
    </nav>
  )
}