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
  const [loading, setLoading] = useState(true)

  // Load session from localStorage on mount
  useEffect(() => {
    const savedSession = localStorage.getItem(AUTH_STORAGE_KEY)
    if (savedSession) {
      try {
        const sessionData = JSON.parse(savedSession)
        const expiresAt = new Date(sessionData.session.expiresAt)
        
        if (expiresAt > new Date()) {
          setIsAuthenticated(true)
          setSurvey(sessionData.survey)
          setSession(sessionData.session)
        } else {
          // Session expired, clear it
          localStorage.removeItem(AUTH_STORAGE_KEY)
        }
      } catch (error) {
        console.error('Error parsing stored session:', error)
        localStorage.removeItem(AUTH_STORAGE_KEY)
      }
    }
    setLoading(false)
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
        session: data.session,
      }

      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(sessionData))
      
      setIsAuthenticated(true)
      setSurvey(data.survey)
      setSession(data.session)

      return { success: true }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY)
    setIsAuthenticated(false)
    setSurvey(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        survey,
        session,
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