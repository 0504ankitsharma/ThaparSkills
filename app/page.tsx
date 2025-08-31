import Link from 'next/link'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { Users, BookOpen, MessageSquare, Calendar } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-blue-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full mb-8">
              <span className="text-3xl font-bold text-primary">TS</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              ThaparSkills
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              Connect with fellow Thapar University students to share knowledge, 
              learn new skills, and build meaningful connections.
            </p>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <Users className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-lg font-semibold mb-2">Peer Learning</h3>
              <p className="text-blue-100">Learn from your fellow students</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-lg font-semibold mb-2">Skill Sharing</h3>
              <p className="text-blue-100">Share your expertise with others</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-lg font-semibold mb-2">Real-time Chat</h3>
              <p className="text-blue-100">Connect and communicate instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-secondary" />
              <h3 className="text-lg font-semibold mb-2">Session Scheduling</h3>
              <p className="text-blue-100">Plan and organize learning sessions</p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SignUpButton mode="modal">
              <button className="btn-secondary text-lg px-8 py-4 font-semibold">
                Get Started
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="btn-outline text-lg px-8 py-4 font-semibold bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                Sign In
              </button>
            </SignInButton>
          </div>

          {/* Footer */}
          <div className="mt-20 text-blue-100">
            <p className="text-sm">
              Built for Thapar University students • Secure • Private
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
