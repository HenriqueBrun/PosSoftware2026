'use client'

import { useAuth } from '@clerk/nextjs'
import { useCallback } from 'react'

/**
 * Hook that provides a function to get the current Clerk session token.
 * Use this to make authenticated API calls to the backend.
 */
export function useClerkToken() {
  const { getToken, isSignedIn } = useAuth()

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!isSignedIn) return null
    return await getToken()
  }, [getToken, isSignedIn])

  return { getAuthToken, isSignedIn }
}
