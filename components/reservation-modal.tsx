"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { fr } from 'date-fns/locale';
import { CalendarIcon, Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CarSeatSelector } from "@/components/car-seat-selector"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Payment methods
const paymentMethods = [
  { id: "oragemoney", name: "OrangeMoney : 032 22 222 22", icon: "/images/car/Bus.svg" },
 /* { id: "paypal", name: "PayPal", icon: "🅿️" },
  { id: "btc", name: "Bitcoin", icon: "₿" },*/
]

interface Country {
  id: number
  name: string
}

interface City {
  id: number
  name: string
  country_id: number
}

interface Vehicle {
  id: number
  name: string
  description: string
  image_url: string
  seats: Seat[]
}

interface Seat {
  id: number
  vehicle_id: number
  seat_id: string
  row_number: number
  position: number
  status: string
}

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  selectedPlan: {
    id: number
    name: string
    price: string
    period: string
  } | null
}

export function ReservationModal({ isOpen, onClose, selectedPlan }: ReservationModalProps) {
  const { toast } = useToast()

  // Form state
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Data state
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch countries
  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await fetch("/api/countries")
        if (!response.ok) {
          throw new Error("N’a pas réussi à obtenir les pays")
        }
        const data = await response.json()
        setCountries(data)
      } catch (error) {
        console.error("Erreur lors de l’extraction des pays :", error)
      }
    }

    if (isOpen) {
      fetchCountries()
    }
  }, [isOpen])

  // Fetch vehicles
  useEffect(() => {
    async function fetchVehicles() {
      try {
        const response = await fetch("/api/vehicles")
        if (!response.ok) {
          throw new Error("N’a pas réussi à récupérer les véhicules")
        }
        const data = await response.json()
        setVehicles(data)

        if (data.length > 0) {
          setSelectedVehicle(data[0].id.toString())
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des véhicules :", error)
      }
    }

    if (isOpen) {
      fetchVehicles()
    }
  }, [isOpen])

  // Fetch cities when country changes
  useEffect(() => {
    async function fetchCities() {
      if (!country) {
        setCities([])
        return
      }

      try {
        setIsLoading(true)
        const response = await fetch(`/api/countries?countryId=${country}`)
        if (!response.ok) {
          throw new Error("N’a pas réussi à récupérer les villes")
        }
        const data = await response.json()
        setCities(data)
      } catch (error) {
        console.error("Erreur lors de l’extraction des villes :", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCities()
    setCity("")
  }, [country])

  // Handle seat selection/deselection
  const handleSeatToggle = (seatId: string) => {
    setSelectedSeats((prev) => {
      if (prev.includes(seatId)) {
        return prev.filter((id) => id !== seatId)
      } else {
        return [...prev, seatId]
      }
    })
  }

  // Handle car selection
  const handleCarSelect = (carId: string) => {
    setSelectedVehicle(carId)
    setSelectedSeats([]) // Reset selected seats when changing cars
  }

  // Generate time slots from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Check if form is complete
  const isFormComplete = country && city && date && time && paymentMethod && selectedSeats.length > 0

  // Calculate total price based on selected plan and number of seats
  const calculateTotal = () => {
    if (!selectedPlan) return "N/A"

    const basePrice = Number.parseFloat(selectedPlan.price.replace("MGA", ""))
    const total = basePrice * (selectedSeats.length || 1)

    return `${total.toFixed(2)} MGA`
  }

  // Handle form submission
  const handleSubmit = async () => {
    if (!isFormComplete || !selectedPlan) return

    setIsSubmitting(true)

    try {
      // Get the selected vehicle and seats
      const vehicle = vehicles.find((v) => v.id.toString() === selectedVehicle)
      const selectedSeatIds = selectedSeats
        .map((seatId) => {
          const seat = vehicle?.seats.find((s) => s.seat_id === seatId)
          return seat?.id
        })
        .filter(Boolean)

      // Format the date and time
      const formattedDate = format(date!, "yyyy-MM-dd", { locale: fr })

      // Calculate total price
      const basePrice = Number.parseFloat(selectedPlan.price.replace("MGA", ""))
      const totalPrice = basePrice * selectedSeats.length

      // Create reservation data
      const reservationData = {
        plan_id: selectedPlan.id,
        vehicle_id: Number.parseInt(selectedVehicle),
        reservation_date: formattedDate,
        reservation_time: time,
        country_id: Number.parseInt(country),
        city_id: Number.parseInt(city),
        payment_method: paymentMethod,
        total_price: totalPrice,
        selected_seats: selectedSeatIds,
      }

      // Submit reservation
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        throw new Error("Impossible de créer une réservation")
      }

      // Show success message
      toast({
        title: "Réservation confirmée",
        description: "Votre réservation a été créée avec succ",
      })

      // Close modal and reset form
      onClose()
      resetForm()
    } catch (error) {
      console.error("Erreur de création de la réservation :", error)
      toast({
        title: "Échec de la réservation",
        description: "Il y a eu une erreur lors de la création de votre réservation. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setCountry("")
    setCity("")
    setDate(undefined)
    setTime("")
    setPaymentMethod("")
    setSelectedSeats([])
    if (vehicles.length > 0) {
      setSelectedVehicle(vehicles[0].id.toString())
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose} >
      <DialogContent className="sm:max-w-[900px] overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Faire une Réservation</DialogTitle>
          <DialogDescription>Remplissez le formulaire ci-dessous pour votre plan de reservation {selectedPlan?.name}.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          {/* Left Column - Form Inputs */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {/* Country Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="country">Ville</Label>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger id="country">
                    <SelectValue placeholder="Choisissez le ville" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ville</SelectLabel>
                      {countries.map((country) => (
                        <SelectItem key={country.id} value={country.id.toString()}>
                          {country.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* City Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="city">Déstination</Label>
                <Select value={city} onValueChange={setCity} disabled={!country || isLoading}>
                  <SelectTrigger id="city">
                    <SelectValue placeholder={isLoading ? "Loading..." : "Selectionner une ville"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Ville</SelectLabel>
                      {cities.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Date Picker */}
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time Picker */}
              <div className="space-y-2">
                <Label htmlFor="time">Heure</Label>
                <Select value={time} onValueChange={setTime}>
                  <SelectTrigger id="time">
                    <SelectValue placeholder="Select time">
                      {time ? (
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {time}
                        </div>
                      ) : (
                        <span>Choisir l'heure</span>
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>heures disponibles</SelectLabel>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-4">
              <Label>Methode de payment</Label>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 gap-4">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={cn(
                      "flex items-center space-x-3 rounded-md border p-4 cursor-pointer",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 dark:border-gray-800",
                    )}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
                    <div className="text-xl"><img src="{method.icon}" alt="Payment 1" /></div>
                    <Label htmlFor={method.id} className="flex-1 cursor-pointer font-normal">
                      {method.name}
                    </Label>
                    {paymentMethod === method.id && <Check className="h-5 w-5 text-primary" />}
                  </div>
                ))}
              </RadioGroup>
            </div>

            {/* Car Seat Selection */}
            {vehicles.length > 0 && (
              <CarSeatSelector
                vehicles={vehicles}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={handleCarSelect}
                selectedSeats={selectedSeats}
                onSelectSeat={handleSeatToggle}
              />
            )}
          </div>

          {/* Right Column - Summary */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Bon récapitulatif</h3>

            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Plan sélectionné</h4>
                <div className="mt-2 flex justify-between">
                  <span className="text-lg font-semibold dark:text-white">{selectedPlan?.name}</span>
                  <span className="text-lg font-semibold dark:text-white">{selectedPlan?.price} par place</span>
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{selectedPlan?.period}</div>
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Emplacement</h4>
                {country ? (
                  <div className="mt-2">
                    <div className="font-medium dark:text-white">
                      {countries.find((c) => c.id.toString() === country)?.name}
                    </div>
                    {city && (
                      <div className="text-gray-600 dark:text-gray-400">
                        {cities.find((c) => c.id.toString() === city)?.name}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500 dark:text-gray-400">Aucun emplacement sélectionné</div>
                )}
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Date & Heure</h4>
                {date ? (
                  <div className="mt-2">
                    <div className="font-medium dark:text-white">{format(date, "PPPP", { locale: fr })}</div>
                    {time && <div className="text-gray-600 dark:text-gray-400">{time}</div>}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500 dark:text-gray-400">Aucune date sélectionnée</div>
                )}
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Mode de paiement</h4>
                {paymentMethod ? (
                  <div className="mt-2 flex items-center">
                    <span className="text-xl mr-2">{paymentMethods.find((m) => m.id === paymentMethod)?.icon}</span>
                    <span className="font-medium dark:text-white">
                      {paymentMethods.find((m) => m.id === paymentMethod)?.name}
                    </span>
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500 dark:text-gray-400">Aucun mode de paiement sélectionné</div>
                )}
              </div>

              <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                <h4 className="font-medium text-gray-700 dark:text-gray-300">Voiture & places</h4>
                <div className="mt-2">
                  <div className="font-medium dark:text-white">
                    {vehicles.find((v) => v.id.toString() === selectedVehicle)?.name}
                  </div>
                  {selectedSeats.length > 0 ? (
                    <div className="mt-2">
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedSeats.map((seat) => (
                          <Badge key={seat} variant="outline">
                            Seat {seat}
                          </Badge>
                        ))}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                        {selectedSeats.length} place {selectedSeats.length !== 1 ? "s" : ""} sélectionné
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">Pas de place sélectioné</div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span className="dark:text-white">Total</span>
                <span className="dark:text-white">{calculateTotal()}</span>
              </div>
              {selectedSeats.length > 1 && (
                <div className="text-sm text-gray-500 dark:text-gray-400 text-right mt-1">
                  {selectedPlan?.price} × {selectedSeats.length} places
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} className="mr-2" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button disabled={!isFormComplete || isSubmitting} onClick={handleSubmit}>
            {isSubmitting ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Processing...
              </>
            ) : (
              "Completer la Reservation"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
