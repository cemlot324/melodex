'use client'

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { User } from 'lucide-react'
import { SignInButton, SignOutButton, UserButton, useUser } from "@clerk/nextjs"

export default function LandingPage() {
  const { isSignedIn } = useUser()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/logo4.svg" alt="Melodex Logo" width={50} height={24} />
            <span className="text-xl font-bold"></span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium hover:text-primary">
              Home
            </Link>
            <Link href="/explore" className="text-sm font-medium hover:text-primary">
              Explore
            </Link>
            <Link href="/top-songs" className="text-sm font-medium hover:text-primary">
              Top Songs
            </Link>
          </nav>
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <SignOutButton>
                  <Button variant="outline" size="sm">
                    Sign out
                  </Button>
                </SignOutButton>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton>
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </SignInButton>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Track the songs you listened to, explore new songs and share with friends.
              </h1>
              <Button size="lg">Explore</Button>
            </div>
            <div className="relative h-64 md:h-96">
              <Image
                src="/hero.png"
                alt="Person listening to music"
                layout="fill"
                objectFit="contain"
                className="rounded-lg"
              />
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/logo4.svg" alt="Melodex Logo" width={24} height={24} />
            <span className="text-xl font-bold"></span>
          </div>
          <p className="text-sm text-gray-500 mt-4 md:mt-0">
            © {new Date().getFullYear()} Melodex. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}