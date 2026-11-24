import { useMemo, useState } from 'react'
import { Download, NotebookPen, Save } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, PageHeading, SearchField, SelectField } from '../components/ui.jsx'
import { exportCsv, fullName, getEntity, newId, scoreAverage, scoreLabel } from '../utils.js'

export default function GradesPage({ person }) {
  const { data, saveItem, notify } = useAcademy()
  const groups = data.assignments.filter((assignment) => assignment.teacherId === person.id)
  const [assignmentId, setAssignmentId] = useState(groups[0]?.id || '')
  const [search, setSearch] = useState('')
  const [drafts, setDrafts] = useState({})
  const assignment = getEntity(data.assignments, assignmentId) || groups[0]
  const subject = getEntity(data.subjects, assignment?.subjectId)
  const students = useMemo(() => data.people.filter((item) => assignment?.studentIds.includes(item.id) && item.role === 'student' && (fullName(item) + ' ' + item.document).toLowerCase().includes(search.toLowerCase())), [data.people, assignment, search])
  const gradeFor = (studentId) => data.grades.find((grade) => grade.studentId === studentId && grade.assignmentId === assignment?.id)
  const visibleGrades = students.map((student) => gradeFor(student.id)).filter(Boolean)
  const averageAll = visibleGrades.flatMap((grade) => [grade.partial1, grade.partial2, grade.partial3]).filter((score) => score !== null && score !== undefined).map(Number)
  const groupAverage = averageAll.length ? averageAll.reduce((sum, score) => sum + score, 0) / averageAll.length : null
  const pending = students.reduce((sum, student) => { const grade = gradeFor(student.id); return sum + (grade?.partial1 == null ? 1 : 0) + (grade?.partial2 == null ? 1 : 0) + (grade?.partial3 == null ? 1 : 0) }, 0)

  const currentScore = (studentId, field) => {
    const key = studentId + ':' + field
    return Object.hasOwn(drafts, key) ? drafts[key] : (gradeFor(studentId)?.[field] ?? '')
  }
  const saveScore = (student, field, value) => {
    const score = value === '' ? null : Number(value)
    if (score !== null && (Number.isNaN(score) || score < 0 || score > 5)) { notify('La nota debe estar entre 0.0 y 5.0.', 'error'); return }
    const previous = gradeFor(student.id) || { id: newId('grade'), studentId: student.id, assignmentId: assignment.id, partial1: null, partial2: null, partial3: null }
    saveItem('grades', { ...previous, [field]: score })
    setDrafts((current) => { const next = { ...current }; delete next[student.id + ':' + field]; return next })
    notify('La calificación de ' + fullName(student) + ' quedó guardada.')
  }

  return <><PageHeading eyebrow="EVALUACIÓN DOCENTE" title="Calificaciones" description="Registra los resultados de los tres parciales definidos en el microcurrículo." action={<Button variant="secondary" icon={Download} onClick={() => exportCsv('calificaciones-' + (subject?.code || 'grupo') + '.csv', [['Estudiante', 'Documento', 'Parcial 1', 'Parcial 2', 'Parcial 3', 'Promedio simple'], ...students.map((student) => { const grade = gradeFor(student.id); return [fullName(student), student.document, grade?.partial1 ?? '', grade?.partial2 ?? '', grade?.partial3 ?? '', scoreAverage(grade)?.toFixed(2) || ''] })])}>Exportar</Button>}><span className="heading-subline"><span className="heading-green-dot" />{subject?.name || 'Selecciona un grupo'} <span className="heading-dot">·</span> Periodo {assignment?.period || '2026-2'}</span></PageHeading>
    <div className="grade-toolbar"><div className="grade-group-select"><SelectField label="Grupo de clase" value={assignment?.id || ''} onChange={(event) => { setAssignmentId(event.target.value); setDrafts({}) }} options={groups.map((item) => ({ value: item.id, label: (getEntity(data.subjects, item.subjectId)?.name || 'Asignatura') + ' · Grupo ' + item.group + ' · ' + item.day }))} /></div><div className="grade-search"><SearchField value={search} onChange={setSearch} placeholder="Buscar estudiante" /></div></div>
    <div className="grade-stats"><div><span>Estudiantes en el grupo</span><strong>{assignment?.studentIds.length || 0}</strong></div><div><span>Promedio de notas registradas</span><strong>{groupAverage === null ? '—' : groupAverage.toFixed(2)}</strong></div><div><span>Calificaciones pendientes</span><strong>{pending}</strong></div><div className="grade-info"><NotebookPen size={17} /><span>Escala de evaluación<br /><strong>0.0 a 5.0</strong></span></div></div>
    <section className="table-card grade-table-card"><div className="table-card-heading"><div><NotebookPen size={18} /><strong>Registro de parciales</strong><span>{students.length} estudiantes</span></div><Badge tone="blue">Guardado automático</Badge></div><div className="table-scroll"><table className="data-table grade-table"><thead><tr><th>ESTUDIANTE</th><th>PARCIAL 1</th><th>PARCIAL 2</th><th>PARCIAL 3</th><th>PROMEDIO</th><th>ESTADO</th></tr></thead><tbody>{students.map((student) => { const grade = gradeFor(student.id); const average = scoreAverage(grade); const count = [grade?.partial1, grade?.partial2, grade?.partial3].filter((score) => score !== null && score !== undefined).length; return <tr key={student.id}><td><div className="person-cell"><Avatar person={student} size="small" tone="mint" /><span><strong>{fullName(student)}</strong><small>{student.document}</small></span></div></td>{['partial1', 'partial2', 'partial3'].map((field, index) => <td key={field}><div className="grade-input-wrap"><input className="grade-input" aria-label={'Parcial ' + (index + 1) + ' de ' + fullName(student)} type="number" min="0" max="5" step="0.1" placeholder="—" value={currentScore(student.id, field)} onChange={(event) => setDrafts((current) => ({ ...current, [student.id + ':' + field]: event.target.value }))} onBlur={(event) => saveScore(student, field, event.target.value)} /><span>/ 5.0</span></div></td>)}<td><span className={'grade-average ' + (average !== null && average >= 3 ? 'grade-passing' : '')}>{scoreLabel(average)}</span></td><td>{count === 3 ? <Badge tone={average >= 3 ? 'mint' : 'orange'} dot>{average >= 3 ? 'Aprobando' : 'En riesgo'}</Badge> : <Badge tone="neutral">{count}/3 parciales</Badge>}</td></tr> })}</tbody></table>{students.length === 0 && <div className="empty-table"><NotebookPen size={22} /><strong>No hay estudiantes en el grupo</strong><span>Asocia estudiantes a esta carga académica desde la planeación del periodo.</span></div>}</div><div className="table-pagination"><span>Haz clic en una nota y sal del campo para guardarla.</span><span><Save size={14} /> Los cambios se guardan en este navegador.</span></div></section><div className="grade-assumption"><span>i</span><p>El promedio mostrado es la media simple de los parciales que ya tienen nota. El enunciado no define ponderaciones; no se calcula una nota oficial definitiva.</p></div>
  </>
}
