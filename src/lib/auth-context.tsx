'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Survey {
  id: number
  title: string
  description: string | null
}

interface SessionData {
  surveyId: number
  expiresAt: string
}

interface AuthContextType {
  isAuthenticated: boolean
  survey: Survey | null
  session: SessionData | null
  currentPassword: string | null
  login: (password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const AUTH_STORAGE_KEY = 'survey_auth_session'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [survey, setSurvey] = useState<Survey | null>(null)
  const [session, setSession] = useState<SessionData | null>(null)
  const [currentPassword, setCurrentPassword] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Check session with server on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        const data = await response.json()
        
        if (data.isAuthenticated) {
          setIsAuthenticated(true)
          setSurvey(data.survey)
          setCurrentPassword(data.currentPassword)
          // Store in localStorage for client-side checks
          localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
            survey: data.survey,
            currentPassword: data.currentPassword
          }))
        } else {
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch (error) {
        console.error('Session check error:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      } finally {
        setLoading(false)
      }
    }
    
    checkSession()
  }, [])

  const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || 'Authentication failed' }
      }

      // Store session data
      const sessionData = {
        survey: data.survey,
        currentPassword: data.currentPassword,
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData))
      
      setIsAuthenticated(true)
      setSurvey(data.survey)
      setCurrentPassword(data.currentPassword)
      setSession(data.session || {})

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    }
    
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setSurvey(null)
    setSession(null)
    setCurrentPassword(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        survey,
        session,
        currentPassword,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}