import { useMemo, useState } from 'react'
import { Activity, Download, Pencil, Plus, UserRound, UserRoundX, Users } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, Field, Modal, PageHeading, SearchField, SelectField } from '../components/ui.jsx'
import { exportCsv, fullName, getEntity, newId, roleNames } from '../utils.js'

const roleTone = { admin: 'blue', coordinator: 'purple', teacher: 'orange', student: 'mint' }
const emptyPerson = { role: 'student', firstName: '', lastName: '', document: '', documentType: 'Cédula', email: '', phone: '', city: 'Cartagena', department: 'Bolívar', birthDate: '', civilStatus: 'Soltero/a', programId: 'prog-sistemas', facultyId: 'fac-ingenieria', icfes: '', sisben: '', guardianName: '', guardianPhone: '', active: true }

export default function PeoplePage() {
  const { data, saveItem, notify } = useAcademy()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyPerson)
  const [error, setError] = useState('')

  const filtered = useMemo(() => data.people.filter((person) => {
    const text = (fullName(person) + ' ' + person.document + ' ' + person.email).toLowerCase()
    return (roleFilter === 'all' || person.role === roleFilter) && text.includes(search.toLowerCase())
  }), [data.people, roleFilter, search])

  const openNew = () => { setEditing(null); setForm({ ...emptyPerson, id: newId('person') }); setError(''); setModalOpen(true) }
  const openEdit = (person) => { setEditing(person.id); setForm({ ...emptyPerson, ...person }); setError(''); setModalOpen(true) }
  const update = (key, value) => setForm((current) => {
    const next = { ...current, [key]: value }
    if (key === 'programId' && value) next.facultyId = getEntity(data.programs, value)?.facultyId || ''
    return next
  })

  const submit = (event) => {
    event.preventDefault()
    const duplicate = data.people.some((person) => person.id !== form.id && (person.document === form.document || person.email.toLowerCase() === form.email.toLowerCase()))
    if (!form.firstName.trim() || !form.lastName.trim() || !form.document.trim() || !form.email.trim()) { setError('Completa nombre, apellido, documento y correo.'); return }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) { setError('Escribe un correo válido.'); return }
    if (duplicate) { setError('Ya existe una persona con ese documento o correo.'); return }
    saveItem('people', { ...form, id: form.id || newId('person'), icfes: form.icfes === '' ? '' : Number(form.icfes) })
    notify(editing ? 'Los datos de la persona se actualizaron.' : 'La persona quedó registrada en el directorio.')
    setModalOpen(false)
  }

  const toggleActive = (person) => {
    saveItem('people', { ...person, active: !person.active })
    notify(person.active ? 'La cuenta quedó inactiva.' : 'La cuenta quedó activa.')
  }

  const mockLookup = (kind) => {
    if (!form.document.trim()) { setError('Ingresa el documento para simular la consulta.'); return }
    if (kind === 'icfes') {
      const digits = form.document.split('').filter((char) => /\d/.test(char)).reduce((sum, char) => sum + Number(char), 0)
      update('icfes', 250 + digits % 151)
      notify('Consulta simulada ICFES completada.')
    } else {
      const groups = ['A2', 'A3', 'B1', 'B2', 'C1', 'C2', 'D1']
      const digits = form.document.split('').filter((char) => /\d/.test(char)).reduce((sum, char) => sum + Number(char), 0)
      update('sisben', groups[digits % groups.length])
      notify('Consulta simulada SISBEN completada.')
    }
    setError('')
  }

  return <><PageHeading eyebrow="GESTIÓN INSTITUCIONAL" title="Personas" description="Administra las cuentas de coordinadores, docentes y estudiantes del campus." action={<><Button variant="secondary" icon={Download} onClick={() => exportCsv('directorio-academico.csv', [['Nombre', 'Rol', 'Documento', 'Correo', 'Programa', 'Estado'], ...filtered.map((person) => [fullName(person), roleNames[person.role], person.document, person.email, getEntity(data.programs, person.programId)?.name || '', person.active ? 'Activo' : 'Inactivo'])])}>Exportar</Button><Button icon={Plus} onClick={openNew}>Nueva persona</Button></>}><span className="heading-subline"><span className="heading-green-dot" />{data.people.length} registros <span className="heading-dot">·</span> {data.people.filter((person) => person.active).length} cuentas activas</span></PageHeading>
    <div className="directory-controls"><div className="filter-tabs"><button className={roleFilter === 'all' ? 'filter-active' : ''} onClick={() => setRoleFilter('all')}>Todos <span>{data.people.length}</span></button>{['student', 'teacher', 'coordinator', 'admin'].map((role) => <button key={role} className={roleFilter === role ? 'filter-active' : ''} onClick={() => setRoleFilter(role)}>{roleNames[role]} <span>{data.people.filter((person) => person.role === role).length}</span></button>)}</div><div className="control-search"><SearchField value={search} onChange={setSearch} placeholder="Buscar por nombre o documento" /></div></div>
    <section className="table-card"><div className="table-card-heading"><div><Users size={18} /><strong>Directorio académico</strong><span>{filtered.length} resultados</span></div><button className="icon-button" title="Filtros"><span className="table-period">Periodo 2026-2</span></button></div><div className="table-scroll"><table className="data-table"><thead><tr><th>PERSONA</th><th>ROL</th><th>DOCUMENTO</th><th>PROGRAMA / CORREO</th><th>ESTADO</th><th className="actions-head">ACCIONES</th></tr></thead><tbody>{filtered.map((person) => <tr key={person.id}><td><div className="person-cell"><Avatar person={person} size="small" tone={roleTone[person.role]} /><span><strong>{fullName(person)}</strong><small>{person.city || 'Cartagena'}, {person.department || 'Bolívar'}</small></span></div></td><td><Badge tone={roleTone[person.role]}>{roleNames[person.role]}</Badge></td><td><span className="mono-cell">{person.document}</span></td><td><div className="stack-cell"><strong>{getEntity(data.programs, person.programId)?.name || person.email}</strong><small>{person.email}</small></div></td><td><Badge tone={person.active ? 'mint' : 'neutral'} dot>{person.active ? 'Activo' : 'Inactivo'}</Badge></td><td><div className="row-actions"><button className="icon-button" title="Editar persona" onClick={() => openEdit(person)}><Pencil size={16} /></button><button className="icon-button" title={person.active ? 'Desactivar cuenta' : 'Activar cuenta'} onClick={() => toggleActive(person)}>{person.active ? <UserRoundX size={16} /> : <UserRound size={16} />}</button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-table"><Users size={22} /><strong>No encontramos personas</strong><span>Prueba otra búsqueda o registra una nueva cuenta.</span></div>}</div><div className="table-pagination"><span>Mostrando <strong>{filtered.length}</strong> de <strong>{data.people.length}</strong> personas</span><span>Datos locales · modo demostración</span></div></section>
    {modalOpen && <Modal title={editing ? 'Editar persona' : 'Registrar persona'} description="Información de identificación y acceso al sistema académico." onClose={() => setModalOpen(false)} size="large" footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={submit}>{editing ? 'Guardar cambios' : 'Crear persona'}</Button></>}><form className="form-grid" onSubmit={submit}><SelectField label="Rol del sistema" value={form.role} onChange={(event) => update('role', event.target.value)} options={Object.entries(roleNames).map(([value, label]) => ({ value, label }))} /><Field label="Tipo de documento"><select value={form.documentType || 'Cédula'} onChange={(event) => update('documentType', event.target.value)}><option>Cédula</option><option>Tarjeta de identidad</option><option>Pasaporte</option><option>Cédula de extranjería</option></select></Field><Field label="Nombres" value={form.firstName} onChange={(event) => update('firstName', event.target.value)} required /><Field label="Apellidos" value={form.lastName} onChange={(event) => update('lastName', event.target.value)} required /><Field label="Número de documento" value={form.document} onChange={(event) => update('document', event.target.value)} required /><Field label="Fecha de nacimiento" type="date" value={form.birthDate} onChange={(event) => update('birthDate', event.target.value)} /><Field label="Correo electrónico" type="email" value={form.email} onChange={(event) => update('email', event.target.value)} required /><Field label="Celular" value={form.phone} onChange={(event) => update('phone', event.target.value)} /><Field label="Ciudad" value={form.city} onChange={(event) => update('city', event.target.value)} /><Field label="Departamento" value={form.department} onChange={(event) => update('department', event.target.value)} />{form.role === 'student' && <><SelectField label="Programa académico" value={form.programId} onChange={(event) => update('programId', event.target.value)} options={data.programs.map((program) => ({ value: program.id, label: program.name }))} /><div className="mock-lookup-row"><Field label="Puntaje ICFES" type="number" min="0" max="500" value={form.icfes} onChange={(event) => update('icfes', event.target.value)} hint="Resultado Saber 11 simulado." /><Button variant="secondary" size="small" icon={Activity} onClick={() => mockLookup('icfes')}>Consultar demo</Button></div><div className="mock-lookup-row"><Field label="Clasificación SISBEN" value={form.sisben} onChange={(event) => update('sisben', event.target.value)} hint="Grupo socioeconómico simulado." /><Button variant="secondary" size="small" icon={Activity} onClick={() => mockLookup('sisben')}>Consultar demo</Button></div><Field label="Nombre del acudiente" value={form.guardianName} onChange={(event) => update('guardianName', event.target.value)} /><Field label="Celular del acudiente" value={form.guardianPhone} onChange={(event) => update('guardianPhone', event.target.value)} /></>}{form.role === 'coordinator' && <SelectField label="Programa a cargo" value={form.programId} onChange={(event) => update('programId', event.target.value)} options={data.programs.map((program) => ({ value: program.id, label: program.name }))} />}{error && <div className="form-error form-span-all">{error}</div>}</form></Modal>}
  </>
}
