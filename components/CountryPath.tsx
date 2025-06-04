"use client"

import Image from 'next/image';
import { motion } from 'framer-motion';

import { ArrowLeftRight, MapPin } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';

import '@/styles/styles.css';

import { Pagination } from 'swiper/modules';

interface CountryPathType {
    path: string;
    start: string;
    mid: string;
    end: string;
    locationStart: string;
    locationMid: string;
    locationEnd: string;
    imgUrl_coutryStart: string;
    imgUrl_coutryMid: string;
    imgUrl_coutryEnd: string;
    frequency: string,
    price: number
}

const coutryPaths: CountryPathType[] = [
    {
        path: "Antananarivo - Ambatolampy - Antsirabe",
        start: "Antananarivo",
        mid: "Ambatolampy",
        end: "Antsirabe",
        locationStart : "Andoharanfotsy",
        locationMid: "Place de l'artisanat en Aluminium",
        locationEnd: "Gara",
        imgUrl_coutryStart: "Antananarivo-imp.jpg",
        imgUrl_coutryMid: "Ambatolampy-imp.jpg",
        imgUrl_coutryEnd: "Antsirabe-imp.jpg",
        frequency: "Lundi-Mardi-Mercredi-Jeudi-Vendredi-Samedi-Dimanche",
        price: 150,
    },
    {
        path: "Antsirabe - Miandrivazo - Morondava",
        start: "Antsirabe",
        mid: "Miandrivazo",
        end: "Morondava",
        locationStart : "Gara",
        locationMid: "descente du fleuve Tsiribihina",
        locationEnd: "Tanana",
        imgUrl_coutryStart: "Antananarivo-imp.jpg",
        imgUrl_coutryMid: "Ambatolampy-imp.jpg",
        imgUrl_coutryEnd: "Antsirabe-imp.jpg",
        frequency: "Lundi - Mercredi - Vendredi",
        price: 150,
    },
    {
        path: "Antsirabe - Miandrivazo - Morondava",
        start: "Antsirabe",
        mid: "Miandrivazo",
        end: "Morondava",
        locationStart : "Gara",
        locationMid: "descente du fleuve Tsiribihina",
        locationEnd: "Tanana",
        imgUrl_coutryStart: "Antananarivo-imp.jpg",
        imgUrl_coutryMid: "Ambatolampy-imp.jpg",
        imgUrl_coutryEnd: "Antsirabe-imp.jpg",
        frequency: "Lundi - Mercredi - Vendredi",
        price: 150,
    },
]

const CountryPath = () => {
    return (
        <>
        <section id='book' className="pt-16 overflow-hidden bg-c1 text-primary border-x">
            <div className='container space-y-6 '>
                <div className="text-center mx-6 md:mx-80">
                    <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                        Réservez Votre Bus en 2 Minutes Chrono <br /> !
                    </h2>
                    <p className="text-lg text-secondary mb-6">
                       Facile, rapide et sans prise de tête.
                    </p>
                    <p className="text-gray-500">
                       Fini les longues files et les réservations compliquées ! Avec notre service ultra-rapide, réservez votre billet de bus en quelques clics. C’est simple, efficace et instantané. Choisissez votre trajet, payez en toute sécurité, et c’est parti ! Voyager n’a jamais été aussi facile.
                    </p>
                </div>
                <div className='relative w-full h-[350px] px-0 md:px-5 '>
                    <Swiper
                        direction={'vertical'}
                        pagination={{
                        clickable: true,
                        }}
                        modules={[Pagination]}
                        className="mySwiper rounded"
                    >
                        {coutryPaths.map((c, index) => (
                            <SwiperSlide key={index}>
                                {swipeLayout(c)}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
                <a
                    href="#book">
                    <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="float-right group outline outline-offset-2 inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded font-semibold shadow hover:bg-blue-700 transition cursor-pointer"
                    >
                    Réserver maintenant
                    <motion.span
                        className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                        whileHover={{ x: 4 }}
                    >
                        &gt;
                    </motion.span>
                    </motion.button>
                </a>
            </div>
        </section>
        </>
    )
}

const swipeLayout = (swipe: CountryPathType) => {
    return ( 
    <div className='flex flex-col w-full h-full cursor-grab bg-c2'>
        <div className='flex flex-col pt-2 items-center font-bold text-c5 justify-center w-full'>
            {swipe.path}
            {/* 
            <div className='flex space-x-8 pt-6'>
                <div className="py-1 px-2 rounded-lg shadow-md plan-classic">
                    <h3 className="text-sm font-bold">Classic</h3>
                </div>
                <div className="py-1 px-2 rounded-lg shadow-md plan-premium">
                    <h3 className="text-sm font-bold">Premium</h3>
                </div>
                <div className="py-1 px-2 rounded-lg shadow-md plan-vip">
                    <h3 className="text-sm font-bold">VIP</h3>
                </div>
                <div className="py-1 px-2 rounded-lg shadow-md plan-vip-plus">
                    <h3 className="text-sm font-bold">VIP+</h3>
                </div>
            </div>  
            */}                                  
        </div>
        <div className='w-full h-full p-5 overflow-x-auto'>
            <div className='flex flex-col w-250 md:w-full h-full'>
                <div className='flex relative flex-row w-full h-full '>
                    <div className='relative -skew-4 outline-6 mx-5 outline-offset-2 outline-white rounded-xl overflow-hidden grow'>
                        <Image src={'/images/place/' + swipe.imgUrl_coutryStart }  alt="Une ville de Madagascar" fill={true} />
                        <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                        items-center text-transparent text-3xl md:text-4xl font-bold hover:text-white ransition-all duration-500">
                            <div>
                                {swipe.start}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center text-c4'><ArrowLeftRight /></div>
                    <div className='relative outline-6 mx-5 outline-offset-2 outline-white rounded-xl overflow-hidden grow'>
                        <Image src={'/images/place/' + swipe.imgUrl_coutryMid } alt="Une ville de Madagascar" fill={true} />
                        <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                        items-center text-transparent text-3xl md:text-4xl font-bold hover:text-white ransition-all duration-500">
                            <div>
                                {swipe.mid}
                            </div>
                        </div>
                    </div>
                    <div className='flex items-center text-c4'><ArrowLeftRight /></div>
                    <div className='relative -skew-4 outline-6 mx-5 outline-offset-2 outline-white rounded-xl overflow-hidden grow'>
                        <Image src={'/images/place/' + swipe.imgUrl_coutryEnd } alt="Une ville de Madagascar" fill={true} />
                        <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                        items-center text-transparent text-3xl md:text-4xl font-bold hover:text-white ransition-all duration-500">
                            <div>
                                {swipe.end}
                            </div>
                        </div>
                    </div>
                </div>
                <div className='relative flex flex-row text-xs w-full'>
                    <div className='flex justify-center grow'>
                        <MapPin size={15} className='flex'/> {swipe.locationStart}
                    </div>
                    <div className='flex justify-center grow'>
                        <MapPin size={15} className='flex'/> {swipe.locationMid}
                    </div>
                    <div className='flex justify-center grow'>
                        <MapPin size={15} className='flex'/> {swipe.locationEnd}
                    </div>
                </div>
            </div>
        </div>       
        <div className='flex items-center font-bold text-c5 justify-center w-full'>
            <p className='italic font-light text-sm'>Départ&nbsp; {swipe.frequency} &nbsp;</p> A partir de {swipe.price} AR
        </div>
    </div>
    )
}

export default CountryPath;