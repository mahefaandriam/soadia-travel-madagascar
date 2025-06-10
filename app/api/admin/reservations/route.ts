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

    // Fetch all reservations with user and plan details
    const reservations = await sql`
      SELECT 
        r.id,
        r.reservation_date,
        r.reservation_time,
        r.total_price,
        r.payment_method,
        r.status,
        r.created_at,
        u.name as user_name,
        u.email as user_email,
        p.name as plan_name,
        v.name as vehicle_name,
        c1.name as country_name,
        c2.name as city_name
      FROM reservations r
      LEFT JOIN users u ON r.user_id = u.id
      LEFT JOIN plans p ON r.plan_id = p.id
      LEFT JOIN vehicles v ON r.vehicle_id = v.id
      LEFT JOIN countries c1 ON r.country_id = c1.id
      LEFT JOIN cities c2 ON r.city_id = c2.id
      ORDER BY r.created_at DESC
    `

    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is admin
    if (!session?.user || session.user.email !== "admin@soatransplus.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { reservationId, status } = await request.json()

    if (!reservationId || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Update reservation status
    const result = await sql`
      UPDATE reservations 
      SET status = ${status}, updated_at = CURRENT_TIMESTAMP
      WHERE id = ${reservationId}
      RETURNING *
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, reservation: result[0] })
  } catch (error) {
    console.error("Error updating reservation status:", error)
    return NextResponse.json({ error: "Failed to update reservation status" }, { status: 500 })
  }
}
