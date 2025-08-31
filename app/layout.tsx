import { ClerkProvider } from '@clerk/nextjs'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthDebug from '@/components/AuthDebug'
import { Suspense } from 'react'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ThaparSkills - Peer-to-Peer Skill Sharing',
  description: 'Connect with fellow Thapar University students to share and learn skills',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Debug environment variable
  console.log('Clerk publishable key:', process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? '✅ Set' : '❌ Missing')
  
  // Check if we're in the browser
  if (typeof window !== 'undefined') {
    console.log('Layout: Running in browser environment')
  }
  
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      appearance={{
        baseTheme: undefined,
        variables: {
          colorPrimary: '#0065BD',
          colorBackground: '#F5F5F5',
        }
      }}
      // Add these options to fix client-side initialization
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/onboarding"
    >
      <html lang="en">
        <body className={inter.className}>
          <Suspense fallback={null}>
            {children}
          </Suspense>
          <AuthDebug />
        </body>
      </html>
    </ClerkProvider>
  )
}
