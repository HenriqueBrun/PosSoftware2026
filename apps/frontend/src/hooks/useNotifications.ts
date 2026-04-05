'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'
import { apiFetch } from '@/lib/api'

type NotificationPermission = 'default' | 'granted' | 'denied'

interface UseNotificationsReturn {
  permission: NotificationPermission
  isSubscribed: boolean
  isLoading: boolean
  isSupported: boolean
  subscribe: () => Promise<void>
  unsubscribe: () => Promise<void>
  sendTest: () => Promise<void>
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export function useNotifications(): UseNotificationsReturn {
  const { getToken } = useAuth()
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  const isSupported =
    typeof window !== 'undefined' &&
    'serviceWorker' in navigator &&
    'PushManager' in window &&
    'Notification' in window

  const getAuthHeaders = useCallback(async (): Promise<Record<string, string>> => {
    const token = await getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }, [getToken])

  // Initialize: register service worker and check existing subscription
  useEffect(() => {
    if (!isSupported) {
      setIsLoading(false)
      return
    }

    const init = async () => {
      try {
        // Check current permission
        setPermission(Notification.permission as NotificationPermission)

        // Register service worker
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' })
        setRegistration(reg)

        // Check if already subscribed
        const existingSub = await reg.pushManager.getSubscription()
        setIsSubscribed(!!existingSub)
      } catch (error) {
        console.error('Failed to init notifications:', error)
      } finally {
        setIsLoading(false)
      }
    }

    init()
  }, [isSupported])

  // Subscribe to push notifications
  const subscribe = useCallback(async () => {
    if (!registration) return

    setIsLoading(true)
    try {
      // Request permission
      const result = await Notification.requestPermission()
      setPermission(result as NotificationPermission)

      if (result !== 'granted') {
        console.warn('Notification permission denied')
        setIsLoading(false)
        return
      }

      // Get VAPID public key
      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      if (!vapidKey) {
        console.error('VAPID public key not configured')
        setIsLoading(false)
        return
      }

      // Subscribe to push
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey).buffer as ArrayBuffer,
      })

      // Send subscription to backend
      const subJson = subscription.toJSON()
      const headers = await getAuthHeaders()
      const res = await apiFetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: JSON.stringify({
          endpoint: subJson.endpoint,
          keys: {
            p256dh: subJson.keys?.p256dh,
            auth: subJson.keys?.auth,
          },
        }),
      })

      if (!res.error) {
        setIsSubscribed(true)
        console.log('Push subscription saved successfully')
      } else {
        console.error('Failed to save subscription:', res.error)
      }
    } catch (error) {
      console.error('Failed to subscribe:', error)
    } finally {
      setIsLoading(false)
    }
  }, [registration, getAuthHeaders])

  // Unsubscribe from push notifications
  const unsubscribe = useCallback(async () => {
    if (!registration) return

    setIsLoading(true)
    try {
      const existingSub = await registration.pushManager.getSubscription()
      if (existingSub) {
        const endpoint = existingSub.endpoint

        // Unsubscribe from push service
        await existingSub.unsubscribe()

        // Remove from backend
        const headers = await getAuthHeaders()
        await apiFetch('/api/v1/notifications/unsubscribe', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...headers,
          },
          body: JSON.stringify({ endpoint }),
        })
      }

      setIsSubscribed(false)
      console.log('Push subscription removed')
    } catch (error) {
      console.error('Failed to unsubscribe:', error)
    } finally {
      setIsLoading(false)
    }
  }, [registration, getAuthHeaders])

  // Send a test notification
  const sendTest = useCallback(async () => {
    try {
      const headers = await getAuthHeaders()
      await apiFetch('/api/v1/notifications/test', {
        method: 'POST',
        headers,
      })
    } catch (error) {
      console.error('Failed to send test notification:', error)
    }
  }, [getAuthHeaders])

  return {
    permission,
    isSubscribed,
    isLoading,
    isSupported,
    subscribe,
    unsubscribe,
    sendTest,
  }
}
