
const AsymetricGallery = () => {
    {/* Asymetric gallery*/}
    return (
        <>
            <section className="pt-16 bg-white text-gray-800">
                <div className="text-center mx-6 md:mx-80 mb-6">
                    <h2 className="text-2xl md:text-3xl font-bold text-sky-950 mb-4">
                        Notre équipe et nos services
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Capturer l&apos;instant et voyager avec Soadia, c&apos;est bien plus qu&apos;un simple déplacement. Nous vous invitons à vivre chaque trajet comme une expérience unique, où confort, sécurité et découverte se conjuguent pour rendre vos voyages inoubliables.
                    </p>
                    <p className="text-gray-500">
                        Notre équipe passionnée met tout en œuvre pour vous offrir un service personnalisé, adapté à vos besoins et à vos envies. Faites confiance à notre expertise pour transformer chaque trajet en un moment d&apos;exception.
                    </p>
                </div>        
                <div className="grid col-span-10 grid-cols-10 md:grid-cols-9 gap-4 mx-6 md:mx-40 h-[550px] md:h-90">
                    {/* Top Row */}
                    <div className="relative col-span-10 md:col-span-5 h-50 overflow-hidden">
                        <div className="h-full w-full bg-cover bg-center hover:scale-110 transition-all duration-500" 
                        style={{ backgroundImage: 'url(/images/car/bustouristique2.jpg)' }}>
                            <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                             items-center text-transparent text-3xl md:text-4xl font-bold mb-4 hover:text-white ransition-all duration-500">
                                STAREX VIP
                            </div>
                        </div>
                    </div>
                    <div className="relative col-span-5 md:col-span-4 h-50 overflow-hidden">
                        <div className="h-full w-full bg-cover bg-center hover:scale-110 transition-all duration-500" 
                        style={{ backgroundImage: 'url(/images/car/BusTouristique.jpg)' }}>
                            <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                             items-center text-transparent text-xl md:text-4xl font-bold mb-4 hover:text-white ransition-all duration-500">
                                BUS TOURISTIQUE
                            </div>
                        </div>
                    </div>
                    <div className="relative col-span-5 md:col-span-4 overflow-hidden">
                        <div className="h-full w-full bg-cover bg-center hover:scale-110 transition-all duration-500" 
                        style={{ backgroundImage: 'url(/images/car/VIP+-car.jpg)' }}>
                            <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                             items-center text-transparent text-3xl md:text-4xl font-bold mb-4 hover:text-white ransition-all duration-500">
                                4x4
                            </div>
                        </div>
                    </div>
                    <div className="relative col-span-10 md:col-span-5 h-50 overflow-hidden">
                        <div className="h-full w-full bg-cover bg-center hover:scale-110 transition-all duration-500" 
                        style={{ backgroundImage: 'url(/images/people/tana-staff.jpg)' }}>
                            <div className="flex justify-center imtesm-center absolute inset-0 bg-none hover:bg-gray-800/25
                             items-center text-transparent text-3xl md:text-4xl font-bold hover:text-white ransition-all duration-500">
                                Réception 
                            </div>
                        </div>
                    </div>
                </div> 
            </section>
        </>
    )
}

export default AsymetricGallery;