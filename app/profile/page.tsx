"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Loader2, LogIn } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (user) {
      setRedirecting(true);
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1500); // slight delay for smooth animation
      return () => clearTimeout(timer);
    }
  }, [user, router]);

  // Loader while Clerk fetches user
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // If no user → show Sign In
  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-8 text-center max-w-md w-full"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4">
            <User className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">
            Profile Not Found
          </h1>
          <p className="text-neutral-600 mb-6">
            Please sign in to view your profile and dashboard.
          </p>
          <button
            onClick={() => router.push("/sign-in")}
            className="w-full py-3 rounded-xl text-white font-medium bg-gradient-to-r from-primary to-blue-500 hover:opacity-90 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        </motion.div>
      </div>
    );
  }

  // If user exists → Show redirect animation
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-lg rounded-2xl p-10 text-center max-w-md w-full"
      >
        <div className="flex justify-center mb-4">
          <div className="relative">
            {user.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 mb-1">
          {user.fullName || "Student"}
        </h1>
        <p className="text-neutral-500 mb-6">Redirecting to your dashboard...</p>

        {redirecting && (
          <div className="flex justify-center mt-2">
            <Loader2 className="w-6 h-6 text-primary animate-spin" />
          </div>
        )}
      </motion.div>
    </div>
  );
}
