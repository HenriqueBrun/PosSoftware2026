'use client'

import { useState, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'
import PrescriptionScanner from '@/components/PrescriptionScanner'
import Sidebar from '@/components/Sidebar'

export default function NovoMedicamentoPage() {
  const router = useRouter()
  const { getToken } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: '',
    startDate: '',
    startTime: '08:00',
    endDate: '',
    criticality: 'low',
    notifyApp: true,
    notifySms: false,
    notifyWa: false,
    notifyEmail: false,
    stock: '',
    lowStockAlert: '',
  })

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  const handleMedicationFromPrescription = useCallback((medication: {
    name: string
    dosage: string
    frequency: '4h' | '6h' | '8h' | '12h' | 'daily'
    criticality: 'low' | 'medium' | 'high'
    notes?: string
  }) => {
    setFormData(prev => ({
      ...prev,
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      criticality: medication.criticality,
    }))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const headers = await getAuthHeaders()

      // Combine date + time into a proper local Date so the timezone
      // offset is baked into the ISO string sent to the backend.
      // e.g. "2026-04-05" + "09:00" in BRT → "2026-04-05T12:00:00.000Z"
      const combinedStart = new Date(`${formData.startDate}T${formData.startTime}:00`)

      const response = await apiFetch('/api/v1/medications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          ...formData,
          stock: formData.stock ? parseInt(formData.stock) : undefined,
          lowStockAlert: formData.lowStockAlert ? parseInt(formData.lowStockAlert) : undefined,
          startDate: combinedStart.toISOString(),
          endDate: formData.endDate || undefined
        }),
      })

      if (response.error) {
        throw new Error((response as any).message || response.error || 'Falha ao salvar medicamento')
      }

      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar o medicamento.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="main-content">
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
              {/* Header Section */}
              <div className="flex flex-col gap-2 mb-10 px-2 text-center">
                <h1 className="text-4xl font-black tracking-tight" style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>Novo Medicamento</h1>
                <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>Configure seus lembretes e cuide bem de você.</p>
              </div>

              {/* Prescription Scanner */}
              <PrescriptionScanner
                onMedicationSelect={handleMedicationFromPrescription}
                getAuthHeaders={getAuthHeaders}
              />

              {error && (
                <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {/* Form Card */}
              <form onSubmit={handleSubmit} style={{ background: 'var(--color-surface)', borderRadius: '12px', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                {/* Basic Info Section */}
                <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>Informações Básicas</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Nome do Medicamento</span>
                      <input
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        placeholder="Ex: Paracetamol 500mg" type="text" />
                    </label>

                    <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Dosagem</span>
                        <input
                          required
                          value={formData.dosage}
                          onChange={e => setFormData({ ...formData, dosage: e.target.value })}
                          style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                          placeholder="Ex: 1 comprimido" type="text" />
                      </label>
                      <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Frequência</span>
                        <select
                          required
                          value={formData.frequency}
                          onChange={e => setFormData({ ...formData, frequency: e.target.value })}
                          style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}>
                          <option value="">Selecione...</option>
                          <option value="4h">A cada 4 horas</option>
                          <option value="6h">A cada 6 horas</option>
                          <option value="8h">A cada 8 horas</option>
                          <option value="12h">A cada 12 horas</option>
                          <option value="daily">Uma vez ao dia</option>
                          <option value="custom">Personalizado</option>
                        </select>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Estoque Section */}
                <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)', background: 'rgba(59, 130, 246, 0.03)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>Controle de Estoque (Opcional)</h3>
                  <div className="grid-2-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Quantidade em Estoque</span>
                      <input
                        value={formData.stock}
                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        placeholder="Ex: 30" type="number" />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Avisar quando restar</span>
                      <input
                        value={formData.lowStockAlert}
                        onChange={e => setFormData({ ...formData, lowStockAlert: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        placeholder="Ex: 5" type="number" />
                    </label>
                  </div>
                </div>

                {/* Schedule Section */}
                <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)', background: 'rgba(139, 92, 246, 0.03)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>Período do Tratamento</h3>
                  <div className="grid-3-cols" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px' }}>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Data de Início</span>
                      <input
                        required
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        type="date" />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Hora da Primeira Dose</span>
                      <input
                        required
                        value={formData.startTime}
                        onChange={e => setFormData({ ...formData, startTime: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        type="time" />
                    </label>
                    <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Data de Término (Opcional)</span>
                      <input
                        value={formData.endDate}
                        onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                        style={{ height: '48px', padding: '0 16px', borderRadius: '8px', border: '1px solid var(--color-border)', outline: 'none', background: 'var(--color-background)', color: 'var(--color-text-primary)' }}
                        type="date" />
                    </label>
                  </div>
                </div>

                {/* Criticality Section */}
                <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>Criticidade</h3>
                  <div style={{ display: 'flex', gap: '16px' }}>

                    {['low', 'medium', 'high'].map(crit => (
                      <div key={crit} style={{ flex: 1 }}>
                        <input
                          type="radio"
                          id={`crit-${crit}`}
                          name="criticality"
                          value={crit}
                          checked={formData.criticality === crit}
                          onChange={e => setFormData({ ...formData, criticality: e.target.value })}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor={`crit-${crit}`}
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '20px',
                            borderRadius: '16px',
                            border: `1px solid ${formData.criticality === crit ? 'var(--color-primary)' : 'var(--color-border)'}`,
                            background: formData.criticality === crit ? 'var(--color-primary)' : 'transparent',
                            color: formData.criticality === crit ? '#fff' : 'var(--color-text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <span style={{ fontSize: '24px', marginBottom: '8px' }}>💊</span>
                          <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            {crit === 'low' ? 'Baixa' : crit === 'medium' ? 'Média' : 'Alta'}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notificações Section */}
                <div style={{ padding: '32px', borderBottom: '1px solid var(--color-border)' }}>
                  <h3 style={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '24px' }}>Notificações</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.notifyApp}
                        onChange={e => setFormData({ ...formData, notifyApp: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>📱 Notificação no Aplicativo</span>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.notifyWa}
                        onChange={e => setFormData({ ...formData, notifyWa: e.target.checked })}
                        style={{ width: '20px', height: '20px', accentColor: 'var(--color-primary)' }}
                      />
                      <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>💬 WhatsApp</span>
                    </label>

                  </div>
                </div>

                {/* Form Actions */}
                <div className="mobile-stack" style={{ padding: '32px', background: 'rgba(0,0,0,0.02)', display: 'flex', gap: '16px' }}>
                  <button
                    type="button"
                    onClick={() => router.push('/dashboard')}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 'bold', cursor: 'pointer' }}>
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{ flex: 1, padding: '16px', borderRadius: '12px', border: 'none', background: 'var(--color-primary)', color: '#fff', fontWeight: 'bold', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? 'Salvando...' : 'Salvar Medicamento'}
                  </button>
                </div>
              </form>

        </div>
      </main>
    </div>
  )
}
