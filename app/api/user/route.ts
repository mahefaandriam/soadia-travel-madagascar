import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { updateUser, updateUserSettings } from "@/lib/db"

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()
    const userId = Number.parseInt(session.user.id)

    // Update user profile
    if (data.profile) {
      const updatedUser = await updateUser(userId, data.profile)

      if (!updatedUser) {
        return NextResponse.json({ error: "Failed to update user profile" }, { status: 500 })
      }
    }

    // Update user settings
    if (data.settings) {
      const updatedSettings = await updateUserSettings(userId, data.settings)

      if (!updatedSettings) {
        return NextResponse.json({ error: "Failed to update user settings" }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}
