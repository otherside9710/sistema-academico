import { ArrowDownRight, ArrowRight, ArrowUpRight, BookOpen, CalendarDays, CheckCircle2, ClipboardCheck, Clock3, GraduationCap, NotebookPen, Users } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, PageHeading } from '../components/ui.jsx'
import { fullName, getEntity, localDate, scoreAverage } from '../utils.js'

const greeting = () => {
  const hour = new Date().getHours()
  return hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches'
}

const assignmentName = (data, assignment) => getEntity(data.subjects, assignment?.subjectId)?.name || 'Asignatura'

function StatCard({ label, value, change, icon: Icon, tone = 'blue', footnote }) {
  return <article className="stat-card"><div className={'stat-icon stat-' + tone}><Icon size={19} strokeWidth={1.8} /></div><span className="stat-label">{label}</span><strong className="stat-value">{value}</strong><div className="stat-foot"><span className={'stat-change ' + (change?.startsWith('-') ? 'stat-down' : '')}>{change?.startsWith('-') ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}{change}</span><span>{footnote}</span></div></article>
}

function TodayClasses({ data, assignments }) {
  const ordered = [...assignments].sort((a, b) => a.start.localeCompare(b.start)).slice(0, 4)
  return <section className="surface-card schedule-card"><div className="surface-heading"><div><span className="surface-kicker">TU AGENDA</span><h2>Clases de la semana</h2></div><span className="calendar-date">PERIODO 2026-2</span></div>{ordered.length ? <div className="agenda-list">{ordered.map((assignment, index) => <div className="agenda-item" key={assignment.id}><div className="agenda-time"><strong>{assignment.start}</strong><span>{assignment.end}</span></div><div className={'agenda-track agenda-track-' + (index % 4)} /><div className="agenda-main"><strong>{assignmentName(data, assignment)}</strong><span>{getEntity(data.people, assignment.teacherId) ? fullName(getEntity(data.people, assignment.teacherId)) : 'Docente sin asignar'} · Grupo {assignment.group}</span></div><div className="agenda-location"><span>{getEntity(data.classrooms, assignment.classroomId)?.code}</span><small>{assignment.day}</small></div></div>)}</div> : <div className="empty-inline">No hay clases programadas todavía.</div>}<div className="surface-footer"><span>Las clases se derivan de la carga académica.</span><CalendarDays size={16} /></div></section>
}

function ActivityFeed({ data }) {
  const icons = { grade: NotebookPen, attendance: ClipboardCheck, plan: BookOpen }
  return <section className="surface-card activity-card"><div className="surface-heading"><div><span className="surface-kicker">RECIENTE</span><h2>Actividad del campus</h2></div><span className="activity-live">● ACTUALIZADO</span></div><div className="activity-list">{data.activity.slice(0, 4).map((item, index) => { const Icon = icons[item.type] || CheckCircle2; return <div className="activity-item" key={item.id}><span className={'activity-icon activity-icon-' + item.type}><Icon size={16} /></span><div className="activity-copy"><strong>{item.text}</strong><span>{localDate(item.date)}</span></div>{index === 0 && <span className="activity-new">Nuevo</span>}</div> })}</div><button className="text-link" onClick={() => window.dispatchEvent(new CustomEvent('campus:navigate', { detail: 'reports' }))}>Ver actividad reciente <ArrowRight size={15} /></button></section>
}

function ProgressSummary({ data, studentId }) {
  const plans = data.plans.filter((plan) => {
    const assignment = getEntity(data.assignments, plan.assignmentId)
    return assignment?.studentIds.includes(studentId)
  })
  const total = plans.reduce((sum, plan) => sum + plan.weeks.length, 0)
  const done = plans.reduce((sum, plan) => sum + plan.weeks.filter((week) => week.completed).length, 0)
  const percent = total ? Math.round(done / total * 100) : 0
  return <section className="surface-card progress-card"><div className="surface-heading"><div><span className="surface-kicker">APRENDIZAJE</span><h2>Avance curricular</h2></div><span className="progress-percent">{percent}%</span></div><div className="progress-large"><div style={{ width: percent + '%' }} /></div><p>Sesiones del plan registradas por tus docentes.</p><div className="progress-legend"><span><i className="legend-dot legend-done" />{done} semanas desarrolladas</span><span><i className="legend-dot legend-pending" />{Math.max(total - done, 0)} pendientes</span></div></section>
}

