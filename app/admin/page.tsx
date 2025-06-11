"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Users, Calendar, CheckCircle, XCircle, Search, MoreHorizontal, Eye, UserCheck, UserX } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import Footer from "@/components/Footer"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  status: "pending" | "approved" | "rejected"
  created_at: string
  image_url?: string
}

interface Reservation {
  id: string
  user_name: string
  user_email: string
  plan_name: string
  vehicle_name: string
  reservation_date: string
  reservation_time: string
  total_price: number
  status: "pending" | "confirmed" | "canceled" | "completed"
  country_name: string
  city_name: string
  payment_method: string
  created_at: string
}

interface AdminStats {
  totalUsers: number
  pendingUsers: number
  totalReservations: number
  pendingReservations: number
  confirmedReservations: number
  totalRevenue: number
}

export default function AdminDashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [activeTab, setActiveTab] = useState("overview")
  const [users, setUsers] = useState<User[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingUsers: 0,
    totalReservations: 0,
    pendingReservations: 0,
    confirmedReservations: 0,
    totalRevenue: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Check if user is admin
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login")
    } else if (status === "authenticated" && session?.user?.email !== "admin@soatransplus.com") {
      router.push("/")
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      })
    }
  }, [status, session, router, toast])

  // Fetch admin data
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email === "admin@soatransplus.com") {
      fetchAdminData()
    }
  }, [status, session])

  const fetchAdminData = async () => {
    try {
      setIsLoading(true)

      // Fetch users
      const usersResponse = await fetch("/api/admin/users")
      if (usersResponse.ok) {
        const usersData = await usersResponse.json()
        setUsers(usersData)
      }

      // Fetch reservations
      const reservationsResponse = await fetch("/api/admin/reservations")
      if (reservationsResponse.ok) {
        const reservationsData = await reservationsResponse.json()
        setReservations(reservationsData)
      }

      // Fetch stats
      const statsResponse = await fetch("/api/admin/stats")
      if (statsResponse.ok) {
        const statsData = await statsResponse.json()
        setStats(statsData)
      }
    } catch (error) {
      console.error("Error fetching admin data:", error)
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUserStatusChange = async (userId: string, newStatus: "approved" | "rejected") => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update user status")
      }

      // Update local state
      setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))

      toast({
        title: "User Status Updated",
        description: `User has been ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      })
    }
  }

  const handleReservationStatusChange = async (reservationId: string, newStatus: "confirmed" | "canceled") => {
    try {
      const response = await fetch("/api/admin/reservations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reservationId,
          status: newStatus,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update reservation status")
      }

      // Update local state
      setReservations(
        reservations.map((reservation) =>
          reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation,
        ),
      )

      toast({
        title: "Reservation Status Updated",
        description: `Reservation has been ${newStatus}.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update reservation status",
        variant: "destructive",
      })
    }
  }

  // Filter users based on search and status
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Filter reservations based on search and status
  const filteredReservations = reservations.filter((reservation) => {
    const matchesSearch =
      reservation.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.plan_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || reservation.status === statusFilter
    return matchesSearch && matchesStatus
  })

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (session?.user?.email !== "admin@soatransplus.com") {
    return null
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage users, reservations, and system settings</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reservations">Reservations</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingUsers} pending approval</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalReservations}</div>
                  <p className="text-xs text-muted-foreground">{stats.pendingReservations} pending confirmation</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">{stats.confirmedReservations} confirmed reservations</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest user registrations and reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.slice(0, 5).map((user) => (
                    <div key={user.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          user.status === "pending" ? "outline" : user.status === "approved" ? "default" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Approve or reject user accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-sm">
                              {user.name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone || "N/A"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "pending"
                                ? "outline"
                                : user.status === "approved"
                                  ? "default"
                                  : "destructive"
                            }
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(new Date(user.created_at), "MMM dd, yyyy")}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "pending" && (
                                <>
                                  <DropdownMenuItem onClick={() => handleUserStatusChange(user.id, "approved")}>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleUserStatusChange(user.id, "rejected")}>
                                    <UserX className="mr-2 h-4 w-4" />
                                    Reject
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reservations Tab */}
          <TabsContent value="reservations" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search reservations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="canceled">Canceled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Reservation Management</CardTitle>
                <CardDescription>Confirm or cancel reservations</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Plan</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReservations.map((reservation) => (
                      <TableRow key={reservation.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.user_name}</div>
                            <div className="text-sm text-gray-500">{reservation.user_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{reservation.plan_name}</div>
                            <div className="text-sm text-gray-500">{reservation.vehicle_name}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {format(new Date(reservation.reservation_date), "MMM dd, yyyy")}
                            </div>
                            <div className="text-sm text-gray-500">{reservation.reservation_time}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {reservation.city_name}, {reservation.country_name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">${reservation.total_price.toFixed(2)}</div>
                          <div className="text-sm text-gray-500">{reservation.payment_method}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              reservation.status === "pending"
                                ? "outline"
                                : reservation.status === "confirmed"
                                  ? "default"
                                  : reservation.status === "completed"
                                    ? "secondary"
                                    : "destructive"
                            }
                          >
                            {reservation.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {reservation.status === "pending" && (
                                <>
                                  <DropdownMenuItem
                                    onClick={() => handleReservationStatusChange(reservation.id, "confirmed")}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirm
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleReservationStatusChange(reservation.id, "canceled")}
                                  >
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancel
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure system-wide settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-approve new users</h4>
                      <p className="text-sm text-gray-500">Automatically approve new user registrations</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email notifications</h4>
                      <p className="text-sm text-gray-500">Send email notifications for admin actions</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Backup settings</h4>
                      <p className="text-sm text-gray-500">Configure automatic database backups</p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  )
}
