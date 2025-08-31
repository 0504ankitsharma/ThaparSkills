'use client'

import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, Users, User, Settings, Menu, X } from 'lucide-react'
import LogoutButton from './LogoutButton'
import { useState } from 'react'

export default function Navbar() {
  const { user } = useUser()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/post-skill', label: 'Post Skill', icon: Plus },
    { href: '/connections', label: 'Connections', icon: Users },
    { href: '/profile', label: 'Profile', icon: User },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  if (!user) return null

  const renderNavLink = (item: typeof navItems[0], isMobile = false) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    return (
      <Link
        key={item.href}
        href={item.href}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
            : 'text-neutral-900 hover:bg-neutral-100'
        } ${isMobile ? 'text-base w-full' : ''}`}
        onClick={() => isMobile && setMobileOpen(false)}
      >
        <Icon size={18} />
        {item.label}
      </Link>
    )
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary-dark rounded-lg flex items-center justify-center shadow-md">
                <span className="text-white font-bold text-lg">TS</span>
              </div>
              <span className="text-2xl font-bold text-primary">ThaparSkills</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => renderNavLink(item))}
          </div>

          {/* User info & logout */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-sm">
                <span className="text-neutral-900 font-semibold text-sm">
                  {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0]?.toUpperCase()}
                </span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-neutral-900">
                {user.firstName || 'User'}
              </span>
            </div>
            <LogoutButton />
          </div>

          {/* Mobile toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-2 rounded-md hover:bg-neutral-100 transition-colors"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden px-4 pt-2 pb-3 space-y-2 bg-white shadow-lg border-t border-neutral-100 animate-slide-down">
          {navItems.map((item) => renderNavLink(item, true))}
          <div className="pt-2 border-t border-neutral-100">
            <LogoutButton className="w-full justify-start" />
          </div>
        </div>
      )}
    </nav>
  )
}
