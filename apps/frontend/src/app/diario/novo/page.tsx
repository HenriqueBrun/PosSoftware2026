'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@clerk/nextjs'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import Sidebar from '@/components/Sidebar'

export default function NovoSintomaPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [medications, setMedications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    description: '',
    intensity: 'mild',
    medicationId: '',
  })

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  useEffect(() => {
    const fetchMedications = async () => {
      const headers = await getAuthHeaders()
      const res = await apiFetch<any[]>('/api/v1/medications', { headers })
      if (!res.error && res.data) {
        setMedications(res.data)
      }
    }
    fetchMedications()
  }, [getAuthHeaders])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const headers = await getAuthHeaders()
      const res = await apiFetch('/api/v1/symptoms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          ...formData,
          medicationId: formData.medicationId || undefined
        }),
      })

      if (!res.error) {
        router.push('/diario')
      } else {
        alert('Erro ao salvar sintoma: ' + (res.error as any).message)
      }
    } catch (error) {
      console.error('Error saving symptom:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '600px' }}>
        <header style={{ marginBottom: '32px' }}>
          <Link 
            href="/diario" 
            style={{ 
              color: 'var(--color-text-secondary)', 
              textDecoration: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px',
              fontSize: '14px'
            }}
          >
            ← Voltar para o Diário
          </Link>
          <h1 style={{ fontSize: '32px', fontWeight: 700, color: 'var(--color-text-primary)' }}>
            Como você está se sentindo?
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Registre seus sintomas para acompanhar sua evolução.</p>
        </header>

        <form 
          onSubmit={handleSubmit}
          className="mobile-stack"
          style={{ 
            background: 'var(--color-surface)', 
            border: '1px solid var(--color-border)', 
            borderRadius: '24px', 
            padding: '32px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px'
          }}
        >
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              O que você está sentindo?
            </label>
            <textarea
              required
              placeholder="Ex: Dor de cabeça leve, náuseas após o almoço..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                fontFamily: 'inherit',
                fontSize: '16px',
                resize: 'vertical'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '12px', color: 'var(--color-text-primary)' }}>
              Intensidade
            </label>
            <div className="grid-3-cols" style={{ gap: '12px' }}>
              {[
                { id: 'mild', label: 'Leve', color: '#10B981', emoji: '😌' },
                { id: 'moderate', label: 'Moderada', color: '#F59E0B', emoji: '😐' },
                { id: 'severe', label: 'Intensa', color: '#EF4444', emoji: '😫' },
              ].map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, intensity: lvl.id })}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    border: '2px solid',
                    borderColor: formData.intensity === lvl.id ? lvl.color : 'var(--color-border)',
                    background: formData.intensity === lvl.id ? `${lvl.color}10` : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <span style={{ fontSize: '24px' }}>{lvl.emoji}</span>
                  <span style={{ fontWeight: 600, color: formData.intensity === lvl.id ? lvl.color : 'var(--color-text-secondary)' }}>
                    {lvl.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', color: 'var(--color-text-primary)' }}>
              Associar a um Medicamento (Opcional)
            </label>
            <select
              value={formData.medicationId}
              onChange={(e) => setFormData({ ...formData, medicationId: e.target.value })}
              style={{
                width: '100%',
                padding: '16px',
                borderRadius: '12px',
                border: '1px solid var(--color-border)',
                background: 'var(--color-background)',
                color: 'var(--color-text-primary)',
                fontSize: '16px',
                appearance: 'none'
              }}
            >
              <option value="">Nenhum específico</option>
              {medications.map((m) => (
                <option key={m.id} value={m.id}>{m.name} ({m.dosage})</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '8px',
              padding: '18px',
              borderRadius: '12px',
              border: 'none',
              background: 'var(--color-primary)',
              color: 'white',
              fontSize: '16px',
              fontWeight: 700,
              cursor: 'pointer',
              opacity: loading ? 0.7 : 1,
              boxShadow: '0 4px 12px rgba(var(--color-primary-rgb), 0.3)'
            }}
          >
            {loading ? 'Salvando...' : 'Salvar Registro'}
          </button>
        </form>
        </div>
      </main>
    </div>
  )
}
