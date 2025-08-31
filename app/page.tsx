"use client";

import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Users, BookOpen, Share2, Star } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 relative overflow-hidden flex flex-col items-center text-white">
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-500 opacity-30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl animate-pulse delay-700"></div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="z-10 text-center max-w-2xl px-6 pt-20"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold mb-4 tracking-tight">
          Share Your{" "}
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Skills & Hobbies
          </span>
        </h1>
        <p className="text-lg md:text-xl text-blue-200 mb-8 font-light leading-relaxed">
          A platform for Thapar students to <span className="font-semibold text-white">teach</span>,
          <span className="font-semibold text-white"> learn</span>, and{" "}
          <span className="font-semibold text-white">connect</span> with peers through real skills and passions.
        </p>

        {/* Auth Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <SignUpButton mode="modal">
            <button className="px-10 py-4 rounded-2xl text-lg font-semibold text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-xl transition-all duration-300 transform hover:scale-105">
              Get Started
            </button>
          </SignUpButton>
          <SignInButton mode="modal">
            <button className="px-10 py-4 rounded-2xl text-lg font-semibold text-white border border-white/30 bg-white/5 hover:bg-white/20 shadow-xl transition-all duration-300 transform hover:scale-105">
              Sign In
            </button>
          </SignInButton>
        </div>
      </motion.div>

      {/* Sample Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-20 px-6 max-w-5xl z-10"
      >
        {[
          {
            icon: <BookOpen size={34} />,
            title: "Coding & Tech",
            desc: "Learn programming, web dev, AI, and more from peers.",
          },
          {
            icon: <Star size={34} />,
            title: "Art & Creativity",
            desc: "Painting, sketching, design, or music — share your talent.",
          },
          {
            icon: <Users size={34} />,
            title: "Language Exchange",
            desc: "Teach your language or learn a new one together.",
          },
          {
            icon: <Share2 size={34} />,
            title: "Photography",
            desc: "Capture moments, edit photos, and share techniques.",
          },
          {
            icon: <BookOpen size={34} />,
            title: "Public Speaking",
            desc: "Practice speaking skills, debates, and presentations.",
          },
          {
            icon: <Star size={34} />,
            title: "Sports & Fitness",
            desc: "Yoga, workouts, or sports — learn and stay active.",
          },
        ].map((skill, idx) => (
          <div
            key={idx}
            className="p-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 text-center flex flex-col items-center gap-3"
          >
            <div className="text-purple-300">{skill.icon}</div>
            <h3 className="text-xl font-bold">{skill.title}</h3>
            <p className="text-blue-200 text-sm">{skill.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="mt-16 mb-6 text-blue-300 text-sm z-10"
      >
        © {new Date().getFullYear()} ThaparSkills. Built for the student community.
      </motion.footer>
    </div>
  );
}
