import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/mainLayout'
import SessionLayout from './layouts/sessionLayout'
import SetupLayout from './layouts/setupLayout'
import PageTitle from './Components/PageTitle'

import Setup from './Pages/Setup/Setup'
import Dashboard from './Pages/Dashboard/Dashboard'
import Session from './Pages/Session/Session'
import Sessions from './Pages/Sessions/Sessions'
import SessionDetails from './Pages/Sessions/SessionDetails'


const soon = (title) => <PageTitle title={title} subtitle="" />

export default function App() {
  return (
    <Routes>
      <Route element={<SetupLayout />}>
        <Route path="/setup" element={<Setup />} />
      </Route>

      <Route element={<SessionLayout />}>
        <Route path="/session/:id" element={<Session />} />
      </Route>

      <Route element={<MainLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/sessions/:id" element={<SessionDetails />} />
        <Route path="/attendance" element={soon('أخد الحضور')} />
        <Route path="/my-reports" element={soon('تقارير موادي')} />
        <Route path="/courses" element={soon('المواد وطلابها')} />
        <Route path="/students" element={soon('الطلاب')} />
        <Route path="/cards" element={soon('الكارنيهات')} />
        <Route path="/schedule" element={soon('الجدول والإجازات')} />
        <Route path="/settings" element={soon('الإعدادات')} />
      </Route>
    </Routes>
  )
}