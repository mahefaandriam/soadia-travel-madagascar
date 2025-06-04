"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, UserIcon } from "lucide-react"

export function AuthButtons({ mobile = false }: { mobile?: boolean }) {
  const { user, isLoading, signIn, signUp, signOut } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await signIn(email, password)
    setIsLoginOpen(false)
    setEmail("")
    setPassword("")
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    await signUp(name, email, password)
    setIsSignupOpen(false)
    setName("")
    setEmail("")
    setPassword("")
  }

  if (isLoading) {
    return (
      <Button disabled variant="ghost">
        Loading...
      </Button>
    )
  }

  if (user) {
    if (mobile) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-3 px-2">
            <Avatar>
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
            <UserIcon className="mr-2 h-4 w-4" />
            Profil
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={() => {}}>
            <Settings className="mr-2 h-4 w-4" />
            Paramètres
          </Button>
          <Button variant="ghost" className="w-full justify-start" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      )
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar>
              <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-gray-500 dark:text-gray-400">{user.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profil</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Paramètres</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Déconnexion</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  if (mobile) {
    return (
      <div className="space-y-4">
        <Button className="w-full" onClick={() => setIsLoginOpen(true)}>
         Connexion
        </Button>
        <Button variant="outline" className="w-full" onClick={() => setIsSignupOpen(true)}>
          Inscription
        </Button>

        {/* Login Dialog */}
        <LoginDialog
          isOpen={isLoginOpen}
          onClose={() => setIsLoginOpen(false)}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleLogin}
        />

        {/* Signup Dialog */}
        <SignupDialog
          isOpen={isSignupOpen}
          onClose={() => setIsSignupOpen(false)}
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSignup}
        />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={() => setIsLoginOpen(true)}>
        Connexion
      </Button>
      <Button onClick={() => setIsSignupOpen(true)}>Incription</Button>

      {/* Login Dialog */}
      <LoginDialog
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
      />

      {/* Signup Dialog */}
      <SignupDialog
        isOpen={isSignupOpen}
        onClose={() => setIsSignupOpen(false)}
        name={name}
        setName={setName}
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSignup}
      />
    </div>
  )
}

function LoginDialog({
  isOpen,
  onClose,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Connexion</DialogTitle>
          <DialogDescription>Entrez votre Email et votre mot de passe pour vous connecter à votre compte.</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Sign in</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

function SignupDialog({
  isOpen,
  onClose,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  onSubmit,
}: {
  isOpen: boolean
  onClose: () => void
  name: string
  setName: (name: string) => void
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  onSubmit: (e: React.FormEvent) => void
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Inscription</DialogTitle>
          <DialogDescription>Créer une compte pour commmencer</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nom</Label>
              <Input id="name" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email-signup">Email</Label>
              <Input
                id="email-signup"
                type="email"
                placeholder="nom@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password-signup">Mot de passe</Label>
              <Input
                id="password-signup"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Inscription</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
