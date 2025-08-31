'use client'

import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Settings, User, Shield, Bell, HelpCircle } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'

export default function SettingsPage() {
  const { user } = useUser()

  if (!user) {
    return <div>Loading...</div>
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
              Settings
            </h1>
            <p className="text-neutral-600">
              Manage your account and preferences
            </p>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Account Settings */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-neutral-900">Account Settings</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Name</p>
                  <p className="text-sm text-neutral-600">{user.firstName} {user.lastName}</p>
                </div>
                <button className="btn-outline text-sm">Edit</button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Email</p>
                  <p className="text-sm text-neutral-600">{user.emailAddresses[0]?.emailAddress}</p>
                </div>
                <button className="btn-outline text-sm">Edit</button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900">Profile Picture</p>
                  <p className="text-sm text-neutral-600">Update your profile picture</p>
                </div>
                <button className="btn-outline text-sm">Upload</button>
              </div>
            </div>
          </div>

          {/* Privacy & Security */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-neutral-900">Privacy & Security</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Profile Visibility</p>
                  <p className="text-sm text-neutral-600">Control who can see your profile</p>
                </div>
                <select className="input-field w-32">
                  <option>Public</option>
                  <option>Connections Only</option>
                  <option>Private</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Connection Requests</p>
                  <p className="text-sm text-neutral-600">Allow connection requests from</p>
                </div>
                <select className="input-field w-32">
                  <option>All Students</option>
                  <option>Same Department</option>
                  <option>Same Year</option>
                </select>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900">Two-Factor Authentication</p>
                  <p className="text-sm text-neutral-600">Add an extra layer of security</p>
                </div>
                <button className="btn-outline text-sm">Enable</button>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <Bell className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-neutral-900">Notifications</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Connection Requests</p>
                  <p className="text-sm text-neutral-600">Get notified when someone wants to connect</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">New Messages</p>
                  <p className="text-sm text-neutral-600">Get notified of new chat messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900">Session Reminders</p>
                  <p className="text-sm text-neutral-600">Get reminded of upcoming sessions</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Help & Support */}
          <div className="card">
            <div className="flex items-center gap-3 mb-4">
              <HelpCircle className="w-6 h-6 text-primary" />
              <h2 className="text-xl font-semibold text-neutral-900">Help & Support</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Documentation</p>
                  <p className="text-sm text-neutral-600">Read our user guide and FAQs</p>
                </div>
                <button className="btn-outline text-sm">View</button>
              </div>
              <div className="flex items-center justify-between py-3 border-b border-neutral-100">
                <div>
                  <p className="font-medium text-neutral-900">Contact Support</p>
                  <p className="text-sm text-neutral-600">Get help from our support team</p>
                </div>
                <button className="btn-outline text-sm">Contact</button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-neutral-900">Report an Issue</p>
                  <p className="text-sm text-neutral-600">Report bugs or problems</p>
                </div>
                <button className="btn-outline text-sm">Report</button>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200 bg-red-50">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium text-red-900">Delete Account</p>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <button className="btn-outline text-red-600 border-red-600 hover:bg-red-600 hover:text-white">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
