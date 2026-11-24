import { useState } from 'react'
import { Activity, BookOpenCheck, BookOpenText, CalendarDays, ChevronDown, ClipboardCheck, ClipboardList, GraduationCap, LayoutDashboard, LogOut, Menu, NotebookPen, PanelLeftClose, Settings2, ShieldCheck, Users, X } from 'lucide-react'
import { Avatar, Button, Toast } from './ui.jsx'
import { fullName, roleNames } from '../utils.js'

const navigation = {
  admin: [
    { label: 'Principal', items: [{ id: 'dashboard', text: 'Resumen', icon: LayoutDashboard }, { id: 'people', text: 'Personas', icon: Users }, { id: 'catalogs', text: 'Oferta académica', icon: BookOpenText }, { id: 'reports', text: 'Reportes', icon: ClipboardList }] },
  ],
  coordinator: [
    { label: 'Programa académico', items: [{ id: 'dashboard', text: 'Resumen', icon: LayoutDashboard }, { id: 'loads', text: 'Carga académica', icon: CalendarDays }, { id: 'curriculum', text: 'Microcurrículos', icon: BookOpenCheck }, { id: 'schedule', text: 'Horarios', icon: CalendarDays }, { id: 'reports', text: 'Seguimiento', icon: Activity }] },
  ],
  teacher: [
    { label: 'Mi docencia', items: [{ id: 'dashboard', text: 'Resumen', icon: LayoutDashboard }, { id: 'grades', text: 'Calificaciones', icon: NotebookPen }, { id: 'attendance', text: 'Asistencia', icon: ClipboardCheck }, { id: 'teacher-plan', text: 'Plan de clase', icon: BookOpenCheck }, { id: 'schedule', text: 'Mi horario', icon: CalendarDays }] },
  ],
  student: [
    { label: 'Mi espacio', items: [{ id: 'dashboard', text: 'Resumen', icon: LayoutDashboard }, { id: 'schedule', text: 'Mi horario', icon: CalendarDays }, { id: 'student-grades', text: 'Mis calificaciones', icon: NotebookPen }, { id: 'student-attendance', text: 'Mis asistencias', icon: ClipboardCheck }, { id: 'student-plan', text: 'Mi plan curricular', icon: BookOpenCheck }] },
  ],
}

function Sidebar({ person, role, activePage, onNavigate, open, onClose }) {
  return <>
    {open && <button className="mobile-scrim" aria-label="Cerrar navegación" onClick={onClose} />}
    <aside className={'sidebar ' + (open ? 'sidebar-open' : '')}>
      <div className="brand"><span className="brand-mark"><GraduationCap size={20} /></span><span><strong>{import.meta.env.VITE_APP_NAME || 'Campus Académico'}</strong><small>GESTIÓN UNIVERSITARIA</small></span><button className="sidebar-close" onClick={onClose} aria-label="Cerrar menú"><X size={18} /></button></div>
      <div className="institution-switch"><span className="institution-avatar">UC</span><span><strong>{import.meta.env.VITE_INSTITUTION_NAME || 'Universidad del Caribe'}</strong><small>Campus virtual</small></span><ChevronDown size={15} /></div>
      <div className="sidebar-scroll">
        {navigation[role]?.map((group) => <div className="nav-group" key={group.label}><div className="nav-label">{group.label}</div>{group.items.map(({ id, text, icon: Icon }) => <button key={id} className={'nav-item ' + (activePage === id ? 'nav-item-active' : '')} onClick={() => { onNavigate(id); onClose() }}><Icon size={17} strokeWidth={1.8} /><span>{text}</span>{id === 'attendance' && <span className="nav-dot" />}</button>)}</div>)}
      </div>
      <div className="sidebar-footer"><div className="term-chip"><span className="term-dot" /><span><small>PERIODO ACTIVO</small><strong>{import.meta.env.VITE_DEFAULT_PERIOD || '2026-2'}</strong></span><Settings2 size={15} /></div><div className="sidebar-user"><Avatar person={person} tone="mint" /><div className="sidebar-user-copy"><strong>{fullName(person)}</strong><small>{roleNames[role]}</small></div><ShieldCheck size={16} className="sidebar-shield" /></div></div>
    </aside>
  </>
}

