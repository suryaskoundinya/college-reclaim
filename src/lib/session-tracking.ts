"use client"

let currentSessionId: string | null = null

export async function trackLogin(): Promise<void> {
  try {
    const response = await fetch('/api/session/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      const data = await response.json()
      currentSessionId = data.sessionId
      
      // Store session ID in sessionStorage for this browser session
      if (typeof window !== 'undefined' && currentSessionId) {
        sessionStorage.setItem('userSessionId', currentSessionId)
      }
    }
  } catch (error) {
    console.error('Failed to track login:', error)
  }
}

export async function trackLogout(): Promise<void> {
  try {
    // Get session ID from memory or sessionStorage
    const sessionId = currentSessionId || (typeof window !== 'undefined' ? sessionStorage.getItem('userSessionId') : null)

    await fetch('/api/session/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    })

    // Clear session ID
    currentSessionId = null
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('userSessionId')
    }
  } catch (error) {
    console.error('Failed to track logout:', error)
  }
}

// Track logout on page unload (browser close, tab close)
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    const sessionId = currentSessionId || sessionStorage.getItem('userSessionId')
    if (sessionId) {
      // Use sendBeacon for reliable tracking on page unload
      navigator.sendBeacon('/api/session/logout', JSON.stringify({ sessionId }))
    }
  })
}
