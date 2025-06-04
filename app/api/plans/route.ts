import { NextResponse } from "next/server"
import { getAllPlans, getPlanById } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const id = url.searchParams.get("id")

    if (id) {
      const plan = await getPlanById(Number.parseInt(id))

      if (!plan) {
        return NextResponse.json({ error: "Plan not found" }, { status: 404 })
      }

      return NextResponse.json(plan)
    }

    const plans = await getAllPlans()
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
