"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ExhibitionGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "모네 특별전",
      subtitle: "인상주의의 거장을 만나다",
      date: "2024.06.01 - 2024.09.30",
      image: "/images/poster8.png",
      bgColor: "from-blue-400 to-purple-500",
      tag: "미술전시",
    },
    {
      id: 2,
      title: "디지털 아트 페스티벌",
      subtitle: "미래를 그리는 예술",
      date: "2024.07.15 - 2024.08.31",
      image: "/images/poster9.png",
      bgColor: "from-pink-400 to-red-500",
      tag: "체험전시",
    },
    {
      id: 3,
      title: "한국 현대미술전",
      subtitle: "우리 시대의 예술가들",
      date: "2024.08.01 - 2024.11.30",
      image: "/images/poster10.png",
      bgColor: "from-green-400 to-teal-500",
      tag: "미술전시",
    },
    {
      id: 4,
      title: "체험형 과학전시",
      subtitle: "과학과 놀자!",
      date: "2024.06.15 - 2024.12.31",
      image: "/images/poster11.png",
      bgColor: "from-yellow-400 to-orange-500",
      tag: "과학전시",
    },
    {
      id: 5,
      title: "서울국제도서전",
      subtitle: "책과 함께하는 특별한 시간",
      date: "2024.09.01 - 2024.09.15",
      image: "/images/poster12.png",
      bgColor: "from-indigo-400 to-purple-500",
      tag: "박람회",
    },
    {
      id: 6,
      title: "서울뮤직페스티벌",
      subtitle: "음악으로 하나되는 축제",
      date: "2024.10.01 - 2024.10.03",
      image: "/images/poster13.png",
      bgColor: "from-rose-400 to-pink-500",
      tag: "페스티벌",
    },
  ]

  const filters = ["전체", "미술전시", "과학전시", "체험전시", "박람회", "페스티벌", "컨벤션"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = [
    "전시/행사 전체보기",
    "미술전시",
    "과학전시",
    "체험전시",
    "박람회",
    "페스티벌",
    "컨벤션",
    "기타행사",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[얼리버드] 모네 특별전 할인권",
      subtitle: "(-30%)",
      date: "2024.06.01 - 2024.09.30",
      image: "/images/poster12.png",
    },
    {
      id: 2,
      title: "[패밀리] 과학관 연간이용권",
      date: "2024.01.01 - 2024.12.31",
      image: "/images/poster13.png",
    },
    {
      id: 3,
      title: "아트페어 VIP 패스",
      date: "2024.09.20 - 2024.09.22",
      image: "/images/poster14.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-100 to-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">전시/행사</h1>
            <p className="text-lg text-gray-600">예술과 문화가 만나는 특별한 공간</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            {filters.map((filter) => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </Button>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredShows.map((show) => (
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
            <Link key={index} href={`/contents/genre/exhibition/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
