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

  if (!user) return <div>Loading...</div>

  const filteredConnections = getFilteredConnections()

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">Connections</h1>
            <p className="text-neutral-600">Manage your learning connections with fellow students</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm p-2 mb-8 flex gap-2">
          {tabs.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key
            return (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                <Icon size={16} />
                {label}
                <span
                  className={`px-2 py-0.5 text-xs rounded-full ${
                    isActive ? 'bg-white/20' : 'bg-neutral-200 text-neutral-700'
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
          <div className="flex flex-col items-center justify-center py-12 text-neutral-600">
            <Loader2 className="w-6 h-6 animate-spin mb-2" />
            Loading connections...
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-neutral-500">
            <div className="w-20 h-20 bg-neutral-200 rounded-full flex items-center justify-center mb-4">
              <Users className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">No connections found</h3>
            <p className="text-sm">
              {activeTab === 'all'
                ? 'Start connecting with other students to see them here'
                : `No ${activeTab} connections at the moment`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredConnections.map((connection) => (
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
