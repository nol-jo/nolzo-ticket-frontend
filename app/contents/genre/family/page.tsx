"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function FamilyGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "뽀로로 뮤지컬",
      subtitle: "뽀로로와 친구들과 함께",
      date: "2025.06.24 - 2025.08.15",
      image: "/images/poster1.png",
      bgColor: "from-blue-400 to-cyan-400",
      tag: "아동뮤지컬",
    },
    {
      id: 2,
      title: "코코몽 콘서트",
      subtitle: "떠나요 즐거운 여행을 제주도행!",
      date: "2025.06.01 - 2025.06.15",
      image: "/images/poster2.png",
      bgColor: "from-pink-400 to-purple-400",
      tag: "가족콘서트",
    },
    {
      id: 3,
      title: "타요 버스 뮤지컬",
      subtitle: "타요타요의 모험",
      date: "2025.05.04 - 2025.06.12",
      image: "/images/poster3.png",
      bgColor: "from-green-400 to-blue-400",
      tag: "아동뮤지컬",
    },
    {
      id: 4,
      title: "헬로카봇",
      subtitle: "헬로카봇 시크릿 미션",
      date: "2025.05.28 - 2025.08.31",
      image: "/images/poster4.png",
      bgColor: "from-orange-400 to-red-400",
      tag: "체험형공연",
    },
    {
      id: 5,
      title: "마술사 최현우 매직쇼",
      subtitle: "신비로운 마술의 세계",
      date: "2025.07.01 - 2025.07.31",
      image: "/images/poster5.png",
      bgColor: "from-purple-400 to-indigo-400",
      tag: "마술쇼",
    },
    {
      id: 6,
      title: "인형극 백설공주",
      subtitle: "아이들이 사랑하는 동화",
      date: "2025.08.01 - 2025.08.31",
      image: "/images/poster6.png",
      bgColor: "from-rose-400 to-pink-400",
      tag: "인형극",
    },
  ]

  const filters = ["전체", "아동뮤지컬", "가족콘서트", "체험형공연", "인형극", "마술쇼"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = [
    "아동/가족 전체보기",
    "아동뮤지컬",
    "가족콘서트",
    "체험형공연",
    "인형극",
    "마술쇼",
    "스키/눈썰매",
    "골프",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[정기가격] 남이섬 입장권",
      subtitle: "(-25.07.31)",
      date: "2025.05.27 - 2025.07.31",
      image: "/images/poster5.png",
    },
    {
      id: 2,
      title: "[충남/보령] 제28회 보령머드축제 입장권",
      date: "2025.07.18 - 2025.08.10",
      image: "/images/poster6.png",
    },
    {
      id: 3,
      title: "설악 워터파이어 리틀시즌 입장권 (-7/11)",
      date: "2025.06.28 - 2025.07.11",
      image: "/images/poster7.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-pink-100 to-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">아동/가족</h1>
            <p className="text-lg text-gray-600">온 가족이 함께 즐기는 행복한 시간</p>
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

      {/* Main Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredShows.map((show) => (
            <Link key={show.id} href={`/performance/${show.id}`}>
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
            <Link key={index} href={`/contents/genre/family/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
            <Link key={item.id} href={`/performance/${item.id}`}>
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
