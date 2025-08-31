'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { User, MessageSquare, Users, Calendar, BookOpen, MapPin, GraduationCap } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'

interface UserProfile {
  id: string
  name: string
  roll_number: string
  department: string
  year: number
  skills: string[]
  bio: string
  profile_pic?: string
  created_at: string
}

interface Skill {
  id: string
  skill_name: string
  description?: string
  image_url?: string
  created_at: string
}

export default function ProfilePage() {
  const { user: currentUser } = useUser()
  const params = useParams()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [connectionStatus, setConnectionStatus] = useState<'none' | 'pending' | 'accepted' | 'rejected'>('none')
  const [isConnecting, setIsConnecting] = useState(false)

  const userId = params.id as string

  useEffect(() => {
    if (userId) {
      loadProfile()
      loadSkills()
      checkConnectionStatus()
    }
  }, [userId])

  const loadProfile = async () => {
    try {
      const response = await fetch(`/api/users?id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      } else {
        throw new Error('Failed to load profile')
      }
    } catch (error) {
      console.error('Error loading profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSkills = async () => {
    try {
      const response = await fetch(`/api/skills?user_id=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSkills(data.skills || [])
      }
    } catch (error) {
      console.error('Error loading skills:', error)
    }
  }

  const checkConnectionStatus = async () => {
    if (!currentUser) return

    try {
      const response = await fetch('/api/connections')
      if (response.ok) {
        const connections = await response.json()
        const connection = connections.find((conn: any) => 
          conn.other_user.id === userId
        )
        
        if (connection) {
          setConnectionStatus(connection.status)
        }
      }
    } catch (error) {
      console.error('Error checking connection status:', error)
    }
  }

  const sendConnectionRequest = async () => {
    if (!currentUser) return

    setIsConnecting(true)
    try {
      const response = await fetch('/api/connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiver_id: userId,
        }),
      })

      if (response.ok) {
        setConnectionStatus('pending')
      } else {
        throw new Error('Failed to send connection request')
      }
    } catch (error) {
      console.error('Error sending connection request:', error)
      alert('Failed to send connection request. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const getConnectionButton = () => {
    if (!currentUser || currentUser.id === userId) return null

    switch (connectionStatus) {
      case 'none':
        return (
          <button
            onClick={sendConnectionRequest}
            disabled={isConnecting}
            className="btn-primary flex items-center gap-2"
          >
            <Users size={16} />
            {isConnecting ? 'Sending...' : 'Connect'}
          </button>
        )
      case 'pending':
        return (
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg text-sm font-medium">
            Connection Request Sent
          </span>
        )
      case 'accepted':
        return (
          <button
            onClick={() => router.push(`/chat/${userId}`)}
            className="btn-primary flex items-center gap-2"
          >
            <MessageSquare size={16} />
            Chat
          </button>
        )
      case 'rejected':
        return (
          <span className="px-4 py-2 bg-red-100 text-red-800 rounded-lg text-sm font-medium">
            Connection Rejected
          </span>
        )
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Navbar />
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-neutral-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-neutral-100">
        <Navbar />
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Profile Not Found</h1>
          <p className="text-neutral-600">The user profile you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Profile
            </h1>
          </div>
        </div>

        {/* Profile Card */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
              {profile.profile_pic ? (
                <Image
                  src={profile.profile_pic}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
              ) : (
                <div className="w-30 h-30 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-neutral-900 font-bold text-3xl">
                    {profile.name[0]}
                  </span>
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                    {profile.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-1">
                      <GraduationCap size={16} />
                      <span>{profile.department}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>Year {profile.year}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User size={16} />
                      <span>{profile.roll_number}</span>
                    </div>
                  </div>
                </div>

                {/* Connection Button */}
                <div>
                  {getConnectionButton()}
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="mb-4">
                  <p className="text-neutral-700 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 mb-2">Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-secondary text-neutral-900 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Skills Section */}
        <div className="card">
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <BookOpen size={24} />
            Skills Shared
          </h3>

          {skills.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-neutral-400" />
              </div>
              <p className="text-neutral-600">No skills shared yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((skill) => (
                <div key={skill.id} className="border border-neutral-200 rounded-lg p-4">
                  <h4 className="font-semibold text-neutral-900 mb-2">
                    {skill.skill_name}
                  </h4>
                  {skill.description && (
                    <p className="text-sm text-neutral-600 mb-3">
                      {skill.description}
                    </p>
                  )}
                  {skill.image_url && (
                    <div className="w-full h-32 bg-neutral-100 rounded overflow-hidden">
                      <Image
                        src={skill.image_url}
                        alt={skill.skill_name}
                        width={200}
                        height={128}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
