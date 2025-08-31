"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Upload, X, Loader2, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import { supabase } from "@/lib/supabaseClient";
import ErrorBoundary from "@/components/ErrorBoundary";
import { motion } from "framer-motion";

// Schema Validation
const postSkillSchema = z.object({
  skill_name: z.string().min(3, "Skill name must be at least 3 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
});

type PostSkillFormData = z.infer<typeof postSkillSchema>;

function PostSkillPageContent() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostSkillFormData>({
    resolver: zodResolver(postSkillSchema),
  });

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      alert("Image must be under 5MB.");
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `skills/${fileName}`;
      const { error } = await supabase.storage
        .from("user-uploads")
        .upload(filePath, imageFile);
      if (error) throw error;
      const { data } = supabase.storage
        .from("user-uploads")
        .getPublicUrl(filePath);
      return data.publicUrl;
    } catch {
      return null;
    }
  };

  const onSubmit = async (data: PostSkillFormData) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      let imageUrl = null;
      if (imageFile) {
        setUploadProgress(50);
        imageUrl = await uploadImage();
        setUploadProgress(100);
      }

      const response = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, image_url: imageUrl }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        throw new Error("Failed to post skill");
      }
    } catch {
      alert("Error posting skill. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded)
    return (
      <div className="h-screen flex items-center justify-center bg-neutral-100">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );

  if (!isSignedIn)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-neutral-100">
        <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
        <button
          onClick={() => router.push("/sign-in")}
          className="btn-primary px-6 py-3"
        >
          Sign In
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-10">
        <BackButton />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-2xl shadow-lg mt-4"
        >
          {success ? (
            <div className="text-center py-16">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-2">Skill Posted!</h1>
              <p className="text-neutral-600">
                Redirecting you to dashboard...
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-1">Post a Skill</h1>
              <p className="text-neutral-500 mb-6">
                Share your knowledge with fellow students
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm mb-2">Skill Name *</label>
                  <input
                    type="text"
                    {...register("skill_name")}
                    className="input-field"
                    placeholder="e.g. Web Development"
                  />
                  {errors.skill_name && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.skill_name.message}
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm mb-2">Description *</label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    className="input-field"
                    placeholder="What will others learn? Your experience?"
                  />
                  {errors.description && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm mb-2">Skill Image</label>
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg p-6 cursor-pointer hover:border-primary transition">
                      <Upload className="w-8 h-8 text-neutral-400 mb-2" />
                      <span className="text-neutral-500 text-sm">
                        Click to upload or drag & drop
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </label>
                  )}
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="w-full bg-neutral-200 h-2 rounded-full">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary py-3 text-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Posting...
                    </span>
                  ) : (
                    "Post Skill"
                  )}
                </button>
              </form>
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
}

export default function PostSkillPage() {
  return (
    <ErrorBoundary
      fallback={<div className="h-screen flex items-center justify-center">Error loading page.</div>}
    >
      <PostSkillPageContent />
    </ErrorBoundary>
  );
}
