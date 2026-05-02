"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useRef, useMemo, useCallback, Suspense } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import CardList from "@/components/Cardlist"
import { getProductDetailsByLanguage } from "@/data/language/detailProduct"
import { getKategoriByLanguage } from "@/data/language/data-kategori"

// Define a type for supported languages
type SupportedLanguage = "id" | "en" | "ms" | "zh"

// Define interfaces for our data structures
interface ProductDetail {
  title: string
  type: string
  price: string
  customTrip: string
  image?: string
  includes?: string[]
  excludes?: string[]
  itinerary?: ItineraryDay[]
  notes?: string[]
  book?: string
  contact?: string
  rating?: number
}

interface ItineraryDay {
  day: string
  details: string[]
}

interface Package {
  id: string | number
  title: string
  rating: number
  duration: string
  image: string
}

// Define props for Header and Footer components
interface HeaderProps {
  language: SupportedLanguage
  setLanguage: (newLanguage: SupportedLanguage) => void
}

interface FooterProps {
  language: SupportedLanguage
}

function ProductPageContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const title = searchParams.get("title")
  const [activeTab, setActiveTab] = useState("hari1")
  const [language, setLanguage] = useState<SupportedLanguage>("id")
  const [productDetails, setProductDetails] = useState<ProductDetail[]>([])
  const [popularPackages, setPopularPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [dataInitialized, setDataInitialized] = useState(false)

  // Use useRef instead of state for the timeout to avoid re-renders
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Memoize the product to avoid recalculating on every render
  const product = useMemo(() => productDetails.find((item) => item.title === title), [productDetails, title])

  // Load language from localStorage on mount - only runs once
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage") || "id"
    // Validate that the saved language is one of the supported languages
    if (savedLanguage === "id" || savedLanguage === "en" || savedLanguage === "ms" || savedLanguage === "zh") {
      setLanguage(savedLanguage as SupportedLanguage)
    } else {
      // Default to "id" if saved language is not supported
      setLanguage("id")
    }
  }, [])

  // Memoize the language change handler to prevent recreation on each render
  const handleLanguageChange = useCallback((newLanguage: string) => {
    // Validate that the new language is one of the supported languages
    if (newLanguage === "id" || newLanguage === "en" || newLanguage === "ms" || newLanguage === "zh") {
      setLanguage(newLanguage as SupportedLanguage)
      localStorage.setItem("selectedLanguage", newLanguage)
    } else {
      // Default to "id" if new language is not supported
      setLanguage("id")
      localStorage.setItem("selectedLanguage", "id")
    }
  }, [])

  // Update product details and packages when language changes
  useEffect(() => {
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }

    // Immediate data fetching without delay for better performance
    const fetchData = () => {
      setIsLoading(true)

      try {
        // Get product details for the current language - use direct assignment for speed
        const details = getProductDetailsByLanguage(language)
        const categories = getKategoriByLanguage(language)

        // Optimize by doing all calculations in one go
        const allPackages = categories.flatMap((category) => category.packages || [])
        const currentProduct = details.find((item) => item.title === title)
        const filteredPackages = currentProduct
          ? allPackages.filter((pkg) => pkg.title !== currentProduct.title).slice(0, 4)
          : allPackages.slice(0, 4)

        // Batch state updates to reduce renders
        setProductDetails(details)
        setPopularPackages(filteredPackages)
        setIsLoading(false)
        setInitialLoading(false)
        setDataInitialized(true)
      } catch (error) {
        console.error("Error loading data:", error)
        setIsLoading(false)
        setInitialLoading(false)
        setDataInitialized(true)
      }
    }

    // Use requestAnimationFrame for smoother UI updates
    requestAnimationFrame(() => {
      fetchData()
    })

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
        loadingTimeoutRef.current = null
      }
    }
  }, [language, title])

  // Memoize tab label getter to avoid recalculation
  const getTabLabel = useCallback(
    (tabType: string) => {
      if (tabType === "termasuk") {
        return language === "id"
          ? "Termasuk"
          : language === "en"
            ? "Included"
            : language === "ms"
              ? "Termasuk"
              : language === "zh"
                ? "包含"
                : "Termasuk"
      } else if (tabType === "tidakTermasuk") {
        return language === "id"
          ? "Tidak Termasuk"
          : language === "en"
            ? "Not Included"
            : language === "ms"
              ? "Tidak Termasuk"
              : language === "zh"
                ? "不包含"
                : "Tidak Termasuk"
      } else if (tabType.startsWith("hari")) {
        const dayNumber = tabType.replace("hari", "")
        return language === "id"
          ? `Hari ${dayNumber}`
          : language === "en"
            ? `Day ${dayNumber}`
            : language === "ms"
              ? `Hari ${dayNumber}`
              : language === "zh"
                ? `第${dayNumber}天`
                : `Hari ${dayNumber}`
      }
      return tabType
    },
    [language],
  )

  // Memoize loading UI to prevent recreation on each render
  const renderLoadingUI = useCallback(
    () => (
      <div className="min-h-screen bg-white font-sans">
        <Header language={language} setLanguage={handleLanguageChange as (newLanguage: SupportedLanguage) => void} />
        <div className="container mx-auto px-4 pt-32 md:pt-40 lg:pt-48 pb-20 flex justify-center">
          <div className="max-w-lg w-full bg-white rounded-xl shadow-sm p-8 text-center border border-orange-100">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 relative">
                <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin"></div>
                </div>
              </div>
              <h2 className="text-xl font-medium text-gray-700">
                {language === "id"
                  ? "Memuat data..."
                  : language === "en"
                    ? "Loading data..."
                    : language === "ms"
                      ? "Memuatkan data..."
                      : language === "zh"
                        ? "加载数据中..."
                        : "Memuat data..."}
              </h2>
            </div>
          </div>
        </div>
        <Footer language={language} />
      </div>
    ),
    [language, handleLanguageChange],
  )

  // Memoize tab content to prevent recreation on each render
  const renderTabContent = useMemo(() => {
    if (!product) return null

    if (activeTab === "termasuk" && product.includes && product.includes.length > 0) {
      return (
        <div className="p-6 bg-white rounded-md">
          <ul className="list-disc ml-6 space-y-2">
            {product.includes.map((item: string, index: number) => (
              <li key={index} className="text-gray-700 text-sm md:text-base">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    } else if (activeTab === "tidakTermasuk" && product.excludes && product.excludes.length > 0) {
      return (
        <div className="p-6 bg-white rounded-md">
          <ul className="list-disc ml-6 space-y-2">
            {product.excludes.map((item: string, index: number) => (
              <li key={index} className="text-gray-700 text-sm md:text-base">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )
    } else if (activeTab.startsWith("hari") && product.itinerary && product.itinerary.length > 0) {
      const dayIndex = Number.parseInt(activeTab.replace("hari", "")) - 1

      if (dayIndex >= 0 && dayIndex < product.itinerary.length) {
        const day = product.itinerary[dayIndex]
        return (
          <div className="p-6 bg-white rounded-md">
            <div className="mb-6">
              <h3 className="font-bold text-lg md:text-2xl mb-4 text-orange-500">{day.day}</h3>
              <ul className="list-disc ml-6 space-y-2">
                {day.details.map((detail: string, idx: number) => (
                  <li key={idx} className="text-gray-700 text-sm md:text-base">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {product.notes && product.notes.length > 0 && activeTab === "hari1" && (
              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-base md:text-xl mb-3 text-orange-500">
                  {language === "id"
                    ? "Catatan:"
                    : language === "en"
                      ? "Notes:"
                      : language === "ms"
                        ? "Nota:"
                        : language === "zh"
                          ? "备注："
                          : "Catatan:"}
                </h3>
                <ul className="list-none space-y-2">
                  {product.notes.map((note: string, index: number) => (
                    <li key={index} className="text-gray-700 text-sm md:text-base">
                      - {note}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      }
    }

    return (
      <div className="p-6 bg-white rounded-md text-gray-700 text-sm md:text-base">
        {language === "id"
          ? "Konten tidak tersedia."
          : language === "en"
            ? "Content not available."
            : language === "ms"
              ? "Kandungan tidak tersedia."
              : language === "zh"
                ? "内容不可用。"
                : "Konten tidak tersedia."}
      </div>
    )
  }, [product, activeTab, language])

  // Memoize recommendations to prevent recreation on each render
  const renderRecommendations = useMemo(() => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-200 rounded-lg aspect-[3/4]"></div>
              <div className="mt-2 bg-gray-200 h-4 rounded w-3/4"></div>
              <div className="mt-1 bg-gray-200 h-3 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="cursor-pointer"
            onClick={() => router.push(`/product?title=${encodeURIComponent(pkg.title)}`)}
          >
            <CardList title={pkg.title} rating={pkg.rating} duration={pkg.duration} image={pkg.image} />
          </div>
        ))}
      </div>
    )
  }, [isLoading, popularPackages, router])

  // Memoize tab buttons to prevent recreation on each render - MOVED UP before conditional returns
  const tabButtons = useMemo(() => {
    if (!product) return null

    // Add proper null checks and length checks
    const hasItinerary = product.itinerary && product.itinerary.length > 0
    const hasIncludes = product.includes && product.includes.length > 0
    const hasExcludes = product.excludes && product.excludes.length > 0

    return (
      <div className="flex flex-wrap gap-2 md:gap-3">
        {/* Dynamically create day tabs based on itinerary length */}
        {hasItinerary &&
          product.itinerary?.map((day, index) => (
            <button
              key={`hari${index + 1}`}
              className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center justify-center border-2 text-xs md:text-sm font-medium transition-all
                ${
                  activeTab === `hari${index + 1}`
                    ? "border-orange-500 bg-orange-500 text-white"
                    : "border-gray-200 hover:border-orange-300 text-gray-700"
                }`}
              onClick={() => setActiveTab(`hari${index + 1}`)}
            >
              {getTabLabel(`hari${index + 1}`)}
            </button>
          ))}

        {hasIncludes && (
          <button
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center justify-center border-2 text-xs md:text-sm font-medium transition-all
              ${
                activeTab === "termasuk"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 hover:border-orange-300 text-gray-700"
              }`}
            onClick={() => setActiveTab("termasuk")}
          >
            {getTabLabel("termasuk")}
          </button>
        )}

        {hasExcludes && (
          <button
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full flex items-center justify-center border-2 text-xs md:text-sm font-medium transition-all
              ${
                activeTab === "tidakTermasuk"
                  ? "border-orange-500 bg-orange-500 text-white"
                  : "border-gray-200 hover:border-orange-300 text-gray-700"
              }`}
            onClick={() => setActiveTab("tidakTermasuk")}
          >
            {getTabLabel("tidakTermasuk")}
          </button>
        )}
      </div>
    )
  }, [product, activeTab, getTabLabel])

  // Now we can use conditional returns after all hooks have been called
  if (isLoading || initialLoading) {
    return renderLoadingUI()
  }

  if (!product && dataInitialized) {
    return (
      <div className="min-h-screen bg-white font-sans">
        <Header language={language} setLanguage={handleLanguageChange as (newLanguage: SupportedLanguage) => void} />
        <div className="container mx-auto px-4 pt-32 md:pt-40 lg:pt-48 pb-20">
          <div className="max-w-lg mx-auto bg-gradient-to-b from-orange-50 to-white rounded-xl shadow-sm p-8 text-center border border-orange-100">
            <div className="mb-6 flex justify-center">
              <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-orange-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {language === "id"
                ? "Segera Hadir!"
                : language === "en"
                  ? "Coming Soon!"
                  : language === "ms"
                    ? "Akan Datang!"
                    : language === "zh"
                      ? "即将推出！"
                      : "Segera Hadir!"}
            </h2>
            <p className="text-gray-600 mb-6">
              {language === "id"
                ? "Paket wisata ini sedang dalam persiapan dan akan segera tersedia. Hubungi kami untuk informasi lebih lanjut."
                : language === "en"
                  ? "This travel package is in preparation and will be available soon. Contact us for more information."
                  : language === "ms"
                    ? "Pakej perjalanan ini sedang dalam persiapan dan akan tersedia tidak lama lagi. Hubungi kami untuk maklumat lanjut."
                    : language === "zh"
                      ? "此旅行套餐正在准备中，即将推出。请联系我们获取更多信息。"
                      : "Paket wisata ini sedang dalam persiapan dan akan segera tersedia. Hubungi kami untuk informasi lebih lanjut."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                {language === "id"
                  ? "Hubungi via WhatsApp"
                  : language === "en"
                    ? "Contact via WhatsApp"
                    : language === "ms"
                      ? "Hubungi melalui WhatsApp"
                      : language === "zh"
                        ? "通过WhatsApp联系"
                        : "Hubungi via WhatsApp"}
              </a>

              <button
                onClick={() => router.push("/")}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
              >
                {language === "id"
                  ? "Kembali ke Beranda"
                  : language === "en"
                    ? "Back to Home"
                    : language === "ms"
                      ? "Kembali ke Laman Utama"
                      : language === "zh"
                        ? "返回首页"
                        : "Kembali ke Beranda"}
              </button>
            </div>
          </div>
        </div>
        <Footer language={language} />
      </div>
    )
  }

  if (!product) return renderLoadingUI()

  return (
    <div className="min-h-screen bg-white font-sans">
      <Header language={language} setLanguage={handleLanguageChange as (newLanguage: SupportedLanguage) => void} />
      <main className="container mx-auto px-4 pt-20 md:pt-32 lg:pt-40 pb-12">
        {/* Product Content */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Column - Image (Sticky) */}
          <div className="lg:sticky lg:top-32 lg:self-start lg:max-height-[calc(100vh-8rem)]">
            <div className="space-y-4">
              <div className="aspect-square relative overflow-hidden rounded-xl bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.title}
                    className="w-full h-full object-cover"
                    loading="eager" // Prioritize image loading
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-500 text-sm md:text-base">
                      {language === "id"
                        ? "Gambar tidak tersedia"
                        : language === "en"
                          ? "No image available"
                          : language === "ms"
                            ? "Tiada gambar tersedia"
                            : language === "zh"
                              ? "没有可用的图片"
                              : "Gambar tidak tersedia"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-tight text-black">{product.title}</h1>
              <p className="text-lg md:text-2xl font-light text-gray-600">{product.type}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {"★★★★★".split("").map((star, i) => (
                  <span key={i} className="text-lg md:text-2xl">
                    {star}
                  </span>
                ))}
              </div>
            </div>

            {/* Price */}
            <p className="text-2xl md:text-4xl font-bold text-black">{product.price}</p>

            {/* Custom Trip */}
            <p className="text-base md:text-xl text-gray-700 leading-relaxed">{product.customTrip}</p>

            {/* Tabs */}
            <div className="space-y-4">
              {tabButtons}
              {/* Tab Content */}
              <div className="mt-4">{renderTabContent}</div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:space-x-4">
              <a
                href="https://api.whatsapp.com/send/?phone=6281390070766&text=Halo%20saya%20ingin%20memesan%20paket%20wisata&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-3 md:py-4 text-base md:text-lg font-semibold rounded transition-colors text-center"
              >
                {product.book ||
                  (language === "id"
                    ? "Pesan"
                    : language === "en"
                      ? "Book Now"
                      : language === "ms"
                        ? "Tempah"
                        : language === "zh"
                          ? "立即预订"
                          : "Pesan")}
              </a>
              <a
                href="https://api.whatsapp.com/send/?phone=6281390070766&text=Halo%20saya%20ingin%20bertanya%20tentang%20paket%20wisata&type=phone_number&app_absent=0"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 md:px-6 py-3 md:py-4 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded text-base md:text-lg font-semibold transition-colors text-center"
              >
                {product.contact ||
                  (language === "id"
                    ? "Hubungi Langsung"
                    : language === "en"
                      ? "Contact Us"
                      : language === "ms"
                        ? "Hubungi Kami"
                        : language === "zh"
                          ? "联系我们"
                          : "Hubungi Langsung")}
              </a>
            </div>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mt-20 mb-12">
          <div className="flex justify-start">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tighter text-orange-500 mb-12">
              {language === "id"
                ? "Rekomendasi Lainnya"
                : language === "en"
                  ? "Other Recommendations"
                  : language === "ms"
                    ? "Cadangan Lain"
                    : language === "zh"
                      ? "其他推荐"
                      : "Rekomendasi Lainnya"}
            </h2>
          </div>
          {renderRecommendations}
        </div>
      </main>
      <Footer language={language} />
    </div>
  )
}

export default function ProductPage() {
  return (
    <Suspense>
      <ProductPageContent />
    </Suspense>
  )
}
