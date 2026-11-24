import { useMemo, useState } from 'react'
import { CalendarDays, Clock3, DoorOpen, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, ConfirmDialog, Field, Modal, PageHeading, SearchField, SelectField } from '../components/ui.jsx'
import { fullName, getEntity, newId } from '../utils.js'

const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
const blankLoad = { programId: '', subjectId: '', teacherId: '', classroomId: '', group: 'A', day: 'Lunes', start: '08:00', end: '10:00', period: import.meta.env.VITE_DEFAULT_PERIOD || '2026-2', studentIds: [] }
const timeNumber = (time) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

export default function LoadsPage({ person }) {
  const { data, saveItem, removeItem, notify } = useAcademy()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(blankLoad)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const programId = person.programId || 'prog-sistemas'
  const programs = data.programs.filter((program) => person.role !== 'coordinator' || program.id === programId)
  const visibleLoads = data.assignments.filter((assignment) => person.role !== 'coordinator' || assignment.programId === programId)
  const filtered = useMemo(() => visibleLoads.filter((item) => {
    const text = [getEntity(data.subjects, item.subjectId)?.name, getEntity(data.people, item.teacherId) && fullName(getEntity(data.people, item.teacherId)), getEntity(data.classrooms, item.classroomId)?.name, item.group, item.day].join(' ').toLowerCase()
    return text.includes(search.toLowerCase())
  }), [visibleLoads, data.subjects, data.people, data.classrooms, search])
  const totalStudents = [...new Set(visibleLoads.flatMap((item) => item.studentIds))].length

  const openNew = () => { setForm({ ...blankLoad, programId: programs[0]?.id || '', subjectId: data.subjects.find((subject) => subject.programId === programs[0]?.id)?.id || '', id: newId('load') }); setEditing(null); setError(''); setModalOpen(true) }
  const openEdit = (load) => { setForm({ ...blankLoad, ...load }); setEditing(load.id); setError(''); setModalOpen(true) }
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const save = (event) => {
    event.preventDefault()
    if (!form.programId || !form.subjectId || !form.teacherId || !form.classroomId) { setError('Selecciona programa, materia, docente y aula.'); return }
    if (timeNumber(form.end) <= timeNumber(form.start)) { setError('La hora de cierre debe ser posterior a la hora de inicio.'); return }
    const conflict = data.assignments.find((item) => item.id !== form.id && item.period === form.period && item.day === form.day && (item.teacherId === form.teacherId || item.classroomId === form.classroomId) && timeNumber(form.start) < timeNumber(item.end) && timeNumber(form.end) > timeNumber(item.start))
    if (conflict) { setError('Hay un cruce de horario para el docente o el aula seleccionados.'); return }
    const subject = getEntity(data.subjects, form.subjectId)
    if (subject?.programId && subject.programId !== form.programId) { setError('La materia seleccionada no pertenece al programa indicado.'); return }
    saveItem('assignments', { ...form, id: form.id || newId('load'), studentIds: form.studentIds || [] })
    notify(editing ? 'La carga académica se actualizó.' : 'El grupo se agregó a la carga académica.')
    setModalOpen(false)
  }

  const deleteLoad = () => {
    removeItem('assignments', pendingDelete.id)
    notify('La asignación se eliminó de la carga.')
    setPendingDelete(null)
  }

  return <><PageHeading eyebrow="PLANEACIÓN DEL PERIODO" title="Carga académica" description="Programa grupos, docentes y espacios para construir horarios coherentes." action={<Button icon={Plus} onClick={openNew}>Nueva asignación</Button>}><span className="heading-subline"><span className="heading-green-dot" />Periodo 2026-2 <span className="heading-dot">·</span> {visibleLoads.length} grupos <span className="heading-dot">·</span> {totalStudents} estudiantes programados</span></PageHeading>
    <div className="load-summary"><div><span className="load-summary-icon load-blue"><CalendarDays size={18} /></span><span><small>GRUPOS PROGRAMADOS</small><strong>{visibleLoads.length}</strong></span></div><div><span className="load-summary-icon load-purple"><Users size={18} /></span><span><small>ESTUDIANTES INSCRITOS</small><strong>{totalStudents}</strong></span></div><div><span className="load-summary-icon load-orange"><DoorOpen size={18} /></span><span><small>AULAS EN USO</small><strong>{new Set(visibleLoads.map((item) => item.classroomId)).size}</strong></span></div><div><span className="load-summary-icon load-mint"><Clock3 size={18} /></span><span><small>HORAS / SEMANA</small><strong>{visibleLoads.reduce((sum, item) => sum + (timeNumber(item.end) - timeNumber(item.start)) / 60, 0)}</strong></span></div></div>
    <section className="table-card"><div className="table-card-heading"><div><CalendarDays size={18} /><strong>Programación por grupos</strong><span>{filtered.length} asignaciones</span></div><div className="load-search"><SearchField value={search} onChange={setSearch} placeholder="Buscar materia, docente o aula" /></div></div><div className="table-scroll"><table className="data-table"><thead><tr><th>ASIGNATURA</th><th>PROGRAMA / GRUPO</th><th>DOCENTE</th><th>HORARIO</th><th>AULA</th><th>ESTUDIANTES</th><th className="actions-head">ACCIONES</th></tr></thead><tbody>{filtered.map((load) => { const subject = getEntity(data.subjects, load.subjectId); const teacher = getEntity(data.people, load.teacherId); const room = getEntity(data.classrooms, load.classroomId); const program = getEntity(data.programs, load.programId); return <tr key={load.id}><td><div className="stack-cell"><strong>{subject?.name || 'Materia pendiente'}</strong><small>{subject?.code || '—'} · {subject?.credits || 0} créditos</small></div></td><td><div className="stack-cell"><strong>{program?.code} · {program?.name}</strong><small>Grupo {load.group} · {load.period}</small></div></td><td><div className="person-inline"><Avatar person={teacher} size="tiny" tone="blue" /><span className="person-inline-name">{fullName(teacher)}</span></div></td><td><div className="stack-cell"><strong>{load.day}, {load.start}–{load.end}</strong><small>{((timeNumber(load.end) - timeNumber(load.start)) / 60).toFixed(0)} horas semanales</small></div></td><td><div className="stack-cell"><strong>{room?.code || '—'}</strong><small>{room?.name || 'Aula sin asignar'}</small></div></td><td><Badge tone="blue">{load.studentIds.length} estudiantes</Badge></td><td><div className="row-actions"><button className="icon-button" title="Editar asignación" onClick={() => openEdit(load)}><Pencil size={16} /></button><button className="icon-button danger-icon" title="Eliminar asignación" onClick={() => setPendingDelete(load)}><Trash2 size={16} /></button></div></td></tr> })}</tbody></table>{filtered.length === 0 && <div className="empty-table"><CalendarDays size={22} /><strong>No hay asignaciones para mostrar</strong><span>Prueba otra búsqueda o crea una nueva asignación de grupo.</span></div>}</div><div className="table-pagination"><span>Los horarios de docentes y estudiantes se derivan de esta carga.</span><span>Se validan cruces de aula y docente en el mismo periodo.</span></div></section>
    {modalOpen && <Modal title={editing ? 'Editar asignación académica' : 'Crear asignación académica'} description="Una carga es la fuente de los horarios de docentes y estudiantes." onClose={() => setModalOpen(false)} size="large" footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={save}>{editing ? 'Guardar cambios' : 'Crear asignación'}</Button></>}><form className="form-grid" onSubmit={save}><SelectField label="Programa académico" value={form.programId} onChange={(event) => { update('programId', event.target.value); update('subjectId', data.subjects.find((subject) => subject.programId === event.target.value)?.id || '') }} options={programs.map((program) => ({ value: program.id, label: program.name }))} /><SelectField label="Materia" value={form.subjectId} onChange={(event) => update('subjectId', event.target.value)} options={data.subjects.filter((subject) => subject.programId === form.programId).map((subject) => ({ value: subject.id, label: subject.code + ' · ' + subject.name }))} /><SelectField label="Docente" value={form.teacherId} onChange={(event) => update('teacherId', event.target.value)} placeholder="Seleccionar docente" options={data.people.filter((item) => item.role === 'teacher' && item.active).map((teacher) => ({ value: teacher.id, label: fullName(teacher) }))} /><SelectField label="Aula" value={form.classroomId} onChange={(event) => update('classroomId', event.target.value)} placeholder="Seleccionar aula" options={data.classrooms.filter((room) => room.active).map((room) => ({ value: room.id, label: room.code + ' · ' + room.name }))} /><Field label="Grupo" value={form.group} onChange={(event) => update('group', event.target.value.toUpperCase())} /><SelectField label="Día" value={form.day} onChange={(event) => update('day', event.target.value)} options={days} /><Field label="Hora de inicio" type="time" value={form.start} onChange={(event) => update('start', event.target.value)} /><Field label="Hora de cierre" type="time" value={form.end} onChange={(event) => update('end', event.target.value)} /><Field label="Periodo académico" value={form.period} onChange={(event) => update('period', event.target.value)} /><label className="field form-span-all"><span className="field-label">Estudiantes inscritos</span><select multiple size="5" value={form.studentIds} onChange={(event) => update('studentIds', Array.from(event.target.selectedOptions, (option) => option.value))}>{data.people.filter((student) => student.role === 'student' && student.programId === form.programId).map((student) => <option key={student.id} value={student.id}>{fullName(student)} · {student.document}</option>)}</select><span className="field-hint">Usa Ctrl/Cmd para seleccionar más de una persona.</span></label>{error && <div className="form-error form-span-all">{error}</div>}</form></Modal>}
    {pendingDelete && <ConfirmDialog title="Eliminar grupo" description={'¿Confirmas eliminar ' + (getEntity(data.subjects, pendingDelete.subjectId)?.name || 'esta asignación') + ', grupo ' + pendingDelete.group + '?'} onCancel={() => setPendingDelete(null)} onConfirm={deleteLoad} />}
  </>
}
