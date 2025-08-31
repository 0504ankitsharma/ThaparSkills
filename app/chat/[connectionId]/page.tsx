'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Send, Calendar, Clock, MapPin } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'

interface Message {
  id: string
  sender_id: string
  message: string
  created_at: string
}

interface Connection {
  id: string
  other_user: {
    id: string
    name: string
    profile_pic?: string
  }
}

export default function ChatPage() {
  const { user } = useUser()
  const params = useParams()
  const connectionId = params.connectionId as string
  
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [connection, setConnection] = useState<Connection | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (connectionId) {
      loadConnection()
      loadMessages()
    }
  }, [connectionId])

  const loadConnection = async () => {
    try {
      const response = await fetch('/api/connections')
      if (response.ok) {
        const connections = await response.json()
        const conn = connections.find((c: any) => c.id === connectionId)
        if (conn) {
          setConnection(conn)
        }
      }
    } catch (error) {
      console.error('Error loading connection:', error)
    }
  }

  const loadMessages = async () => {
    try {
      const response = await fetch(`/api/chats/${connectionId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      }
    } catch (error) {
      console.error('Error loading messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !user) return

    try {
      const response = await fetch(`/api/chats/${connectionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: newMessage.trim(),
        }),
      })

      if (response.ok) {
        setNewMessage('')
        // Reload messages to show the new one
        loadMessages()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  if (!connection) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Navbar />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Connection Not Found</h1>
          <p className="text-neutral-600">The connection you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-neutral-900 font-semibold">
                {connection.other_user.name[0]}
              </span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">
                {connection.other_user.name}
              </h1>
              <p className="text-sm text-neutral-600">Chat</p>
            </div>
          </div>
        </div>

        {/* Chat Container */}
        <div className="card h-96 flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-neutral-600">Loading messages...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Send className="w-8 h-8 text-neutral-400" />
                </div>
                <p className="text-neutral-600">No messages yet</p>
                <p className="text-sm text-neutral-500">Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => {
                const isOwnMessage = message.sender_id === user.id
                return (
                  <div
                    key={message.id}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        isOwnMessage
                          ? 'bg-primary text-white'
                          : 'bg-neutral-200 text-neutral-900'
                      }`}
                    >
                      <p className="text-sm">{message.message}</p>
                      <p className={`text-xs mt-1 ${
                        isOwnMessage ? 'text-blue-100' : 'text-neutral-500'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Message Input */}
          <div className="border-t border-neutral-100 p-4">
            <form onSubmit={sendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="input-field flex-1"
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 flex gap-3">
          <button className="btn-outline flex items-center gap-2">
            <Calendar size={16} />
            Schedule Session
          </button>
          <button className="btn-outline flex items-center gap-2">
            <MapPin size={16} />
            Share Location
          </button>
        </div>
      </div>
    </div>
  )
}
