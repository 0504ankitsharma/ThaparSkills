'use client'

import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams } from 'next/navigation'
import { Send, Calendar, Loader2 } from 'lucide-react'
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
  const [sending, setSending] = useState(false)
  const [scheduleModal, setScheduleModal] = useState(false)
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')

  const scrollRef = useRef<HTMLDivElement>(null)

  // Load connection & messages
  useEffect(() => {
    if (connectionId) {
      loadConnection()
      loadMessages()
    }
  }, [connectionId])

  // Auto-scroll to bottom on messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadConnection = async () => {
    try {
      const response = await fetch('/api/connections')
      if (response.ok) {
        const connections = await response.json()
        const conn = connections.find((c: any) => c.id === connectionId)
        if (conn) setConnection(conn)
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

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || !user) return

    setSending(true)
    try {
      const response = await fetch(`/api/chats/${connectionId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageText.trim() }),
      })

      if (response.ok) {
        setNewMessage('')
        loadMessages()
      } else throw new Error('Failed to send message')
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Message failed. Try again.')
    } finally {
      setSending(false)
    }
  }

  const handleScheduleSend = () => {
    if (!scheduledDate || !scheduledTime) return
    const scheduleMsg = `📅 Scheduled Session: ${scheduledDate} at ${scheduledTime}`
    sendMessage(scheduleMsg)
    setScheduleModal(false)
    setScheduledDate('')
    setScheduledTime('')
  }

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen text-neutral-600">
        <Loader2 className="animate-spin w-8 h-8 mr-2" />
        Loading user info...
      </div>
    )

  if (!connection)
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-neutral-900">Connection Not Found</h1>
            <p className="text-neutral-500 mt-2">This connection does not exist.</p>
          </div>
        </div>
      </div>
    )

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Navbar />

      <div className="flex flex-col flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* Chat Header */}
        <div className="flex items-center gap-4 mb-4 border-b border-neutral-200 pb-4">
          <BackButton />
          <div className="flex items-center gap-3">
            <img
              src={
                connection.other_user.profile_pic ||
                `https://ui-avatars.com/api/?name=${connection.other_user.name}`
              }
              alt={connection.other_user.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-primary"
            />
            <div>
              <h1 className="text-lg font-bold text-neutral-900">
                {connection.other_user.name}
              </h1>
              <p className="text-xs text-green-600 font-medium">Online</p>
            </div>
          </div>
        </div>

        {/* Messages Section */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-3 bg-white rounded-2xl shadow-lg flex flex-col mb-4"
          style={{ maxHeight: '70vh' }}
        >
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-2 items-start animate-pulse">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-neutral-400">
              <Send className="w-8 h-8 mb-2" />
              <p>No messages yet</p>
              <p className="text-xs">Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwn = message.sender_id === user.id
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl text-sm shadow-md break-words ${
                      isOwn
                        ? 'bg-gradient-to-r from-primary to-blue-500 text-white rounded-br-none'
                        : 'bg-neutral-100 text-neutral-900 rounded-bl-none'
                    }`}
                  >
                    <p>{message.message}</p>
                    <span className="text-xs opacity-60 block mt-1 text-right">
                      {new Date(message.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Message Input & Schedule */}
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 rounded-full border border-neutral-300 px-5 py-3 focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
            />
            <button
              type="button"
              onClick={() => sendMessage(newMessage)}
              disabled={!newMessage.trim() || sending}
              className="flex items-center justify-center bg-primary hover:bg-blue-700 text-white p-3 rounded-full transition-all disabled:opacity-50 shadow-md"
            >
              {sending ? <Loader2 className="animate-spin w-5 h-5" /> : <Send size={20} />}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setScheduleModal(true)}
            className="w-full bg-gradient-to-r from-primary to-blue-500 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-full shadow-md transition font-medium flex items-center justify-center gap-2"
          >
            <Calendar size={16} /> Schedule Session
          </button>
        </div>

        {/* Schedule Modal */}
        {scheduleModal && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-80 shadow-lg space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">Schedule Session</h2>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setScheduleModal(false)}
                  className="px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleSend}
                  className="px-4 py-2 rounded-full bg-primary text-white hover:bg-blue-700 transition"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
