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
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      {/* Image */}
      {skill.image_url && !imageError ? (
        <div className="relative w-full h-52">
          <Image
            src={skill.image_url}
            alt={skill.skill_name}
            fill
            className="object-cover"
            onError={() => setImageError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent rounded-t-xl" />
        </div>
      ) : (
        <div className="w-full h-52 bg-gradient-to-br from-primary/10 to-secondary/20 flex items-center justify-center rounded-t-xl">
          <BookOpen className="w-16 h-16 text-primary/40" />
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Skill Name */}
        <h3 className="text-xl font-bold text-neutral-900 hover:text-primary transition-colors">
          {skill.skill_name}
        </h3>

        {/* Description */}
        {skill.description && (
          <p className="text-neutral-600 text-sm leading-relaxed">
            {truncateText(skill.description, 120)}
          </p>
        )}

        {/* User Info */}
        <div className="flex items-center gap-3">
          {skill.user_pic ? (
            <Image
              src={skill.user_pic}
              alt={skill.user_name || 'User'}
              width={40}
              height={40}
              className="rounded-full border-2 border-primary/30"
            />
          ) : (
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center shadow-sm">
              <span className="text-neutral-900 font-semibold text-sm">
                {skill.user_name?.[0] || 'U'}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-neutral-900">
              {skill.user_name || 'Anonymous'}
            </p>
            <p className="text-xs text-neutral-500">{skill.roll_number}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Calendar size={16} />
            <span>{formatDate(skill.created_at)}</span>
          </div>

          <Link
            href={`/profile/${skill.user_id}`}
            className="inline-flex items-center gap-1 text-primary border border-primary rounded-lg px-3 py-1 text-sm font-medium hover:bg-primary hover:text-white transition-colors"
          >
            <User size={16} />
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}
