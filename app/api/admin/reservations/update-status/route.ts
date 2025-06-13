import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {

    console.log("there");
    
    console.log("there1");

    return NextResponse.json({
      success: true
    })
  } catch (error) {
    console.error("Error in update-status endpoint:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}