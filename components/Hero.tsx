"use client"

import React from 'react';
import { motion } from 'framer-motion';

const headline = 'Explorer Madagascar avec  Soadia Travel';

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const wordAnimation = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const letterAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  return (
    <section id='hero' className="relative h-screen flex items-center bg-cover bg-center" style={{ backgroundImage: 'url("/images/place/avenue-baobab.jpg")' }}>
      {/* Overlay */}
      <div className="absolute inset-0 bg-blue-900/40"></div>
      

      <div className="container mx-auto px-6 relative z-10 max-w-4xl text-center md:text-left">
        <motion.h1
          className="text-3xl md:text-4xl font-bold mb-4 leading-tight text-white flex flex-wrap justify-center md:justify-start"
          variants={container}
          initial="hidden"
          animate="visible"
        >
          {headline.split(' ').map((word, wordIndex) => (
            <motion.span
              key={wordIndex}
              variants={wordAnimation}
              className="mr-2 inline-block"
            >
              {word.split('').map((char, charIndex) => (
                <motion.span key={charIndex} variants={letterAnimation}>
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ))}
        </motion.h1>
        <div
          className="text-lg font-pacifico md:text-xl mb-8 max-w-xl text-gray-200"
        >
          Réservez vos trajets en bus facilement ou louez les vôtres, découvrez de nouveaux itinéraires et profitez du voyage avec confort et sécurité.
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          className="flex justify-center md:justify-start gap-4 flex-wrap"
        >
          {/*<a
            href="/booking"
            className="bg-secondary hover:bg-red-700 transition-colors text-white text-center my-1 px-6 py-3 font-semibold rounded outline-4 outline-offset-2 shadow"
          >
            Book Now
          </a>*/}
          <a
            href="#book">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="group border border-white inline-flex items-center gap-2 hover:bg-secondary hover:text-blue-500 text-white px-6 py-3 rounded font-semibold shadow  transition cursor-pointer"
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
          <a
              href="#location"
          >
             <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="group border border-white inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded font-semibold shadow  transition cursor-pointer"
            >
              Location
              <motion.span
                className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                whileHover={{ x: 4 }}
              >
                &gt;
              </motion.span>
            </motion.button>
          </a>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
