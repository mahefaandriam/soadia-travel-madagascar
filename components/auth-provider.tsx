"use client"

import { createContext, useContext, useState, useEffect } from "react"
import type React from "react"

interface User {
  id: string
  name: string
  email: string
  image?: string
  phone?: string
  bio?: string
}

interface AuthContextProps {
  user: User | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => void
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: () => {},
  updateUser: () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Simulate checking for an existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  // Simulate sign in
  const signIn = async (email: string, password: string) => {
    // In a real app, this would make an API call to authenticate
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser = {
      id: "user-1",
      name: email.split("@")[0],
      email,
      image: `/simple-man-head-icon-set.webp`,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
  }

  // Simulate sign up
  const signUp = async (name: string, email: string, password: string) => {
    // In a real app, this would make an API call to register
    setIsLoading(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser = {
      id: "user-1",
      name,
      email,
      image: `/simple-man-head-icon-set.webp`,
    }

    setUser(newUser)
    localStorage.setItem("user", JSON.stringify(newUser))
    setIsLoading(false)
  }

  // Simulate sign out
  const signOut = () => {
    setUser(null)
    localStorage.removeItem("user")
  }

  // Update user information
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
