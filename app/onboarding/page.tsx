'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, GraduationCap, Calendar, BookOpen, Upload } from 'lucide-react'
import { getDepartmentFromRollNumber, getYearFromRollNumber } from '@/lib/helpers'

const onboardingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  roll_number: z.string().min(1, 'Roll number is required'),
  department: z.string().min(1, 'Please select a department'),
  year: z.number().min(1).max(5, 'Year must be between 1 and 5'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  skills: z.array(z.string()).min(1, 'Please add at least one skill'),
})

type OnboardingFormData = z.infer<typeof onboardingSchema>

const departments = [
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

const commonSkills = [
  'Programming', 'Web Development', 'Machine Learning', 'Data Science',
  'Graphic Design', 'Public Speaking', 'Leadership', 'Project Management',
  'Creative Writing', 'Photography', 'Music', 'Sports', 'Cooking',
  'Languages', 'Mathematics', 'Physics', 'Chemistry', 'Biology'
]

export default function OnboardingPage() {
  const { user } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newSkill, setNewSkill] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      skills: [],
      year: 1,
    },
  })

  const watchedRollNumber = watch('roll_number')
  const watchedSkills = watch('skills')

  // Auto-fill department and year from roll number (if it matches Thapar format)
  if (watchedRollNumber && watchedRollNumber.length >= 9) {
    const department = getDepartmentFromRollNumber(watchedRollNumber)
    const year = getYearFromRollNumber(watchedRollNumber)
    
    if (department && !watch('department')) {
      setValue('department', department)
    }
    if (year && !watch('year')) {
      setValue('year', year)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !watchedSkills.includes(newSkill.trim())) {
      setValue('skills', [...watchedSkills, newSkill.trim()])
      setNewSkill('')
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setValue('skills', watchedSkills.filter(skill => skill !== skillToRemove))
  }

  const onSubmit = async (data: OnboardingFormData) => {
    if (!user) return
    
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clerk_id: user.id,
          ...data,
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to create profile')
      }
    } catch (error) {
      console.error('Error creating profile:', error)
      alert('Failed to create profile. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-neutral-100 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-neutral-600">
            Tell us about yourself to get started with ThaparSkills
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Full Name
            </label>
            <input
              type="text"
              {...register('name')}
              className="input-field"
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Roll Number */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Roll Number
            </label>
            <input
              type="text"
              {...register('roll_number')}
              className="input-field"
              placeholder="Enter your roll number"
            />
            {errors.roll_number && (
              <p className="mt-1 text-sm text-red-600">{errors.roll_number.message}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Department
            </label>
            <select {...register('department')} className="input-field">
              <option value="">Select your department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
            )}
          </div>

          {/* Year */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Current Year
            </label>
            <select {...register('year', { valueAsNumber: true })} className="input-field">
              {[1, 2, 3, 4, 5].map((year) => (
                <option key={year} value={year}>
                  Year {year}
                </option>
              ))}
            </select>
            {errors.year && (
              <p className="mt-1 text-sm text-red-600">{errors.year.message}</p>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Bio
            </label>
            <textarea
              {...register('bio')}
              rows={3}
              className="input-field"
              placeholder="Tell us a bit about yourself..."
            />
            {errors.bio && (
              <p className="mt-1 text-sm text-red-600">{errors.bio.message}</p>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Skills
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                className="input-field flex-1"
                placeholder="Add a skill"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
              />
              <button
                type="button"
                onClick={addSkill}
                className="btn-primary"
              >
                Add
              </button>
            </div>
            
            {/* Selected Skills */}
            <div className="flex flex-wrap gap-2 mb-2">
              {watchedSkills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-secondary text-neutral-900 px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>

            {/* Common Skills Suggestions */}
            <div className="text-sm text-neutral-600">
              <p className="mb-2">Popular skills:</p>
              <div className="flex flex-wrap gap-1">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => {
                      if (!watchedSkills.includes(skill)) {
                        setValue('skills', [...watchedSkills, skill])
                      }
                    }}
                    disabled={watchedSkills.includes(skill)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      watchedSkills.includes(skill)
                        ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {errors.skills && (
              <p className="mt-1 text-sm text-red-600">{errors.skills.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Creating Profile...' : 'Complete Profile'}
          </button>
        </form>
      </div>
    </div>
  )
}