function CoordinatorOverview({ data, person, onNavigate }) {
  const programId = person.programId || 'prog-sistemas'
  const program = getEntity(data.programs, programId)
  const loads = data.assignments.filter((assignment) => assignment.programId === programId)
  const studentCount = data.people.filter((item) => item.role === 'student' && item.programId === programId).length
  const microCount = data.microcurricula.filter((item) => item.programId === programId).length
  const planCount = data.plans.filter((plan) => loads.some((assignment) => assignment.id === plan.assignmentId)).length
  const completion = data.plans.filter((plan) => loads.some((assignment) => assignment.id === plan.assignmentId)).flatMap((plan) => plan.weeks).filter((week) => week.completed).length
  const totalWeeks = data.plans.filter((plan) => loads.some((assignment) => assignment.id === plan.assignmentId)).flatMap((plan) => plan.weeks).length
  const progress = totalWeeks ? Math.round(completion / totalWeeks * 100) : 0
  return <><PageHeading eyebrow="VISTA DE COORDINACIÓN" title="Resumen del programa" description="La planeación y el avance de tu comunidad académica, en un solo lugar." action={<Button variant="secondary" icon={CalendarDays} onClick={() => onNavigate('loads')}>Ver programación</Button>}><span className="heading-subline"><span className="heading-green-dot" />{program?.name} <span className="heading-dot">·</span> Periodo 2026-2</span></PageHeading><div className="stats-grid stats-four"><StatCard label="Estudiantes activos" value={studentCount} change="8.4%" footnote="vs. periodo anterior" icon={Users} tone="blue" /><StatCard label="Grupos programados" value={loads.length} change="2 nuevos" footnote="en este periodo" icon={CalendarDays} tone="purple" /><StatCard label="Microcurrículos" value={microCount} change="100%" footnote="asignaturas con plan" icon={BookOpen} tone="orange" /><StatCard label="Planes en seguimiento" value={planCount} change={progress + '%'} footnote="avance de ejecución" icon={CheckCircle2} tone="mint" /></div><div className="dashboard-grid dashboard-two"><section className="surface-card program-progress"><div className="surface-heading"><div><span className="surface-kicker">CUMPLIMIENTO ACADÉMICO</span><h2>Avance de los microcurrículos</h2></div><Badge tone="blue">{progress}% promedio</Badge></div><p className="muted-copy">Seguimiento semanal reportado por los docentes del programa.</p><div className="progress-large"><div style={{ width: progress + '%' }} /></div><div className="plan-stats"><span><strong>{completion}</strong> sesiones ejecutadas</span><span><strong>{Math.max(totalWeeks - completion, 0)}</strong> pendientes de reporte</span></div><div className="program-highlights"><div><span>Periodo activo</span><strong>2026 · Segundo semestre</strong></div><div><span>Programa</span><strong>{program?.code} · {program?.name}</strong></div><div><span>Oferta</span><strong>{loads.length} grupos · {microCount} asignaturas</strong></div></div></section><TodayClasses data={data} assignments={loads} /></div><ActivityFeed data={data} /></>
}

