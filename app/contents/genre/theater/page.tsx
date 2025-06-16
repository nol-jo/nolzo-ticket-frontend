"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TheaterGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "햄릿",
      subtitle: "셰익스피어의 불멸의 명작",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-gray-700 to-gray-900",
      tag: "셰익스피어",
    },
    {
      id: 2,
      title: "죽음의 덫",
      subtitle: "아가사 크리스티의 추리극",
      date: "2024.09.15 - 2024.12.15",
      image: "/images/poster9.png",
      bgColor: "from-red-600 to-black",
      tag: "번역연극",
    },
    {
      id: 3,
      title: "로미오와 줄리엣",
      subtitle: "영원한 사랑 이야기",
      date: "2024.10.01 - 2024.11.30",
      image: "/images/poster10.png",
      bgColor: "from-pink-500 to-purple-600",
      tag: "셰익스피어",
    },
    {
      id: 4,
      title: "맥베스",
      subtitle: "권력과 야망의 비극",
      date: "2024.11.15 - 2025.01.31",
      image: "/images/poster11.png",
      bgColor: "from-purple-700 to-indigo-800",
      tag: "셰익스피어",
    },
    {
      id: 5,
      title: "옥탑방 고양이",
      subtitle: "한국 창작연극의 대표작",
      date: "2024.09.01 - 2024.11.30",
      image: "/images/poster12.png",
      bgColor: "from-blue-500 to-cyan-600",
      tag: "창작연극",
    },
    {
      id: 6,
      title: "웃음의 대학",
      subtitle: "유쾌한 코미디 연극",
      date: "2024.10.15 - 2024.12.31",
      image: "/images/poster13.png",
      bgColor: "from-yellow-500 to-orange-600",
      tag: "코미디",
    },
  ]

  const filters = ["전체", "창작연극", "번역연극", "셰익스피어", "코미디", "드라마", "실험연극"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = [
    "연극 전체보기",
    "창작연극",
    "번역연극",
    "셰익스피어",
    "코미디",
    "드라마",
    "실험연극",
    "소극장연극",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[얼리버드] 대학로 연극 패스",
      subtitle: "(-25%)",
      date: "2024.08.01 - 2024.12.31",
      image: "/images/poster12.png",
    },
    {
      id: 2,
      title: "[커플] 로맨틱 연극 2인권",
      date: "2024.09.01 - 2024.11.30",
      image: "/images/poster13.png",
    },
    {
      id: 3,
      title: "연극 애호가 멤버십",
      date: "2024.01.01 - 2024.12.31",
      image: "/images/poster14.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-gray-100 to-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">연극</h1>
            <p className="text-lg text-gray-600">인간의 삶과 감정을 그려내는 진정한 예술</p>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
            <Link key={index} href={`/contents/genre/theater/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
