'use client'

import { useUser } from '@clerk/nextjs'
import { Settings, User, Shield, Bell, HelpCircle, Trash2 } from 'lucide-react'
import Navbar from '@/components/Navbar'
import BackButton from '@/components/BackButton'
import { motion } from 'framer-motion'

export default function SettingsPage() {
  const { user } = useUser()

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <p className="text-neutral-600 text-lg">Loading your settings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header Section */}
        <div className="flex items-center gap-4 mb-10">
          <BackButton />
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Settings</h1>
            <p className="text-neutral-600 text-sm">Manage your account preferences and privacy controls</p>
          </div>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Account Settings */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200 transition"
          >
            <div className="flex items-center gap-3 mb-5">
              <User className="w-6 h-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-neutral-900">Account Settings</h2>
            </div>
            <div className="space-y-4">
              <SettingItem label="Name" value={`${user.firstName} ${user.lastName}`} />
              <SettingItem label="Email" value={user.emailAddresses[0]?.emailAddress} />
              <SettingItem label="Profile Picture" value="Update your profile picture" action="Upload" />
            </div>
          </motion.div>

          {/* Privacy & Security */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200 transition"
          >
            <div className="flex items-center gap-3 mb-5">
              <Shield className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-neutral-900">Privacy & Security</h2>
            </div>
            <div className="space-y-4">
              <SettingDropdown label="Profile Visibility" options={['Public', 'Connections Only', 'Private']} />
              <SettingDropdown label="Connection Requests" options={['All Students', 'Same Department', 'Same Year']} />
              <SettingItem label="Two-Factor Authentication" value="Add extra security to your account" action="Enable" />
            </div>
          </motion.div>

          {/* Notifications */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200 transition"
          >
            <div className="flex items-center gap-3 mb-5">
              <Bell className="w-6 h-6 text-emerald-500" />
              <h2 className="text-xl font-semibold text-neutral-900">Notifications</h2>
            </div>
            <div className="space-y-4">
              <SettingToggle label="Connection Requests" description="Get notified when someone wants to connect" defaultChecked />
              <SettingToggle label="New Messages" description="Get notified about new chat messages" defaultChecked />
              <SettingToggle label="Session Reminders" description="Reminders for upcoming sessions" />
            </div>
          </motion.div>

          {/* Help & Support */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white rounded-2xl shadow-sm p-6 border border-neutral-200 transition"
          >
            <div className="flex items-center gap-3 mb-5">
              <HelpCircle className="w-6 h-6 text-amber-500" />
              <h2 className="text-xl font-semibold text-neutral-900">Help & Support</h2>
            </div>
            <div className="space-y-4">
              <SettingItem label="Documentation" value="Read our FAQs & guides" action="View" />
              <SettingItem label="Contact Support" value="Get help from our team" action="Contact" />
              <SettingItem label="Report Issue" value="Report a bug or problem" action="Report" />
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-red-50 rounded-2xl shadow-sm p-6 border border-red-200 transition col-span-1 lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-5">
              <Trash2 className="w-6 h-6 text-red-600" />
              <h2 className="text-xl font-semibold text-red-900">Danger Zone</h2>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium text-red-900">Delete Account</p>
                <p className="text-sm text-red-700">This action cannot be undone</p>
              </div>
              <button className="px-4 py-2 text-sm font-medium rounded-lg border border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition">
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* 🔹 Reusable Setting Components */

function SettingItem({ label, value, action }: { label: string, value: string, action?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600">{value}</p>
      </div>
      {action && <button className="px-3 py-1 text-sm rounded-lg border border-neutral-300 hover:bg-neutral-100 transition">{action}</button>}
    </div>
  )
}

function SettingDropdown({ label, options }: { label: string, options: string[] }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600">Select an option</p>
      </div>
      <select className="px-3 py-2 text-sm border border-neutral-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
        {options.map((opt) => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  )
}

function SettingToggle({ label, description, defaultChecked }: { label: string, description: string, defaultChecked?: boolean }) {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
      <div>
        <p className="font-medium text-neutral-900">{label}</p>
        <p className="text-sm text-neutral-600">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
        <div className="w-11 h-6 bg-neutral-200 rounded-full peer peer-checked:bg-blue-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
      </label>
    </div>
  )
}
