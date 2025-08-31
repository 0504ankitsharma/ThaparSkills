'use client'

import { useClerk } from '@clerk/nextjs'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }

  return (
    <button
      onClick={handleSignOut}
      className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
    >
      <LogOut size={20} />
      <span>Logout</span>
    </button>
  )
}
