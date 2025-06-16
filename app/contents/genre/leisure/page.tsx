import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function LeisureGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "롯데워터파크",
      subtitle: "시원한 물놀이의 천국",
      date: "2024.06.01 - 2024.08.31",
      image: "/images/poster5.png",
      bgColor: "from-blue-400 to-cyan-500",
    },
    {
      id: 2,
      title: "제주투어패스",
      subtitle: "제주도 명소 무제한 이용",
      date: "2024.07.01 - 2024.10.31",
      image: "/images/poster6.png",
      bgColor: "from-green-400 to-emerald-500",
    },
    {
      id: 3,
      title: "강원도 캠핑장",
      subtitle: "자연 속에서 힐링 캠핑",
      date: "2024.05.01 - 2024.10.31",
      image: "/images/poster7.png",
      bgColor: "from-orange-400 to-red-500",
    },
    {
      id: 4,
      title: "스키리조트 패키지",
      subtitle: "겨울 스포츠의 즐거움",
      date: "2024.12.01 - 2025.03.31",
      image: "/images/poster8.png",
      bgColor: "from-purple-400 to-pink-500",
    },
  ]

  const categories = [
    "레저/캠핑 전체보기",
    "워터파크",
    "테마파크",
    "캠핑장",
    "스키장",
    "골프장",
    "체험활동",
    "아웃도어",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[정기가격] 남이섬 입장권",
      subtitle: "(-25.07.31)",
      date: "2025.05.27 - 2025.07.31",
      image: "/images/poster9.png",
    },
    {
      id: 2,
      title: "[충남/보령] 제28회 보령머드축제 입장권",
      date: "2025.07.18 - 2025.08.10",
      image: "/images/poster10.png",
    },
    {
      id: 3,
      title: "설악 워터파이어 리틀시즌 입장권 (-7/11)",
      date: "2025.06.28 - 2025.07.11",
      image: "/images/poster11.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-cyan-100 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">레저/캠핑</h1>
            <p className="text-lg text-gray-600">자연과 함께하는 힐링과 모험의 시간</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              전체
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              워터파크
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              테마파크
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              캠핑장
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              스키장
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              골프장
            </Button>
          </div>
        </div>
      </section>

      {/* Main Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainShows.map((show) => (
            <Link key={show.id} href={`/goods/${show.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-80">
                <div className={`relative h-full bg-gradient-to-br ${show.bgColor} text-white`}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div>
                      <h2 className="text-2xl font-bold mb-2">{show.title}</h2>
                      <p className="text-sm opacity-90 mb-4">{show.subtitle}</p>
                    </div>
                    <div>
                      <p className="text-sm opacity-90">{show.date}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Image
                      src={show.image || "/placeholder.svg"}
                      alt={show.title}
                      width={80}
                      height={100}
                      className="rounded shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <Link key={index} href={`/contents/genre/leisure/${category.toLowerCase().replace(/\s+/g, "-")}`}>
              <Button variant="outline" className="rounded-full px-6 py-2 hover:bg-gray-100 transition-colors">
                {category}
                <span className="ml-2">›</span>
              </Button>
            </Link>
          ))}
        </div>
      </section>

      {/* MD Recommendations Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">MD 추천 상품</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {mdRecommendations.map((item) => (
            <Link key={item.id} href={`/goods/${item.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[4/3] overflow-hidden">
                  <Image
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                  {item.subtitle && <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>}
                  <p className="text-sm text-gray-500">{item.date}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
