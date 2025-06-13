"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { AdminReservationForm } from "@/components/admin-reservation-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CreateReservationPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Redirect if not admin
  useEffect(() => {
    if (status === "loading") return

    if (!session || session.user.email !== "admin@soatransplus.com") {
      router.push("/")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session || session.user.email !== "admin@soatransplus.com") {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Create Reservation</h1>
              <p className="text-gray-600 dark:text-gray-400">Create a new reservation for a user</p>
            </div>
          </div>

          <AdminReservationForm />
        </div>
      </main>
      <Footer />
    </div>
  )
}
