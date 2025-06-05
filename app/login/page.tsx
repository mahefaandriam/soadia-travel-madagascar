"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn, useSession } from "next-auth/react"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function LoginPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  // Redirect if already logged in
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/profile")
    }
  }, [status, router])

  // Get error message from URL if it exists
  const error = searchParams.get("error")
  let errorMessage = ""

  if (error) {
    switch (error) {
      case "CredentialsSignin":
        errorMessage = "Email ou mot de passe incorrect"
        break
      case "OAuthAccountNotLinked":
        errorMessage = "Cet email est déjà associé avec un autre compte"
        break
      case "OAuthSignin":
      case "OAuthCallback":
      case "OAuthCreateAccount":
        errorMessage = "Erreur d'authentification"
        break
      case "EmailCreateAccount":
      case "EmailSignin":
        errorMessage = "Erreur d'authentification de l'Email"
        break
      case "SessionRequired":
        errorMessage = "Vous devez  vous inscrire pour accéder à la page"
        break
      default:
        errorMessage = error
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Redirect to profile page or the page they came from
      const callbackUrl = searchParams.get("callbackUrl") || "/profile"
      router.push(callbackUrl)

      toast({
        title: "Connexion effectuée",
        description: "Vous avez été connecté avec succès",
      })
    } catch (error) {
      toast({
        title: "Erreur du connexion",
        description: error instanceof Error ? error.message : "Email ou mot de passe incorrect",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar isProfilePage={true} />
      <main className="flex-1 flex items-center justify-center p-4 mt-16">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Connexion</CardTitle>
            <CardDescription>Entrez vos identifiants pour accéder à votre compte</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="rakoto@exemple.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                  Mot de passe oublié ?
                  </Link>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
              <div className="text-center text-sm">
                Vous n'avez pas de compte ?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Créer une compte
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
