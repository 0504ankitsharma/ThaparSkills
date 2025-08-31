'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackPath?: string
  className?: string
}

export default function BackButton({ fallbackPath = '/dashboard', className = '' }: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(fallbackPath)
    }
  }

  return (
    <button
      onClick={handleBack}
      className={`flex items-center gap-2 text-primary hover:text-blue-700 transition-colors ${className}`}
    >
      <ArrowLeft size={20} />
      <span>Back</span>
    </button>
  )
}
