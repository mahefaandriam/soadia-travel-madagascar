import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user || session.user.email !== "admin@soatransplus.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch all users with their status
    const users = await sql`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.phone,
        u.image_url,
        u.created_at,
        COALESCE(u.status, 'pending') as status
      FROM users u
      ORDER BY u.created_at DESC
    `

    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user || session.user.email !== "admin@soatransplus.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { userId, status } = await request.json()

    if (!userId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update user status
    const result = await sql`
      UPDATE users 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${userId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, user: result[0] })
  } catch (error) {
    console.error("Error updating user status:", error)
    return NextResponse.json({ error: "Failed to update user status" }, { status: 500 })
  }
}
