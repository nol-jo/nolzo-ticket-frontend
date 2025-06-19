"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEvents } from "@/hooks/use-events"
import type { EventResponse } from "@/lib/api/events"

export default function HomePage() {
  const { events, loading, error, usingFallback } = useEvents()
  const [currentBanner, setCurrentBanner] = useState<EventResponse | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 첫 번째 이벤트를 기본 배너로 설정
  useEffect(() => {
    if (events.length > 0 && !currentBanner) {
      setCurrentBanner(events[0])
    }
  }, [events, currentBanner])

  const handleBannerHover = (banner: EventResponse) => {
    if (banner.id !== currentBanner?.id) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBanner(banner)
        setIsTransitioning(false)
      }, 150)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">공연 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* API 상태 알림 */}
      {usingFallback && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-sm">⚠️ {error} 현재 샘플 데이터를 표시하고 있습니다.</p>
          </div>
        </div>
      )}

      {/* Main Banner */}
      {currentBanner && (
        <section className="relative h-[500px] bg-black overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
                isTransitioning ? "opacity-0" : "opacity-30"
              }`}
              style={{
                backgroundImage: `url(${currentBanner.poster || "/placeholder.svg"})`,
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>

          {/* Banner Content */}
          <div className="relative z-10 h-full flex items-center justify-center pb-24">
            <div className="text-center text-white max-w-2xl px-4">
              <div
                className={`transition-all duration-300 ${
                  isTransitioning ? "opacity-0 transform translate-y-4" : "opacity-100 transform translate-y-0"
                }`}
              >
                <span className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mb-4">
                  {currentBanner.category}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold mb-4">{currentBanner.title}</h1>
                <p className="text-xl mb-2 opacity-90">{currentBanner.subtitle}</p>
                <p className="text-lg opacity-75 mb-6">{currentBanner.description}</p>
                <Link href={`/goods/${currentBanner.id}`}>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                    자세히 보기
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Thumbnail Navigation */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20">
            <div className="flex space-x-3 overflow-x-auto px-4 max-w-screen-lg">
              {events.slice(0, 14).map((banner) => (
                <div
                  key={banner.id}
                  className={`w-14 h-14 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 cursor-pointer transition-all duration-200 ${
                    currentBanner.id === banner.id
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black scale-110"
                      : "hover:scale-105 opacity-70 hover:opacity-100"
                  }`}
                  onMouseEnter={() => handleBannerHover(banner)}
                >
                  <Image
                    src={banner.poster || "/placeholder.svg"}
                    alt={banner.title}
                    width={56}
                    height={56}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, 6).map((event, index) => {
            const gradients = [
              "from-blue-400 to-blue-600",
              "from-yellow-400 to-orange-500",
              "from-red-600 to-red-800",
              "from-pink-300 to-pink-500",
              "from-blue-500 to-purple-600",
              "from-gray-800 to-black",
            ]

            return (
              <Link key={event.id} href={`/goods/${event.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`relative h-48 bg-gradient-to-br ${gradients[index % gradients.length]}`}>
                    <div className="absolute inset-0 p-6 text-white">
                      <div className="text-sm opacity-90 mb-2">{event.category}</div>
                      <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                      <p className="text-sm opacity-90">{event.subtitle}</p>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Image
                        src={event.poster || "/placeholder.svg"}
                        alt={event.title}
                        width={60}
                        height={80}
                        className="rounded shadow-lg"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Additional Content Sections */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">인기 공연</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {events.slice(0, 6).map((event) => (
              <Link key={event.id} href={`/goods/${event.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={event.poster || "/placeholder.svg"}
                      alt={event.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900">{event.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">오픈 예정</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {events.slice(6, 12).map((event) => (
              <Link key={event.id} href={`/goods/${event.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg relative">
                    <Image
                      src={event.poster || "/placeholder.svg"}
                      alt={event.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      OPEN
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900">{event.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
