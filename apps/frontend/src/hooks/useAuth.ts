'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signup = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:3001/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Erro ao criar conta')
      }

      localStorage.setItem('pills_token', json.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const login = async (data: any) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`http://localhost:3001/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.message || 'Erro ao fazer login')
      }

      localStorage.setItem('pills_token', json.access_token)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('pills_token')
    router.push('/')
  }

  return { signup, login, logout, loading, error }
}
