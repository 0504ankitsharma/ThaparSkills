'use client'

import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { User, Settings, LogOut } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useUser()
  const router = useRouter()

  useEffect(() => {
    // Redirect to user's own profile if they're authenticated
    if (user) {
      // This will redirect to their profile once they have one
      // For now, redirect to dashboard
      router.push('/dashboard')
    }
  }, [user, router])

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-neutral-600 mb-4">
            Please sign in to view your profile
          </p>
          <button
            onClick={() => router.push('/sign-in')}
            className="btn-primary"
          >
            Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Profile
          </h1>
          <p className="text-neutral-600">
            Redirecting to your profile...
          </p>
        </div>
      </div>
    </div>
  )
}
