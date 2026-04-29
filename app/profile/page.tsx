"use client"

import { useRouter } from "next/navigation"
import { Suspense } from "react"
import { UserProfile } from "@/components/user-profile"

function ProfileContent() {
  const router = useRouter()

  return (
    <UserProfile
      onClose={() => router.push("/")}
      onAccountDeleted={() => router.push("/")}
    />
  )
}

export default function ProfilePage() {
  return (
    <Suspense>
      <ProfileContent />
    </Suspense>
  )
}
