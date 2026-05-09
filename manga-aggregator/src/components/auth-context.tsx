'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

interface AuthUser {
  name: string
  email: string
}

interface StoredUser extends AuthUser {
  password: string
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (email: string, password: string) => boolean
  register: (name: string, email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const SESSION_KEY = 'manga-aggregator-session'
const USERS_KEY = 'manga-aggregator-users'

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]') as StoredUser[]
  } catch {
    return []
  }
}

function saveStoredUsers(users: StoredUser[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

function saveSession(user: AuthUser | null) {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(SESSION_KEY)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const session = localStorage.getItem(SESSION_KEY)
    if (session) {
      try {
        setUser(JSON.parse(session) as AuthUser)
      } catch {
        setUser(null)
      }
    }
  }, [])

  const login = (email: string, password: string) => {
    const users = getStoredUsers()
    const matched = users.find((user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password)
    if (!matched) return false
    const authUser = { name: matched.name, email: matched.email }
    setUser(authUser)
    saveSession(authUser)
    return true
  }

  const register = (name: string, email: string, password: string) => {
    const users = getStoredUsers()
    if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return false
    }
    const newUser: StoredUser = { name, email, password }
    users.push(newUser)
    saveStoredUsers(users)
    const authUser = { name, email }
    setUser(authUser)
    saveSession(authUser)
    return true
  }

  const logout = () => {
    setUser(null)
    saveSession(null)
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      register,
      logout,
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
