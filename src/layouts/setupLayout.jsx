import { Outlet } from 'react-router-dom'
import Header from '../Components/Header'
import { useUser } from '../Context/useUser'

export default function SetupLayout() {
  const { user } = useUser()

  return (
    <div className="layout">
      <Header user={user} />
      <main className="layout-content p-3 p-lg-4"><Outlet /></main>
    </div>
  )
}