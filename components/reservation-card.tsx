"use client"

import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, MapPin, Car, CreditCard, Users } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

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

interface ReservationCardProps {
  reservation: Reservation
}

export function ReservationCard({ reservation }: ReservationCardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  // Determine badge color based on status
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "upcoming":
        return "default"
      case "completed":
        return "outline"
      case "canceled":
        return "destructive"
      default:
        return "default"
    }
  }

  // Format status text
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Prochainement"
      case "completed":
        return "Passé"
      case "canceled":
        return "Annulé"
      default:
        return ""
    }
  }

  // Handle reservation cancellation
  const handleCancel = async () => {
    if (!confirm("Êtes-vous sûr de vouloir annuler cette réservation?")) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: reservation.id,
          status: "canceled",
        }),
      })

      if (!response.ok) {
        throw new Error("Impossible d’annuler la réservation")
      }

      toast({
        title: "Réservation annulée",
        description: "Votre réservation a été annulé",
      })

      // Refresh the page to update the reservation list
      router.refresh()
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible d’annuler la réservation. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 pb-4">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl">{reservation.plan} Plan</CardTitle>
          <Badge variant={getBadgeVariant(reservation.status)}>{getStatusText(reservation.status)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Date</p>
                <p className="text-gray-600 dark:text-gray-300">{format(reservation.date, "PPPP", { locale: fr })}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Heure</p>
                <p className="text-gray-600 dark:text-gray-300">{reservation.time}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Lieu</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {reservation.location.city}, {reservation.location.country}
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-start">
              <Car className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Véhicules</p>
                <p className="text-gray-600 dark:text-gray-300">{reservation.vehicle.name}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Places</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {reservation.vehicle.seats.map((seat) => (
                    <Badge key={seat} variant="outline" className="text-xs">
                      {seat}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-start">
              <CreditCard className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Payment</p>
                <p className="text-gray-600 dark:text-gray-300">
                  {reservation.paymentMethod} • {reservation.price.replace(/[^0-9.]/g, "")} MGA
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-between py-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Réservation ID: {reservation.id}</p>
        </div>
        <div className="flex space-x-2">
          {reservation.status === "upcoming" && (
            <>
              {/*<Button variant="outline" size="sm">
                Modifier
              </Button>*/}
              <Button variant="destructive" size="sm" onClick={handleCancel} disabled={isLoading}>
                {isLoading ? "Anuller..." : "Annuler"}
              </Button>
            </>
          )}
          {/*<Button size="sm">Voir les détails</Button> */}
        </div>
      </CardFooter>
    </Card>
  )
}
