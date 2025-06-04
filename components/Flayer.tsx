"use client"


const Flayer = () => {
    return (
        <>
            <section className="relative mt-6 bg-c1 h-[350px]">
                <div className="w-full h-full bg-cover bg-center pl-6 pr-6 md:pl-18 md:pr-150 "
                    style={{backgroundImage: 'url(/images/country/avenue-baobab-night.webp'}}
                >
                <div className="absolute inset-0 bg-blue-900/40"></div>
                    <div className=" relative flex flex-col justify-center text-center md:text-left w-full h-full">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Voyagez Facilement, Louez Rapidement !
                        </h2>
                        <p className="text-lg text-c1 mb-6">
                            Confort | Sécurité | Rapidité | Fiabilité | Service Premium
                            Réservation Instantanée | Chauffeurs Professionnels | Trajets Sur-Mesure
                            Disponible 24/7 | Sans Stress | Prix Compétitifs | Mobilité Simplifiée
                        </p>
                        <div className="flex justify-center md:justify-start gap-4 flex-wrap"
                            >
                            <a
                                href="#location"
                                className="bg-secondary hover:bg-red-700 transition-colors text-white font-semibold px-6 py-3 rounded shadow"
                            >
                                Louez en 1 Clic
                            </a>
                            <a
                                href="#book"
                                className="border border-white hover:border-secondary hover:text-secondary transition-colors px-6 py-3 rounded font-semibold text-white"
                            >
                                Trouver & Réserver
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Flayer;