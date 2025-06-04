import { NextResponse } from "next/server"
import { getAllVehicles, getVehicleById } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const vehicle = await getVehicleById(Number.parseInt(id))

      if (!vehicle) {
        return NextResponse.json({ error: "Vehicle not found" }, { status: 404 })
      }

      return NextResponse.json(vehicle)
    }

    const vehicles = await getAllVehicles()
    return NextResponse.json(vehicles)
  } catch (error) {
    console.error("Error fetching vehicles:", error)
    return NextResponse.json({ error: "Failed to fetch vehicles" }, { status: 500 })
  }
}
