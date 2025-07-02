"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

// 배너 데이터 타입 정의
interface BannerData {
  id: number
  title: string
  description: string
  posterImageUrl: string
  category: string
}

export default function HomePage() {
  const [bannerData, setBannerData] = useState<BannerData[]>([])
  const [currentBanner, setCurrentBanner] = useState<BannerData | null>(null)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API에서 데이터 가져오기
  useEffect(() => {
    const fetchBannerData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/v1/event/popular')

        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.')
        }

        const data: BannerData[] = await response.json()
        setBannerData(data)

        // 첫 번째 배너를 기본으로 설정
        if (data.length > 0) {
          setCurrentBanner(data[0])
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBannerData()
  }, [])

  const handleBannerHover = (banner: BannerData) => {
    if (currentBanner && banner.id !== currentBanner.id) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBanner(banner)
        setIsTransitioning(false)
      }, 150)
    }
  }

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              다시 시도
            </button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // 데이터가 없는 경우
  if (!currentBanner || bannerData.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p>표시할 데이터가 없습니다.</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Banner */}
      <section className="relative h-[500px] bg-black overflow-visible">
        {/* Background Image */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-30"
            }`}
            style={{
              backgroundImage: `url(${currentBanner.posterImageUrl})`,
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
          <div className="flex space-x-3 overflow-x-auto overflow-y-hidden px-4 py-2 max-w-screen-lg">
            {bannerData.map((banner) => (
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
                  src={banner.posterImageUrl || "/placeholder.svg"}
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

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannerData.map((item, index) => {
            // 각 카테고리별 그라데이션 색상 정의
            const gradientColors = {
              '뮤지컬': 'from-purple-400 to-purple-600',
              '콘서트': 'from-blue-400 to-blue-600',
              '연극': 'from-green-400 to-green-600',
              '클래식': 'from-amber-400 to-amber-600',
              '기타': 'from-gray-400 to-gray-600'
            }

            const gradientClass = gradientColors[item.category as keyof typeof gradientColors] || gradientColors['기타']

            return (
              <Link key={item.id} href={`/goods/${item.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className={`relative h-48 bg-gradient-to-br ${gradientClass}`}>
                    <div className="absolute inset-0 p-6 text-white">
                      <div className="text-sm opacity-90 mb-2">{item.category}</div>
                      <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                      <p className="text-sm opacity-90 line-clamp-2">{item.description}</p>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Image
                        src={item.posterImageUrl || "/placeholder.svg"}
                        alt={item.title}
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
      </main>

      <Footer />
    </div>
  )
}