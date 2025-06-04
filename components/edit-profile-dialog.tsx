"use client"

import type React from "react"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Upload } from "lucide-react"

interface EditProfileDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function EditProfileDialog({ isOpen, onClose }: EditProfileDialogProps) {
  const { data: session, update } = useSession()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: session?.user?.name || "",
    email: session?.user?.email || "",
    phone: session?.user?.phone || "",
    bio: session?.user?.bio || "",
    image: session?.user?.image || "",
  })

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, you would upload the file to a server and get a URL back
    // For this demo, we'll use a placeholder URL based on the email
    const reader = new FileReader()
    reader.onload = () => {
      // In a real implementation, you would upload the file and get a URL back
      // For this demo, we'll just update the state with the placeholder
      setFormData((prev) => ({
        ...prev,
        image: `https://avatar.vercel.sh/${formData.email}?size=128`,
      }))
    }
    reader.readAsDataURL(file)
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error("Nom requis")
      }

      if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) {
        throw new Error("Email valide requis")
      }

      // Send update to server
      const response = await fetch("/api/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          profile: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            bio: formData.bio,
            image_url: formData.image,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Impossible de mettre à jour le profil")
      }

      // Update session
      await update({
        ...session,
        user: {
          ...session?.user,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          bio: formData.bio,
          image: formData.image,
        },
      })

      // Show success message
      toast({
        title: "profil mis à jour",
        description: "Vos renseignements de profil ont été mis à jour avec succès.",
      })

      // Close the dialog
      onClose()
    } catch (error) {
      // Show error message
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible de mettre à jour le profil",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Modifier profil</DialogTitle>
          <DialogDescription>Mettez à jour vos renseignements personnels. Cliquez sur Sauvegarder lorsque vous avez terminé.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                <AvatarImage src={formData.image || "/placeholder.svg"} alt={formData.name} />
                <AvatarFallback className="text-2xl">{formData.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>

              <div className="flex items-center">
                <Label
                  htmlFor="picture"
                  className="cursor-pointer bg-secondary hover:bg-secondary/80 text-secondary-foreground px-4 py-2 rounded-md flex items-center"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Change Picture
                </Label>
                <Input id="picture" type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </div>
            </div>

            {/* Name */}
            <div className="grid gap-2">
              <Label htmlFor="name">Nom complet</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Entrer votre nom complet"
                required
              />
            </div>

            {/* Email */}
            <div className="grid gap-2">
              <Label htmlFor="email">Address Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Entrer votre adresse Email"
                required
              />
            </div>

            {/* Phone */}
            <div className="grid gap-2">
              <Label htmlFor="phone">Numéro</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Entrer votre numéro de telephone"
              />
            </div>

            {/* Bio */}
            <div className="grid gap-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Dites-nous plus sur vous!"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer les modifications
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
