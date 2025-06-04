import { Navbar } from "@/components/navbar"
import Hero from "@/components/Hero"
import WhyChoose from "@/components/WhyChoose"
import CountryPhares from "@/components/CountryPhares"
import CountryPath from "@/components/CountryPath"
import LocationCar from "@/components/LocationCar"
import Testamonials from "@/components/Testamonials"
import { InfiniteImageScroll } from "@/components/infinite-image-scroll"
import { TariffPlans } from "@/components/tariff-plans"
import { UserCommentTags } from "@/components/user-comment-tags"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="overflow-visible">
        {/* Hero Section  */}
         <Hero />
        {/*<section className="relative py-32">
          {/* Background Image 
          <div className="absolute inset-0 z-0">
            <img
              src="/avenue-baobab.jpg"
              alt="Background"
              className="mask-b-from-20% mask-b-to-80% w-full h-full object-cover"
            />
            {/* Overlay 
            {/* <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-900/80 dark:from-primary/90 dark:to-blue-900/90 mix-blend-multiply"></div> 
          </div> 
          <div className="container relative z-10 mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold mb-6 text-blue-200 dark:text-white">Le bonheur de voyager avec Soadia Travel Madagascar</h1>
            <p className="text-xl text-gray-300 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Quand le confort prend tout son sens chez Soadia Travel
            </p>
            <div className="flex justify-center gap-4">
              <a href="#tariff-plan"><button className="bg-primary text-white px-6 py-3 rounded-md font-medium">Réserver</button></a>
              <a href="#about"><button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 px-6 py-3 rounded-md font-medium dark:text-white">
                Destination
              </button></a>
            </div>
          </div>
        </section>
        */}

        {/* Content Section 1 - Why us ? */}
        <div>
          <WhyChoose />
        </div>

        {/* Content Section 1 - Country phares */}
        <div>
          <CountryPhares />
        </div>

        {/* Content Section 1 - Asymmetric Gallery */}
        <section id="features" className="py-24 dark:bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6 dark:text-white">Collection en Images</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
              Voyagez avec Nous! À travers les merveilleux villes de Madagascar.
              </p>
            </div>

            {/* Asymmetric Gallery */}
            <div className="grid col-span-10 md:grid-cols-9 gap-4 mx-4 md:mx-32">
              {/* Top Row */}

              <div className="col-span-9 md:col-span-5 h-64">
                  <img
                    src="/images/car/starexplusvip.jpg"
                    alt="Large Left"
                    className="w-full h-full object-cover  shadow-md"
                  />
              </div>
              <div className="col-span-4 h-64">
                  <img
                    src="/images/car/bustouristique.jpg"
                    alt="Large Left"
                    className="w-full h-full object-cover shadow-md"
                  />
              </div>
              <div className="col-span-4 h-64">
                  <img
                    src="/images/car/VIP+-car.jpg"
                    alt="Large Left"
                    className="w-full h-full object-cover shadow-md"
                  />
              </div>
              <div className="col-span-9 md:col-span-5 h-64">
                  <img
                    src="/images/people/tana.jpg"
                    alt="Large Left"
                    className="w-full h-full object-cover shadow-md"
                  />
              </div>
            </div>
            
          </div>
        </section>

        {/* Content Section 2 - Background Image with Overlay */}
        <section id="pricing" className="relative py-32">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/place/baobab-night.webp"
              alt="Background"
              className="w-full h-full object-cover"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-blue-900/80 dark:from-primary/90 dark:to-blue-900/90 mix-blend-multiply"></div>
          </div>

          {/* Content */}
          <div className="container relative z-10 mx-auto px-4 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl font-bold mb-6 text-white">MADAGASCAR VOUS ATTEND!</h2>
              <div className="w-24 h-1 bg-white mx-auto mb-8 rounded-full"></div>
              <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
              Les plus beaux souvenirs se créent sur la route, là où chaque kilomètre parcouru devient une histoire, chaque arrêt un souvenir,
               et chaque détour une aventure inattendue.
              </p>
              <a href="#tariff-plan"><button className="bg-white text-primary px-8 py-4 rounded-md font-medium hover:bg-white/90 transition-colors">
                Voir nos tarifs
              </button></a>
            </div>
          </div>
        </section>

        {/* Content Section 3 - Infinite Image Scroll */}
        <section id="about" className="py-24 dark:bg-gray-900">
          <div className="container mx-auto px-4 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-6 dark:text-white">Nos implémentations</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              Trouvez facilement l’agence la plus proche de chez vous et bénéficiez de notre expertise locale, où que vous soyez.
              </p>
            </div>
          </div>

          {/* Infinite Image Scroll Component */}
          <InfiniteImageScroll />
        </section>

        {/* Content Section 1 - Country path */}
        <div>
          <CountryPath />
        </div>


        {/* Content Section 1 - Location */}
        <div>
          <LocationCar />
        </div>

        {/* Content Section 4 - Tariff Plans */}
        <section id="contact" className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto mb-16 text-center">
              <h2 className="text-5xl font-bold mb-6 dark:text-white">Tarifs</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
              Trouvez l’offre qui vous convient parmi nos différentes formules, conçues 
              pour s’adapter à vos besoins, vos priorités et votre budget.
              </p>
            </div>

            {/* Tariff Plans Component */}
            <TariffPlans />
          </div>
        </section>

        {/* Content Section 5 - Infinite Tags Scroll 
        <section className="py-20 dark:bg-gray-900">
          <div className="container mx-auto px-4 mb-12">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-6 dark:text-white">Our Expertise</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                We specialize in a wide range of services to help your business grow and succeed.
              </p>
            </div>
          </div>

          {/* Infinite Tags Scroll Component ///////
          <InfiniteTagsScroll />
        </section>*/}

        {/* Content Section 6 - User Comment Tags */}
        <section className="py-24 bg-gray-50 dark:bg-gray-800">
          <div className="container mx-auto px-4 mb-16">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-5xl font-bold mb-6 dark:text-white">Qu'est ce que nos clients disents</h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-12">
              Ne nous croyez pas sur parole. Voici ce que nos clients ont à dire de nos services.
              </p>
            </div>
          </div>

          {/* User Comment Tags Component */}
          <UserCommentTags />

          {/* Content Section Testamonials */}
          <div>
            <Testamonials />
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
