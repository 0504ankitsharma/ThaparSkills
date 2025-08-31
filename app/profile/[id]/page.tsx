"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  User,
  MessageSquare,
  Users,
  Calendar,
  BookOpen,
  GraduationCap,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { motion } from "framer-motion";

interface UserProfile {
  id: string;
  name: string;
  roll_number: string;
  department: string;
  year: number;
  skills: string[];
  bio: string;
  profile_pic?: string;
  created_at: string;
}

interface Skill {
  id: string;
  skill_name: string;
  description?: string;
  image_url?: string;
  created_at: string;
}

export default function ProfilePage() {
  const { user: currentUser } = useUser();
  const params = useParams();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<
    "none" | "pending" | "accepted" | "rejected"
  >("none");
  const [isConnecting, setIsConnecting] = useState(false);

  const userId = params.id as string;

  useEffect(() => {
    if (userId) {
      loadProfile();
      loadSkills();
      checkConnectionStatus();
    }
  }, [userId]);

  const loadProfile = async () => {
    try {
      const res = await fetch(`/api/users?id=${userId}`);
      if (!res.ok) throw new Error("Failed to load profile");
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadSkills = async () => {
    try {
      const res = await fetch(`/api/skills?user_id=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setSkills(data.skills || []);
      }
    } catch (err) {
      console.error("Error loading skills:", err);
    }
  };

  const checkConnectionStatus = async () => {
    if (!currentUser) return;
    try {
      const res = await fetch("/api/connections");
      if (res.ok) {
        const connections = await res.json();
        const connection = connections.find((c: any) => c.other_user.id === userId);
        if (connection) setConnectionStatus(connection.status);
      }
    } catch (err) {
      console.error("Error checking connection:", err);
    }
  };

  const sendConnectionRequest = async () => {
    if (!currentUser) return;
    setIsConnecting(true);
    try {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiver_id: userId }),
      });
      if (!res.ok) throw new Error("Failed to send connection");
      setConnectionStatus("pending");
    } catch (err) {
      console.error(err);
    } finally {
      setIsConnecting(false);
    }
  };

  const ConnectionButton = () => {
    if (!currentUser || currentUser.id === userId) return null;
    if (connectionStatus === "accepted")
      return (
        <button
          onClick={() => router.push(`/chat/${userId}`)}
          className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition flex items-center gap-2"
        >
          <MessageSquare size={16} /> Chat
        </button>
      );
    if (connectionStatus === "pending")
      return (
        <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-xl text-sm font-medium">
          Request Sent
        </span>
      );
    if (connectionStatus === "rejected")
      return (
        <span className="px-4 py-2 bg-red-100 text-red-800 rounded-xl text-sm font-medium">
          Rejected
        </span>
      );
    return (
      <button
        onClick={sendConnectionRequest}
        disabled={isConnecting}
        className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-xl hover:opacity-90 transition flex items-center gap-2"
      >
        <Users size={16} /> {isConnecting ? "Sending..." : "Connect"}
      </button>
    );
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );

  if (!profile)
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100 text-center">
        <h1 className="text-2xl font-bold">Profile Not Found</h1>
        <p className="text-neutral-500 mt-2">This user does not exist.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-100">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <BackButton />
          <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
        </div>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {profile.profile_pic ? (
                <Image
                  src={profile.profile_pic}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-white shadow-md"
                />
              ) : (
                <div className="w-28 h-28 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md">
                  {profile.name[0]}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{profile.name}</h2>
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mt-1">
                    <span className="flex items-center gap-1">
                      <GraduationCap size={16} /> {profile.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar size={16} /> Year {profile.year}
                    </span>
                    <span className="flex items-center gap-1">
                      <User size={16} /> {profile.roll_number}
                    </span>
                  </div>
                </div>
                <ConnectionButton />
              </div>
              {profile.bio && <p className="text-neutral-700 mt-2">{profile.bio}</p>}
              {profile.skills?.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {profile.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white shadow-lg rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold text-neutral-900 mb-6 flex items-center gap-2">
            <BookOpen size={20} /> Skills Shared
          </h3>
          {skills.length === 0 ? (
            <div className="text-center py-6 text-neutral-500">No skills shared yet</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.map((s) => (
                <div
                  key={s.id}
                  className="border border-neutral-200 rounded-xl p-4 hover:shadow-md transition"
                >
                  <h4 className="font-semibold text-neutral-900 mb-2">{s.skill_name}</h4>
                  {s.description && (
                    <p className="text-sm text-neutral-600 mb-3">{s.description}</p>
                  )}
                  {s.image_url && (
                    <div className="w-full h-32 rounded-lg overflow-hidden">
                      <Image
                        src={s.image_url}
                        alt={s.skill_name}
                        width={400}
                        height={200}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
