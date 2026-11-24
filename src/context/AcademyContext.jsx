import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { seedData, demoAccounts } from '../data/seed.js'

const AcademyContext = createContext(null)

const loadData = () => {
  try {
    const stored = localStorage.getItem('campus-academico.data')
    return stored ? { ...structuredClone(seedData), ...JSON.parse(stored) } : structuredClone(seedData)
  } catch {
    return structuredClone(seedData)
  }
}

const loadSession = () => {
  try { return JSON.parse(localStorage.getItem('campus-academico.session') || 'null') } catch { return null }
}

export function AcademyProvider({ children }) {
  const [data, setData] = useState(loadData)
  const [session, setSession] = useState(loadSession)
  const [toast, setToast] = useState(null)

  useEffect(() => { localStorage.setItem('campus-academico.data', JSON.stringify(data)) }, [data])
  useEffect(() => {
    if (session) localStorage.setItem('campus-academico.session', JSON.stringify(session))
    else localStorage.removeItem('campus-academico.session')
  }, [session])

  const notify = useCallback((message, kind = 'success') => {
    setToast({ id: Date.now(), message, kind })
    window.setTimeout(() => setToast((current) => current?.message === message ? null : current), 3200)
  }, [])
  const clearToast = useCallback(() => setToast(null), [])

  const updateCollection = useCallback((collection, updater) => {
    setData((current) => ({ ...current, [collection]: updater(current[collection] || []) }))
  }, [])

  const saveItem = useCallback((collection, item) => {
    updateCollection(collection, (items) => {
      const index = items.findIndex((existing) => existing.id === item.id)
      if (index === -1) return [item, ...items]
      return items.map((existing) => existing.id === item.id ? item : existing)
    })
  }, [updateCollection])

  const removeItem = useCallback((collection, id) => {
    updateCollection(collection, (items) => items.filter((item) => item.id !== id))
  }, [updateCollection])

  const login = useCallback((personId) => {
    const account = demoAccounts.find((item) => item.personId === personId)
    if (!account) return false
    setSession({ personId: account.personId, role: account.role })
    return true
  }, [])

  const logout = useCallback(() => setSession(null), [])
  const resetDemo = useCallback(() => {
    setData(structuredClone(seedData))
    setSession(null)
    localStorage.removeItem('campus-academico.data')
  }, [])

  const value = useMemo(() => ({ data, setData, session, login, logout, toast, notify, clearToast, updateCollection, saveItem, removeItem, resetDemo }), [data, session, login, logout, toast, notify, clearToast, updateCollection, saveItem, removeItem, resetDemo])
  return <AcademyContext.Provider value={value}>{children}</AcademyContext.Provider>
}

export const useAcademy = () => {
  const value = useContext(AcademyContext)
  if (!value) throw new Error('useAcademy debe utilizarse dentro de AcademyProvider')
  return value
}
