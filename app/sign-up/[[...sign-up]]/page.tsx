import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Join ThaparSkills
          </h1>
          <p className="text-neutral-600">
            Create your account to start sharing and learning skills
          </p>
        </div>
        <SignUp 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "shadow-none bg-white rounded-lg border border-neutral-200",
            }
          }}
        />
      </div>
    </div>
  );
}
