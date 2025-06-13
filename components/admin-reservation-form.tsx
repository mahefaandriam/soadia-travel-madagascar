"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { CalendarIcon, Clock, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Input } from "@/components/ui/input"

// Payment methods
const paymentMethods = [
  { id: "visa", name: "Visa/Mastercard", icon: "💳" },
  { id: "paypal", name: "PayPal", icon: "🅿️" },
  { id: "btc", name: "Bitcoin", icon: "₿" },
]

interface AdminUser {
  id: number
  name: string
  email: string
}

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

interface Plan {
  id: number
  name: string
  price: number
  period: string
}

export function AdminReservationForm() {
  const { toast } = useToast()

  // Form state
  const [userId, setUserId] = useState("")
  const [userEmail, setUserEmail] = useState("")
  const [planId, setPlanId] = useState("")
  const [country, setCountry] = useState("")
  const [city, setCity] = useState("")
  const [date, setDate] = useState<Date>()
  const [time, setTime] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [selectedVehicle, setSelectedVehicle] = useState("")
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])

  // Data state
  const [users, setUsers] = useState<AdminUser[]>([])
  const [countries, setCountries] = useState<Country[]>([])
  const [cities, setCities] = useState<City[]>([])
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [plans, setPlans] = useState<Plan[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch initial data
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)

        // Fetch users
        const usersResponse = await fetch("/api/admin/users")
        if (usersResponse.ok) {
          const usersData = await usersResponse.json()
          setUsers(usersData)
        }

        // Fetch countries
        const countriesResponse = await fetch("/api/countries")
        if (countriesResponse.ok) {
          const countriesData = await countriesResponse.json()
          setCountries(countriesData)
        }

        // Fetch vehicles
        const vehiclesResponse = await fetch("/api/vehicles")
        if (vehiclesResponse.ok) {
          const vehiclesData = await vehiclesResponse.json()
          setVehicles(vehiclesData)
          if (vehiclesData.length > 0) {
            setSelectedVehicle(vehiclesData[0].id.toString())
          }
        }

        // Get plans
        const plansData = [
          {
            id: 1,
            name: "Basic",
            price: 29,
            period: "per trip",
          },
          {
            id: 2,
            name: "Premium",
            price: 49,
            period: "per trip",
          },
          {
            id: 3,
            name: "VIP",
            price: 99,
            period: "per trip",
          },
        ]
        setPlans(plansData)
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load necessary data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [toast])

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
        if (response.ok) {
          const data = await response.json()
          setCities(data)
        }
      } catch (error) {
        console.error("Error fetching cities:", error)
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

  // Handle user search
  const handleUserSearch = async () => {
    if (!userEmail) return

    try {
      setIsLoading(true)
      const response = await fetch(`/api/admin/users?email=${encodeURIComponent(userEmail)}`)

      if (response.ok) {
        const userData = await response.json()
        if (userData && userData.id) {
          setUserId(userData.id.toString())
          toast({
            title: "User found",
            description: `Found user: ${userData.name}`,
          })
        } else {
          toast({
            title: "User not found",
            description: "No user found with that email",
            variant: "destructive",
          })
          setUserId("")
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to search for user",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error searching for user:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Generate time slots from 9 AM to 6 PM
  const timeSlots = Array.from({ length: 10 }, (_, i) => {
    const hour = i + 9
    return `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? "PM" : "AM"}`
  })

  // Check if form is complete
  const isFormComplete =
    userId && planId && country && city && date && time && paymentMethod && selectedSeats.length > 0

  // Calculate total price based on selected plan and number of seats
  const calculateTotal = () => {
    if (!planId) return "N/A"

    const selectedPlan = plans.find((p) => p.id.toString() === planId)
    if (!selectedPlan) return "N/A"

    const basePrice = selectedPlan.price
    const total = basePrice * (selectedSeats.length || 1)

    return `$${total.toFixed(2)}`
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isFormComplete) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Get the selected vehicle and seats
      const vehicle = vehicles.find((v) => v.id.toString() === selectedVehicle)

      if (!vehicle) {
        throw new Error("Selected vehicle not found")
      }

      const selectedSeatIds = selectedSeats
        .map((seatId) => {
          const seat = vehicle?.seats.find((s) => s.seat_id === seatId)
          return seat?.id
        })
        .filter(Boolean)

      // Format the date and time
      const formattedDate = date ? format(date, "yyyy-MM-dd") : ""

      // Calculate total price
      const selectedPlan = plans.find((p) => p.id.toString() === planId)
      const totalPrice = selectedPlan ? selectedPlan.price * selectedSeats.length : 0

      // Create reservation data
      const reservationData = {
        user_id: Number.parseInt(userId),
        plan_id: Number.parseInt(planId),
        vehicle_id: Number.parseInt(selectedVehicle),
        reservation_date: formattedDate,
        reservation_time: time,
        country_id: Number.parseInt(country),
        city_id: Number.parseInt(city),
        payment_method: paymentMethod,
        total_price: totalPrice,
        selected_seats: selectedSeatIds,
        created_by_admin: true,
      }

      // Submit reservation
      const response = await fetch("/api/admin/reservations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()

      // Show success message
      toast({
        title: "Reservation Created",
        description: `Successfully created reservation #${result.id}`,
      })

      // Reset form
      resetForm()
    } catch (error) {
      console.error("Error creating reservation:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred"

      toast({
        title: "Reservation Failed",
        description: `There was an error creating the reservation: ${errorMessage}`,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setUserId("")
    setUserEmail("")
    setPlanId("")
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
    <Card>
      <CardHeader>
        <CardTitle>Create Reservation</CardTitle>
        <CardDescription>Create a new reservation for a user</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {/* User Selection */}
          <div className="space-y-2">
            <Label>Select User</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Select value={userId} onValueChange={setUserId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Users</SelectLabel>
                      {users.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {user.name} ({user.email})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-muted-foreground">OR</div>
              <div className="flex-1 flex gap-2">
                <Input placeholder="Search by email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} />
                <Button type="button" variant="outline" onClick={handleUserSearch} disabled={isLoading}>
                  {isLoading ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label>Select Plan</Label>
            <Select value={planId} onValueChange={setPlanId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Available Plans</SelectLabel>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id.toString()}>
                      {plan.name} (${plan.price} {plan.period})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Country Dropdown */}
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger id="country">
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Countries</SelectLabel>
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
              <Label htmlFor="city">City</Label>
              <Select value={city} onValueChange={setCity} disabled={!country || isLoading}>
                <SelectTrigger id="city">
                  <SelectValue placeholder={isLoading ? "Loading..." : "Select city"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Cities</SelectLabel>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger id="time">
                  <SelectValue placeholder="Select time">
                    {time ? (
                      <div className="flex items-center">
                        <Clock className="mr-2 h-4 w-4" />
                        {time}
                      </div>
                    ) : (
                      <span>Select time</span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Available Times</SelectLabel>
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
            <Label>Payment Method</Label>
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
                  <div className="text-xl">{method.icon}</div>
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

          {/* Reservation Summary */}
          <div className="rounded-lg border p-6 bg-gray-50 dark:bg-gray-900">
            <h3 className="text-lg font-semibold mb-4">Reservation Summary</h3>

            <div className="space-y-3">
              {userId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">User:</span>
                  <span className="font-medium">
                    {users.find((u) => u.id.toString() === userId)?.name || "Unknown"}
                  </span>
                </div>
              )}

              {planId && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Plan:</span>
                  <span className="font-medium">
                    {plans.find((p) => p.id.toString() === planId)?.name || "Unknown"}
                  </span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Price per seat:</span>
                <span className="font-medium">${plans.find((p) => p.id.toString() === planId)?.price || "N/A"}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Selected seats:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seatId) => (
                      <Badge key={seatId} variant="secondary" className="text-xs">
                        {seatId}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-500">None</span>
                  )}
                </div>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Number of seats:</span>
                <span className="font-medium">{selectedSeats.length}</span>
              </div>

              {country && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Country:</span>
                  <span className="font-medium">{countries.find((c) => c.id.toString() === country)?.name}</span>
                </div>
              )}

              {city && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">City:</span>
                  <span className="font-medium">{cities.find((c) => c.id.toString() === city)?.name}</span>
                </div>
              )}

              {date && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Date:</span>
                  <span className="font-medium">{format(date, "PPP")}</span>
                </div>
              )}

              {time && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Time:</span>
                  <span className="font-medium">{time}</span>
                </div>
              )}

              {paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Payment:</span>
                  <span className="font-medium">{paymentMethods.find((p) => p.id === paymentMethod)?.name}</span>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{calculateTotal()}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={resetForm}>
            Reset
          </Button>
          <Button type="submit" disabled={!isFormComplete || isSubmitting}>
            {isSubmitting ? "Creating Reservation..." : "Create Reservation"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
