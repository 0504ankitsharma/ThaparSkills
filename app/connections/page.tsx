'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Users, Check, X, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import ConnectionItem from '@/components/ConnectionItem'
import { Loader2 } from 'lucide-react'

interface Connection {
  id: string
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  other_user: {
    id: string
    name: string
    profile_pic?: string
    roll_number: string
    department: string
  }
  is_sender: boolean
}

export default function ConnectionsPage() {
  const { user } = useUser()
  const router = useRouter()

  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'accepted' | 'rejected'>('all')

  const tabs = [
    { key: 'all', label: 'All', icon: Users },
    { key: 'pending', label: 'Pending', icon: Clock },
    { key: 'accepted', label: 'Accepted', icon: Check },
    { key: 'rejected', label: 'Rejected', icon: X },
  ]

  useEffect(() => {
    if (user) loadConnections()
  }, [user, activeTab])

  const loadConnections = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/connections?status=${activeTab}`)
      if (response.ok) {
        const data = await response.json()
        setConnections(data)
      }
    } catch (error) {
      console.error('Error loading connections:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectionUpdate = async (connectionId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const response = await fetch(`/api/connections/${connectionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        loadConnections()
      } else {
        throw new Error('Failed to update connection')
      }
    } catch (error) {
      console.error('Error updating connection:', error)
      alert('Failed to update connection. Please try again.')
    }
  }

  const getFilteredConnections = () => {
    if (activeTab === 'all') return connections
    return connections.filter(conn => conn.status === activeTab)
  }

  const getTabCount = (status: string) => {
    if (status === 'all') return connections.length
    return connections.filter(conn => conn.status === status).length
  }

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-neutral-600">
        <Loader2 className="w-8 h-8 animate-spin mr-2" />
        Loading user info...
      </div>
    )

  const filteredConnections = getFilteredConnections()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Connections</h1>
            <p className="text-sm sm:text-base text-gray-600">
              Manage your learning connections with fellow students
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${isActive ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                <Icon size={18} />
                {label}
                <span
                  className={`ml-1 px-2 py-0.5 text-xs rounded-full font-semibold ${
                    isActive ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {getTabCount(key)}
                </span>
              </button>
            )
          })}
        </div>

        {/* Connections List */}
        {loading ? (
          <div className="grid gap-4 py-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow animate-pulse">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="w-20 h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1">No connections found</h3>
            <p className="text-sm sm:text-base text-center max-w-xs">
              {activeTab === 'all'
                ? 'Start connecting with other students to see them here.'
                : `No ${activeTab} connections at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConnections.map(connection => (
              <ConnectionItem
                key={connection.id}
                connection={connection}
                onUpdate={handleConnectionUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
