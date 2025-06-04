import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      phone?: string
      bio?: string
      emailNotifications?: boolean
      smsNotifications?: boolean
      darkMode?: boolean
      twoFactorEnabled?: boolean
      language?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    phone?: string
    bio?: string
    emailNotifications?: boolean
    smsNotifications?: boolean
    darkMode?: boolean
    twoFactorEnabled?: boolean
    language?: string
  }
}
