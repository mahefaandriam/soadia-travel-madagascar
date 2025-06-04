
const CountryPhares = () => {
    
    return (
        <section className="pt-30 bg-c1 text-gray-800 ">
            <div className="text-left ml-6 md:ml-6 mr-6 md:mr-150">
                <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
                    Les villes les plus emblématiques de Madagascar
                </h2>
                <p className="text-lg text-secondary mb-6">
                    Découvrez la richesse culturelle et la beauté naturelle de Madagascar à travers ses villes incontournables.
                </p>
                <p className="text-gray-500">
                    Partez à la découverte d’<strong>Antananarivo</strong>, la capitale perchée sur ses collines, <strong>Mahajanga</strong> et ses plages animées, ou encore <strong>Antsirabe</strong>, réputée pour ses sources thermales. Chaque ville offre une expérience unique, entre histoire, traditions et paysages à couper le souffle.
                </p>
            </div>
            <div className="container mx-auto mt-6 px-6">                
                <div className="grid grid-cols-1 md:grid-cols-3 h-[550px] md:h-[200px] gap-8">
                    <div className="col-span-1 overflow-hidden rounded-lg">             
                        <div className="bg-cover bg-center h-full transition-all duration-500 hover:scale-105"
                        style={{ backgroundImage : 'url(/images/country/Antananarivo-imp.jpg)' }}>
                            <div className="flex items-center justify-center w-full h-full hover:bg-gray-800/25">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                    Antananarivo
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 overflow-hidden rounded-lg">             
                        <div className="bg-cover bg-center h-full transition-all duration-500 hover:scale-105"
                        style={{ backgroundImage : 'url(/images/country/Mahajanga-imp.webp)' }}>
                            <div className="flex items-center justify-center w-full h-full hover:bg-gray-800/25">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                    Mahajanga
                                </h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-span-1 overflow-hidden rounded-lg">             
                        <div className="bg-cover bg-center h-full transition-all duration-500 hover:scale-105"
                        style={{ backgroundImage : 'url(/images/country/Antsirabe-imp.jpg)' }}>
                            <div className="flex items-center justify-center w-full h-full hover:bg-gray-800/25">
                                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                                    Antsirabe
                                </h2>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    )
}

export default CountryPhares;