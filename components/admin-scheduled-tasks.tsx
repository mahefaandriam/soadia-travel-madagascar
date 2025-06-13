"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function AdminScheduledTasks() {
  const { toast } = useToast()
  const [isUpdating, setIsUpdating] = useState(false)
  const [lastRun, setLastRun] = useState<string | null>(null)
  const [updatedCount, setUpdatedCount] = useState<number | null>(null)

  const updatePastReservations = async () => {
    try {
      setIsUpdating(true)
      
      const response = await fetch("/api/admin/reservations/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "",
          email: "",
          password: "",
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to register")
      }
    
      setLastRun(data.timestamp)
      setUpdatedCount(data.updated)

      toast({
        title: "Update Complete",
        description: `Updated ${data.updated} reservation(s) to completed status.`,
      })
    } catch (error) {
      console.error("Error updating reservations:", error)
      toast({
        title: "Update Failed",
        description: "There was an error updating reservation statuses.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scheduled Tasks</CardTitle>
        <CardDescription>Manage automated system tasks</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-medium">Update Past Reservations</h3>
              <p className="text-sm text-muted-foreground">
                Automatically marks reservations with past dates as completed
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={updatePastReservations} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Run Now
                </>
              )}
            </Button>
          </div>

          {lastRun && (
            <div className="text-sm flex items-center text-muted-foreground">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Last run: {new Date(lastRun).toLocaleString()}
              {updatedCount !== null && (
                <span className="ml-2">
                  ({updatedCount} reservation{updatedCount !== 1 ? "s" : ""} updated)
                </span>
              )}
            </div>
          )}

          <div className="mt-2 text-xs text-muted-foreground">
            <AlertCircle className="h-3 w-3 inline-block mr-1" />
            This task runs automatically every day, but can also be triggered manually.
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Scheduled tasks help maintain system data integrity automatically.
      </CardFooter>
    </Card>
  )
}
