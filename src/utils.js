export const roleNames = {
  admin: 'Administrador',
  coordinator: 'Coordinador',
  teacher: 'Docente',
  student: 'Estudiante',
}

export const initials = (person) => {
  if (!person) return 'CA'
  return (person.firstName.slice(0, 1) + person.lastName.slice(0, 1)).toUpperCase()
}

export const fullName = (person) => person ? person.firstName + ' ' + person.lastName : 'Sin asignar'

export const getEntity = (items, id) => items.find((item) => item.id === id)

export const localDate = (value) => {
  if (!value) return '—'
  return new Intl.DateTimeFormat('es-CO', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(value + 'T12:00:00'))
}

export const scoreAverage = (grade) => {
  const scores = [grade?.partial1, grade?.partial2, grade?.partial3].filter((value) => value !== null && value !== '' && value !== undefined)
  return scores.length ? scores.reduce((sum, score) => sum + Number(score), 0) / scores.length : null
}

export const scoreLabel = (score) => score === null || score === undefined ? 'Pendiente' : Number(score).toFixed(1)

export const exportCsv = (filename, rows) => {
  const content = rows.map((row) => row.map((cell) => '"' + String(cell ?? '').replaceAll('"', '""') + '"').join(';')).join('\n')
  const blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export const newId = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 9)
