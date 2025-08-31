'use client'

import { useUser } from '@clerk/nextjs'

export default function TestPage() {
  const { user, isLoaded, isSignedIn } = useUser()

  console.log('TestPage rendered:', { isLoaded, isSignedIn, userId: user?.id })

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Loading Test Page...
          </h1>
          <p className="text-neutral-600">
            Clerk is initializing...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">
          Test Page Working! ✅
        </h1>
        
        <div className="bg-white p-6 rounded-lg shadow-md text-left">
          <h2 className="text-xl font-semibold mb-4">Authentication Status:</h2>
          
          <div className="space-y-2 text-sm">
            <div><strong>isLoaded:</strong> {String(isLoaded)}</div>
            <div><strong>isSignedIn:</strong> {String(isSignedIn)}</div>
            <div><strong>User ID:</strong> {user?.id || 'None'}</div>
            <div><strong>User Name:</strong> {user?.firstName || 'None'}</div>
          </div>
          
          {isSignedIn && user ? (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-green-800 text-sm">
                ✅ Authentication working correctly!
              </p>
            </div>
          ) : (
            <div className="mt-4 p-3 bg-red-50 rounded-lg">
              <p className="text-red-800 text-sm">
                ❌ Authentication not working
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          <a href="/post-skill" className="btn-primary">
            Go to Post Skill Page
          </a>
        </div>
      </div>
    </div>
  )
}
