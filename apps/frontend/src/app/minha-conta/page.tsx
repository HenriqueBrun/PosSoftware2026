'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser, useAuth, SignOutButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

export default function MinhaContaPage() {
  const { user } = useUser()
  const { getToken } = useAuth()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  // Format phone as user types: (11) 99999-9999
  const formatPhone = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    if (digits.length <= 2) return digits
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(formatPhone(e.target.value))
  }

  // Load user data
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const headers = await getAuthHeaders()
        const res = await apiFetch<any>('/api/v1/users/me', { headers })
        if (!res.error && res.data) {
          setName(res.data.name || '')
          setPhone(res.data.phone ? formatPhone(res.data.phone) : '')
        }
      } catch (e) {
        console.error('Error loading profile:', e)
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [getAuthHeaders])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const headers = await getAuthHeaders()
      // Send raw digits to backend
      const rawPhone = phone.replace(/\D/g, '')

      const res = await apiFetch('/api/v1/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          name,
          phone: rawPhone || null,
        }),
      })

      if (res.error) {
        throw new Error(res.error)
      }

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil.')
    } finally {
      setSaving(false)
    }
  }

  const userName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Usuário'

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '16px' }}>Carregando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-background)', display: 'flex' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '260px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px', padding: '0 8px' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              background: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ fontSize: '18px' }}>💊</span>
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: 'var(--color-primary)' }}>Pills</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link
            href="/dashboard"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            🏠 Início
          </Link>
          <Link
            href="/medicamentos"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            💊 Medicamentos
          </Link>
          <Link
            href="/agenda"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'var(--color-text-secondary)',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            📅 Agenda
          </Link>
          <Link
            href="/minha-conta"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              background: 'rgba(19, 127, 236, 0.1)',
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            👤 Minha Conta
          </Link>
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ padding: '8px 16px' }}>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: 32, height: 32 },
                },
              }}
            />
          </div>

          <SignOutButton>
            <button
              style={{
                padding: '12px 16px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-danger)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                fontFamily: 'inherit',
              }}
            >
              🚪 Sair
            </button>
          </SignOutButton>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 48px', maxWidth: '720px' }}>
        <header style={{ marginBottom: '48px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
            Minha Conta 👤
          </h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie suas informações pessoais e preferências de notificação.</p>
        </header>

        {/* Success Message */}
        {success && (
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(34, 197, 94, 0.1)',
              border: '1px solid rgba(34, 197, 94, 0.3)',
              color: 'var(--color-success)',
              borderRadius: '12px',
              marginBottom: '24px',
              fontWeight: 600,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            ✅ Perfil atualizado com sucesso!
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div
            style={{
              padding: '14px 20px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--color-danger)',
              borderRadius: '12px',
              marginBottom: '24px',
              fontWeight: 600,
              fontSize: '14px',
            }}
          >
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info Card */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '24px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                margin: 0,
              }}>
                Informações Pessoais
              </h2>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {/* Email (read-only from Clerk) */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Email</span>
                <input
                  type="email"
                  readOnly
                  value={user?.emailAddresses?.[0]?.emailAddress || ''}
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    background: 'rgba(0,0,0,0.03)',
                    color: 'var(--color-text-secondary)',
                    cursor: 'not-allowed',
                    fontSize: '15px',
                  }}
                />
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Gerenciado pelo Clerk — não pode ser alterado aqui.
                </span>
              </label>

              {/* Name */}
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>Nome</span>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Seu nome completo"
                  style={{
                    height: '48px',
                    padding: '0 16px',
                    borderRadius: '10px',
                    border: '1px solid var(--color-border)',
                    outline: 'none',
                    background: 'var(--color-background)',
                    color: 'var(--color-text-primary)',
                    fontSize: '15px',
                    transition: 'border-color 0.2s',
                  }}
                />
              </label>
            </div>
          </div>

          {/* Phone & WhatsApp Card */}
          <div
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '16px',
              overflow: 'hidden',
              marginBottom: '32px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
            }}
          >
            <div style={{ padding: '24px 28px', borderBottom: '1px solid var(--color-border)' }}>
              <h2 style={{
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                color: 'var(--color-primary)',
                margin: 0,
              }}>
                WhatsApp & Telefone
              </h2>
            </div>

            <div style={{ padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                  Número de Telefone (WhatsApp)
                </span>
                <div style={{ position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '14px',
                      color: 'var(--color-text-secondary)',
                      fontWeight: 500,
                    }}
                  >
                    🇧🇷 +55
                  </span>
                  <input
                    type="tel"
                    id="phone-input"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    maxLength={16}
                    style={{
                      width: '100%',
                      height: '48px',
                      padding: '0 16px 0 80px',
                      borderRadius: '10px',
                      border: '1px solid var(--color-border)',
                      outline: 'none',
                      background: 'var(--color-background)',
                      color: 'var(--color-text-primary)',
                      fontSize: '15px',
                      transition: 'border-color 0.2s',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                  Usado para enviar lembretes de medicamentos via WhatsApp. Ative a opção &quot;WhatsApp&quot; ao cadastrar um medicamento.
                </span>
              </label>

              {/* WhatsApp info box */}
              <div
                style={{
                  padding: '16px 20px',
                  background: 'rgba(37, 211, 102, 0.08)',
                  borderRadius: '12px',
                  border: '1px solid rgba(37, 211, 102, 0.2)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '20px', flexShrink: 0 }}>💬</span>
                <div>
                  <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                    Como funciona?
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)', lineHeight: '1.5' }}>
                    Ao cadastrar um medicamento, marque a opção &quot;WhatsApp&quot; nas notificações.
                    Você receberá lembretes automáticos no seu WhatsApp no horário de cada dose.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            disabled={saving}
            id="save-profile-btn"
            style={{
              width: '100%',
              padding: '16px',
              borderRadius: '12px',
              border: 'none',
              background: saving ? 'var(--color-text-secondary)' : 'var(--color-primary)',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 700,
              cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s',
              boxShadow: saving ? 'none' : '0 4px 16px rgba(19, 127, 236, 0.3)',
            }}
          >
            {saving ? 'Salvando...' : 'Salvar Alterações'}
          </button>
        </form>
      </main>
    </div>
  )
}
