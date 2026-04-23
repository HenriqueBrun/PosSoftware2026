'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth, SignOutButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import Sidebar from '@/components/Sidebar'

interface Medication {
  id: string
  name: string
  dosage: string
  frequency: string
  startDate: string
  endDate: string | null
  criticality: 'low' | 'medium' | 'high'
}

export default function MedicamentosPage() {
  const { getToken } = useAuth()
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        setLoading(true)
        const headers = await getAuthHeaders()
        const response = await apiFetch('/api/v1/medications', {
          method: 'GET',
          headers,
        })

        if (response.error) {
          throw new Error(response.error)
        }

        setMedications((response.data as any) || [])
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar medicamentos.')
      } finally {
        setLoading(false)
      }
    }

    fetchMedications()
  }, [getAuthHeaders])

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este medicamento?')) return;

    try {
      const headers = await getAuthHeaders()
      const response = await apiFetch(`/api/v1/medications/${id}`, {
        method: 'DELETE',
        headers,
      })

      if (response.error) {
        throw new Error(response.error)
      }

      setMedications(medications.filter(med => med.id !== id));
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir medicamento.')
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />

      {/* Main Content */}
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Meus Medicamentos
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie todos os seus tratamentos cadastrados.</p>
          </div>
          <Link
            href="/medicamentos/novo"
            style={{
              background: 'var(--color-primary)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              textDecoration: 'none',
            }}
          >
            ➕ Novo Medicamento
          </Link>
        </header>

        {error && (
          <div style={{ padding: '16px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--color-danger)', borderRadius: '8px', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <span style={{ color: 'var(--color-text-secondary)' }}>Carregando...</span>
          </div>
        ) : medications.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: '60px 20px',
              border: '1px dashed var(--color-border)',
              borderRadius: '16px',
              background: 'var(--color-surface)'
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💊</div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '8px' }}>Nenhum medicamento</h3>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '24px' }}>Você ainda não possui medicamentos cadastrados.</p>
            <Link
              href="/medicamentos/novo"
              style={{
                textDecoration: 'none',
                color: 'var(--color-primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              Começar a cadastrar →
            </Link>
          </div>
        ) : (
          <div className="grid-3-cols">
            {medications.map((med) => (
              <div
                key={med.id}
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'rgba(139, 92, 246, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                      }}
                    >
                      💊
                    </div>
                    <div>
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-text-primary)' }}>{med.name}</h3>
                      <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>{med.dosage}</p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: med.criticality === 'high' ? 'rgba(239, 68, 68, 0.1)' : med.criticality === 'medium' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                      color: med.criticality === 'high' ? 'var(--color-danger)' : med.criticality === 'medium' ? 'var(--color-warning)' : 'var(--color-success)',
                    }}
                  >
                    {med.criticality === 'high' ? 'Alta' : med.criticality === 'medium' ? 'Média' : 'Baixa'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px 0', borderTop: '1px dashed var(--color-border)', borderBottom: '1px dashed var(--color-border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Frequência</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 600 }}>
                      {med.frequency === 'daily' ? 'Uma vez ao dia' : `A cada ${med.frequency}`}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Início</span>
                    <span style={{ color: 'var(--color-text-primary)' }}>
                      {new Date(med.startDate).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  {med.endDate && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontWeight: 500 }}>Término</span>
                      <span style={{ color: 'var(--color-text-primary)' }}>
                        {new Date(med.endDate).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <button
                    onClick={() => handleDelete(med.id)}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-danger)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-danger)',
                      cursor: 'pointer',
                    }}
                  >
                    Excluir
                  </button>
                  <Link
                    href={`/medicamentos/${med.id}/editar`}
                    style={{
                      background: 'transparent',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      padding: '8px 16px',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--color-text-secondary)',
                      cursor: 'pointer',
                      textDecoration: 'none',
                    }}
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
