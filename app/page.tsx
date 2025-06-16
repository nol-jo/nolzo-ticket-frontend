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
  subtitle: string
  description: string
  image: string
  backgroundImage: string
  category: string
}

// 메인 배너 데이터 (실제로는 서버에서 가져올 데이터)
const bannerData: BannerData[] = [
  {
    id: 1,
    title: "뮤지컬 라이온킹",
    subtitle: "디즈니의 감동 대서사시",
    description: "아프리카 대초원을 배경으로 펼쳐지는 생명의 찬가",
    image: "/images/poster1.png",
    backgroundImage: "/images/poster1.png",
    category: "뮤지컬",
  },
  {
    id: 2,
    title: "BTS 월드투어",
    subtitle: "Yet To Come in Cinemas",
    description: "전 세계를 감동시킨 BTS의 특별한 무대",
    image: "/images/poster2.png",
    backgroundImage: "/images/poster2.png",
    category: "콘서트",
  },
  {
    id: 3,
    title: "뮤지컬 위키드",
    subtitle: "브로드웨이 최고의 뮤지컬",
    description: "마법사 오즈의 숨겨진 이야기",
    image: "/images/poster3.png",
    backgroundImage: "/images/poster3.png",
    category: "뮤지컬",
  },
  {
    id: 4,
    title: "연극 햄릿",
    subtitle: "셰익스피어의 불멸의 명작",
    description: "복수와 광기, 그리고 인간의 본성을 그린 걸작",
    image: "/images/poster4.png",
    backgroundImage: "/images/poster4.png",
    category: "연극",
  },
  {
    id: 5,
    title: "클래식 갈라 콘서트",
    subtitle: "세계적 거장들의 만남",
    description: "베토벤부터 차이콥스키까지, 클래식의 정수",
    image: "/images/poster5.png",
    backgroundImage: "/images/poster5.png",
    category: "클래식",
  },
  {
    id: 6,
    title: "아이유 콘서트",
    subtitle: "The Golden Hour",
    description: "따뜻한 감성과 아름다운 목소리의 만남",
    image: "/images/poster6.png",
    backgroundImage: "/images/poster6.png",
    category: "콘서트",
  },
  {
    id: 7,
    title: "전시 모네 특별전",
    subtitle: "인상주의의 거장을 만나다",
    description: "빛과 색채의 마법사 모네의 작품 세계",
    image: "/images/poster7.png",
    backgroundImage: "/images/poster7.png",
    category: "전시",
  },
  {
    id: 8,
    title: "뮤지컬 맘마미아",
    subtitle: "ABBA의 히트곡으로 만나는 감동",
    description: "사랑과 가족, 그리고 꿈에 대한 이야기",
    image: "/images/poster8.png",
    backgroundImage: "/images/poster8.png",
    category: "뮤지컬",
  },
  {
    id: 9,
    title: "프로야구 KBO리그",
    subtitle: "2024 시즌 정규리그",
    description: "뜨거운 야구 열기를 직접 느껴보세요",
    image: "/images/poster9.png",
    backgroundImage: "/images/poster9.png",
    category: "스포츠",
  },
  {
    id: 10,
    title: "아동뮤지컬 뽀로로",
    subtitle: "뽀로로와 친구들의 모험",
    description: "온 가족이 함께 즐기는 즐거운 시간",
    image: "/images/poster10.png",
    backgroundImage: "/images/poster10.png",
    category: "아동/가족",
  },
  {
    id: 11,
    title: "레저 워터파크",
    subtitle: "시원한 물놀이의 천국",
    description: "여름을 시원하게 만들어줄 특별한 경험",
    image: "/images/poster11.png",
    backgroundImage: "/images/poster11.png",
    category: "레저",
  },
  {
    id: 12,
    title: "투어 제주도 패키지",
    subtitle: "아름다운 제주를 만끽하세요",
    description: "자연과 문화가 어우러진 힐링 여행",
    image: "/images/poster12.png",
    backgroundImage: "/images/poster12.png",
    category: "투어",
  },
  {
    id: 13,
    title: "MD상품 굿즈",
    subtitle: "좋아하는 공연의 특별한 기념품",
    description: "소중한 추억을 간직할 수 있는 아이템",
    image: "/images/poster13.png",
    backgroundImage: "/images/poster13.png",
    category: "MD상품",
  },
  {
    id: 14,
    title: "할인 특가 이벤트",
    subtitle: "더 저렴하게 즐기는 문화생활",
    description: "놓치면 후회할 특별한 할인 혜택",
    image: "/images/poster14.png",
    backgroundImage: "/images/poster14.png",
    category: "할인",
  },
]

