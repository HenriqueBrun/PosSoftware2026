import Link from 'next/link'
import { apiFetch } from '@/lib/api'

interface HealthData {
  status: string
  service: string
  timestamp: string
}

async function getApiHealth(): Promise<HealthData | null> {
  const { data } = await apiFetch<HealthData>('/api/v1/health', {
    cache: 'no-store',
  })
  return data
}

export default async function HomePage() {
  const health = await getApiHealth()

  const isOnline = health?.status === 'ok'

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '32px',
        padding: '24px',
        background: 'var(--color-background)',
      }}
    >
      {/* Logo */}
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            boxShadow: '0 8px 24px rgba(19,127,236,0.3)',
          }}
        >
          <span style={{ fontSize: '28px' }}>💊</span>
        </div>
        <h1
          style={{
            fontSize: '36px',
            fontWeight: 700,
            color: 'var(--color-primary)',
            letterSpacing: '-0.5px',
          }}
        >
          Pills
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: 'var(--color-text-secondary)',
            marginTop: '8px',
          }}
        >
          Nunca esqueça seus medicamentos novamente
        </p>
      </div>

      {/* API Status Card */}
      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: '12px',
          padding: '24px 32px',
          textAlign: 'center',
          minWidth: '320px',
        }}
      >
        <p
          style={{
            fontSize: '13px',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: 'var(--color-text-secondary)',
            marginBottom: '12px',
          }}
        >
          Status da API
        </p>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isOnline
              ? 'rgba(34,197,94,0.1)'
              : 'rgba(239,68,68,0.1)',
            color: isOnline ? 'var(--color-success)' : 'var(--color-danger)',
            borderRadius: '999px',
            padding: '6px 16px',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: isOnline
                ? 'var(--color-success)'
                : 'var(--color-danger)',
              display: 'inline-block',
            }}
          />
          {isOnline ? 'Online' : 'Offline'}
        </div>

        {health && (
          <p
            style={{
              fontSize: '12px',
              color: 'var(--color-text-secondary)',
              marginTop: '12px',
            }}
          >
            {health.service} &bull;{' '}
            {new Date(health.timestamp).toLocaleTimeString('pt-BR')}
          </p>
        )}
      </div>

      {/* CTA Buttons */}
      <div style={{ display: 'flex', gap: '12px' }}>
        <Link
          href="/sign-up"
          style={{
            background: 'var(--color-primary)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            padding: '12px 28px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Criar Conta
        </Link>
        <Link
          href="/sign-in"
          style={{
            background: 'transparent',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            textDecoration: 'none',
            borderRadius: '12px',
            padding: '12px 28px',
            fontSize: '15px',
            fontWeight: 600,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Entrar
        </Link>
      </div>
    </main>
  )
}
