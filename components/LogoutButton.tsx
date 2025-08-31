'use client'

import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface LogoutButtonProps {
  className?: string
}

export default function LogoutButton({ className = '' }: LogoutButtonProps) {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 font-medium
        hover:bg-red-100 hover:text-red-700 shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-red-300
        ${className}
      `}
    >
      <div className="p-1 bg-red-100 rounded-full flex items-center justify-center">
        <LogOut size={18} className="text-red-600" />
      </div>
      <span>Logout</span>
    </button>
  )
}
