'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Usuário')

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem('pills_token')
    if (!token) {
      router.push('/login')
      return
    }
    const fetchUser = async () => {
      if (!token) return
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/users/me`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        if (res.ok) {
          const data = await res.json()
          setUserName(data.name || data.email.split('@')[0])
        } else {
          try {
            const payload = JSON.parse(atob(token.split('.')[1]))
            if (payload.email) setUserName(payload.email.split('@')[0])
          } catch (e) { }
        }
      } catch (e) { }
    }

    fetchUser()
  }, [router])

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
              background: 'rgba(19, 127, 236, 0.1)',
              color: 'var(--color-primary)',
              fontWeight: 600,
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
        </nav>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            href="/perfil"
            style={{
              padding: '12px 16px',
              borderRadius: '8px',
              color: 'var(--color-primary)',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              background: 'transparent',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(19, 127, 236, 0.1)'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent'
            }}
          >
            ✏️ Editar Perfil
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem('pills_token')
              router.push('/')
            }}
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
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Olá, {userName} 👋
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>Aqui está o resumo dos seus medicamentos para hoje.</p>
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

        {/* Informational Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '48px' }}>
          {[
            { title: 'Doses Hoje', value: '0', color: 'var(--color-primary)', icon: '☀️' },
            { title: 'Atrasados', value: '0', color: 'var(--color-success)', icon: '✅' },
            { title: 'Estoque Baixo', value: '0', color: 'var(--color-danger)', icon: '⚠️' }
          ].map((card, idx) => (
            <div
              key={idx}
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
                borderRadius: '16px',
                padding: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '20px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '12px',
                  background: `rgba(0,0,0,0.04)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                }}
              >
                {card.icon}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {card.title}
                </p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: card.color }}>
                  {card.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Schedule List */}
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '24px' }}>
            Próximas Doses
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Lista vazia de medicamentos */}
            <div
              style={{
                textAlign: 'center',
                padding: '40px',
                border: '1px dashed var(--color-border)',
                borderRadius: '12px',
                color: 'var(--color-text-secondary)'
              }}
            >
              Nenhuma dose programada para hoje.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
