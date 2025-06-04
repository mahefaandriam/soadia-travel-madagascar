"use client"

import React from 'react';
import Image from "next/legacy/image";
import AnimatedCounter from './AnimatedCounter';

const WhyChoose = () => {
  return (
    <>
      <section id='about' className="relative pt-16 bg-c1 text-gray-800 ">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary">
              Pourquoi choisir Soadia Travel?
            </h2>
            <p className="text-lg mb-6 text-gray-600">
              <b>Soadia Travel</b> vous offre une expérience de voyage <b>fiable</b>, <b>confortable</b> et <b>accessible</b> à travers Madagascar. Profitez d’un <b>service client attentif</b>, d’une <b>réservation facile</b> et d’une <b>flotte moderne</b> pour tous vos déplacements.
              Chez <b>Soadia Travel</b>, nous rendons votre voyage aussi <b>confortable</b> et <b>fiable</b> que possible. Que vous voyagiez en ville ou à la campagne, nous avons tout ce qu’il vous faut.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <p className="text-gray-700">Easy online booking and real-time seat availability</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <p className="text-gray-700">Safe and well-maintained buses</p>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-secondary text-xl">✓</span>
                <p className="text-gray-700">Friendly customer support and instant confirmations</p>
              </li>
            </ul>
            
             <div className="grid grid-cols-2 gap-4 py-4 text-center font-medium">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <AnimatedCounter to={10} suffix={'+'} className="text-4xl font-bold text-blue-500" />
                  <div className="text-gray-600">Villes implémentées à Madagascar</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <AnimatedCounter to={4} className="text-4xl font-bold text-blue-500" />
                  <div className="text-gray-600">Choix de classes à un prix abordable</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <AnimatedCounter to={70} suffix={'+'} className="text-4xl font-bold text-blue-500" />
                  <div className="text-gray-600">Plus de centaines de voitures en service</div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <AnimatedCounter to={24} suffix={'/7'} className="text-4xl font-bold text-blue-500" />
                  <div className="text-gray-600">Toujours disponibles</div>
                </div>
              </div>
          </div>

          {/* Image */}
          <div className="w-full h-[300px] md:h-[400px] relative">
            <Image
              src="/images/car/bus-interior.webp"
              alt="Comfortable bus interior"
              layout="fill"
              objectFit="cover"
              className="rounded-lg shadow-lg"
            />
             <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-c5 rounded-lg hidden md:block">
                <img
                  src="/images/car/bustouristique.jpg"
                  alt="Hotel Detail"
                  className="w-full h-full object-cover rounded-lg transform translate-x-4 translate-y-4 shadow-lg"
                />
              </div>
          </div>
        </div>           
      </section>
    </>
  );
};

export default WhyChoose;
