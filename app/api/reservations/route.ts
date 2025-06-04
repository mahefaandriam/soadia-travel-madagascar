import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { createReservation, getReservationById, getReservationsByUserId, updateReservationStatus } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const reservation = await getReservationById(Number.parseInt(id))

      if (!reservation) {
        return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
      }

      // Check if the reservation belongs to the current user
      if (reservation.user_id !== Number.parseInt(session.user.id)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
      }

      return NextResponse.json(reservation)
    }

    const reservations = await getReservationsByUserId(Number.parseInt(session.user.id))
    return NextResponse.json(reservations)
  } catch (error) {
    console.error("Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    // Add user_id to the data
    data.user_id = Number.parseInt(session.user.id)

    const reservation = await createReservation(data)

    return NextResponse.json(reservation)
  } catch (error) {
    console.error("Error creating reservation:", error)
    return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const { id, status } = data

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if the reservation belongs to the current user
    const reservation = await getReservationById(id)

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    if (reservation.user_id !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const updatedReservation = await updateReservationStatus(id, status)

    return NextResponse.json(updatedReservation)
  } catch (error) {
    console.error("Error updating reservation:", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}
