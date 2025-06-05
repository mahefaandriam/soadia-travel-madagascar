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

const Testamonials = () => {
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
                spaceBetween={30}
                slidesPerView={1}
                pagination={{ clickable: true }}
                className="pb-12"
                >
                {testaments.map((review, idx) => (
                    <SwiperSlide key={idx}>
                    <div className="grid grid-cols-1 md:grid-cols-3 bg-white p-6 rounded-lg shadow-md mx-auto">
                        <div className="flex flex-col justify-start gap-4 mb-4 border-b-1 border-c2">                    
                            <div className="text-left">
                                <div className="flex text-c5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" fill="currentColor" />
                                ))}
                                </div>
                            </div>
                            <p className="text-left text-gray-700 italic text-lg">{review.content}</p>
                            <div className="flex justify-items-start">
                                <Image
                                    src={review.avatar}
                                    alt={review.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <p className="flex justify-items-start font-semibold text-sky-950">{review.name}</p>
                        </div>
                        <div className="flex flex-col justify-start gap-4 mb-4 border-b-1 border-c2">                    
                            <div className="text-left">
                                <div className="flex text-c5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" fill="currentColor" />
                                ))}
                                </div>
                            </div>
                            <p className="text-left text-gray-700 italic text-lg">{review.content}</p>
                            <div className="flex justify-items-start">
                                <Image
                                    src={review.avatar}
                                    alt={review.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <p className="flex justify-items-start font-semibold text-sky-950">{review.name}</p>
                        </div>
                        <div className="flex flex-col justify-start gap-4 mb-4 border-b-1 border-c2">                    
                            <div className="text-left">
                                <div className="flex text-c5">
                                {Array.from({ length: review.rating }).map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-current" fill="currentColor" />
                                ))}
                                </div>
                            </div>
                            <p className="text-left text-gray-700 italic text-lg">{review.content}</p>
                            <div className="flex justify-items-start">
                                <Image
                                    src={review.avatar}
                                    alt={review.name}
                                    width={60}
                                    height={60}
                                    className="rounded-full object-cover"
                                />
                            </div>
                            <p className="flex justify-items-start font-semibold text-sky-950">{review.name}</p>
                        </div>                   
                    </div>
                    </SwiperSlide>
                ))}
                </Swiper>
            </div>
        </section>
        </>
    )
}

export default Testamonials;