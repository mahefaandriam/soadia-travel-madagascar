

import Link from "next/link"
import { Facebook, Twitter, Instagram, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react"

const Footer  = () => {
    return (
    <>
      <footer className="bg-[#0d0036] text-gray-300">
            {/* Main Footer */}
            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {/* Company Info */}
                <div>
                    {/* <div className="flex items-center space-x-2 mb-6 h-52 w-72">
                    <img
                            src="/soatransplus-logo2.png"
                            alt="Large Left"
                            className="w-full h-full object-cover shadow-md"
                        />
                    </div>*/}
                    <p className="mb-6 text-gray-400">
                    <span className="text-xl font-bold text-white">Soa Dia Travel MADAGASCAR </span>
                    <br /> Vous accompagnerons jusqu&apos;à votre destination.
                    </p>
                    <div className="flex space-x-4">
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Facebook size={20} />
                        <span className="sr-only">Facebook</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Twitter size={20} />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Instagram size={20} />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Linkedin size={20} />
                        <span className="sr-only">LinkedIn</span>
                    </Link>
                    <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Github size={20} />
                        <span className="sr-only">GitHub</span>
                    </Link>
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Navigation rapide</h3>
                    <ul className="space-y-3">
                    <li>
                        <Link href="#hero" className="text-gray-400 hover:text-white transition-colors">
                        Page d&apos;Accueil
                        </Link>
                    </li>
                    <li>
                        <Link href="#about" className="text-gray-400 hover:text-white transition-colors">
                        Pourquoi Nous?
                        </Link>
                    </li>
                    <li>
                        <Link href="#book" className="text-gray-400 hover:text-white transition-colors">
                        Réserver une Voyage
                        </Link>
                    </li>
                    <li>
                        <Link href="#location" className="text-gray-400 hover:text-white transition-colors">
                        Location Spécial
                        </Link>
                    </li>
                    </ul>
                </div>

                {/* Contact Info */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Contactez-nous</h3>
                    <ul className="space-y-4">
                    <li className="flex items-start">
                        <MapPin className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                        <span>Antananarivo</span>
                    </li>
                    <li className="flex items-center">
                        <Phone className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                        <span>+261373737001 (Whatsapp) <br /> +261321190500</span>
                    </li>
                    <li className="flex items-center">
                        <Mail className="mr-3 h-5 w-5 text-primary flex-shrink-0" />
                        <span>connecttalent.mg@gmail.com</span>
                    </li>
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-6">Abonnez-vous</h3>
                    <p className="mb-4 text-gray-400">Restez à jour avec nos dernières nouvelles et offres.</p>
                    <div className="flex flex-col space-y-3">
                    <input
                        type="email"
                        placeholder="Votre adresse email"
                        className="bg-[#140642] rounded p-2 border-gray-700 text-white placeholder:text-gray-500"
                    />
                    <button className="bg-[#140642] border border-white/25 rounded py-1 px-2">Inscrivez-vous</button>
                    </div>
                </div>
                
                </div>
            </div>

            {/* Bottom Footer */}
            <div className="border-t border-gray-800">
                <div className="container mx-auto px-4 py-6">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className="text-sm text-gray-500 mb-4 md:mb-0">
                    © {new Date().getFullYear()} Soadia Travel MADAGASCAR. Tous droits réservés.
                    </div>
                    {/*
                    <div className="flex flex-wrap justify-center space-x-4 text-sm">
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors mb-2 md:mb-0">
                        Privacy Policy
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors mb-2 md:mb-0">
                        Terms of Service
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors mb-2 md:mb-0">
                        Cookie Policy
                    </Link>
                    <Link href="#" className="text-gray-500 hover:text-white transition-colors mb-2 md:mb-0">
                        Sitemap
                    </Link>
                    </div>
                    */}
                </div>
                </div>
            </div>
        </footer>
    </>
    )
}

export default Footer;