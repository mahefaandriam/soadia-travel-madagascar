import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"
import { SessionProvider } from "@/components/session-provider"

export const metadata: Metadata = {
  title: "Soadia Travel Madagascar",
  description: "Created by Connect Talent Dev",
  generator: "",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SessionProvider>
            <ToastProvider>{children}</ToastProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
