import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"
import { SessionProvider } from "@/components/session-provider"
import { Pacifico } from 'next/font/google';

export const metadata: Metadata = {
  title: "Soadia Travel Madagascar",
  description: "Created by Connect Talent Dev",
  generator: "",
}

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap', 
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={pacifico.variable}>
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
