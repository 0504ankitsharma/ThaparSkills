'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Plus, Search, Filter } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import SkillCard from '@/components/SkillCard'
import { Skill } from '@/lib/supabaseClient'

export default function DashboardPage() {
  const { user } = useUser()
  const router = useRouter()
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('All Departments')
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
        setSkills(loadMore ? [...skills, ...data.skills] : data.skills)
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
    loadSkills()
  }

  const handleLoadMore = () => {
    if (hasMore && !loading) loadSkills(true)
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 mb-2">
              Hey, {user.firstName || 'Student'} 👋
            </h1>
            <p className="text-neutral-600 text-lg">
              Discover, share, and learn new skills from your peers.
            </p>
          </div>
          <Link
            href="/post-skill"
            className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 mt-5 sm:mt-0 shadow-md transition transform hover:scale-105"
          >
            <Plus size={20} /> Post a Skill
          </Link>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-10">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  type="text"
                  placeholder="Search for skills or hobbies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="lg:w-64">
              <select
                value={departmentFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="w-full py-3 px-4 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-purple-400 focus:outline-none transition"
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
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-medium shadow-md transition transform hover:scale-105"
            >
              Search
            </button>
          </div>
        </div>

        {/* Skills Grid or States */}
        {loading && skills.length === 0 ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
            <p className="text-neutral-500">Fetching skills for you...</p>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-neutral-200 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-10 h-10 text-neutral-400" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">No skills found</h3>
            <p className="text-neutral-500 mb-6">
              {searchTerm || departmentFilter !== 'All Departments'
                ? 'Try adjusting your search or filters'
                : 'Be the first to post a skill and start sharing!'}
            </p>
            {!searchTerm && departmentFilter === 'All Departments' && (
              <Link href="/post-skill" className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition">
                Post Your First Skill
              </Link>
            )}
          </div>
        ) : (
          <>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"
            >
              {skills.map((skill) => (
                <motion.div
                  key={skill.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <SkillCard skill={skill} />
                </motion.div>
              ))}
            </motion.div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={loading}
                  className="px-8 py-3 rounded-lg border border-purple-400 text-purple-600 hover:bg-purple-50 transition disabled:opacity-50"
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
