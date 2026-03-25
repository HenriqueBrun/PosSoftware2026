'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUser, useAuth, SignOutButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { apiFetch } from '@/lib/api'

export default function DashboardPage() {
  const { user } = useUser()
  const { getToken } = useAuth()
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [todayDosesCount, setTodayDosesCount] = useState<number>(0)
  const [totalTakenCount, setTotalTakenCount] = useState<number>(0)
  const [totalSkippedCount, setTotalSkippedCount] = useState<number>(0)

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  const fetchTodayCounts = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
      const todayRes = await apiFetch<any[]>(`/api/v1/medications/events?startDate=${startOfDay.toISOString()}&endDate=${endOfDay.toISOString()}`, {
        headers
      });
      if (!todayRes.error && todayRes.data) {
        setTodayDosesCount(todayRes.data.length);
      }
    } catch (e) {
      console.error('Error fetching today counts:', e);
    }
  }, [getAuthHeaders])

  const fetchAllTimeCounts = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const allRes = await apiFetch<any[]>('/api/v1/medications/events', {
        headers
      });
      if (!allRes.error && allRes.data) {
        setTotalTakenCount(allRes.data.filter(e => e.status === 'TAKEN').length);
        setTotalSkippedCount(allRes.data.filter(e => e.status === 'SKIPPED').length);
      }
    } catch (e) {
      console.error('Error fetching all-time counts:', e);
    }
  }, [getAuthHeaders])

  const fetchUpcomingEvents = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      const evtsRes = await apiFetch<any[]>('/api/v1/medications/events/upcoming', {
        headers
      });
      if (!evtsRes.error && evtsRes.data) {
        setUpcomingEvents(evtsRes.data);
      }
    } catch (e) {
      console.error('Error fetching upcoming events:', e);
    }
  }, [getAuthHeaders])

  useEffect(() => {
    const fetchData = async () => {
      await Promise.all([
        fetchUpcomingEvents(),
        fetchTodayCounts(),
        fetchAllTimeCounts(),
      ]);
    }
    fetchData()
  }, [fetchUpcomingEvents, fetchTodayCounts, fetchAllTimeCounts])

  const handleUpdateStatus = async (eventId: string, newStatus: string) => {
    try {
      const headers = await getAuthHeaders()
      const res = await apiFetch(`/api/v1/medications/events/${eventId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.error) {
        setUpcomingEvents(prev => prev.filter(e => e.id !== eventId));
        if (newStatus === 'TAKEN') setTotalTakenCount(prev => prev + 1);
        if (newStatus === 'SKIPPED') setTotalSkippedCount(prev => prev + 1);

        await Promise.all([
          fetchUpcomingEvents(),
          fetchTodayCounts(),
          fetchAllTimeCounts(),
        ]);
      }
    } catch (e) {
      console.error('Error updating event status:', e);
    }
  };

  const userName = user?.firstName || user?.emailAddresses?.[0]?.emailAddress?.split('@')[0] || 'Usuário'

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
      <main style={{ flex: 1, padding: '40px 48px' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '4px' }}>
              Olá, {userName}! 👋
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
            { title: 'Doses Hoje', value: todayDosesCount.toString(), color: 'var(--color-primary)', icon: '☀️' },
            { title: 'Em Dia', value: totalTakenCount.toString(), color: 'var(--color-success)', icon: '✅' },
            { title: 'Atrasados / Pulados', value: totalSkippedCount.toString(), color: 'var(--color-danger)', icon: '❌' }
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
            {upcomingEvents.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '40px',
                  border: '1px dashed var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-secondary)'
                }}
              >
                Nenhuma dose programada.
              </div>
            ) : (
              upcomingEvents.map((event, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '16px 24px',
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      💊
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                        {event.medication?.name || 'Medicamento'}
                      </h4>
                      <p style={{ margin: 0, fontSize: '14px', color: 'var(--color-text-secondary)' }}>
                        {event.medication?.dosage || ''}
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: 'var(--color-primary)' }}>
                        {new Date(event.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
                        {new Date(event.time).toLocaleDateString()}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateStatus(event.id, 'SKIPPED')}
                        style={{ background: 'transparent', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Pular
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(event.id, 'TAKEN')}
                        style={{ background: 'var(--color-success)', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                        Tomar
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
