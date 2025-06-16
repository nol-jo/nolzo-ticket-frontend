import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function RegionalGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "서울 공연",
      subtitle: "수도권 지역 공연 모음",
      date: "상시 업데이트",
      image: "/images/poster1.png",
      bgColor: "from-blue-500 to-purple-600",
    },
    {
      id: 2,
      title: "부산 공연",
      subtitle: "부산/경남 지역 공연",
      date: "지역 특색 공연",
      image: "/images/poster2.png",
      bgColor: "from-teal-500 to-cyan-600",
    },
    {
      id: 3,
      title: "대구 공연",
      subtitle: "대구/경북 지역 공연",
      date: "문화의 도시",
      image: "/images/poster3.png",
      bgColor: "from-red-500 to-pink-600",
    },
    {
      id: 4,
      title: "제주 공연",
      subtitle: "제주도 특별 공연",
      date: "관광과 함께",
      image: "/images/poster4.png",
      bgColor: "from-green-500 to-emerald-600",
    },
  ]

  const categories = ["지역별 전체보기", "서울", "부산", "대구", "인천", "광주", "대전", "제주"]

  const mdRecommendations = [
    {
      id: 1,
      title: "[서울] 대학로 연극 패스",
      subtitle: "소극장 연극 무제한",
      date: "2024.06.01 - 2024.12.31",
      image: "/images/poster5.png",
    },
    {
      id: 2,
      title: "[부산] 해운대 페스티벌 패키지",
      date: "2024.07.01 - 2024.08.31",
      image: "/images/poster6.png",
    },
    {
      id: 3,
      title: "[제주] 관광+공연 패키지",
      date: "2024.06.01 - 2024.10.31",
      image: "/images/poster7.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-teal-100 to-cyan-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">지역별</h1>
            <p className="text-lg text-gray-600">전국 각지에서 펼쳐지는 다양한 공연</p>
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
              서울
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              부산
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              대구
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              인천
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              제주
            </Button>
          </div>
        </div>
      </section>

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

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category, index) => (
            <Link key={index} href={`/contents/genre/regional/${category.toLowerCase().replace(/\s+/g, "-")}`}>
              <Button variant="outline" className="rounded-full px-6 py-2 hover:bg-gray-100 transition-colors">
                {category}
                <span className="ml-2">›</span>
              </Button>
            </Link>
          ))}
        </div>
      </section>

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
