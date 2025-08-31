'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, User, Calendar, BookOpen } from 'lucide-react'
import { Skill } from '@/lib/supabaseClient'
import { formatDate, truncateText } from '@/lib/helpers'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Image */}
      {skill.image_url && !imageError ? (
        <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
          <Image
            src={skill.image_url}
            alt={skill.skill_name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
        </div>
      ) : (
        <div className="w-full h-48 mb-4 bg-gradient-to-br from-primary/10 to-secondary/20 rounded-lg flex items-center justify-center">
          <BookOpen className="w-16 h-16 text-primary/40" />
        </div>
      )}

      {/* Content */}
      <div className="space-y-3">
        {/* Skill Name */}
        <h3 className="text-xl font-semibold text-neutral-900">
          {skill.skill_name}
        </h3>

        {/* Description */}
        {skill.description && (
          <p className="text-neutral-600 text-sm leading-relaxed">
            {truncateText(skill.description, 120)}
          </p>
        )}

        {/* User Info */}
        <div className="flex items-center gap-3 pt-2">
          <div className="flex items-center gap-2">
            {skill.user_pic ? (
              <Image
                src={skill.user_pic}
                alt={skill.user_name || 'User'}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                <span className="text-neutral-900 font-semibold text-sm">
                  {skill.user_name?.[0] || 'U'}
                </span>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-neutral-900">
                {skill.user_name || 'Anonymous'}
              </p>
              <p className="text-xs text-neutral-500">
                {skill.roll_number}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar size={16} />
            <span>{formatDate(skill.created_at)}</span>
          </div>

          <Link
            href={`/profile/${skill.user_id}`}
            className="btn-outline text-sm py-1 px-3"
          >
            <User size={16} className="mr-1" />
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
