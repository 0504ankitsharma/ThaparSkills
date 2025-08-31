'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Users, Check, X, MessageSquare, Clock } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import ConnectionItem from '@/components/ConnectionItem'

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

  useEffect(() => {
    if (user) {
      loadConnections()
    }
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        // Reload connections
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

  if (!user) {
    return <div>Loading...</div>
  }

  const filteredConnections = getFilteredConnections()

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Connections
            </h1>
            <p className="text-neutral-600">
              Manage your learning connections with fellow students
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md p-1 mb-8">
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All', icon: Users },
              { key: 'pending', label: 'Pending', icon: Clock },
              { key: 'accepted', label: 'Accepted', icon: Check },
              { key: 'rejected', label: 'Rejected', icon: X },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.key
              const count = getTabCount(tab.key)
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                  <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Connections List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading connections...</p>
          </div>
        ) : filteredConnections.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Users className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No connections found
            </h3>
            <p className="text-neutral-600">
              {activeTab === 'all'
                ? 'Start connecting with other students to see connections here'
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