function Topbar({ person, role, onLogout, onMenu }) {
  const today = new Intl.DateTimeFormat('es-CO', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
  return <header className="topbar"><button className="mobile-menu icon-button" onClick={onMenu} aria-label="Abrir menú"><Menu size={20} /></button><div className="breadcrumb"><span>Campus</span><span className="breadcrumb-slash">/</span><strong>{roleNames[role]}</strong></div><div className="topbar-right"><div className="topbar-date"><span className="topbar-live" />{today}</div><div className="topbar-divider" /><button className="profile-button" onClick={onLogout} title="Cerrar sesión"><Avatar person={person} size="small" /><span><strong>{person.firstName}</strong><small>Cerrar sesión</small></span><LogOut size={15} /></button></div></header>
}

export function AppShell({ person, role, activePage, onNavigate, onLogout, children, toast, onCloseToast }) {
  const [menuOpen, setMenuOpen] = useState(false)
  return <div className="app-shell"><Sidebar person={person} role={role} activePage={activePage} onNavigate={onNavigate} open={menuOpen} onClose={() => setMenuOpen(false)} /><div className="app-column"><Topbar person={person} role={role} onLogout={onLogout} onMenu={() => setMenuOpen(true)} /><main className="main-content">{children}</main></div><Toast toast={toast} onClose={onCloseToast} /></div>
}

export function LoginScreen({ onLogin, people }) {
  const [selected, setSelected] = useState('stu-1')
  const [password, setPassword] = useState('demo123')
  const [error, setError] = useState('')
  const accounts = [
    { id: 'adm-1', role: 'Administrador', access: 'Gestión institucional', color: 'blue' },
    { id: 'coord-1', role: 'Coordinación', access: 'Planeación académica', color: 'purple' },
    { id: 'teach-1', role: 'Docente', access: 'Docencia y evaluación', color: 'orange' },
    { id: 'stu-1', role: 'Estudiante', access: 'Portal estudiantil', color: 'green' },
  ]
  const submit = (event) => {
    event.preventDefault()
    if (password !== 'demo123') { setError('La clave de demostración es demo123.'); return }
    onLogin(selected)
  }
  return <div className="login-page"><div className="login-hero"><div className="login-brand"><span className="brand-mark"><GraduationCap size={21} /></span><strong>{import.meta.env.VITE_APP_NAME || 'Campus Académico'}</strong></div><div className="login-story"><span className="login-kicker"><span /> PLATAFORMA ACADÉMICA INTEGRAL</span><h1>Todo tu mundo<br /><em>académico,</em><br />en un solo lugar.</h1><p>Un espacio conectado para planear, enseñar y aprender durante todo el semestre.</p><div className="login-illustration"><div className="illustration-orbit orbit-one" /><div className="illustration-orbit orbit-two" /><div className="illustration-card card-schedule"><span className="illustration-mini-icon"><CalendarDays size={16} /></span><div><strong>Tu semana</strong><small>5 clases programadas</small></div><span className="mini-check">✓</span></div><div className="illustration-card card-progress"><span className="illustration-progress-icon"><Activity size={17} /></span><div><strong>Buen progreso</strong><small>Microcurrículo · 68%</small><span className="mini-progress"><i /></span></div></div><div className="illustration-bubble bubble-one">+</div><div className="illustration-bubble bubble-two">✳</div></div></div><div className="login-hero-footer"><span>EDUCACIÓN QUE CONECTA</span><span>© 2026 · CAMPUS ACADÉMICO</span></div></div><div className="login-panel"><form className="login-form" onSubmit={submit}><div className="login-heading"><span className="login-mobile-brand"><GraduationCap size={18} /> {import.meta.env.VITE_APP_NAME || 'Campus Académico'}</span><span className="eyebrow">BIENVENIDO DE NUEVO</span><h2>Inicia sesión</h2><p>Selecciona un perfil para entrar a la demo académica.</p></div><label className="field"><span className="field-label">Perfil de demostración</span><select value={selected} onChange={(event) => setSelected(event.target.value)}>{accounts.map((account) => { const person = people.find((item) => item.id === account.id); return <option value={account.id} key={account.id}>{account.role} · {person?.firstName} {person?.lastName}</option> })}</select></label><label className="field"><span className="field-label">Contraseña de demostración</span><input type="password" value={password} onChange={(event) => { setPassword(event.target.value); setError('') }} /></label>{error && <div className="login-error">{error}</div>}<Button type="submit" className="login-submit">Entrar al campus <span>→</span></Button><div className="login-divider"><span /> <small>O PRUEBA UN PERFIL</small> <span /></div><div className="demo-account-grid">{accounts.map((account) => { const person = people.find((item) => item.id === account.id); return <button key={account.id} type="button" className={'demo-account demo-' + account.color + (selected === account.id ? ' demo-account-selected' : '')} onClick={() => { setSelected(account.id); setError('') }}><span className="demo-icon"><GraduationCap size={16} /></span><span><strong>{account.role}</strong><small>{account.access}</small></span><span className="demo-radio">{selected === account.id && <i />}</span></button> })}</div><p className="login-footnote">Modo demostración · La información se guarda en este navegador.</p></form><div className="login-panel-footer"><span>Ayuda</span><span>Privacidad</span><span>© Universidad del Caribe</span></div></div></div>
}
