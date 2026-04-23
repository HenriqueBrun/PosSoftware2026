'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import Sidebar from '@/components/Sidebar'

export default function DiarioPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [symptoms, setSymptoms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  const fetchSymptoms = useCallback(async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await apiFetch<any[]>('/api/v1/symptoms', { headers })
      if (!res.error && res.data) {
        setSymptoms(res.data)
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error)
    } finally {
      setLoading(false)
    }
  }, [getAuthHeaders])

  useEffect(() => {
    fetchSymptoms()
  }, [fetchSymptoms])

  const getIntensityInfo = (intensity: string) => {
    switch (intensity) {
      case 'mild': return { label: 'Leve', color: '#10B981', emoji: '😌' }
      case 'moderate': return { label: 'Moderada', color: '#F59E0B', emoji: '😐' }
      case 'severe': return { label: 'Intensa', color: '#EF4444', emoji: '😫' }
      default: return { label: intensity, color: 'var(--color-text-secondary)', emoji: '❓' }
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este registro?')) return

    try {
      const headers = await getAuthHeaders()
      const res = await apiFetch(`/api/v1/symptoms/${id}`, {
        method: 'DELETE',
        headers
      })
      if (!res.error) {
        setSymptoms(prev => prev.filter(s => s.id !== id))
      }
    } catch (error) {
      console.error('Error deleting symptom:', error)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Diário de Sintomas 📓
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Acompanhe como você se sente dia após dia.</p>
          </div>
          <Link
            href="/diario/novo"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              padding: '14px 28px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.2)'
            }}
          >
            ➕ Registrar Sintoma
          </Link>
        </header>

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
            <p style={{ color: 'var(--color-text-secondary)' }}>Carregando histórico...</p>
          </div>
        ) : symptoms.length === 0 ? (
          <div style={{ 
            background: 'var(--color-surface)', 
            border: '1px dashed var(--color-border)', 
            borderRadius: '24px', 
            padding: '80px', 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px'
          }}>
            <span style={{ fontSize: '48px' }}>✍️</span>
            <h2 style={{ fontSize: '20px', fontWeight: 600 }}>Nenhum registro ainda</h2>
            <p style={{ color: 'var(--color-text-secondary)', maxWidth: '300px' }}>
              Comece a registrar como você se sente para ter um histórico completo.
            </p>
          </div>
        ) : (
          <div className="grid-2-cols">
            {symptoms.map((symptom) => {
              const info = getIntensityInfo(symptom.intensity)
              return (
                <div
                  key={symptom.id}
                  style={{
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '20px',
                    padding: '24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', gap: '20px' }}>
                    <div style={{ 
                      width: '48px', 
                      height: '48px', 
                      borderRadius: '12px', 
                      background: `${info.color}15`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      fontSize: '24px'
                    }}>
                      {info.emoji}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                        <span style={{ 
                          fontSize: '12px', 
                          fontWeight: 700, 
                          color: info.color, 
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {info.label}
                        </span>
                        <span style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>
                          {new Date(symptom.createdAt).toLocaleString('pt-BR', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <p style={{ fontSize: '16px', color: 'var(--color-text-primary)', marginBottom: '8px', fontWeight: 500 }}>
                        {symptom.description}
                      </p>
                      {symptom.medication && (
                        <div style={{ 
                          display: 'inline-flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          background: 'rgba(0,0,0,0.05)', 
                          padding: '4px 10px', 
                          borderRadius: '6px',
                          fontSize: '12px',
                          color: 'var(--color-text-secondary)',
                          fontWeight: 600
                        }}>
                          💊 {symptom.medication.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(symptom.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                      padding: '8px',
                      opacity: 0.5,
                      transition: 'opacity 0.2s ease'
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
                    onMouseOut={(e) => (e.currentTarget.style.opacity = '0.5')}
                  >
                    🗑️
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
