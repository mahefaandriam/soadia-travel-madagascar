"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Tag {
  id: number
  name: string
  color: string
}

// Sample tags data
const tags: Tag[] = [
  { id: 1, name: "Web Design", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  { id: 2, name: "UI/UX", color: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200" },
  { id: 3, name: "Mobile Development", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { id: 4, name: "Branding", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { id: 5, name: "Marketing", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
  { id: 6, name: "SEO", color: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200" },
  { id: 7, name: "Content Creation", color: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200" },
  { id: 8, name: "E-commerce", color: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200" },
  { id: 9, name: "Analytics", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { id: 10, name: "Consulting", color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200" },
  { id: 11, name: "Artificial Intelligence", color: "bg-lime-100 text-lime-800 dark:bg-lime-900 dark:text-lime-200" },
  { id: 12, name: "Blockchain", color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200" },
]

export function InfiniteTagsScroll() {
  const [isPaused, setIsPaused] = useState(false)
  const [animationDuration, setAnimationDuration] = useState("60s")

  // Adjust animation speed based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) {
        setAnimationDuration("30s")
      } else if (width < 1024) {
        setAnimationDuration("45s")
      } else {
        setAnimationDuration("60s")
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Create two sets of tags for seamless looping
  const firstRow = [...tags]
  const secondRow = [...tags.slice(6), ...tags.slice(0, 6)]

  return (
    <div
      className="w-full overflow-hidden py-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* First row - left to right */}
      <div className="relative">
        <div
          className={cn("flex whitespace-nowrap", isPaused ? "animate-pause" : "animate-scroll")}
          style={{
            animationDuration: animationDuration,
          }}
        >
          {firstRow.map((tag) => (
            <TagItem key={`row1-${tag.id}`} tag={tag} />
          ))}
          {/* Duplicate for seamless loop */}
          {firstRow.map((tag) => (
            <TagItem key={`row1-dup-${tag.id}`} tag={tag} />
          ))}
        </div>
      </div>

      {/* Second row - right to left (reversed direction) */}
      <div className="relative mt-4">
        <div
          className={cn("flex whitespace-nowrap", isPaused ? "animate-pause" : "animate-scroll-reverse")}
          style={{
            animationDuration: animationDuration,
          }}
        >
          {secondRow.map((tag) => (
            <TagItem key={`row2-${tag.id}`} tag={tag} />
          ))}
          {/* Duplicate for seamless loop */}
          {secondRow.map((tag) => (
            <TagItem key={`row2-dup-${tag.id}`} tag={tag} />
          ))}
        </div>
      </div>
    </div>
  )
}

function TagItem({ tag }: { tag: Tag }) {
  return (
    <div
      className={cn(
        "inline-block rounded-full px-4 py-2 text-sm font-medium mx-2",
        tag.color,
        "transition-transform hover:scale-110 cursor-pointer",
      )}
    >
      {tag.name}
    </div>
  )
}
