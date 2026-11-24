import { useMemo, useState } from 'react'
import { Building2, DoorOpen, GraduationCap, Pencil, Plus, Trash2 } from 'lucide-react'
import { useAcademy } from '../context/AcademyContext.jsx'
import { Avatar, Badge, Button, ConfirmDialog, Field, Modal, PageHeading, SearchField, SelectField } from '../components/ui.jsx'
import { getEntity, newId } from '../utils.js'

const catalogMeta = {
  faculties: { title: 'Facultades', singular: 'facultad', icon: Building2, description: 'Unidades académicas que agrupan programas.' },
  programs: { title: 'Programas', singular: 'programa', icon: GraduationCap, description: 'Programas de formación ofrecidos por la institución.' },
  subjects: { title: 'Materias', singular: 'materia', icon: GraduationCap, description: 'Asignaturas de los planes de estudio.' },
  classrooms: { title: 'Aulas', singular: 'aula', icon: DoorOpen, description: 'Espacios físicos disponibles para la programación.' },
}

const initialForms = {
  faculties: { code: '', name: '', campus: 'Sede Centro', active: true },
  programs: { code: '', name: '', facultyId: 'fac-ingenieria', credits: 160, coordinatorId: '', active: true },
  subjects: { code: '', name: '', credits: 3, level: 1, programId: 'prog-sistemas', active: true },
  classrooms: { code: '', name: '', campus: 'Sede Centro', capacity: 30, sensorCode: '', active: true },
}

