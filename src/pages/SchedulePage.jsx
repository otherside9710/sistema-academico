import { useMemo, useState } from 'react'
import { CalendarDays, Download, MapPin, PencilLine, UserRound } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Badge, Button, Modal, PageHeading } from '../components/ui.jsx'
import { exportCsv, fullName, getEntity } from '../utils.js'

const weekdayNames = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const weekdayShort = ['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB']
const colorClasses = ['schedule-blue', 'schedule-purple', 'schedule-orange', 'schedule-mint']
const timeNumber = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

export default function SchedulePage({ person, role }) {
  const { data, saveItem, notify: toast } = useAcademy()
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIds, setSelectedIds] = useState([])
  const [error, setError] = useState('')
  const isCoordinator = role === 'coordinator'
  const programId = person.programId
  const visibleLoads = useMemo(() => data.assignments.filter((assignment) => {
    if (role === 'teacher') return assignment.teacherId === person.id
    if (role === 'coordinator') return assignment.programId === programId
    return assignment.studentIds.includes(person.id)
  }).sort((a, b) => weekdayNames.indexOf(a.day) - weekdayNames.indexOf(b.day) || a.start.localeCompare(b.start)), [data.assignments, role, person.id, programId])
  const availableLoads = role === 'student' ? data.assignments.filter((assignment) => assignment.programId === person.programId) : []
  const hours = visibleLoads.reduce((sum, assignment) => sum + (timeNumber(assignment.end) - timeNumber(assignment.start)) / 60, 0)
  const program = getEntity(data.programs, person.programId)

  const openManage = () => { setSelectedIds(availableLoads.filter((assignment) => assignment.studentIds.includes(person.id)).map((assignment) => assignment.id)); setError(''); setModalOpen(true) }
  const saveSchedule = () => {
    const selected = availableLoads.filter((assignment) => selectedIds.includes(assignment.id))
    for (let index = 0; index < selected.length; index += 1) {
      for (let otherIndex = index + 1; otherIndex < selected.length; otherIndex += 1) {
        const first = selected[index]
        const second = selected[otherIndex]
        if (first.day === second.day && timeNumber(first.start) < timeNumber(second.end) && timeNumber(first.end) > timeNumber(second.start)) {
          setError('Hay un cruce entre ' + getEntity(data.subjects, first.subjectId)?.name + ' y ' + getEntity(data.subjects, second.subjectId)?.name + '.')
          return
        }
      }
    }
    availableLoads.forEach((assignment) => {
      const enrolled = new Set(assignment.studentIds)
      if (selectedIds.includes(assignment.id)) enrolled.add(person.id)
      else enrolled.delete(person.id)
      saveItem('assignments', { ...assignment, studentIds: [...enrolled] })
    })
    toast('Tu horario académico quedó actualizado.')
    setModalOpen(false)
  }

  const pageTitle = isCoordinator ? 'Horarios del programa' : role === 'teacher' ? 'Mi horario' : 'Mi horario académico'
  const headingAction = <div className="schedule-actions">{role === 'student' && <Button variant="secondary" icon={PencilLine} onClick={openManage}>Elegir materias</Button>}<Button variant="secondary" icon={Download} onClick={() => exportCsv('horario-academico.csv', [['Día', 'Inicio', 'Fin', 'Materia', 'Grupo', 'Aula', 'Docente'], ...visibleLoads.map((item) => [item.day, item.start, item.end, getEntity(data.subjects, item.subjectId)?.name, item.group, getEntity(data.classrooms, item.classroomId)?.code, fullName(getEntity(data.people, item.teacherId))])])}>Descargar horario</Button></div>
  return <><PageHeading eyebrow={isCoordinator ? 'CONSULTA DEL PROGRAMA' : role === 'teacher' ? 'PLANEACIÓN DOCENTE' : 'ORGANIZACIÓN SEMANAL'} title={pageTitle} description={isCoordinator ? 'Revisa los horarios derivados de la carga académica del programa.' : role === 'teacher' ? 'Consulta los grupos y espacios que tienes asignados esta semana.' : 'Consulta tus clases o selecciona grupos para organizar el semestre.'} action={headingAction}><span className="heading-subline"><span className="heading-green-dot" />Periodo {import.meta.env.VITE_DEFAULT_PERIOD || '2026-2'} <span className="heading-dot">·</span> {program?.name || 'Programa académico'}</span></PageHeading>
    <div className="schedule-summary"><div><CalendarDays size={18} /><span><small>{isCoordinator ? 'GRUPOS PROGRAMADOS' : 'CLASES POR SEMANA'}</small><strong>{visibleLoads.length}</strong></span></div><div><span className="schedule-summary-dot" /><span><small>HORAS PROGRAMADAS</small><strong>{hours} horas</strong></span></div><div><MapPin size={18} /><span><small>ESPACIOS ACADÉMICOS</small><strong>{new Set(visibleLoads.map((item) => item.classroomId)).size} aulas</strong></span></div></div>
    <section className="schedule-board"><div className="schedule-board-heading"><div><span className="surface-kicker">VISTA SEMANAL</span><h2>Clases programadas</h2></div><Badge tone="blue">SEMESTRE {import.meta.env.VITE_DEFAULT_PERIOD || '2026-2'}</Badge></div><div className="week-grid">{weekdayNames.map((day, dayIndex) => { const today = visibleLoads.filter((assignment) => assignment.day === day); return <section className="week-column" key={day}><div className="week-day-head"><span>{weekdayShort[dayIndex]}</span><strong>{day}</strong><small>{today.length} {today.length === 1 ? 'clase' : 'clases'}</small></div><div className="week-class-list">{today.length ? today.map((assignment, index) => { const subject = getEntity(data.subjects, assignment.subjectId); const teacher = getEntity(data.people, assignment.teacherId); const classroom = getEntity(data.classrooms, assignment.classroomId); return <article className={'week-class ' + colorClasses[index % colorClasses.length]} key={assignment.id}><div className="week-class-time"><strong>{assignment.start}</strong><span>{assignment.end}</span></div><h3>{subject?.name || 'Asignatura'}</h3><div className="week-class-meta"><span><MapPin size={13} />{classroom?.code || 'Sin aula'}</span><span>Grupo {assignment.group}</span></div>{(role === 'student' || isCoordinator) && <div className="week-class-teacher"><UserRound size={13} />{teacher?.firstName} {teacher?.lastName}{isCoordinator && <span className="class-students">{assignment.studentIds.length} est.</span>}</div>}</article> }) : <div className="day-empty"><span>—</span><small>Sin clases</small></div>}</div></section> })}</div><div className="schedule-note"><span className="schedule-note-icon"><CalendarDays size={16} /></span><span>Tu horario se construye desde las asignaciones de carga académica del periodo.</span></div></section>
    <section className="surface-card schedule-table-card"><div className="surface-heading"><div><span className="surface-kicker">DETALLE DE LA CARGA</span><h2>{isCoordinator ? 'Grupos del programa' : 'Todas tus clases'}</h2></div><span className="surface-count">{visibleLoads.length} asignaciones</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>DÍA Y HORA</th><th>ASIGNATURA</th><th>DOCENTE</th><th>AULA</th><th>GRUPO</th>{isCoordinator && <th>ESTUDIANTES</th>}</tr></thead><tbody>{visibleLoads.map((assignment) => <tr key={assignment.id}><td><div className="stack-cell"><strong>{assignment.day}</strong><small>{assignment.start}–{assignment.end}</small></div></td><td><div className="stack-cell"><strong>{getEntity(data.subjects, assignment.subjectId)?.name || 'Asignatura'}</strong><small>{getEntity(data.subjects, assignment.subjectId)?.code}</small></div></td><td>{fullName(getEntity(data.people, assignment.teacherId))}</td><td>{getEntity(data.classrooms, assignment.classroomId)?.code}</td><td><Badge tone="purple">Grupo {assignment.group}</Badge></td>{isCoordinator && <td>{assignment.studentIds.length}</td>}</tr>)}</tbody></table>{visibleLoads.length === 0 && <div className="empty-table"><CalendarDays size={22} /><strong>{role === 'student' ? 'Tu horario todavía está vacío' : 'No hay grupos en este horario'}</strong><span>{role === 'student' ? 'Elige materias disponibles para crear tu horario académico.' : 'No hay asignaciones para mostrar en este periodo.'}</span></div>}</div></section>
    {modalOpen && <Modal title="Organiza tu horario" description="Selecciona los grupos disponibles para tu programa. Los cruces de día y hora se validan al guardar." onClose={() => setModalOpen(false)} footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={saveSchedule}>Guardar horario</Button></>}><div className="schedule-options">{availableLoads.map((assignment) => { const subject = getEntity(data.subjects, assignment.subjectId); const teacher = getEntity(data.people, assignment.teacherId); const classroom = getEntity(data.classrooms, assignment.classroomId); const checked = selectedIds.includes(assignment.id); return <label className={'schedule-option ' + (checked ? 'schedule-option-selected' : '')} key={assignment.id}><input type="checkbox" checked={checked} onChange={(event) => setSelectedIds((current) => event.target.checked ? [...current, assignment.id] : current.filter((id) => id !== assignment.id))} /><span className="schedule-option-copy"><strong>{subject?.name} · Grupo {assignment.group}</strong><small>{assignment.day} · {assignment.start}–{assignment.end} · {classroom?.code} · {fullName(teacher)}</small></span><Badge tone={checked ? 'blue' : 'neutral'}>{subject?.credits || 0} cr.</Badge></label> })}{availableLoads.length === 0 && <div className="empty-table"><CalendarDays size={22} /><strong>No hay grupos disponibles</strong><span>El coordinador debe publicar la carga académica de tu programa.</span></div>}{error && <div className="form-error">{error}</div>}</div></Modal>}
  </>
}
