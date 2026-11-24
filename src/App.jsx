import { useEffect, useState } from 'react'
import { useAcademy } from './context/AcademyContext.jsx'
import { AppShell, LoginScreen } from './components/layout.jsx'
import { Dashboard } from './pages/Dashboard.jsx'
import PeoplePage from './pages/PeoplePage.jsx'
import CatalogsPage from './pages/CatalogsPage.jsx'
import LoadsPage from './pages/LoadsPage.jsx'
import CurriculumPage, { TeacherPlanPage } from './pages/CurriculumPage.jsx'
import GradesPage from './pages/GradesPage.jsx'
import AttendancePage from './pages/AttendancePage.jsx'
import SchedulePage from './pages/SchedulePage.jsx'
import { StudentAttendancePage, StudentGradesPage, StudentPlanPage } from './pages/StudentPages.jsx'
import ReportsPage from './pages/ReportsPage.jsx'

const allowedPages = {
  admin: ['dashboard', 'people', 'catalogs', 'reports'],
  coordinator: ['dashboard', 'loads', 'curriculum', 'schedule', 'reports'],
  teacher: ['dashboard', 'grades', 'attendance', 'teacher-plan', 'schedule'],
  student: ['dashboard', 'schedule', 'student-grades', 'student-attendance', 'student-plan'],
}

export default function App() {
  const { data, session, login, logout, toast, notify, clearToast } = useAcademy()
  const [page, setPage] = useState('dashboard')
  const person = data.people.find((item) => item.id === session?.personId)
  const role = person?.role

  useEffect(() => { setPage('dashboard') }, [session?.personId])
  useEffect(() => {
    const listener = (event) => {
      if (allowedPages[role]?.includes(event.detail)) setPage(event.detail)
    }
    window.addEventListener('campus:navigate', listener)
    return () => window.removeEventListener('campus:navigate', listener)
  }, [role])

  useEffect(() => {
    if (session && !person) {
      logout()
      notify('No encontramos el perfil guardado. Vuelve a iniciar sesión.', 'info')
    }
  }, [session, person, logout, notify])

  if (!session || !person) return <LoginScreen onLogin={login} people={data.people} />

  const navigate = (nextPage) => {
    if (!allowedPages[role]?.includes(nextPage)) { setPage('dashboard'); return }
    setPage(nextPage)
  }

  let content
  switch (page) {
    case 'people': content = <PeoplePage />; break
    case 'catalogs': content = <CatalogsPage />; break
    case 'loads': content = <LoadsPage person={person} />; break
    case 'curriculum': content = <CurriculumPage person={person} />; break
    case 'teacher-plan': content = <TeacherPlanPage person={person} />; break
    case 'grades': content = <GradesPage person={person} />; break
    case 'attendance': content = <AttendancePage person={person} />; break
    case 'schedule': content = <SchedulePage person={person} role={role} />; break
    case 'student-grades': content = <StudentGradesPage person={person} />; break
    case 'student-attendance': content = <StudentAttendancePage person={person} />; break
    case 'student-plan': content = <StudentPlanPage person={person} />; break
    case 'reports': content = <ReportsPage person={person} />; break
    default: content = <Dashboard person={person} role={role} onNavigate={navigate} />
  }

  return <AppShell person={person} role={role} activePage={page} onNavigate={navigate} onLogout={logout} toast={toast} onCloseToast={clearToast}>{content}</AppShell>
}
