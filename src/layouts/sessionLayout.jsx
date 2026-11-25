import { Outlet, Navigate } from 'react-router-dom'
import Header from '../Components/Header'
import { useUser } from '../Context/useUser'

export default function SessionLayout() {
  const { user } = useUser()
  if (!user) return <Navigate to="/setup" replace />

  return (
    <div className="layout">
      <Header user={user} backTo="/" />
      <main className="layout-content p-3 p-lg-4"><Outlet /></main>
    </div>
  )
}