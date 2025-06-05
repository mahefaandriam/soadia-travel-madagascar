"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, User, Settings, LogOut, Edit, Shield } from "lucide-react"
import { Navbar } from "@/components/navbar"
import Footer from "@/components/Footer"
import { ReservationCard } from "@/components/reservation-card"
import { EditProfileDialog } from "@/components/edit-profile-dialog"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { signOut } from "next-auth/react"

interface Reservation {
  id: string
  date: Date
  time: string
  plan: string
  price: string
  location: {
    country: string
    city: string
  }
  vehicle: {
    name: string
    seats: string[]
  }
  paymentMethod: string
  status: "upcoming" | "completed" | "canceled"
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("upcoming")
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [reservations, setReservations] = useState<Reservation[]>([])

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(session?.user?.emailNotifications || false)
  const [smsNotifications, setSmsNotifications] = useState(session?.user?.smsNotifications || false)
  const [darkMode, setDarkMode] = useState(session?.user?.darkMode || false)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(session?.user?.twoFactorEnabled || false)

  // Fetch reservations
  useEffect(() => {
    if (status === "authenticated") {
      fetchReservations()
    }
  }, [status])

  const fetchReservations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/reservations")

      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des réservations:")
      }

      const data = await response.json()

      // Transform the data to match our Reservation interface
      const formattedReservations = data.map((res: any) => ({
        id: res.id.toString(),
        date: new Date(res.reservation_date),
        time: res.reservation_time,
        plan: res.plan_name,
        price: `$${Number(res.total_price).toFixed(2)}`,
        location: {
          country: res.country_name,
          city: res.city_name,
        },
        vehicle: {
          name: res.vehicle_name,
          seats: res.seats ? res.seats.map((seat: any) => seat.seat_id) : [],
        },
        paymentMethod: res.payment_method,
        status: res.status,
      }))

      setReservations(formattedReservations)
    } catch (error) {
      console.error("Erreur lors de la récupération des réservations:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les réservations",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle settings update
  const handleSaveSettings = async () => {
    try {
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          settings: {
            email_notifications: emailNotifications,
            sms_notifications: smsNotifications,
            dark_mode: darkMode,
            two_factor_enabled: twoFactorEnabled,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Échec de la mise à jour des paramètres")
      }

      toast({
        title: "Paramètres mis à jour",
        description: "Vos paramètres ont été enregistrés avec succès.",
      })
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour des paramètres",
        variant: "destructive",
      })
    }
  }

  // Handle sign out
  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    }
  }, [status, router])

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Filter reservations by status
  const upcomingReservations = reservations.filter((res) => res.status === "upcoming")
  const pastReservations = reservations.filter((res) => res.status === "completed" || res.status === "canceled")

  return (
    <div className="min-h-screen">
      <Navbar isProfilePage={true}/>
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          {/* User Profile Sidebar */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={session.user.image || "/placeholder.svg"} alt={session.user.name} />
                    <AvatarFallback className="text-2xl">{session.user.name.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{session.user.name}</CardTitle>
                <CardDescription>{session.user.email}</CardDescription>
                {session.user.phone && <CardDescription className="mt-1">{session.user.phone}</CardDescription>}
              </CardHeader>
              <CardContent>
                {session.user.bio && (
                  <div className="mb-4 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">"{session.user.bio}"</p>
                  </div>
                )}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Badge className="mr-2">{upcomingReservations.length}</Badge>
                    <span>Prochaines réservations</span>
                  </div>
                  <div className="flex items-center">
                    <Badge variant="outline" className="mr-2">
                      {pastReservations.length}
                    </Badge>
                    <span>Réservations passées</span>
                  </div>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <Button
                      variant={activeTab === "upcoming" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("upcoming")}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Prochaines réservations
                    </Button>
                    <Button
                      variant={activeTab === "past" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("past")}
                    >
                      <Clock className="mr-2 h-4 w-4" />
                      Réservations passées
                    </Button>
                    <Button
                      variant={activeTab === "account" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("account")}
                    >
                      <User className="mr-2 h-4 w-4" />
                      Information du compte
                    </Button>
                    <Button
                      variant={activeTab === "settings" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="mr-2 h-4 w-4" />
                      Paramètres
                    </Button>
                    <Separator className="my-2" />
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Déconnexion
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="upcoming">Prochain</TabsTrigger>
                <TabsTrigger value="past">Passé</TabsTrigger>
                <TabsTrigger value="account">Compte</TabsTrigger>
                <TabsTrigger value="settings">Paramètres</TabsTrigger>
              </TabsList>

              {/* Prochaines réservations Tab */}
              <TabsContent value="upcoming" className="space-y-6">
                <h2 className="text-2xl font-bold">Prochaines réservations</h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : upcomingReservations.length > 0 ? (
                  upcomingReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas de prochaines réservations</p>
                      <Button className="mt-4" onClick={() => router.push("/#pricing")}>
                        Faire une réservations
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Réservations passées Tab */}
              <TabsContent value="past" className="space-y-6">
                <h2 className="text-2xl font-bold">Réservations passées</h2>
                {isLoading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                  </div>
                ) : pastReservations.length > 0 ? (
                  pastReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} />
                  ))
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-gray-500 dark:text-gray-400">Vous n'avez pas de réservations passées</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Information du compte Tab */}
              <TabsContent value="account">
                <Card>
                  <CardHeader>
                    <CardTitle>Information du compte</CardTitle>
                    <CardDescription>Paramètrés vos informations</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Nom complet</label>
                        <p className="text-lg">{session.user.name}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Adresse Email</label>
                        <p className="text-lg">{session.user.email}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Numéro de téléphone</label>
                        <p className="text-lg">{session.user.phone || "Not provided"}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Membre Depuis</label>
                        <p className="text-lg">{format(new Date(), "MMMM yyyy")}</p>
                      </div>
                    </div>

                    {session.user.bio && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Bio</label>
                        <p className="text-base mt-1">{session.user.bio}</p>
                      </div>
                    )}

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status du compte</label>
                      <p className="text-lg">
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                        >
                          Active
                        </Badge>
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="mr-2" onClick={() => setIsEditProfileOpen(true)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Modifier profil
                    </Button>
                    <Button variant="outline">Changer mot de passe</Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              {/* Settings Tab */}
              <TabsContent value="settings">
                <Card>
                  <CardHeader>
                    <CardTitle>Paramètres</CardTitle>
                    <CardDescription>Gérer les paramètres et préférences de votre compte</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-6">
                      {/* Notifications Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Notifications du Email</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Recevoir des mises à jour par Email sur vos réservations
                              </p>
                            </div>
                            <Switch
                              checked={emailNotifications}
                              onCheckedChange={setEmailNotifications}
                              aria-label="Toggle email notifications"
                            />
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Notifications par SMS</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">Recevoir des rappels par SMS</p>
                            </div>
                            <Switch
                              checked={smsNotifications}
                              onCheckedChange={setSmsNotifications}
                              aria-label="Toggle SMS notifications"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Appearance Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Apparence</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Dark Mode</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Utiliser un thème sombre pour l’application
                              </p>
                            </div>
                            <Switch checked={darkMode} onCheckedChange={setDarkMode} aria-label="Toggle dark mode" />
                          </div>
                        </div>
                      </div>

                      {/* Security Section */}
                      <div>
                        <h3 className="text-lg font-medium mb-4">Sécurité</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Authentification à deux facteurs</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Ajoutez une couche de sécurité supplémentaire à votre compte
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Shield className="mr-2 h-4 w-4" />
                              {twoFactorEnabled ? "Désactiver" : "Activer"}
                            </Button>
                          </div>
                          <Separator />
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium">Gestion des sessions</h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Gérez vos sessions et appareils actifs
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Gérer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={handleSaveSettings}>Enregistrer les paramètres</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />

      {/* Edit Profile Dialog */}
      <EditProfileDialog isOpen={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </div>
  )
}
