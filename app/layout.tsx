// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/hooks/use-toast"
import { SessionProvider } from "@/components/session-provider"
import { Pacifico } from 'next/font/google'
import Script from "next/script"

export const metadata: Metadata = {
  title: "Soa Dia Travel Madagascar",
  description: "Created by Connect Talent Dev",
  generator: "",
  icons: "/favicon.png",
}

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-pacifico',
  display: 'swap', 
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning className={pacifico.variable}>
      <head>
        {/* Example: Global XM / Google Ads script */}
        <Script
          strategy="afterInteractive"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8528915813394509"
          crossOrigin="anonymous"
        />
      </head>
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
