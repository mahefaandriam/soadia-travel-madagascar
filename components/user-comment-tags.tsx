import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserComment {
  id: number
  name: string
  role: string
  comment: string
  avatar: string
  color: string
}

const userComments: UserComment[] = [
  {
    id: 1,
    name: "Sarah Ramanatoanina",
    role: "directeur du marketing",
    comment: "Tsara be soa transplus ",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Software Engineer",
    comment: "The user interface is intuitive and beautifully designed.",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  },
  {
    id: 3,
    name: "Tina Andrea Tina",
    role: "",
    comment: "Manakaiky ny vahoka atrany Soatrans!",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
  },
  {
    id: 4,
    name: "Ny Hasyna Julese",
    role: "communication, à Étudiant",
    comment: "Tena hoe mi-chapeau foana🙏🏾❤️",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  },
  {
    id: 5,
    name: "Sidia Randria",
    role: "Mpampianatra",
    comment: "Tsy itako izay tenenina fa makasitra ny sotrans atrany!",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
  },
  {
    id: 6,
    name: "James Thompson",
    role: "IT Director",
    comment: "Une expérience inoubliable ! Tout était parfaitement organisé, du début à la fin. Les paysages étaient à couper le souffle, l’équipe était chaleureuse et professionnelle, et le confort du voyage a largement dépassé mes attentes. Merci pour ces merveilleux souvenirs, je recommande sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    role: "Content Strategist",
    comment: "Un voyage juste incroyable ! Tout était fluide, confortable et vraiment haut de gamme. Les hébergements étaient magnifiques, les services au top, et on s’est sentis chouchoutés du début à la fin. Une vraie parenthèse de détente et d’élégance. À refaire sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: 8,
    name: "Randria Aina",
    role: " Business Administration à INSCAE Madagascar",
    comment: "Za vao aingana teo nandeha Soatrans tena afa-po. 🌹",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800",
  },
  {
    id: 9,
    name: "Ava Garcia",
    role: "Customer Success",
    comment: "The support team is exceptional.",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800",
  },
]

export function UserCommentTags() {
  // Create a staggered layout with different sizes
  const getCommentSize = (index: number) => {
    // Alternate between different widths for visual interest
    const sizePattern = index % 5
    switch (sizePattern) {
      case 0:
        return "col-span-1 md:col-span-2"
      case 1:
        return "col-span-1"
      case 2:
        return "col-span-1 md:col-span-1"
      case 3:
        return "col-span-1 md:col-span-1"
      case 4:
        return "col-span-1 md:col-span-2"
      default:
        return "col-span-1"
    }
  }

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {userComments.map((comment, index) => (
          <div
            key={comment.id}
            className={cn(
              "group transition-all duration-300 hover:shadow-lg",
              "rounded-xl border p-4",
              comment.color,
              getCommentSize(index),
            )}
          >
            <div className="flex items-start space-x-4">
              <Avatar className="h-10 w-10 border-2 border-white dark:border-gray-800 shadow-sm">
                <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.name} />
                <AvatarFallback>{comment.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white truncate">{comment.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{comment.role}</p>
              </div>
            </div>
            <div className="mt-3">
              <p className="text-gray-700 dark:text-gray-300">"{comment.comment}"</p>
            </div>
            <div className="mt-3 flex items-center text-sm">
              <div className="flex items-center text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-500 dark:text-gray-400 ml-2">5.0</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
