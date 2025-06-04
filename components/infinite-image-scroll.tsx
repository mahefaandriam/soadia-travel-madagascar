"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollItem {
  id: number
  title: string
  description: string
  imageUrl: string
  plan: string
}

const scrollItems: ScrollItem[] = [
  {
    id: 1,
    title: "Antananarivo",
    description: "Capitale politique et économique, Antananarivo est une ville perchée sur des collines, mêlant histoire royale, marchés animés et quartiers modernes. On y trouve le Palais de la Reine, des vues panoramiques et une vie culturelle riche.",
    imageUrl: "/images/place/Antananarivo-imp.jpg",
    plan: "VIP, Premium, LITE, VIP +",
  },
  {
    id: 2,
    title: "Tamatave",
    description: "Située sur la côte Est, Toamasina est le principal port du pays. Son climat tropical, ses plages, et son rôle central dans le commerce en font une ville stratégique, vivante et accueillante.",
    imageUrl: "/images/place/Toamasina-imp.jpg",
    plan: "VIP, Premium",
  },
  {
    id: 3,
    title: "Fianarantsoa",
    description: "Cité universitaire et religieuse, Fianarantsoa est le cœur culturel des hauts plateaux du sud. Elle est aussi le point de départ pour explorer les vignobles, le parc de Ranomafana, et les villages traditionnels.",
    imageUrl: "/images/place/Fianarantsoa-imp.jpg",
    plan: "Premium",
  },
  {
    id: 4,
    title: "Majanga",
    description: "Célèbre pour sa promenade en bord de mer, son célèbre baobab géant et son ambiance paisible, Mahajanga est une ville portuaire du nord-ouest prisée pour les vacances et les couchers de soleil.",
    imageUrl: "/images/place/Mahajanga-imp.webp",
    plan: "VIP +, Premium",
  },
  {
    id: 5,
    title: "Antsirabe",
    description: "Située sur les hauts plateaux, Antsirabe est connue pour ses sources chaudes, ses pousse-pousse colorés, ses artisans et son climat frais. Elle mêle charme colonial et vie locale animée.",
    imageUrl: "/images/place/Antsirabe-imp.jpg",
    plan: "VIP, Premium",
  },
  {
    id: 6,
    title: "Morondava",
    description: "Célèbre pour sa majestueuse Allée des Baobabs, Morondava est une ville côtière du sud-ouest au charme unique. Elle est aussi le point d’accès au parc de Kirindy et à la culture Sakalava.",
    imageUrl: "/images/place/Morondava-imp.jpg",
    plan: "VIP, LITE, Premium",
  },
  {
    id: 7,
    title: "Ambatolampy",
    description: "Au sud d’Antananarivo, Ambatolampy est le centre de la métallurgie artisanale malgache, célèbre pour ses fonderies d’aluminium. Une ville discrète mais essentielle dans le tissu industriel local.",
    imageUrl: "/images/place/Ambatolampy-imp.jpg",
    plan: "Premium",
  },
  {
    id: 8,
    title: "Farafangana",
    description: "Située au sud-est, Farafangana est bordée par l’océan Indien. C’est une ville agricole importante, point de départ vers la forêt tropicale du parc de Manombo et riche en diversité ethnique.",
    imageUrl: "/images/place/Farafangana-imp.jpg",
    plan: "Premium",
  },
  {
    id: 8,
    title: "Ambositra",
    description: "Située dans les Hautes Terres, Ambositra est réputée pour sa richesse artisanale : sculptures sur bois, marqueterie et objets traditionnels issus du savoir-faire Zafimaniry.",
    imageUrl: "/images/place/Ambositra-imp.webp",
    plan: "Premium",
  },
  {
    id: 8,
    title: "Manakara",
    description: "Ville portuaire du Sud-Est, Manakara est connue pour son charme tranquille, sa côte sauvage, et comme terminus du mythique train Fianarantsoa–Côte Est. Elle offre un cadre naturel unique entre mer, rivière et canaux.",
    imageUrl: "/images/place/Manakara-imp.jpg",
    plan: "Premium",
  },
]

export function InfiniteImageScroll() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [touchStartX, setTouchStartX] = useState(0)

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering) return

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const scrollAmount = 1
        scrollRef.current.scrollLeft += scrollAmount

        // Reset scroll position when reaching the end of duplicated items
        if (scrollRef.current.scrollLeft >= scrollRef.current.scrollWidth / 2) {
          scrollRef.current.scrollLeft = 0
        }
      }
    }, 20)

    return () => clearInterval(interval)
  }, [isHovering])

  // Update active item based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      if (scrollRef.current) {
        const scrollLeft = scrollRef.current.scrollLeft
        const itemWidth = scrollRef.current.clientWidth / 3 // Assuming 3 visible items
        const newIndex = Math.floor(scrollLeft / itemWidth) % scrollItems.length
        setActiveIndex(newIndex)
      }
    }

    const scrollElement = scrollRef.current
    if (scrollElement) {
      scrollElement.addEventListener("scroll", handleScroll)
      return () => scrollElement.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Touch event handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX)
    setIsHovering(true)
  }

  const handleTouchEnd = () => {
    setIsHovering(false)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!scrollRef.current) return

    const touchCurrentX = e.touches[0].clientX
    const diff = touchStartX - touchCurrentX
    scrollRef.current.scrollLeft += diff / 2
    setTouchStartX(touchCurrentX)
  }

  // Duplicate items to create the infinite effect
  const displayItems = [...scrollItems, ...scrollItems]

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Gradient overlays for fade effect */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white dark:from-gray-900 to-transparent pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white dark:from-gray-900 to-transparent pointer-events-none"></div>

      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
      >
        {displayItems.map((item, index) => (
          <div key={`${item.id}-${index}`} className="flex-none w-full sm:w-1/2 md:w-1/3 lg:w-1/3 px-4 snap-start">
            <div
              className={cn(
                "bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300",
                activeIndex === index % scrollItems.length ? "scale-100 opacity-100" : "scale-95 opacity-90",
              )}
            >
              <div className="relative h-48 md:h-64">
                <img
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-primary text-white text-sm font-bold px-3 py-1 rounded-full">
                  {item.plan}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 dark:text-white">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation dots */}
      <div className="flex justify-center mt-8 space-x-2">
        {scrollItems.map((_, index) => (
          <button
            key={index}
            className={cn(
              "w-3 h-3 rounded-full transition-all duration-300",
              activeIndex === index ? "bg-primary scale-125" : "bg-gray-300 dark:bg-gray-600",
            )}
            onClick={() => {
              if (scrollRef.current) {
                const itemWidth = scrollRef.current.clientWidth / 3
                scrollRef.current.scrollLeft = index * itemWidth
              }
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
