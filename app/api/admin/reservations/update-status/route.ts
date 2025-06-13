import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function POST(request: Request) {
  try {
        // Get session for admin access
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.email === "admin@soatransplus.com"

    console.log("there");
    // Check if user is admin
    if (!session?.user || session.user.email !== "admin@soatransplus.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    
    console.log("there1");
    
    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error in update-status endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}