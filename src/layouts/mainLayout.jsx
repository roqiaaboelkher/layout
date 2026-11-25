import { Outlet, Navigate } from 'react-router-dom'
import Header from '../Components/Header'
import Sidebar from '../Components/Sidebar'
import { useUser } from '../Context/useUser'

export default function MainLayout() {
  const { user } = useUser()
  if (!user) return <Navigate to="/setup" replace />

  return (
    <div className="layout">
      <Header user={user} withMenu />
      <div className="layout-body">
        <Sidebar />
        <main className="layout-content p-3 p-lg-4"><Outlet /></main>
      </div>
    </div>
  )
}
