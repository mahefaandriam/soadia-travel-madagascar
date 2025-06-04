import { NextResponse } from "next/server"
import { getAllCountries, getCitiesByCountryId } from "@/lib/db"

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const countryId = url.searchParams.get("countryId")

    if (countryId) {
      const cities = await getCitiesByCountryId(Number.parseInt(countryId))
      return NextResponse.json(cities)
    }

    const countries = await getAllCountries()
    return NextResponse.json(countries)
  } catch (error) {
    console.error("Error fetching countries/cities:", error)
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
  }
}