export function Dashboard({ person, role, onNavigate }) {
  const { data } = useAcademy()
  const myLoads = role === 'teacher' ? data.assignments.filter((item) => item.teacherId === person.id) : role === 'student' ? data.assignments.filter((item) => item.studentIds.includes(person.id)) : data.assignments
  const displayName = person.firstName.split(' ')[0]

  if (role === 'coordinator') return <CoordinatorOverview data={data} person={person} onNavigate={onNavigate} />

  if (role === 'admin') {
    const activePeople = data.people.filter((item) => item.active).length
    const recentSessions = data.attendanceSessions.length
    const distribution = [
      { name: 'Estudiantes', count: data.people.filter((item) => item.role === 'student').length, width: 77, tone: 'blue' },
      { name: 'Docentes', count: data.people.filter((item) => item.role === 'teacher').length, width: 38, tone: 'purple' },
      { name: 'Coordinadores', count: data.people.filter((item) => item.role === 'coordinator').length, width: 17, tone: 'orange' },
      { name: 'Administradores', count: data.people.filter((item) => item.role === 'admin').length, width: 9, tone: 'mint' },
    ]
    return <><PageHeading eyebrow="PANEL INSTITUCIONAL" title={'Hola, ' + displayName} description="Aquí tienes el pulso general de la actividad académica." action={<Button variant="secondary" icon={Users} onClick={() => onNavigate('people')}>Gestionar personas</Button>}><span className="heading-subline"><span className="heading-green-dot" />{import.meta.env.VITE_INSTITUTION_NAME || 'Universidad del Caribe'} <span className="heading-dot">·</span> Periodo 2026-2</span></PageHeading><div className="stats-grid stats-four"><StatCard label="Personas activas" value={activePeople} change="12.6%" footnote="vs. periodo anterior" icon={Users} tone="blue" /><StatCard label="Programas académicos" value={data.programs.length} change="2 facultades" footnote="oferta institucional" icon={GraduationCap} tone="purple" /><StatCard label="Grupos programados" value={data.assignments.length} change="2026-2" footnote="carga académica" icon={CalendarDays} tone="orange" /><StatCard label="Sesiones de asistencia" value={recentSessions} change="+3" footnote="este mes" icon={ClipboardCheck} tone="mint" /></div><div className="dashboard-grid dashboard-admin"><section className="surface-card role-distribution"><div className="surface-heading"><div><span className="surface-kicker">COMUNIDAD</span><h2>Personas por rol</h2></div><button className="more-button" onClick={() => onNavigate('people')}>Ver directorio <ArrowRight size={15} /></button></div><div className="distribution-total"><strong>{activePeople}</strong><span>personas en el campus</span></div><div className="distribution-bars">{distribution.map((item) => <div className="distribution-row" key={item.name}><div className="distribution-label"><span>{item.name}</span><strong>{item.count}</strong></div><div className="distribution-track"><div className={'distribution-fill fill-' + item.tone} style={{ width: item.width + '%' }} /></div></div>)}</div><div className="role-legend"><span><i className="legend-dot legend-done" />Usuarios con acceso demo</span><span>{data.faculties.length} facultades activas</span></div></section><section className="surface-card admin-quick"><span className="surface-kicker">ACCESOS RÁPIDOS</span><h2>¿Qué necesitas gestionar?</h2><button onClick={() => onNavigate('catalogs')}><span className="quick-icon quick-violet"><BookOpen size={17} /></span><span><strong>Oferta académica</strong><small>Facultades, programas y aulas</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('people')}><span className="quick-icon quick-blue"><Users size={17} /></span><span><strong>Directorio de personas</strong><small>Cuentas, roles y datos básicos</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('reports')}><span className="quick-icon quick-orange"><ClipboardList size={17} /></span><span><strong>Reportes institucionales</strong><small>Actividad y operación académica</small></span><ArrowRight size={16} /></button></section></div><ActivityFeed data={data} /></>
  }

  if (role === 'teacher') {
    const myStudentIds = [...new Set(myLoads.flatMap((item) => item.studentIds))]
    const pending = data.grades.filter((grade) => myLoads.some((item) => item.id === grade.assignmentId) && grade.partial3 === null).length
    const plans = data.plans.filter((plan) => plan.teacherId === person.id)
    const done = plans.flatMap((plan) => plan.weeks).filter((week) => week.completed).length
    const total = plans.flatMap((plan) => plan.weeks).length
    const progress = total ? Math.round(done / total * 100) : 0
    return <><PageHeading eyebrow="ESPACIO DOCENTE" title={'Hola, ' + displayName} description="Tu espacio de trabajo para acompañar y evaluar a tus grupos." action={<Button variant="secondary" icon={CalendarDays} onClick={() => onNavigate('schedule')}>Ver mi horario</Button>}><span className="heading-subline"><span className="heading-green-dot" />Periodo 2026-2 <span className="heading-dot">·</span> {myLoads.length} grupos a cargo</span></PageHeading><div className="stats-grid stats-four"><StatCard label="Grupos a cargo" value={myLoads.length} change="2026-2" footnote="en este periodo" icon={BookOpen} tone="blue" /><StatCard label="Estudiantes" value={myStudentIds.length} change="Activos" footnote="en tus grupos" icon={Users} tone="purple" /><StatCard label="Notas por completar" value={pending} change="3 parciales" footnote="registro académico" icon={NotebookPen} tone="orange" /><StatCard label="Avance del plan" value={progress + '%'} change={done + '/' + total} footnote="sesiones reportadas" icon={CheckCircle2} tone="mint" /></div><div className="dashboard-grid dashboard-two"><TodayClasses data={data} assignments={myLoads} /><section className="surface-card teacher-tasks"><div className="surface-heading"><div><span className="surface-kicker">POR HACER</span><h2>Continúa tu gestión</h2></div><span className="task-count">{pending}</span></div><button className="task-link" onClick={() => onNavigate('grades')}><span className="task-icon task-orange"><NotebookPen size={17} /></span><span><strong>Completar calificaciones</strong><small>Revisa el tercer parcial de tus estudiantes</small></span><ArrowRight size={16} /></button><button className="task-link" onClick={() => onNavigate('teacher-plan')}><span className="task-icon task-purple"><BookOpen size={17} /></span><span><strong>Actualizar plan microcurricular</strong><small>Registra el avance semanal del curso</small></span><ArrowRight size={16} /></button><div className="teacher-hint"><Clock3 size={16} />Mantén el plan al día para facilitar el seguimiento del programa.</div></section></div><ActivityFeed data={data} /></>
  }

  const grades = data.grades.filter((grade) => grade.studentId === person.id)
  const averages = grades.map(scoreAverage).filter((value) => value !== null)
  const average = averages.length ? averages.reduce((sum, item) => sum + item, 0) / averages.length : 0
  const myAttendance = data.attendanceSessions.flatMap((session) => session.details.filter((detail) => detail.studentId === person.id).map((detail) => detail.status))
  const present = myAttendance.filter((status) => status === 'Presente' || status === 'Tardanza').length
  const attendanceRate = myAttendance.length ? Math.round(present / myAttendance.length * 100) : 100
  const program = getEntity(data.programs, person.programId)
  const faculty = getEntity(data.faculties, person.facultyId)
  const upcoming = [...myLoads].sort((a, b) => a.day.localeCompare(b.day)).slice(0, 3)
  return <><PageHeading eyebrow="PORTAL ESTUDIANTIL" title={'Hola, ' + displayName} description="Tu vida académica, organizada para que avances a tu ritmo." action={<Button variant="secondary" icon={CalendarDays} onClick={() => onNavigate('schedule')}>Ver mi horario</Button>}><span className="heading-subline"><span className="heading-green-dot" />{program?.name} <span className="heading-dot">·</span> {faculty?.name}</span></PageHeading><div className="stats-grid stats-three"><StatCard label="Promedio actual" value={average.toFixed(1)} change="Sobre 5.0" footnote="promedio simple" icon={NotebookPen} tone="blue" /><StatCard label="Asistencia" value={attendanceRate + '%'} change={present + ' presentes'} footnote="de tus sesiones" icon={ClipboardCheck} tone="mint" /><StatCard label="Materias inscritas" value={myLoads.length} change="2026-2" footnote="este semestre" icon={BookOpen} tone="purple" /></div><div className="dashboard-grid dashboard-two"><section className="surface-card student-upcoming"><div className="surface-heading"><div><span className="surface-kicker">TU SEMANA</span><h2>Materias inscritas</h2></div><button className="more-button" onClick={() => onNavigate('schedule')}>Horario completo <ArrowRight size={15} /></button></div><div className="upcoming-list">{upcoming.map((assignment, index) => <div className="upcoming-item" key={assignment.id}><span className={'upcoming-marker upcoming-marker-' + index}><BookOpen size={16} /></span><div><strong>{assignmentName(data, assignment)}</strong><small>{assignment.day} · {assignment.start}–{assignment.end}</small></div><span className="upcoming-room">{getEntity(data.classrooms, assignment.classroomId)?.code}</span></div>)}</div></section><ProgressSummary data={data} studentId={person.id} /></div><div className="student-shortcuts"><button onClick={() => onNavigate('student-grades')}><span className="quick-icon quick-orange"><NotebookPen size={17} /></span><span><strong>Consulta tus notas</strong><small>Parciales y promedio por materia</small></span><ArrowRight size={16} /></button><button onClick={() => onNavigate('student-attendance')}><span className="quick-icon quick-mint"><ClipboardCheck size={17} /></span><span><strong>Revisa tus asistencias</strong><small>Historial de sesiones registradas</small></span><ArrowRight size={16} /></button></div><ActivityFeed data={data} /></>
}
