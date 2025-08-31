'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'

interface BackButtonProps {
  fallbackPath?: string
  className?: string
}

export default function BackButton({
  fallbackPath = '/dashboard',
  className = '',
}: BackButtonProps) {
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
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg shadow-sm bg-white hover:bg-primary/10 text-primary font-medium transition-all duration-200
        hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${className}
      `}
    >
      <div className="p-1 bg-primary/10 rounded-full flex items-center justify-center">
        <ArrowLeft size={18} className="text-primary" />
      </div>
      <span>Back</span>
    </button>
  )
}
