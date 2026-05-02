"use client";
import React from "react";
import { sectionEightData, SectionEightContent } from "@/data/language/section-eight";

const ContactPerson: React.FC<{ language: keyof typeof sectionEightData }> = ({ language }) => {
  const data: SectionEightContent = sectionEightData[language] || sectionEightData["id"];

  return (
    <div className="container mx-auto py-16 px-4 mt-12">
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl md:text-4xl font-bold text-amber-500">
              {data.title}
            </h1>
            <p className="text-sm md:text-base max-w-3xl mx-auto leading-relaxed text-black">
              {data.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {(["facebook", "instagram", "tiktok"] as const).map((platform) => {
              const links = {
                facebook: "https://www.facebook.com/indojavatrip/",
                instagram: "https://www.instagram.com/indojavatrip/",
                tiktok: "https://www.tiktok.com/@indojavatrip",
              };

              return (
                <a
                  key={platform}
                  href={links[platform]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-3"
                >
                  <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center">
                    {platform === "facebook" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 320 512"
                        fill="currentColor"
                        className="text-amber-500"
                      >
                        <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
                      </svg>
                    )}
                    {platform === "instagram" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        className="text-amber-500"
                      >
                        <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                      </svg>
                    )}
                    {platform === "tiktok" && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        className="text-amber-500"
                      >
                        <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
                      </svg>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-black">
                      {platform.charAt(0).toUpperCase() + platform.slice(1)}
                    </span>
                    <span className="text-xs text-gray-600">
                      @indojavatrip
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column */}
        <div className="border border-amber-200 rounded-lg p-6 mt-8">
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-black">
              {data.contactForm.kontak}
            </h2>

            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm text-black">
                {data.contactForm.name}
              </label>
              <div>
                <input
                  id="name"
                  type="text"
                  placeholder={data.contactForm.placeholderName}
                  className="w-full p-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm text-black">
                {data.contactForm.email}
              </label>
              <div>
                <input
                  id="email"
                  type="email"
                  placeholder={data.contactForm.placeholderEmail}
                  className="w-full p-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm text-black">
                {data.contactForm.description}
              </label>
              <textarea
                id="description"
                placeholder={data.contactForm.placeholderDescription}
                className="w-full min-h-[100px] p-2 border border-amber-200 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-black placeholder:text-gray-400"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-md transition-colors"
            >
              {data.contactForm.submitButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPerson;
