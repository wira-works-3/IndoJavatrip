"use client"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion" // Import Framer Motion
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import SectionTwo from "./dashboard/section-two/SectionTwo"
import HotPackagesSection from "./dashboard/section-three/HotPackagesSection"
import SectionFour from "./dashboard/section-four/SectionFour"
import FiturUnggulan from "./dashboard/section-five/FiturUnggulan"
import SectionSix from "./dashboard/section-six/ImageGallery"
import TestimonialSection from "./dashboard/section-seven/page"
import ContactPerson from "./dashboard/section-eight/ContactPerson"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { heroSectionData, type HeroSectionContent } from "@/data/language/heroSectionData"

// Define language type directly in this file
type SupportedLanguage = "id" | "en" | "ms" | "zh"

export default function Home() {
  const [language, setLanguage] = useState<SupportedLanguage>("id") // Default language: Indonesian
  const [isReady, setIsReady] = useState(false) // Track if the app is ready to render
  const [currentImage, setCurrentImage] = useState(0)
  const [prevImage, setPrevImage] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false) // Track if the screen is mobile

  const sectionTwoRef = useRef<HTMLDivElement>(null) // Reference to Section Two

  const images = ["/Herosection/gunung.svg", "/Herosection/Pantai_dashboard.svg"]

  // Detect screen size for responsive animation
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768) // Set to true if screen width is <= 768px
    }

    handleResize() // Check on initial load
    window.addEventListener("resize", handleResize) // Add resize listener

    return () => window.removeEventListener("resize", handleResize) // Cleanup listener
  }, [])

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage")
    // Validate that the saved language is one of the supported languages
    const validLanguage = (savedLanguage || "id") as SupportedLanguage
    setLanguage(["id", "en", "ms", "zh"].includes(savedLanguage || "") ? validLanguage : "id")
    setIsReady(true)
  }, [])

  // Custom language setter that also saves to localStorage
  const handleLanguageChange = (newLanguage: SupportedLanguage) => {
    setLanguage(newLanguage)
    localStorage.setItem("selectedLanguage", newLanguage)
  }

  const goToNextImage = () => {
    if (transitioning) return

    const currentIdx = currentImage
    setPrevImage(currentIdx)
    setTransitioning(true)

    const nextIndex = (currentImage + 1) % images.length
    setCurrentImage(nextIndex)

    setTimeout(() => {
      setTransitioning(false)
    }, 600)
  }

  const goToPrevImage = () => {
    if (transitioning) return

    const currentIdx = currentImage
    setPrevImage(currentIdx)
    setTransitioning(true)

    const prevIndex = currentImage === 0 ? images.length - 1 : currentImage - 1
    setCurrentImage(prevIndex)

    setTimeout(() => {
      setTransitioning(false)
    }, 600)
  }

  // Auto transition every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      goToNextImage()
    }, 5000)

    return () => clearInterval(interval)
  }, [currentImage, transitioning])

  // Scroll to Section Two with offset
  const scrollToSectionTwo = () => {
    if (sectionTwoRef.current) {
      const offset = -100 // Adjust this value to control how much higher the scroll stops
      const sectionPosition = sectionTwoRef.current.getBoundingClientRect().top + window.scrollY + offset

      window.scrollTo({
        top: sectionPosition,
        behavior: "smooth", // Smooth scrolling
      })
    }
  }

  // Render nothing until the app is ready
  if (!isReady) {
    return null // Prevent rendering until language is loaded
  }

  const heroData: HeroSectionContent = heroSectionData[language] || heroSectionData["id"]

  return (
    <div className="min-h-screen bg-white">
      {/* Import Header - pass both language and the custom handler */}
      <Header language={language} setLanguage={handleLanguageChange} />

      {/* Main Content Container */}
      <div className="container mx-auto px-4 py-4 pt-24 md:py-10 md:pt-36 lg:pt-48">
        {/* Hero Section Card */}
        <div className="relative w-full overflow-hidden rounded-xl md:rounded-3xl shadow-lg">
          {/* Image Slider */}
          <div className="relative aspect-[4/5] xs:aspect-[3/4] sm:aspect-[16/9] md:aspect-[21/9] w-full min-h-[calc(100vh-120px)] sm:min-h-0 md:max-h-[600px] lg:max-h-[700px]">
            {/* Current Image */}
            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={`Slide ${currentImage + 1}`}
              className={`absolute inset-0 w-full h-full object-cover scale-110 transition-transform duration-700 ease-in-out ${
                transitioning ? "z-10" : "z-20"
              }`}
            />

            {/* Previous Image (for dissolve effect) */}
            {transitioning && (
              <img
                src={images[prevImage] || "/placeholder.svg"}
                alt={`Previous slide`}
                className="absolute inset-0 w-full h-full object-cover scale-110 z-0"
              />
            )}

            {/* Content Overlay with Responsive Animation */}
            <motion.div
              className="absolute inset-0 z-30 p-4 sm:p-6 md:p-12 flex flex-col justify-center md:justify-center"
              initial={isMobile ? { y: "30%", opacity: 0 } : { x: "-100%", opacity: 0 }} // Mobile: slide from slightly below, Desktop: slide from left
              animate={{ x: 0, y: 0, opacity: 1 }} // Slide to original position and fade in
              transition={{ duration: 1.2, ease: "easeInOut" }} // Smooth animation with longer duration
            >
              <div className="max-w-xl bg-black/30 md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none backdrop-blur-sm md:backdrop-blur-none mx-auto md:mx-0 text-center md:text-left">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
                  {heroData.title}
                  <br className="hidden xs:block" />
                  <span className="text-orange-300 md:text-white">{heroData.subtitle}</span>
                </h1>
                <p className="text-white/90 text-xs sm:text-sm md:text-base lg:text-lg mb-3 sm:mb-6 max-w-md mx-auto md:mx-0">
                  {heroData.description}
                </p>
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-4 justify-center md:justify-start">
                  <button
                    onClick={scrollToSectionTwo} // Scroll to Section Two
                    className="bg-orange-500 hover:bg-orange-600 text-white text-sm sm:text-base font-medium px-4 py-2 md:px-6 md:py-2 lg:px-8 lg:py-3 rounded-md transition-colors w-full md:w-auto md:max-w-[180px]"
                  >
                    {heroData.buttons.getStarted}
                  </button>
                  <button className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white text-sm sm:text-base font-medium px-4 py-2 md:px-6 md:py-2 lg:px-8 lg:py-3 rounded-md transition-colors hidden xs:block">
                    {heroData.buttons.explorePackages}
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Navigation Buttons */}
            <div className="absolute top-4 right-4 sm:bottom-6 sm:right-6 sm:top-auto z-40 flex gap-2 md:gap-4">
              <button
                onClick={goToPrevImage} // Go to previous image
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-1.5 sm:p-2 md:p-3 transition-colors"
                aria-label="Previous image"
                disabled={transitioning}
              >
                <ArrowLeft size={16} className="sm:hidden" />
                <ArrowLeft size={20} className="hidden sm:block" />
              </button>
              <button
                onClick={goToNextImage} // Go to next image
                className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full p-1.5 sm:p-2 md:p-3 transition-colors"
                aria-label="Next image"
                disabled={transitioning}
              >
                <ArrowRight size={16} className="sm:hidden" />
                <ArrowRight size={20} className="hidden sm:block" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Section Two */}
      <div ref={sectionTwoRef} className="mb-16">
        <SectionTwo language={language} />
      </div>

      {/* Hot Packages Section */}
      <HotPackagesSection language={language} />
      <SectionFour language={language} />
      <FiturUnggulan language={language} />
      <SectionSix language={language} />
      <TestimonialSection />
      <ContactPerson language={language} />
      <Footer language={language} />
    </div>
  )
}
