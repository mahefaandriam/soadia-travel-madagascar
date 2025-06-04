"use client"
import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import { NavigationIcon as Steering } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

interface Seat {
  id: number
  vehicle_id: number
  seat_id: string
  row_number: number
  position: number
  status: string
}

interface Vehicle {
  id: number
  name: string
  image_url: string
  seats: Seat[]
}

interface CarSeatSelectorProps {
  vehicles: Vehicle[]
  selectedVehicle: string
  onSelectVehicle: (vehicleId: string) => void
  selectedSeats: string[]
  onSelectSeat: (seatId: string) => void
}

export function CarSeatSelector({
  vehicles,
  selectedVehicle,
  onSelectVehicle,
  selectedSeats,
  onSelectSeat,
}: CarSeatSelectorProps) {
  const currentVehicle = vehicles.find((vehicle) => vehicle.id.toString() === selectedVehicle) || vehicles[0]

  const handleSeatClick = (seatId: string) => {
    const seat = currentVehicle.seats.find((s) => s.seat_id === seatId)
    if (seat && seat.status !== "unavailable") {
      onSelectSeat(seatId)
    }
  }

  const isSeatSelected = (seatId: string) => {
    return selectedSeats.includes(seatId)
  }

  // Group seats by row
  const seatsByRow = currentVehicle?.seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row_number]) {
        acc[seat.row_number] = []
      }
      acc[seat.row_number].push(seat)
      return acc
    },
    {} as Record<number, Seat[]>,
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-base">Selectionner une voiture</Label>
        <Select value={selectedVehicle} onValueChange={onSelectVehicle}>
          <SelectTrigger>
            <SelectValue placeholder="Selectionner une voiture" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Voitures disponibles</SelectLabel>
              {vehicles.map((vehicle) => (
                <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                  {vehicle.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-base">Selectionner votre place</Label>
          <Badge variant="outline" className="ml-2">
            {selectedSeats.length} seat{selectedSeats.length !== 1 ? "s" : ""} selectionner
          </Badge>
        </div>

        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          {/* Car image */}
          <div className="mb-4 flex justify-center">
            <img
              src={currentVehicle?.image_url || "/placeholder.svg"}
              alt={currentVehicle?.name}
              className="h-16 object-contain rounded-md"
            />
          </div>

          {/* Car outline */}
          <div className="relative mx-auto w-full max-w-md border-2 border-gray-400 dark:border-gray-600 rounded-xl p-4">
            {/* Car front (dashboard) */}
            <div className="mb-6 w-full h-8 bg-gray-300 dark:bg-gray-700 rounded-md flex items-center justify-center">
              <Steering className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>

            {/* Seats container */}
            <div className="space-y-4">
              {/* Group seats by row */}
              {seatsByRow &&
                Object.keys(seatsByRow).map((rowNum) => (
                  <div key={rowNum} className="flex justify-center space-x-4">
                    {seatsByRow[Number.parseInt(rowNum)]
                      .sort((a, b) => a.position - b.position)
                      .map((seat) => (
                        <div
                          key={seat.id}
                          className={cn(
                            "w-12 h-12 rounded-md flex items-center justify-center cursor-pointer transition-colors",
                            seat.status === "unavailable"
                              ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                              : isSeatSelected(seat.seat_id)
                                ? "bg-primary text-white"
                                : "bg-white dark:bg-gray-600 hover:bg-primary/20 dark:hover:bg-primary/20",
                          )}
                          onClick={() => handleSeatClick(seat.seat_id)}
                        >
                          {seat.seat_id}
                        </div>
                      ))}
                  </div>
                ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex justify-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-white dark:bg-gray-600 rounded-sm mr-2"></div>
              <span>Disponilble</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-primary rounded-sm mr-2"></div>
              <span>sélectionné</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-300 dark:bg-gray-700 rounded-sm mr-2"></div>
              <span>Non disponible</span>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
            Cliquez sur plusieurs sièges pour les sélectionner. Cliquez à nouveau pour désélectionner.
          </div>
        </div>
      </div>
    </div>
  )
}
