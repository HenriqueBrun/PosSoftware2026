'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

// Helpers
const getDaysInMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1)
  const days = []

  // Prev month filler
  const firstDay = date.getDay()
  const prevMonthDays = new Date(year, month, 0).getDate()
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDays - i, isCurrentMonth: false, monthOffset: -1 })
  }

  // Current month
  const currentMonthDays = new Date(year, month + 1, 0).getDate()
  for (let i = 1; i <= currentMonthDays; i++) {
    days.push({ day: i, isCurrentMonth: true, monthOffset: 0 })
  }

  // Next month filler
  const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, isCurrentMonth: false, monthOffset: 1 })
  }

  return days
}

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
]

const WEEK_DAYS = ['DOM.', 'SEG.', 'TER.', 'QUA.', 'QUI.', 'SEX.', 'SÁB.']

export default function AgendaPage() {
  const router = useRouter()
  const [userName, setUserName] = useState('Usuário')
  const [events, setEvents] = useState<any[]>([])

  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const days = getDaysInMonth(year, month)

  useEffect(() => {
    // Basic auth check
    const token = localStorage.getItem('pills_token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]))
        if (payload.email) {
          setUserName(payload.email.split('@')[0])
        }
      }
    } catch (e) { }

    const fetchEvents = async () => {
      try {
        const response = await apiFetch<any[]>('/api/v1/medications/events', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.error && response.data) {
          setEvents(response.data)
        }
      } catch (err) {
        console.error('Falha ao buscar eventos', err)
      }
    }
    fetchEvents()
  }, [router, month, year])

  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const goToday = () => setCurrentDate(new Date())

  const getEventsForDay = (d: any) => {
    const targetDate = new Date(year, month + d.monthOffset, d.day)
    return events.filter(evt => {
      if (evt.status !== 'PENDING') return false;
      const evtDate = new Date(evt.time)
      return evtDate.getFullYear() === targetDate.getFullYear() &&
             evtDate.getMonth() === targetDate.getMonth() &&
             evtDate.getDate() === targetDate.getDate()
    })
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', display: 'flex' }}>
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
              background: 'rgba(19, 127, 236, 0.1)',
              color: 'var(--color-primary)',
              fontWeight: 600,
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
      <main style={{ flex: 1, padding: '24px 32px', display: 'flex', flexDirection: 'column' }}>
        {/* Calendar Toolbar */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={goToday}
              style={{ padding: '8px 16px', borderRadius: '24px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)', fontWeight: 500, cursor: 'pointer' }}>
              Hoje
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={prevMonth}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                {'<'}
              </button>
              <button
                onClick={nextMonth}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid var(--color-border)', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-secondary)' }}>
                {'>'}
              </button>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 500, color: 'var(--color-text-primary)', margin: 0 }}>
              {MONTH_NAMES[month]} de {year}
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <select disabled
              style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--color-border)', background: 'transparent', color: 'var(--color-text-primary)' }}>
              <option>Mês</option>
            </select>
          </div>
        </header>

        {/* Calendar Grid */}
        <div style={{ flex: 1, border: '1px solid var(--color-border)', borderRadius: '12px', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--color-background)' }}>
          {/* Weekday Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-surface)' }}>
            {WEEK_DAYS.map((day, idx) => (
              <div key={idx} style={{ padding: '12px 8px', textAlign: 'center', fontSize: '11px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: 'minmax(120px, 1fr)', flex: 1 }}>
            {days.map((d, idx) => {
              // Highlight today
              const isToday = d.isCurrentMonth && d.day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();

              const dayEvents = getEventsForDay(d);
              
              // Count medications to group them
              const uniqueMeds = Array.from(new Set(dayEvents.map(e => e.medication?.name || 'Medicamento')));

              return (
                <div key={idx} style={{ borderRight: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', padding: '8px', display: 'flex', flexDirection: 'column', gap: '4px', background: d.isCurrentMonth ? 'transparent' : 'rgba(0,0,0,0.02)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '4px' }}>
                    <span style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '50%',
                      background: isToday ? 'var(--color-primary)' : 'transparent',
                      color: isToday ? '#fff' : (d.isCurrentMonth ? 'var(--color-text-primary)' : 'var(--color-text-secondary)'),
                      fontSize: '12px',
                      fontWeight: isToday ? 'bold' : 'normal'
                    }}>
                      {d.day}
                    </span>
                  </div>

                  {uniqueMeds.length > 0 && (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px', overflowY: 'auto' }}>
                      {uniqueMeds.map((medName, mIdx) => (
                         <div key={mIdx} style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', fontSize: '10px', padding: '4px 6px', borderRadius: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 600 }}>
                           {medName}
                         </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

      </main>
    </div>
  )
}
