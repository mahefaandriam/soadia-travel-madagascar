"use client"

import Image from "next/legacy/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';

const testaments = [
  {
    name: "Fatima O.",
    rating: 5,
    content: "Soadia Travel made my trip stress-free and super comfortable. Highly recommend!",
    avatar: "/images/girl-avatar.jpg",
  },
    {
    name: "Fatima O.",
    rating: 5,
    content: "Soadia Travel made my trip stress-free and super comfortable. Highly recommend!",
    avatar: "/images/girl-avatar.jpg",
  },
    {
    name: "Fatima O.",
    rating: 5,
    content: "Soadia Travel made my trip stress-free and super comfortable. Highly recommend!",
    avatar: "/images/girl-avatar.jpg",
  },
];

interface UserComment {
  id: number
  name: string
  rating: number
  role: string
  comment: string
  avatar: string
  color: string
}

const userComments: UserComment[] = [
  {
    id: 6,
    name: "James Thompson",
    rating: 5,
    role: "IT Director",
    comment: "Une expérience inoubliable ! Tout était parfaitement organisé, du début à la fin. Les paysages étaient à couper le souffle, l’équipe était chaleureuse et professionnelle, et le confort du voyage a largement dépassé mes attentes. Merci pour ces merveilleux souvenirs, je recommande sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    rating: 5,
    role: "Content Strategist",
    comment: "Un voyage juste incroyable ! Tout était fluide, confortable et vraiment haut de gamme. Les hébergements étaient magnifiques, les services au top, et on s’est sentis chouchoutés du début à la fin. Une vraie parenthèse de détente et d’élégance. À refaire sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: 8,
    name: "Randria Aina",
    rating: 5,
    role: " Business Administration à INSCAE Madagascar",
    comment: "Za vao aingana teo nandeha Soatrans tena afa-po. 🌹",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800",
  },
  {
    id: 1,
    name: "Sarah Ramanatoanina",
    rating: 5,    
    role: "directeur du marketing",
    comment: "Tsara be soa transplus ",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800",
  },
  {
    id: 2,
    name: "Michael Chen",
    rating: 5,
    role: "Software Engineer",
    comment: "The user interface is intuitive and beautifully designed.",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800",
  },
  {
    id: 3,
    name: "Tina Andrea Tina",
    rating: 5,
    role: "",
    comment: "Manakaiky ny vahoka atrany Soatrans!",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-pink-50 dark:bg-pink-900/30 border-pink-200 dark:border-pink-800",
  },
  {
    id: 4,
    name: "Ny Hasyna Julese",
    rating: 5,
    role: "communication, à Étudiant",
    comment: "Tena hoe mi-chapeau foana🙏🏾❤️",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800",
  },
  {
    id: 5,
    name: "Sidia Randria",
    rating: 5,
    role: "Mpampianatra",
    comment: "Tsy itako izay tenenina fa makasitra ny sotrans atrany!",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800",
  },
  {
    id: 6,
    name: "James Thompson",
    rating: 5,
    role: "IT Director",
    comment: "Une expérience inoubliable ! Tout était parfaitement organisé, du début à la fin. Les paysages étaient à couper le souffle, l’équipe était chaleureuse et professionnelle, et le confort du voyage a largement dépassé mes attentes. Merci pour ces merveilleux souvenirs, je recommande sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800",
  },
  {
    id: 7,
    name: "Sophia Martinez",
    rating: 5,
    role: "Content Strategist",
    comment: "Un voyage juste incroyable ! Tout était fluide, confortable et vraiment haut de gamme. Les hébergements étaient magnifiques, les services au top, et on s’est sentis chouchoutés du début à la fin. Une vraie parenthèse de détente et d’élégance. À refaire sans hésiter !",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-indigo-50 dark:bg-indigo-900/30 border-indigo-200 dark:border-indigo-800",
  },
  {
    id: 8,
    name: "Randria Aina",
    rating: 5,
    role: " Business Administration à INSCAE Madagascar",
    comment: "Za vao aingana teo nandeha Soatrans tena afa-po. 🌹",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-teal-50 dark:bg-teal-900/30 border-teal-200 dark:border-teal-800",
  },
  {
    id: 9,
    name: "Ava Garcia",
    rating: 5,
    role: "Customer Success",
    comment: "The support team is exceptional.",
    avatar: "/placeholder.svg?height=40&width=40",
    color: "bg-cyan-50 dark:bg-cyan-900/30 border-cyan-200 dark:border-cyan-800",
  },
]

const Testamonials = () => {
    let comLenght = userComments.length;
    return (
        <>
        <section>
            <div className="relative space-y-6 col-span-2 md:col-span-1">
                <div className="text-left ml-6 mr-6 md:mr-150">
                    <h2 className="text-2xl md:text-3xl font-bold text-sky-950 mb-4">
                        Ce Qu&quot;ils Disent de Nous
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Des clients satisfaits, des trajets réussis.
                    </p>
                    <p className="text-gray-500">
                        Chaque trajet compte, et chaque retour d&quot;expérience nous touche. Merci à nos clients pour leur confiance ! Qu&quot;il s&quot;agisse d&quot;un simple trajet en bus ou d&quot;un service VIP avec chauffeur, ils partagent leurs impressions — et nous, on en est fiers.
                    </p>
                    <div className="absolute top-0 right-50 opacity-10 z-50">
                           <Quote size={250} opacity={50}  strokeWidth={1} />
                    </div>
                </div>
                <Swiper
                modules={[Pagination]}
                loop={true}
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="pb-12"
                >
                {Array.from({ length: Math.ceil(userComments.length / 3) }).map((_, groupIdx) => {
                    const group = userComments.slice(groupIdx * 3, groupIdx * 3 + 3);
                    return (
                        <SwiperSlide key={groupIdx}>
                            <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-6 rounded-lg shadow-md mx-auto">
                                {group.map((review, idx) => (
                                    <div
                                        key={review.id}
                                        className={`flex flex-col justify-start gap-4 mb-4 border-b-1 border-c2 ${review.color} p-4 rounded-lg`}
                                    >
                                        <div className="text-left">
                                            <div className="flex text-c5">
                                                {Array.from({ length: review.rating }).map((_, i) => (
                                                    <Star key={i} className="w-4 h-4 fill-current" fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-left text-gray-700 italic text-lg">{review.comment}</p>
                                        <div className="flex items-center gap-3">
                                            <Image
                                                src={review.avatar}
                                                alt={review.name}
                                                width={40}
                                                height={40}
                                                className="rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-semibold text-sky-950">{review.name}</p>
                                                {review.role && <p className="text-xs text-gray-500">{review.role}</p>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </SwiperSlide>
                    );
                })}
                </Swiper>
            </div>
        </section>
        </>
    )
}

export default Testamonials;