export default function CatalogsPage() {
  const { data, saveItem, removeItem, notify } = useAcademy()
  const [tab, setTab] = useState('faculties')
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState(initialForms.faculties)
  const [editing, setEditing] = useState(null)
  const [error, setError] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const meta = catalogMeta[tab]
  const items = data[tab]
  const Icon = meta.icon
  const filtered = useMemo(() => items.filter((item) => (item.name + ' ' + item.code).toLowerCase().includes(search.toLowerCase())), [items, search])
  const openNew = () => { setForm({ ...initialForms[tab], id: newId(tab.slice(0, -1)) }); setEditing(null); setError(''); setModalOpen(true) }
  const openEdit = (item) => { setForm({ ...initialForms[tab], ...item }); setEditing(item.id); setError(''); setModalOpen(true) }
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))

  const save = (event) => {
    event.preventDefault()
    if (!form.code?.trim() || !form.name?.trim()) { setError('El código y el nombre son obligatorios.'); return }
    if (items.some((item) => item.id !== form.id && item.code.toLowerCase() === form.code.toLowerCase())) { setError('Ya existe un registro con ese código.'); return }
    if (tab === 'programs' && !form.facultyId) { setError('Selecciona la facultad a la que pertenece el programa.'); return }
    if (tab === 'subjects' && !form.programId) { setError('Selecciona el programa que ofrece esta materia.'); return }
    saveItem(tab, { ...form, id: form.id || newId(tab.slice(0, -1)), credits: Number(form.credits || 0), level: Number(form.level || 0), capacity: Number(form.capacity || 0), active: form.active !== false })
    notify(editing ? 'El registro se actualizó correctamente.' : 'El registro se agregó a la oferta académica.')
    setModalOpen(false)
  }

  const askDelete = (item) => {
    const dependencies = tab === 'faculties' ? data.programs.some((program) => program.facultyId === item.id)
      : tab === 'programs' ? data.people.some((person) => person.programId === item.id) || data.subjects.some((subject) => subject.programId === item.id) || data.assignments.some((assignment) => assignment.programId === item.id)
        : tab === 'subjects' ? data.assignments.some((assignment) => assignment.subjectId === item.id) || data.microcurricula.some((micro) => micro.subjectId === item.id)
          : data.assignments.some((assignment) => assignment.classroomId === item.id)
    if (dependencies) { notify('No se puede eliminar: este registro está asociado a datos académicos.', 'error'); return }
    setPendingDelete(item)
  }

  const confirmDelete = () => {
    removeItem(tab, pendingDelete.id)
    notify('El registro se eliminó de la oferta académica.')
    setPendingDelete(null)
  }

  return <><PageHeading eyebrow="CONFIGURACIÓN INSTITUCIONAL" title="Oferta académica" description="Mantén la estructura que organiza la programación de cada periodo." action={<Button icon={Plus} onClick={openNew}>Nueva {meta.singular}</Button>}><span className="heading-subline"><span className="heading-green-dot" />{data.faculties.length} facultades <span className="heading-dot">·</span> {data.programs.length} programas <span className="heading-dot">·</span> {data.subjects.length} materias <span className="heading-dot">·</span> {data.classrooms.length} aulas</span></PageHeading>
    <div className="catalog-tabs">{Object.entries(catalogMeta).map(([key, item]) => <button key={key} className={tab === key ? 'catalog-tab-active' : ''} onClick={() => { setTab(key); setSearch('') }}><item.icon size={17} />{item.title}<span>{data[key].length}</span></button>)}</div>
    <section className="table-card catalog-card"><div className="catalog-toolbar"><div className="catalog-title"><span className="catalog-title-icon"><Icon size={18} /></span><div><strong>{meta.title}</strong><small>{meta.description}</small></div></div><SearchField value={search} onChange={setSearch} placeholder={'Buscar ' + meta.title.toLowerCase()} /></div><div className="table-scroll"><table className="data-table"><thead><tr>{tab === 'faculties' ? <><th>CÓDIGO</th><th>FACULTAD</th><th>SEDE</th><th>PROGRAMAS</th><th>ESTADO</th></> : tab === 'programs' ? <><th>CÓDIGO</th><th>PROGRAMA</th><th>FACULTAD</th><th>CRÉDITOS</th><th>COORDINADOR</th></> : tab === 'subjects' ? <><th>CÓDIGO</th><th>MATERIA</th><th>PROGRAMA</th><th>CRÉDITOS</th><th>NIVEL</th></> : <><th>CÓDIGO</th><th>AULA</th><th>SEDE</th><th>CAPACIDAD</th><th>SENSOR</th></>}<th className="actions-head">ACCIONES</th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}>{tab === 'faculties' ? <><td><span className="code-pill">{item.code}</span></td><td><div className="stack-cell"><strong>{item.name}</strong><small>Facultad académica</small></div></td><td>{item.campus}</td><td><Badge tone="blue">{data.programs.filter((program) => program.facultyId === item.id).length} programas</Badge></td><td><Badge tone={item.active ? 'mint' : 'neutral'} dot>{item.active ? 'Activa' : 'Inactiva'}</Badge></td></> : tab === 'programs' ? <><td><span className="code-pill">{item.code}</span></td><td><div className="stack-cell"><strong>{item.name}</strong><small>Plan de estudios · {item.credits} créditos</small></div></td><td>{getEntity(data.faculties, item.facultyId)?.name || 'Sin facultad'}</td><td>{item.credits}</td><td><div className="person-inline"><Avatar person={getEntity(data.people, item.coordinatorId)} size="tiny" tone="purple" />{getEntity(data.people, item.coordinatorId)?.firstName || 'Por asignar'}</div></td></> : tab === 'subjects' ? <><td><span className="code-pill">{item.code}</span></td><td><div className="stack-cell"><strong>{item.name}</strong><small>Asignatura</small></div></td><td>{getEntity(data.programs, item.programId)?.name || 'Sin programa'}</td><td>{item.credits}</td><td><Badge tone="purple">Nivel {item.level}</Badge></td></> : <><td><span className="code-pill">{item.code}</span></td><td><div className="stack-cell"><strong>{item.name}</strong><small>{item.sensorCode ? 'Sensor ' + item.sensorCode : 'Sin sensor asociado'}</small></div></td><td>{item.campus}</td><td>{item.capacity} estudiantes</td><td>{item.sensorCode ? <Badge tone="mint" dot>Conectado</Badge> : <Badge>Sin sensor</Badge>}</td></>}<td><div className="row-actions"><button className="icon-button" title="Editar" onClick={() => openEdit(item)}><Pencil size={16} /></button><button className="icon-button danger-icon" title="Eliminar" onClick={() => askDelete(item)}><Trash2 size={16} /></button></div></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="empty-table"><Icon size={23} /><strong>No hay registros en esta categoría</strong><span>Agrega el primer registro para comenzar a organizar tu oferta.</span></div>}</div><div className="table-pagination"><span>{filtered.length} {meta.title.toLowerCase()} visibles</span><span>Las relaciones académicas se validan al eliminar.</span></div></section>
    {modalOpen && <Modal title={(editing ? 'Editar ' : 'Nueva ') + meta.singular} description={meta.description} onClose={() => setModalOpen(false)} footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Cancelar</Button><Button onClick={save}>{editing ? 'Guardar cambios' : 'Crear registro'}</Button></>}><form className="form-grid" onSubmit={save}><Field label="Código institucional" value={form.code} onChange={(event) => update('code', event.target.value.toUpperCase())} required /><Field label="Nombre" value={form.name} onChange={(event) => update('name', event.target.value)} required />{tab === 'faculties' && <Field label="Sede" value={form.campus} onChange={(event) => update('campus', event.target.value)} />}{tab === 'programs' && <><SelectField label="Facultad" value={form.facultyId} onChange={(event) => update('facultyId', event.target.value)} options={data.faculties.map((faculty) => ({ value: faculty.id, label: faculty.name }))} /><Field label="Créditos del programa" type="number" min="1" max="300" value={form.credits} onChange={(event) => update('credits', event.target.value)} /><SelectField label="Coordinador" value={form.coordinatorId} onChange={(event) => update('coordinatorId', event.target.value)} placeholder="Sin asignar" options={data.people.filter((person) => person.role === 'coordinator').map((person) => ({ value: person.id, label: person.firstName + ' ' + person.lastName }))} /></>}{tab === 'subjects' && <><SelectField label="Programa" value={form.programId} onChange={(event) => update('programId', event.target.value)} options={data.programs.map((program) => ({ value: program.id, label: program.name }))} /><Field label="Créditos" type="number" min="1" max="20" value={form.credits} onChange={(event) => update('credits', event.target.value)} /><Field label="Nivel / semestre" type="number" min="1" max="12" value={form.level} onChange={(event) => update('level', event.target.value)} /></>}{tab === 'classrooms' && <><Field label="Sede" value={form.campus} onChange={(event) => update('campus', event.target.value)} /><Field label="Capacidad" type="number" min="1" value={form.capacity} onChange={(event) => update('capacity', event.target.value)} /><Field label="Código de sensor (opcional)" value={form.sensorCode} onChange={(event) => update('sensorCode', event.target.value.toUpperCase())} /></>}{error && <div className="form-error form-span-all">{error}</div>}</form></Modal>}
    {pendingDelete && <ConfirmDialog title="Eliminar registro" description={'¿Confirmas la eliminación de ' + pendingDelete.name + '?'} onCancel={() => setPendingDelete(null)} onConfirm={confirmDelete} />}
  </>
}
