"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"

interface TestimonialData {
  name: string
  location: string
  rating: number
  feedback: string
  color: string
}

function Avatar({ name, color, size = 48 }: Readonly<{ name: string; color: string; size?: number }>) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
  return (
    <div
      className={`${color} rounded-full flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}
    >
      {initials}
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}

function useResponsiveView(mobileBreakpoint = 480, tabletBreakpoint = 1024) {
  const [viewType, setViewType] = useState<"desktop" | "tablet" | "mobile">("desktop")

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkViewType = () => {
        const width = window.innerWidth
        if (width < mobileBreakpoint) {
          setViewType("mobile")
        } else if (width < tabletBreakpoint) {
          setViewType("tablet")
        } else {
          setViewType("desktop")
        }
      }

      checkViewType()
      window.addEventListener("resize", checkViewType)
      return () => {
        window.removeEventListener("resize", checkViewType)
      }
    }
  }, [mobileBreakpoint, tabletBreakpoint])

  return viewType
}

const TestimonialSection = () => {
  const viewType = useResponsiveView()
  const isSliderView = viewType === "mobile" || viewType === "tablet"
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const sliderRef = useRef<HTMLDivElement>(null)

  const testimonials: TestimonialData[] = [
    {
      name: "Maydar",
      location: "Kuala Lumpur",
      rating: 5.0,
      feedback:
        "many interesting travel offers, travel packages can be changed according to our wishes, the best travel agent",
      color: "bg-orange-500",
    },
    {
      name: "Jon Delno",
      location: "Amerika Serikat",
      rating: 5.0,
      feedback:
        "first time traveling on mount bromo and ijen crater, it was very satisfying the first time traveling, and the guide was very friendly and fun",
      color: "bg-blue-500",
    },
    {
      name: "Faryel Vivaldy",
      location: "Indonesia",
      rating: 5.0,
      feedback:
        "Tripnya seru banget! Semua udah diatur rapi, jadi tinggal santai aja nikmatin perjalanan. Guide-nya ramah, nggak ngabasenin, dan tau banyak spot keren.",
      color: "bg-green-500",
    },
    {
      name: "Jon Delno",
      location: "Indonesia",
      rating: 5.0,
      feedback:
        "Suka banget sama pelayanannya! Bener-bener bikin liburan jadi lebih santai dan nggak ribet. Next time pasti pakai Indo Javatrip lagi!",
      color: "bg-purple-500",
    },
    {
      name: "Jon Delno",
      location: "Indonesia",
      rating: 5.0,
      feedback: "guide asik, dan perjalanan super nyaman. Paketnya puas banget sama Indo Javatrip. Worth it!",
      color: "bg-rose-500",
    },
  ]

  useEffect(() => {
    if (isSliderView) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [isSliderView, testimonials.length])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 50) {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length)
    } else if (distance < -50) {
      setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    }
    setTouchStart(null)
    setTouchEnd(null)
  }

  const goToSlide = (index: number) => setCurrentSlide(index)
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % testimonials.length)

  const renderStars = (rating: number) => (
    <div className="flex items-center">
      <span className="text-yellow-400 text-xl mr-1">★</span>
      <span className="font-medium text-black">{rating.toFixed(1)}</span>
    </div>
  )

  return (
    <section className="py-16 bg-orange-400">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-white text-center mb-10 md:mb-16">
          Testimoni dari Tamu Kami
          <br />
          yang Terhormat
        </h2>

        {/* Desktop view */}
        {viewType === "desktop" && (
          <>
            <div className="grid grid-cols-3 gap-6">
              {testimonials.slice(0, 3).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <Avatar name={testimonial.name} color={testimonial.color} size={48} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{testimonial.name}</h3>
                      <p className="text-sm text-orange-500">{testimonial.location}</p>
                    </div>
                    <div className="ml-auto">{renderStars(testimonial.rating)}</div>
                  </div>
                  <p className="text-sm text-black">{testimonial.feedback}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-6 mt-6 max-w-4xl mx-auto">
              {testimonials.slice(3).map((testimonial, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <Avatar name={testimonial.name} color={testimonial.color} size={48} />
                    </div>
                    <div>
                      <h3 className="font-bold text-black">{testimonial.name}</h3>
                      <p className="text-sm text-orange-500">{testimonial.location}</p>
                    </div>
                    <div className="ml-auto">{renderStars(testimonial.rating)}</div>
                  </div>
                  <p className="text-sm text-black">{testimonial.feedback}</p>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Mobile and Tablet slider view */}
        {isSliderView && (
          <div className="relative">
            <div
              ref={sliderRef}
              className="overflow-hidden"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0 px-2">
                    <div className="bg-white rounded-lg p-5 shadow-md h-full">
                      <div className="flex items-center mb-4">
                        <div className="mr-4">
                          <Avatar name={testimonial.name} color={testimonial.color} size={56} />
                        </div>
                        <div>
                          <h3 className="font-bold text-black">{testimonial.name}</h3>
                          <p className="text-sm text-orange-500">{testimonial.location}</p>
                        </div>
                        <div className="ml-auto">{renderStars(testimonial.rating)}</div>
                      </div>
                      <p className="text-sm text-black">{testimonial.feedback}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    currentSlide === index ? "bg-white w-6" : "bg-white/50",
                  )}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            <div className="flex justify-between absolute top-1/2 left-0 right-0 -translate-y-1/2 px-2">
              <button
                onClick={goToPrevSlide}
                className="bg-white/80 rounded-full p-2 text-orange-500 hover:bg-white"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <button
                onClick={goToNextSlide}
                className="bg-white/80 rounded-full p-2 text-orange-500 hover:bg-white"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialSection
