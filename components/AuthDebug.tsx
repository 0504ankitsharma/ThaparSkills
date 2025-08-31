'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function AuthDebug() {
  const { user, isLoaded, isSignedIn } = useUser()
  const [renderCount, setRenderCount] = useState(0)

  useEffect(() => {
    setRenderCount(prev => prev + 1)
  }, []) // Only run once on mount

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <div className="font-bold mb-2">Auth Debug (Render #{renderCount})</div>
      <div>isLoaded: {String(isLoaded)}</div>
      <div>isSignedIn: {String(isSignedIn)}</div>
      <div>user: {user ? '✅' : '❌'}</div>
      {user && (
        <div className="mt-2">
          <div>ID: {user.id}</div>
          <div>Name: {user.firstName || 'N/A'}</div>
        </div>
      )}
    </div>
  )
}
