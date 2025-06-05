"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, Sun, Moon, LogOut, User, Settings } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { useTheme } from "@/components/theme-provider"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

interface NavItem {
  label: string
  href: string
}
/*
const navItems: NavItem[] = [
  { label: "Accueil", href: "/" },
  { label: "Collections", href: "#features" },
  { label: "Notre tarification", href: "#pricing" },
  { label: "Nos destinations", href: "#destination" },
]*/

const menuItems = [
  { id: 'hero', label: 'Page d\'Accueil' },
  { id: 'about', label: 'Pourquoi Nous?' },
  { id: 'book', label: 'Réserver une Voyage' },
  { id: 'location', label: 'Location Spécial' },
];

export function Navbar({ isProfilePage = false }: { isProfilePage?: boolean }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    const handleScroll = () => {
      if (!isProfilePage) setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll, true)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-700",
        isScrolled 
          ? "bg-white py-[1px] backdrop-blur-sm shadow-sm h-14 dark:bg-gray-900 dark:shadow-gray-800/20 "
          : "bg-none py-[20px] shadow-none dark:bg-gray-900/10 ",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {/*<div className="h-8 w-8 rounded-full bg-primary" />*/}
              <span className={cn("text-xl font-mono font-bold",
               isScrolled ? "text-primary" : "text-white"
              )}>SoaDia Travel
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/#${item.id}`}
                className={cn(
                "text-sm font-bold hover:text-primary transition-colors dark:text-gray-200 dark:hover:text-primary",
                  isScrolled 
                  ? "text-primary/70"
                  : "text-blue-50"
                  )}
              >
                {item.label}
              </Link>
            ))}
            <ThemeToggle />
            <AuthButtons />
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-x-0 top-16 z-50 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-800/20 transition-all duration-300 ease-in-out",
            mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 pointer-events-none",
          )}
        >
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`#${item.id}`}
                className="text-base font-medium text-gray-700 hover:text-primary py-2 transition-colors dark:text-gray-200 dark:hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="py-2">
              <ThemeToggle mobile />
            </div>
            <MobileAuthButtons closeMenu={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  )

  function AuthButtons() {
    if (status === "loading") {
      return (
        <Button disabled variant="ghost">
          Chargement...
        </Button>
      )
    }

    if (session) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar>
                <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name} />
                <AvatarFallback>{session.user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{session.user.name}</p>
                <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{session.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/profile?tab=settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Paramètre</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => signOut({ redirect: true, callbackUrl: "/" })}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="border border-white text-white" onClick={() => router.push("/login")}>
          Connexion
        </Button>
        <Button onClick={() => router.push("/register")}>Inscription</Button>
      </div>
    )
  }

  function MobileAuthButtons({ closeMenu }: { closeMenu: () => void }) {
    if (status === "loading") {
      return <div className="py-4">Loading...</div>
    }

    if (session) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name} />
              <AvatarFallback>{session.user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{session.user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{session.user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              router.push("/profile")
              closeMenu()
            }}
          >
            <User className="mr-2 h-4 w-4" />
            Profil
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              router.push("/profile?tab=settings")
              closeMenu()
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Paramètre
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={() => {
              signOut({ redirect: true, callbackUrl: "/" })
              closeMenu()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            déconnexion
          </Button>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <Button
          className="w-full"
          onClick={() => {
            router.push("/login")
            closeMenu()
          }}
        >
          Connexion
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            router.push("/register")
            closeMenu()
          }}
        >
          Inscription
        </Button>
      </div>
    )
  }
}

function ThemeToggle({ mobile = false }: { mobile?: boolean }) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size={mobile ? "default" : "icon"}
      onClick={() => setTheme(theme === "dark" ? "light" : "light")}
      className={mobile ? "justify-start w-full" : ""}
    >
      {theme === "dark" ? (
        <>
          <Sun className="h-5 w-5" />
          {mobile && <span className="ml-2">Light Mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5" />
          {mobile && <span className="ml-2">Dark Mode</span>}
        </>
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
