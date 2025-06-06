"use client"

import Image from "next/image";
import { useState, useRef } from 'react';

import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion , AnimatePresence} from "framer-motion";
import 'swiper/css';
import 'swiper/css/pagination';

import '@/styles/styles.css';

const locationCarsItems = [
  {
    id: 1,
    name: "Enrager G5",
    description: "Motorisation 1.5l Mivec",
    advantages: [
      "7 Places",
      "4 Vitres électronique",
      "Abs",
      "Caméra recule"
    ],
    locationDay: "100.000",
    locationWeek: "450.000"
  },
   {
    id: 1,
    name: "Enrager G5",
    description: "Motorisation 1.5l Mivec",
    advantages: [
      "7 Places",
      "4 Vitres électronique",
      "Abs",
      "Caméra recule"
    ],
    locationDay: "100.000",
    locationWeek: "450.000"
  },
   {
    id: 1,
    name: "Enrager G5",
    description: "Motorisation 1.5l Mivec",
    advantages: [
      "7 Places",
      "4 Vitres électronique",
      "Abs",
      "Caméra recule"
    ],
    locationDay: "100.000",
    locationWeek: "450.000"
  },
];

const LocationCar = () => {
    // eslint-disable-next-line
    const swiperRef = useRef<any>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    return (
        <>
            <section id="location" className="py-16 bg-c1 text-gray-800">
                <div className="text-center mx-6 md:mx-80 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-sky-950 mb-4">
                        Location de Voiture avec ou sans Chauffeur à Madagascar
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                      Service rapide, facile et 100 % sur mesure. Avec ou sans Chauffeur.
                    </p> 
                    <p className="text-gray-500">
                      Offrez-vous l’excellence du transport haut de gamme. Avec notre service de location de voiture avec chauffeur, réservez en toute simplicité une expérience de prestige : véhicules de luxe, chauffeurs professionnels, ponctualité irréprochable. Gagnez du temps avec une réservation facile, profitez d’un service rapide… et voyagez avec élégance.
                    </p>
                </div >                 
                    <Swiper
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        loop={true}
                        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
                        className="mySwiper"
                    >
                        {locationCarsItems.map((c, indexc) => (
                            <SwiperSlide key={c.id}>
                                <div className="container bg-c2 relative mx-auto px-6 grid md:grid-cols-2 gap-10 items-start">
                                    <div className="text-center ">
                                        <h2 className="text-2xl md:text-3xl font-bold mt-6  text-sky-950">
                                            {c.name}
                                        </h2>
                                        <p className="text-sm mb-6 text-gray-600">
                                            {c.description}
                                        </p>
                                        {activeIndex === indexc && (
                                                                                       
                                            <AnimatePresence mode="wait">   
                                                <ul className="space-y-4 justify-self-center">
                                                    {c.advantages.map((a, index)=> (                                                     
                                                                <motion.li
                                                                    key={index}
                                                                    initial={{ opacity: 0, y: 20 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    transition={{ delay: index * 0.3, duration: 0.5 }}
                                                                    className="flex items-center gap-3 "
                                                                >
                                                                        <span className="text-sky-950 text-xl">✓</span>
                                                                        <p className="text-gray-700">{a}</p>
                                                                
                                                                </motion.li>   
                                                    ))}                                     
                                                </ul>
                                                                                         
                                            </AnimatePresence>
                                        )}
                                        <p className="font-bold my-4">A partir de {c.locationDay} AR par jour</p>
                                        <p className="font-bold text-blue-400 text-2xl">A partir de {c.locationWeek} AR par semaine</p>
                                    </div>
                        
                                    {/* Image */}
                                    <div className="w-full h-[300px] md:h-[400px] relative">
                                    <Image
                                        src="/images/car/VIP+-car.jpg"
                                        alt="Comfortable 4x4 interior"
                                        layout="fill"
                                        objectFit="cover"
                                        className="rounded-lg shadow-lg"
                                    />
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>         
                    <div className="mt-6 flex justify-center gap-6 ">
                        <button
                        onClick={() => swiperRef.current?.slidePrev()}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium shadow cursor-pointer"
                        >
                        <ChevronLeft />
                        </button>
                        <button
                        onClick={() => swiperRef.current?.slideNext()}
                        className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-full text-sm font-medium shadow cursor-pointer"
                        >
                        <ChevronRight />
                        </button>
                    </div>
            </section>
        </>
    )
}

export default LocationCar;