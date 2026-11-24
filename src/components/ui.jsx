import { useEffect } from 'react'
import { AlertCircle, Check, CheckCircle2, Info, X } from 'lucide-react'

export function Button({ children, variant = 'primary', size = 'normal', icon: Icon, className = '', type = 'button', onClick, disabled = false, ...props }) {
  return <button type={type} onClick={onClick} disabled={disabled} className={'button button-' + variant + ' button-' + size + ' ' + className} {...props}>
    {Icon && <Icon size={16} strokeWidth={1.9} />}{children}
  </button>
}

export function Avatar({ person, size = 'normal', tone = 'blue' }) {
  const initials = person ? (person.firstName.slice(0, 1) + person.lastName.slice(0, 1)).toUpperCase() : 'CA'
  return <span className={'avatar avatar-' + size + ' avatar-' + tone} aria-label={person?.firstName || 'Usuario'}>{initials}</span>
}

export function Badge({ children, tone = 'neutral', dot = false }) {
  return <span className={'badge badge-' + tone}>{dot && <span className="badge-dot" />}{children}</span>
}

export function PageHeading({ eyebrow, title, description, action, children }) {
  return <div className="page-heading">
    <div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1>{description && <p>{description}</p>}{children}</div>
    {action && <div className="page-heading-action">{action}</div>}
  </div>
}

export function Modal({ title, description, onClose, children, footer, size = 'normal' }) {
  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
    <section className={'modal modal-' + size} role="dialog" aria-modal="true" aria-label={title}>
      <header className="modal-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button className="icon-button" onClick={onClose} aria-label="Cerrar"><X size={19} /></button></header>
      <div className="modal-body">{children}</div>
      {footer && <footer className="modal-footer">{footer}</footer>}
    </section>
  </div>
}

export function Field({ label, hint, error, className = '', children, ...props }) {
  return <label className={'field ' + className}><span className="field-label">{label}</span>{children || <input {...props} />}{hint && <span className="field-hint">{hint}</span>}{error && <span className="field-error">{error}</span>}</label>
}

export function SelectField({ label, options, value, onChange, placeholder, className = '', ...props }) {
  return <label className={'field ' + className}><span className="field-label">{label}</span><select value={value ?? ''} onChange={onChange} {...props}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => typeof option === 'string' ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}
  </select></label>
}

export function SearchField({ value, onChange, placeholder = 'Buscar...', className = '' }) {
  return <div className={'search-field ' + className}><span className="search-icon"><svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg></span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} /></div>
}

export function EmptyState({ icon: Icon = Info, title, description, action }) {
  return <div className="empty-state"><span className="empty-icon"><Icon size={22} /></span><h3>{title}</h3><p>{description}</p>{action}</div>
}

export function Toast({ toast, onClose }) {
  if (!toast) return null
  const Icon = toast.kind === 'error' ? AlertCircle : toast.kind === 'info' ? Info : CheckCircle2
  return <div className={'toast toast-' + toast.kind} role="status"><Icon size={18} /><span>{toast.message}</span><button onClick={onClose} aria-label="Cerrar aviso"><X size={16} /></button></div>
}

export function ConfirmDialog({ title, description, onCancel, onConfirm }) {
  return <Modal title={title} description={description} onClose={onCancel} size="small" footer={<><Button variant="ghost" onClick={onCancel}>Cancelar</Button><Button variant="danger" icon={Check} onClick={onConfirm}>Eliminar registro</Button></>}>
    <div className="confirm-copy"><AlertCircle size={20} /><span>Esta acción se aplica de inmediato a los datos guardados en este navegador.</span></div>
  </Modal>
}
