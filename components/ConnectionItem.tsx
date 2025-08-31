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
    <div className="card">
      <div className="flex items-center justify-between">
        {/* User Info */}
        <div className="flex items-center gap-4">
          {/* Profile Picture */}
          {connection.other_user.profile_pic ? (
            <Image
              src={connection.other_user.profile_pic}
              alt={connection.other_user.name}
              width={56}
              height={56}
              className="rounded-full"
            />
          ) : (
            <div className="w-14 h-14 bg-secondary rounded-full flex items-center justify-center">
              <span className="text-neutral-900 font-semibold text-lg">
                {connection.other_user.name[0]}
              </span>
            </div>
          )}

          {/* User Details */}
          <div>
            <h3 className="text-lg font-semibold text-neutral-900">
              {connection.other_user.name}
            </h3>
            <p className="text-sm text-neutral-600">
              {connection.other_user.roll_number}
            </p>
            <p className="text-sm text-neutral-500">
              {connection.other_user.department}
            </p>
          </div>
        </div>

        {/* Status and Actions */}
        <div className="flex items-center gap-4">
          {/* Status */}
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
          </div>

          {/* Action Buttons */}
          {connection.status === 'pending' && !connection.is_sender && (
            <div className="flex gap-2">
              <button
                onClick={() => onUpdate(connection.id, 'accepted')}
                className="btn-primary flex items-center gap-2 px-4 py-2"
              >
                <Check size={16} />
                Accept
              </button>
              <button
                onClick={() => onUpdate(connection.id, 'rejected')}
                className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white px-4 py-2"
              >
                <X size={16} />
                Reject
              </button>
            </div>
          )}

          {connection.status === 'pending' && connection.is_sender && (
            <button
              onClick={() => onUpdate(connection.id, 'rejected')}
              className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white px-4 py-2"
            >
              <X size={16} />
              Cancel
            </button>
          )}

          {/* Chat Button for Accepted Connections */}
          {connection.status === 'accepted' && (
            <Link
              href={`/chat/${connection.id}`}
              className="btn-primary flex items-center gap-2 px-4 py-2"
            >
              <MessageSquare size={16} />
              Chat
            </Link>
          )}

          {/* View Profile Button */}
          <Link
            href={`/profile/${connection.other_user.id}`}
            className="btn-outline flex items-center gap-2 px-4 py-2"
          >
            <User size={16} />
            Profile
          </Link>
        </div>
      </div>

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-neutral-100">
        <p className="text-sm text-neutral-500">
          {connection.is_sender ? 'Sent' : 'Received'} on {formatDate(connection.created_at)}
        </p>
      </div>
    </div>
  )
}
