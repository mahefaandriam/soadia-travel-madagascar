import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/lib/db"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Get user from database
          const user = await getUserByEmail(credentials.email)

          if (!user) {
            return null
          }

          // Check password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            return null
          }

          // Return user object without password
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            image: user.image_url,
            phone: user.phone,
            bio: user.bio,
            emailNotifications: user.email_notifications,
            smsNotifications: user.sms_notifications,
            darkMode: user.dark_mode,
            twoFactorEnabled: user.two_factor_enabled,
            language: user.language,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.phone = user.phone
        token.bio = user.bio
        token.emailNotifications = user.emailNotifications
        token.smsNotifications = user.smsNotifications
        token.darkMode = user.darkMode
        token.twoFactorEnabled = user.twoFactorEnabled
        token.language = user.language
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.phone = token.phone
        session.user.bio = token.bio
        session.user.emailNotifications = token.emailNotifications
        session.user.smsNotifications = token.smsNotifications
        session.user.darkMode = token.darkMode
        session.user.twoFactorEnabled = token.twoFactorEnabled
        session.user.language = token.language
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
