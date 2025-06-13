import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { updatePastReservations } from "@/lib/db"

export async function POST(request: Request) {
  try {
    // Check for API key in header for automated calls
    const apiKey = request.headers.get("x-api-key")
    const validApiKey = process.env.RESERVATION_UPDATE_API_KEY

    // Get session for admin access
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.email === "admin@soatransplus.com"

    // Authorize request - either valid API key or admin user
    if (!isAdmin && apiKey !== validApiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update past reservations
    const result = await updatePastReservations()

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Error in update-status endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}