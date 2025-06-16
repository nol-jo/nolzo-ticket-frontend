import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TourGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "제주도 패키지",
      subtitle: "아름다운 제주를 만끽하세요",
      date: "2024.06.01 - 2024.12.31",
      image: "/images/poster1.png",
      bgColor: "from-blue-400 to-cyan-500",
    },
    {
      id: 2,
      title: "부산 여행",
      subtitle: "바다와 함께하는 힐링 여행",
      date: "2024.07.01 - 2024.11.30",
      image: "/images/poster2.png",
      bgColor: "from-teal-400 to-blue-500",
    },
    {
      id: 3,
      title: "경주 역사 탐방",
      subtitle: "천년 고도의 문화유산",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster3.png",
      bgColor: "from-amber-400 to-orange-500",
    },
    {
      id: 4,
      title: "강원도 자연 여행",
      subtitle: "청정 자연 속 힐링",
      date: "2024.09.01 - 2024.12.15",
      image: "/images/poster4.png",
      bgColor: "from-green-400 to-emerald-500",
    },
  ]

  const categories = [
    "투어 전체보기",
    "국내여행",
    "해외여행",
    "당일치기",
    "1박2일",
    "패키지여행",
    "자유여행",
    "테마여행",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[얼리버드] 제주도 3박4일 패키지",
      subtitle: "(-30%)",
      date: "2024.06.01 - 2024.12.31",
      image: "/images/poster5.png",
    },
    {
      id: 2,
      title: "[가족여행] 부산 2박3일 특가",
      date: "2024.07.01 - 2024.11.30",
      image: "/images/poster6.png",
    },
    {
      id: 3,
      title: "강원도 펜션 할인권",
      date: "2024.08.01 - 2024.12.31",
      image: "/images/poster7.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-emerald-100 to-teal-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">투어</h1>
            <p className="text-lg text-gray-600">새로운 곳에서 만나는 특별한 추억</p>
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
              국내여행
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              해외여행
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              당일치기
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              1박2일
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              패키지여행
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
            <Link key={index} href={`/contents/genre/tour/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
