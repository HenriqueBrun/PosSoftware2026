'use client'

import { useNotifications } from '@/hooks/useNotifications'

export default function NotificationBell() {
  const {
    permission,
    isSubscribed,
    isLoading,
    isSupported,
    subscribe,
    unsubscribe,
    sendTest,
  } = useNotifications()

  if (isSubscribed && !isLoading) {
    return null;
  }

  if (!isSupported) {
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.08)',
        color: 'var(--color-text-secondary)',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        🚫 Notificações não suportadas neste navegador
      </div>
    )
  }

  if (permission === 'denied') {
    return (
      <div style={{
        padding: '12px 16px',
        borderRadius: '8px',
        background: 'rgba(239, 68, 68, 0.08)',
        color: 'var(--color-danger)',
        fontSize: '13px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        🔇 Notificações bloqueadas. Habilite nas configurações do navegador.
      </div>
    )
  }

  return (
    <div style={{
      padding: '16px',
      borderRadius: '12px',
      background: isSubscribed
        ? 'rgba(34, 197, 94, 0.06)'
        : 'rgba(139, 92, 246, 0.06)',
      border: `1px solid ${isSubscribed ? 'rgba(34, 197, 94, 0.15)' : 'rgba(139, 92, 246, 0.15)'}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: isSubscribed
            ? 'rgba(34, 197, 94, 0.12)'
            : 'rgba(139, 92, 246, 0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          transition: 'all 0.3s ease',
        }}>
          {isSubscribed ? '🔔' : '🔕'}
        </div>
        <div>
          <p style={{
            margin: 0,
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}>
            {isSubscribed ? 'Notificações ativas' : 'Notificações desativadas'}
          </p>
          <p style={{
            margin: 0,
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
          }}>
            {isSubscribed
              ? 'Você será lembrado na hora de cada dose'
              : 'Ative para receber lembretes de medicação'}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
        {isSubscribed && (
          <button
            onClick={sendTest}
            disabled={isLoading}
            style={{
              background: 'transparent',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text-secondary)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: isLoading ? 'wait' : 'pointer',
              fontFamily: 'inherit',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap',
            }}
            title="Enviar notificação de teste"
          >
            🧪 Testar
          </button>
        )}

        <button
          onClick={isSubscribed ? unsubscribe : subscribe}
          disabled={isLoading}
          style={{
            background: isSubscribed
              ? 'transparent'
              : 'var(--color-primary)',
            border: isSubscribed
              ? '1px solid var(--color-danger)'
              : 'none',
            color: isSubscribed
              ? 'var(--color-danger)'
              : '#fff',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isLoading ? 'wait' : 'pointer',
            fontFamily: 'inherit',
            transition: 'all 0.2s ease',
            opacity: isLoading ? 0.6 : 1,
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading
            ? '⏳ ...'
            : isSubscribed
              ? '🔕 Desativar'
              : '🔔 Habilitar'}
        </button>
      </div>
    </div>
  )
}
