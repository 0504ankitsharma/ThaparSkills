'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Check, X, Clock, MessageSquare, User } from 'lucide-react'
import { formatDate } from '@/lib/helpers'

interface ConnectionItemProps {
  connection: {
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
  onUpdate: (connectionId: string, status: 'accepted' | 'rejected') => void
}

export default function ConnectionItem({ connection, onUpdate }: ConnectionItemProps) {
  const getStatusIcon = () => {
    switch (connection.status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'accepted':
        return <Check className="w-5 h-5 text-green-500" />
      case 'rejected':
        return <X className="w-5 h-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = () => {
    if (connection.is_sender) {
      switch (connection.status) {
        case 'pending':
          return 'Request sent'
        case 'accepted':
          return 'Request accepted'
        case 'rejected':
          return 'Request rejected'
        default:
          return ''
      }
    } else {
      switch (connection.status) {
        case 'pending':
          return 'Request received'
        case 'accepted':
          return 'Request accepted'
        case 'rejected':
          return 'Request rejected'
        default:
          return ''
      }
    }
  }

  const getStatusColor = () => {
    switch (connection.status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-neutral-100 text-neutral-800'
    }
  }

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-3 w-full transition hover:shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* User Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {connection.other_user.profile_pic ? (
            <Image
              src={connection.other_user.profile_pic}
              alt={connection.other_user.name}
              width={56}
              height={56}
              className="rounded-full object-cover border-2 border-primary"
            />
          ) : (
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-neutral-900 font-semibold text-lg">
                {connection.other_user.name[0]}
              </span>
            </div>
          )}
          <div className="truncate">
            <h3 className="text-lg font-semibold text-neutral-900 truncate">
              {connection.other_user.name}
            </h3>
            <p className="text-sm text-neutral-600 truncate">
              {connection.other_user.roll_number}
            </p>
            <p className="text-sm text-neutral-500 truncate">{connection.other_user.department}</p>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
          {/* Status */}
          <div className="flex items-center gap-2 whitespace-nowrap">
            {getStatusIcon()}
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}
            >
              {getStatusText()}
            </span>
          </div>

          {/* Action Buttons */}
          {connection.status === 'pending' && !connection.is_sender && (
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onUpdate(connection.id, 'accepted')}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white hover:from-blue-600 hover:to-blue-600 transition"
              >
                <Check size={16} />
                Accept
              </button>
              <button
                onClick={() => onUpdate(connection.id, 'rejected')}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}

          {connection.status === 'pending' && connection.is_sender && (
            <button
              onClick={() => onUpdate(connection.id, 'rejected')}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition"
            >
              <X size={16} />
              Cancel
            </button>
          )}

          {connection.status === 'accepted' && (
            <Link
              href={`/chat/${connection.id}`}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-blue-500 text-white hover:from-blue-600 hover:to-blue-600 transition"
            >
              <MessageSquare size={16} />
              Chat
            </Link>
          )}

          <Link
            href={`/profile/${connection.other_user.id}`}
            className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
          >
            <User size={16} />
            Profile
          </Link>
        </div>
      </div>

      {/* Timestamp */}
      <div className="pt-3 border-t border-neutral-100">
        <p className="text-sm text-neutral-500">
          {connection.is_sender ? 'Sent' : 'Received'} on{' '}
          {formatDate(connection.created_at)}
        </p>
      </div>
    </div>
  )
}
