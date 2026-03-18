"use client" // only if using client-side interactivity

import Script from "next/script";

export default function Home() {
  return (
    <div>
      <Script
        strategy="afterInteractive"
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8528915813394509"
        crossOrigin="anonymous"
      />
      
      {/* Your components */}
      <Navbar />
      <main>
        <Hero />
        <WhyChoose />
        <CountryPhares />
        <AsymetricGallery />
        <CountryPath />
        <Testamonials />
        <InfiniteImageScroll />
        <TariffPlans />
      </main>
      <Footer />
    </div>
  );
}