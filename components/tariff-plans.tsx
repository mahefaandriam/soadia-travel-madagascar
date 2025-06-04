"use client"

import { useState, useEffect } from "react"
import { Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ReservationModal } from "@/components/reservation-modal"

interface TariffFeature {
  id: number
  plan_id: number
  name: string
  is_included: boolean
}

interface TariffPlan {
  id: number
  name: string
  price: string
  description: string
  features: TariffFeature[]
  is_popular: boolean
  period: string
}

export function TariffPlans() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<TariffPlan | null>(null)
  const [plans, setPlans] = useState<TariffPlan[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchPlans() {
      try {
        const response = await fetch("/api/plans")
        if (!response.ok) {
          throw new Error("Failed to fetch plans")
        }
        const data = await response.json()

        // Format the price to include the dollar sign
        const formattedPlans = data.map((plan: any) => ({
          ...plan,
          price: `${Number.parseFloat(plan.price).toFixed(2)} MGA`,
        }))

        setPlans(formattedPlans)
      } catch (error) {
        console.error("Error fetching plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPlans()
  }, [])

  const handlePlanSelect = (plan: TariffPlan) => {
    setSelectedPlan(plan)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <div id="tariff-plan" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={cn(
              "rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl",
              "bg-white dark:bg-gray-900 border dark:border-gray-700",
              plan.is_popular
                ? "border-primary dark:border-primary shadow-lg scale-105 z-10"
                : "border-gray-200 hover:border-gray-300 dark:hover:border-gray-600",
            )}
          >
            {plan.is_popular && (
              <div className="bg-primary text-white text-center py-2 font-medium text-sm">Le plus populaire chez-nous</div>
            )}

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 dark:text-white">{plan.name}</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold dark:text-white">{plan.price}</span>
                <span className="text-gray-500 dark:text-gray-400 ml-1">{plan.period}</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 h-12">{plan.description}</p>

              <Button
                className={cn(
                  "w-full mb-6",
                  plan.is_popular ? "" : "bg-gray-800 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600",
                )}
                onClick={() => handlePlanSelect(plan)}
              >
                {plan.name === "VIP +" ? "Contactez-nous" : "Réserver maintenant"}
              </Button>

              <div className="space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature.id} className="flex items-center">
                    {feature.is_included ? (
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 dark:text-gray-600 mr-2 flex-shrink-0" />
                    )}
                    <span
                      className={cn(
                        "text-sm",
                        feature.is_included ? "text-gray-700 dark:text-gray-300" : "text-gray-400 dark:text-gray-500",
                      )}
                    >
                      {feature.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reservation Modal */}
      <ReservationModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} selectedPlan={selectedPlan} />
    </>
  )
}
