'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import Navbar from '@/components/Navbar'
import SkillCard from '@/components/SkillCard'
import { Skill } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)

  const departments = [
    'All Departments',
    'Computer Science',
    'Mechanical Engineering',
    'Electrical Engineering',
    'Civil Engineering',
    'Chemical Engineering',
    'Biotechnology',
    'Metallurgical Engineering',
    'Physics',
    'Mathematics',
    'Mathematics and Computing',
    'Mathematics and Scientific Computing',
    'Mathematics and Statistics'
  ]

  useEffect(() => {
    if (user) {
      checkOnboardingStatus()
      loadSkills()
    }
  }, [user])

  const checkOnboardingStatus = async () => {
    try {
      const response = await fetch('/api/users/me')
      if (!response.ok) {
        router.push('/onboarding')
        return
      }
    } catch (error) {
      console.error('Error checking onboarding status:', error)
      router.push('/onboarding')
    }
  }

  const loadSkills = async (loadMore = false) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (cursor && loadMore) params.append('cursor', cursor)
      if (searchTerm) params.append('search', searchTerm)
      if (departmentFilter && departmentFilter !== 'All Departments') {
        params.append('department', departmentFilter)
      }

      const response = await fetch(`/api/skills?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        
        if (loadMore) {
          setSkills(prev => [...prev, ...data.skills])
        } else {
          setSkills(data.skills)
        }
        
        setHasMore(data.hasMore)
        setCursor(data.nextCursor)
      }
    } catch (error) {
      console.error('Error loading skills:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    setCursor(null)
    loadSkills()
  }

  const handleFilterChange = (dept: string) => {
    setDepartmentFilter(dept)
    setCursor(null)
    setTimeout(() => loadSkills(), 100)
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) {
      loadSkills(true)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              Welcome back, {user.firstName || 'Student'}!
            </h1>
            <p className="text-neutral-600">
              Discover skills from your fellow Thapar students
            </p>
          </div>
          <Link
            href="/post-skill"
            className="btn-primary flex items-center gap-2 mt-4 sm:mt-0"
          >
            <Plus size={20} />
            Post a Skill
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search skills..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-field pl-10"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="lg:w-64">
              <select
                value={departmentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="input-field"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="btn-primary px-6"
            >
              Search
            </button>
          </div>
        </div>

        {/* Skills Grid */}
        {loading && skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-neutral-600">Loading skills...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-12 h-12 text-neutral-400" />
            </div>
            <h3 className="text-xl font-semibold text-neutral-900 mb-2">
              No skills found
            </h3>
            <p className="text-neutral-600 mb-6">
              {searchTerm || departmentFilter !== 'All Departments'
                ? 'Try adjusting your search or filters'
                : 'Be the first to post a skill!'}
            </p>
            {!searchTerm && departmentFilter === 'All Departments' && (
              <Link href="/post-skill" className="btn-primary">
                Post Your First Skill
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {skills.map((skill) => (
                <SkillCard key={skill.id} skill={skill} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="btn-outline px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Loading...' : 'Load More Skills'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