export default function HomePage() {
  const [currentBanner, setCurrentBanner] = useState<BannerData>(bannerData[0])
  const [isTransitioning, setIsTransitioning] = useState(false)

  // 실제 프로젝트에서는 이런 식으로 서버에서 데이터를 가져올 수 있습니다
  useEffect(() => {
    // const fetchBannerData = async () => {
    //   try {
    //     const response = await fetch('/api/banners')
    //     const data = await response.json()
    //     setBannerData(data)
    //     setCurrentBanner(data[0])
    //   } catch (error) {
    //     console.error('Failed to fetch banner data:', error)
    //   }
    // }
    // fetchBannerData()
  }, [])

  const handleBannerHover = (banner: BannerData) => {
    if (banner.id !== currentBanner.id) {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentBanner(banner)
        setIsTransitioning(false)
      }, 150)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Main Banner */}
      <section className="relative h-[500px] bg-black overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <div
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-300 ${
              isTransitioning ? "opacity-0" : "opacity-30"
            }`}
            style={{
              backgroundImage: `url(${currentBanner.backgroundImage})`,
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
                  src={banner.image || "/placeholder.svg"}
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
          {/* 육상재 밴드 */}
          <Link href="/goods/15">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">THE BLUE JOURNEY</div>
                  <h3 className="text-xl font-bold mb-2">육상재 밴드</h3>
                  <p className="text-sm opacity-90">6.4(수) 20:00 일반예매 티켓오픈</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Image
                    src="/images/poster1.png"
                    alt="육상재 밴드"
                    width={60}
                    height={80}
                    className="rounded shadow-lg"
                  />
                </div>
              </div>
            </Card>
          </Link>

          {/* 뮤지컬 구텐베르크 */}
          <Link href="/goods/16">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-orange-500">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">두 남자가 쓴 가장 위대한 뮤지컬</div>
                  <h3 className="text-xl font-bold mb-2">뮤지컬 구텐베르크</h3>
                  <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
                </div>
                <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                  GUTENBERG
                </div>
              </div>
            </Card>
          </Link>

          {/* 킬링시저 */}
          <Link href="/goods/17">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-red-600 to-red-800">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">나는, 사자의, 죽일 것이다.</div>
                  <h3 className="text-xl font-bold mb-2">연극 킬링시저</h3>
                  <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <Image
                    src="/images/poster3.png"
                    alt="킬링시저"
                    width={60}
                    height={80}
                    className="rounded shadow-lg"
                  />
                </div>
              </div>
            </Card>
          </Link>

          {/* 제19회 DIMF */}
          <Link href="/goods/18">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-pink-300 to-pink-500">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">세계인의 뮤지컬축제</div>
                  <h3 className="text-xl font-bold mb-2">제19회 DIMF</h3>
                  <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="flex space-x-1">
                    <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      D
                    </div>
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      I
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      M
                    </div>
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      F
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* 청년문화예술패스 */}
          <Link href="/goods/19">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">응원까지 시작 가능!</div>
                  <h3 className="text-xl font-bold mb-2">청년문화예술패스</h3>
                  <p className="text-sm opacity-90">지금 공연 · 전시 예약하세요</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                    <span className="text-2xl">⭐</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>

          {/* 손민수 & 임윤찬 */}
          <Link href="/goods/20">
            <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black">
                <div className="absolute inset-0 p-6 text-white">
                  <div className="text-sm opacity-90 mb-2">인디카토 음악프로젝트 30</div>
                  <h3 className="text-xl font-bold mb-2">손민수 & 임윤찬</h3>
                  <p className="text-sm opacity-90">6.4(수) 14:00 신예매 티켓오픈</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <div className="text-white text-4xl opacity-50">🎹</div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Additional Content Sections */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">인기 공연</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bannerData.slice(0, 6).map((banner) => (
              <Link key={banner.id} href={`/goods/${banner.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900">{banner.title}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">오픈 예정</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {bannerData.slice(6, 12).map((banner) => (
              <Link key={banner.id} href={`/goods/${banner.id}`}>
                <div className="group cursor-pointer">
                  <div className="aspect-[3/4] overflow-hidden rounded-lg relative">
                    <Image
                      src={banner.image || "/placeholder.svg"}
                      alt={banner.title}
                      width={200}
                      height={267}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                      OPEN
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 group-hover:text-gray-900">{banner.title}</p>
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
