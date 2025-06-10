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

    // Get user statistics
    const userStats = await sql`
      SELECT 
        COUNT(*) as total_users,
        COUNT(CASE WHEN COALESCE(status, 'pending') = 'pending' THEN 1 END) as pending_users
      FROM users
    `

    // Get reservation statistics
    const reservationStats = await sql`
      SELECT 
        COUNT(*) as total_reservations,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_reservations,
        COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_reservations,
        COALESCE(SUM(CASE WHEN status = 'confirmed' OR status = 'completed' THEN total_price ELSE 0 END), 0) as total_revenue
      FROM reservations
    `

    const stats = {
      totalUsers: Number(userStats[0].total_users),
      pendingUsers: Number(userStats[0].pending_users),
      totalReservations: Number(reservationStats[0].total_reservations),
      pendingReservations: Number(reservationStats[0].pending_reservations),
      confirmedReservations: Number(reservationStats[0].confirmed_reservations),
      totalRevenue: Number(reservationStats[0].total_revenue),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching admin stats:", error)
    return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 })
  }
}
