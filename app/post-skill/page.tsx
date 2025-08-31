'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, X, BookOpen, Loader2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import { supabase } from '@/lib/supabaseClient'
import ErrorBoundary from '@/components/ErrorBoundary'

// Check if Supabase is available
const isSupabaseAvailable = () => {
  return process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
}

// Add error logging
console.log('PostSkillPage module loaded')

const postSkillSchema = z.object({
  skill_name: z.string().min(3, 'Skill name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
})

type PostSkillFormData = z.infer<typeof postSkillSchema>

function PostSkillPageContent() {
  const { user, isLoaded, isSignedIn } = useUser()
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [authError, setAuthError] = useState<string | null>(null)

  // Debug logging
  useEffect(() => {
    console.log('PostSkillPage auth state:', {
      isLoaded,
      isSignedIn,
      userId: user?.id,
      timestamp: new Date().toISOString()
    })
  }, [isLoaded, isSignedIn, user])

  // Add error boundary logging
  useEffect(() => {
    console.log('PostSkillPage component mounted successfully')
    
    // Check if we're in the browser
    if (typeof window !== 'undefined') {
      console.log('Running in browser environment')
      
      // Check environment variables
      console.log('Environment check:', {
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅' : '❌',
        supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅' : '❌',
        clerkKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅' : '❌'
      })
    }
  }, [])

  // Handle authentication errors
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setAuthError('You must be signed in to post a skill')
    } else if (isLoaded && isSignedIn && !user) {
      setAuthError('Authentication state error - please refresh the page')
    } else {
      setAuthError(null)
    }
  }, [isLoaded, isSignedIn, user])

  // Initialize form - this must be called before any conditional returns
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSkillFormData>({
    resolver: zodResolver(postSkillSchema),
  })

  // Show loading state while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Loading...
          </h1>
          <p className="text-neutral-600">
            Please wait while we authenticate you
          </p>
        </div>
      </div>
    )
  }

  // Show authentication error
  if (authError) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Authentication Required
          </h1>
          <p className="text-neutral-600 mb-6">
            {authError}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full btn-primary"
            >
              Sign In
            </button>
            <button
              onClick={() => window.location.reload()}
              className="w-full btn-outline"
            >
              Refresh Page
            </button>
          </div>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              If you're already signed in, try refreshing the page or signing in again.
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Ensure user is available before rendering the form
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Loading User...
          </h1>
          <p className="text-neutral-600">
            Please wait while we load your profile
          </p>
        </div>
      </div>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size must be less than 5MB')
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(null)
  }

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null

    try {
      // Check if Supabase is properly configured
      if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.warn('Supabase not configured, skipping image upload')
        return null
      }

      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `skill-images/${fileName}`

      // Check if storage bucket exists, if not, skip image upload
      try {
        const { error: uploadError } = await supabase.storage
          .from('user-uploads')
          .upload(filePath, imageFile)

        if (uploadError) {
          console.warn('Image upload failed, continuing without image:', uploadError)
          return null
        }

        const { data: { publicUrl } } = supabase.storage
          .from('user-uploads')
          .getPublicUrl(filePath)

        return publicUrl
      } catch (storageError) {
        console.warn('Storage bucket not available, continuing without image:', storageError)
        return null
      }
    } catch (error) {
      console.error('Error uploading image:', error)
      return null // Don't throw error, just continue without image
    }
  }

  const onSubmit = async (data: PostSkillFormData) => {
    if (!user) return
    
    setIsSubmitting(true)
    setUploadProgress(0)
    
    try {
      let imageUrl = null
      
      // Upload image if selected
      if (imageFile) {
        setUploadProgress(50)
        imageUrl = await uploadImage()
        setUploadProgress(100)
      }

      // Create skill post
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          image_url: imageUrl,
        }),
      })

      if (response.ok) {
        router.push('/dashboard')
      } else {
        throw new Error('Failed to create skill post')
      }
    } catch (error) {
      console.error('Error creating skill post:', error)
      alert('Failed to create skill post. Please try again.')
    } finally {
      setIsSubmitting(false)
      setUploadProgress(0)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <div>
            <h1 className="text-3xl font-bold text-neutral-900">
              Post a Skill
            </h1>
            <p className="text-neutral-600">
              Share your expertise with fellow Thapar students
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Skill Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Skill Name *
            </label>
            <input
              type="text"
              {...register('skill_name')}
              className="input-field"
              placeholder="e.g., Web Development, Machine Learning, Public Speaking"
            />
            {errors.skill_name && (
              <p className="mt-1 text-sm text-red-600">{errors.skill_name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-neutral-900 mb-2">
              Description *
            </label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-field"
              placeholder="Describe what you can teach, your experience level, and what students can expect to learn..."
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

                  {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-neutral-900 mb-2">
            Skill Image (Optional)
          </label>
          
          {!isSupabaseAvailable() && (
            <div className="mb-4 p-3 bg-yellow-50 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ Image upload is currently unavailable. Please check your configuration.
              </p>
            </div>
          )}
            
            {imagePreview ? (
              <div className="relative">
                <div className="w-full h-48 bg-neutral-100 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>
                          ) : (
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  isSupabaseAvailable() 
                    ? 'border-neutral-300 hover:border-primary cursor-pointer' 
                    : 'border-neutral-200 bg-neutral-50 cursor-not-allowed'
                }`}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="image-upload"
                    disabled={!isSupabaseAvailable()}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex flex-col items-center gap-2 ${
                      isSupabaseAvailable() ? 'cursor-pointer' : 'cursor-not-allowed'
                    }`}
                  >
                    <Upload className={`w-8 h-8 ${
                      isSupabaseAvailable() ? 'text-neutral-400' : 'text-neutral-300'
                    }`} />
                    <span className={`text-sm ${
                      isSupabaseAvailable() ? 'text-neutral-600' : 'text-neutral-400'
                    }`}>
                      {isSupabaseAvailable() 
                        ? 'Click to upload an image (max 5MB)' 
                        : 'Image upload unavailable'
                      }
                    </span>
                    <span className={`text-xs ${
                      isSupabaseAvailable() ? 'text-neutral-500' : 'text-neutral-400'
                    }`}>
                      {isSupabaseAvailable() ? 'PNG, JPG, GIF up to 5MB' : 'Check configuration'}
                    </span>
                  </label>
                </div>
              )}
          </div>

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="w-full bg-neutral-200 rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary text-lg py-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating Skill Post...
              </span>
            ) : (
              'Post Skill'
            )}
          </button>
        </form>

        {/* Tips */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">Tips for a great skill post:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Be specific about what you can teach</li>
            <li>• Mention your experience level and background</li>
            <li>• Include any relevant certifications or projects</li>
            <li>• Specify if you prefer online or in-person sessions</li>
            <li>• Add a clear, relevant image to make your post stand out</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function PostSkillPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-full mb-4">
              <span className="text-white text-2xl">⚠️</span>
            </div>
            <h1 className="text-2xl font-bold text-neutral-900 mb-2">
              Page Error
            </h1>
            <p className="text-neutral-600 mb-4">
              Something went wrong loading this page
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload Page
            </button>
          </div>
        </div>
      }
    >
      <PostSkillPageContent />
    </ErrorBoundary>
  )
}
