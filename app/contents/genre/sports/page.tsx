import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function SportsGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "프로야구",
      subtitle: "2024 KBO 리그",
      date: "2024.03.23 - 2024.10.31",
      image: "/images/poster1.png",
      bgColor: "from-green-500 to-blue-600",
    },
    {
      id: 2,
      title: "프로축구",
      subtitle: "K리그1 2024시즌",
      date: "2024.02.24 - 2024.12.01",
      image: "/images/poster2.png",
      bgColor: "from-red-500 to-orange-500",
    },
    {
      id: 3,
      title: "프로농구",
      subtitle: "KBL 2024-25시즌",
      date: "2024.10.05 - 2025.04.30",
      image: "/images/poster3.png",
      bgColor: "from-orange-500 to-yellow-500",
    },
    {
      id: 4,
      title: "프로배구",
      subtitle: "V-리그 2024-25시즌",
      date: "2024.10.12 - 2025.04.06",
      image: "/images/poster4.png",
      bgColor: "from-purple-500 to-pink-500",
    },
  ]

  const categories = ["스포츠 전체보기", "야구", "축구", "농구", "배구", "골프", "테니스", "기타스포츠"]

  const mdRecommendations = [
    {
      id: 1,
      title: "[시즌권] 2024 KBO 리그 시즌패스",
      subtitle: "(-10.31)",
      date: "2024.03.23 - 2024.10.31",
      image: "/images/poster5.png",
    },
    {
      id: 2,
      title: "[프리미엄] K리그 VIP석 패키지",
      date: "2024.02.24 - 2024.12.01",
      image: "/images/poster6.png",
    },
    {
      id: 3,
      title: "KBL 올스타전 특별관람권",
      date: "2025.01.15 - 2025.01.16",
      image: "/images/poster7.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-green-100 to-blue-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">스포츠</h1>
            <p className="text-lg text-gray-600">열정과 감동이 넘치는 스포츠 현장</p>
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
              야구
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              축구
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              농구
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              배구
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              골프
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
            <Link key={index} href={`/contents/genre/sports/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
