import { useMemo, useState } from 'react'
import { CheckCheck, ClipboardCheck, Download, Fingerprint, Plus, Radio, UserRoundCheck } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, Field, Modal, PageHeading, SelectField } from '../components/ui.jsx'
import { exportCsv, fullName, getEntity, localDate, newId } from '../utils.js'

const statusOptions = ['Presente', 'Tardanza', 'Ausente', 'Sin registro']
const statusTone = { Presente: 'mint', Tardanza: 'orange', Ausente: 'red', 'Sin registro': 'neutral' }

export default function AttendancePage({ person }) {
  const { data, saveItem, notify } = useAcademy()
  const groups = data.assignments.filter((item) => item.teacherId === person.id)
  const [assignmentId, setAssignmentId] = useState(groups[0]?.id || '')
  const [sessionId, setSessionId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [sessionForm, setSessionForm] = useState({ date: new Date().toISOString().slice(0, 10), topic: '' })
  const [sensorStudentId, setSensorStudentId] = useState('')
  const assignment = getEntity(data.assignments, assignmentId) || groups[0]
  const subject = getEntity(data.subjects, assignment?.subjectId)
  const classroom = getEntity(data.classrooms, assignment?.classroomId)
  const sessions = useMemo(() => data.attendanceSessions.filter((session) => session.assignmentId === assignment?.id).sort((a, b) => b.date.localeCompare(a.date)), [data.attendanceSessions, assignment])
  const selectedSession = sessions.find((session) => session.id === sessionId) || sessions[0]
  const records = selectedSession?.details || []
  const summary = {
    present: records.filter((detail) => detail.status === 'Presente').length,
    late: records.filter((detail) => detail.status === 'Tardanza').length,
    absent: records.filter((detail) => detail.status === 'Ausente').length,
    pending: records.filter((detail) => detail.status === 'Sin registro').length,
  }

  const createSession = (event) => {
    event.preventDefault()
    if (!sessionForm.topic.trim()) { notify('Escribe el tema de la sesión.', 'error'); return }
    const created = { id: newId('att'), assignmentId: assignment.id, date: sessionForm.date, topic: sessionForm.topic, status: 'Abierta', details: assignment.studentIds.map((studentId) => ({ id: newId('det'), studentId, status: 'Sin registro', time: '' })) }
    saveItem('attendanceSessions', created)
    setSessionId(created.id)
    setModalOpen(false)
    notify('Se abrió la sesión. Puedes registrar asistencia manual o simular el sensor.')
  }

  const updateDetail = (detailId, status) => {
    saveItem('attendanceSessions', { ...selectedSession, details: selectedSession.details.map((detail) => detail.id === detailId ? { ...detail, status, time: status === 'Ausente' || status === 'Sin registro' ? '' : new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false }) } : detail) })
    notify('El detalle de asistencia se actualizó.')
  }

  const simulateSensor = () => {
    if (!selectedSession || selectedSession.status !== 'Abierta') { notify('Abre una sesión para recibir marcaciones del sensor.', 'error'); return }
    if (!sensorStudentId) { notify('Selecciona una persona para simular la marcación.', 'error'); return }
    const existing = selectedSession.details.find((detail) => detail.studentId === sensorStudentId)
    const time = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
    const updated = existing ? selectedSession.details.map((detail) => detail.studentId === sensorStudentId ? { ...detail, status: 'Presente', time } : detail) : [...selectedSession.details, { id: newId('det'), studentId: sensorStudentId, status: 'Presente', time }]
    saveItem('attendanceSessions', { ...selectedSession, details: updated })
    notify('Marcación del sensor simulado recibida a las ' + time + '.')
  }

  const closeSession = () => {
    const completed = selectedSession.details.map((detail) => detail.status === 'Sin registro' ? { ...detail, status: 'Ausente' } : detail)
    saveItem('attendanceSessions', { ...selectedSession, status: 'Cerrada', details: completed })
    notify('La sesión se cerró y las personas sin marcación quedaron como ausentes.')
  }

  const exportSession = () => exportCsv('asistencia-' + (subject?.code || 'grupo') + '-' + selectedSession.date + '.csv', [['Estudiante', 'Documento', 'Estado', 'Hora'], ...records.map((detail) => { const student = getEntity(data.people, detail.studentId); return [fullName(student), student?.document || '', detail.status, detail.time] })])

  return <><PageHeading eyebrow="REGISTRO DE ASISTENCIA" title="Asistencia" description="Gestiona las sesiones por grupo y revisa las marcaciones del aula." action={<Button icon={Plus} onClick={() => { setSessionForm({ date: new Date().toISOString().slice(0, 10), topic: '' }); setModalOpen(true) }}>Nueva sesión</Button>}><span className="heading-subline"><span className="heading-green-dot" />{subject?.name || 'Selecciona un grupo'} <span className="heading-dot">·</span> {classroom?.code || 'Sin aula'} · Periodo {assignment?.period || '2026-2'}</span></PageHeading>
    <div className="attendance-controls"><SelectField label="Grupo de clase" value={assignment?.id || ''} onChange={(event) => { setAssignmentId(event.target.value); setSessionId('') }} options={groups.map((item) => ({ value: item.id, label: (getEntity(data.subjects, item.subjectId)?.name || 'Asignatura') + ' · Grupo ' + item.group + ' · ' + item.day }))} /><div className="session-picker"><span className="field-label">Sesión</span><div className="session-chips">{sessions.map((session) => <button key={session.id} className={'session-chip ' + (selectedSession?.id === session.id ? 'session-chip-active' : '')} onClick={() => setSessionId(session.id)}><span>{localDate(session.date)}</span><small>{session.status}</small></button>)}{sessions.length === 0 && <span className="muted-copy">Sin sesiones para este grupo.</span>}</div></div></div>
    {selectedSession ? <><div className="attendance-summary"><div><span className="attendance-stat-icon att-present"><UserRoundCheck size={18} /></span><span><small>PRESENTES</small><strong>{summary.present}</strong></span></div><div><span className="attendance-stat-icon att-late"><Radio size={18} /></span><span><small>TARDANZAS</small><strong>{summary.late}</strong></span></div><div><span className="attendance-stat-icon att-absent"><span>×</span></span><span><small>AUSENTES</small><strong>{summary.absent}</strong></span></div><div><span className="attendance-stat-icon att-pending"><ClipboardCheck size={18} /></span><span><small>SIN REGISTRO</small><strong>{summary.pending}</strong></span></div></div>
      <section className="sensor-panel"><span className={'sensor-panel-icon ' + (classroom?.sensorCode ? 'sensor-connected' : '')}><Fingerprint size={21} /></span><div className="sensor-copy"><strong>{classroom?.sensorCode ? 'Sensor de asistencia simulado' : 'Aula sin sensor asociado'}</strong><span>{classroom?.sensorCode ? 'Dispositivo ' + classroom.sensorCode + ' · ' + classroom.name : 'Asocia un código de sensor desde Oferta académica para habilitar la simulación.'}</span></div><div className="sensor-action"><select value={sensorStudentId} onChange={(event) => setSensorStudentId(event.target.value)} aria-label="Estudiante para marcar con sensor"><option value="">Seleccionar estudiante</option>{assignment?.studentIds.map((id) => { const student = getEntity(data.people, id); return <option key={id} value={id}>{fullName(student)}</option> })}</select><Button variant="secondary" icon={Fingerprint} onClick={simulateSensor} disabled={!classroom?.sensorCode || selectedSession.status !== 'Abierta'}>Simular marcación</Button></div></section>
      <section className="table-card attendance-table-card"><div className="table-card-heading"><div><ClipboardCheck size={18} /><strong>Lista de clase</strong><span>{records.length} registros</span></div><div className="attendance-header-actions"><Badge tone={selectedSession.status === 'Abierta' ? 'orange' : 'neutral'} dot>{selectedSession.status}</Badge><Button variant="secondary" size="small" icon={Download} onClick={exportSession}>Exportar lista</Button>{selectedSession.status === 'Abierta' && <Button size="small" icon={CheckCheck} onClick={closeSession}>Cerrar sesión</Button>}</div></div><div className="attendance-topic"><span>{selectedSession.topic}</span><span>{localDate(selectedSession.date)} · {assignment?.start}–{assignment?.end} · {classroom?.code}</span></div><div className="table-scroll"><table className="data-table"><thead><tr><th>ESTUDIANTE</th><th>DOCUMENTO</th><th>ESTADO DE ASISTENCIA</th><th>HORA DE REGISTRO</th></tr></thead><tbody>{records.map((detail) => { const student = getEntity(data.people, detail.studentId); return <tr key={detail.id}><td><div className="person-cell"><Avatar person={student} size="small" tone="mint" /><span><strong>{fullName(student)}</strong><small>{student?.email}</small></span></div></td><td><span className="mono-cell">{student?.document || '—'}</span></td><td>{selectedSession.status === 'Abierta' ? <select className="attendance-status-select" value={detail.status} onChange={(event) => updateDetail(detail.id, event.target.value)}>{statusOptions.map((status) => <option key={status}>{status}</option>)}</select> : <Badge tone={statusTone[detail.status] || 'neutral'} dot>{detail.status}</Badge>}</td><td>{detail.time || <span className="muted-copy">Sin marcación</span>}</td></tr> })}</tbody></table>{records.length === 0 && <div className="empty-table"><ClipboardCheck size={22} /><strong>Este grupo no tiene estudiantes inscritos</strong><span>Asocia estudiantes a la carga académica para registrar su asistencia.</span></div>}</div><div className="table-pagination"><span>Las asistencias son informativas y no bloquean el acceso al aula.</span><span>La marcación electrónica está simulada en el navegador.</span></div></section></> : <section className="surface-card empty-session"><span><ClipboardCheck size={22} /></span><h2>Empieza una nueva sesión</h2><p>Abre una sesión para pasar lista o simular el registro del sensor del aula.</p><Button icon={Plus} onClick={() => { setSessionForm({ date: new Date().toISOString().slice(0, 10), topic: '' }); setModalOpen(true) }}>Crear sesión de clase</Button></section>}
    {modalOpen && <Modal title="Nueva sesión de asistencia" description="Se creará una lista para todos los estudiantes del grupo seleccionado." onClose={() => setModalOpen(false)} footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={createSession}>Abrir sesión</Button></>}><form className="form-grid" onSubmit={createSession}><Field label="Fecha de la sesión" type="date" value={sessionForm.date} onChange={(event) => setSessionForm((current) => ({ ...current, date: event.target.value }))} /><Field label="Grupo seleccionado" value={(subject?.name || 'Asignatura') + ' · Grupo ' + (assignment?.group || '—')} readOnly /><Field label="Tema de clase" className="form-span-all"><input value={sessionForm.topic} onChange={(event) => setSessionForm((current) => ({ ...current, topic: event.target.value }))} placeholder="Ej. Modelado de casos de uso" required /></Field></form></Modal>}
  </>
}
