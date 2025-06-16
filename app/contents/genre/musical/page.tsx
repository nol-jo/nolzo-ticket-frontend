"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function MusicalGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "라이온킹",
      subtitle: "디즈니의 감동 대서사시",
      date: "2025.06.01 - 2025.12.31",
      image: "/images/poster7.png",
      bgColor: "from-yellow-400 to-orange-500",
      tag: "대형뮤지컬",
    },
    {
      id: 2,
      title: "위키드",
      subtitle: "브로드웨이 최고의 뮤지컬",
      date: "2025.07.15 - 2025.11.30",
      image: "/images/poster8.png",
      bgColor: "from-green-400 to-emerald-500",
      tag: "브로드웨이",
    },
    {
      id: 3,
      title: "맘마미아",
      subtitle: "ABBA의 히트곡으로 만나는 감동",
      date: "2025.08.01 - 2025.10.31",
      image: "/images/poster9.png",
      bgColor: "from-blue-400 to-purple-500",
      tag: "팝뮤지컬",
    },
    {
      id: 4,
      title: "레미제라블",
      subtitle: "불멸의 클래식 뮤지컬",
      date: "2025.09.01 - 2025.12.15",
      image: "/images/poster10.png",
      bgColor: "from-red-400 to-pink-500",
      tag: "클래식뮤지컬",
    },
    {
      id: 5,
      title: "시카고",
      subtitle: "재즈와 댄스의 향연",
      date: "2025.06.15 - 2025.08.30",
      image: "/images/poster11.png",
      bgColor: "from-purple-400 to-indigo-500",
      tag: "브로드웨이",
    },
    {
      id: 6,
      title: "빨간머리 앤",
      subtitle: "한국 창작 뮤지컬의 대표작",
      date: "2025.07.01 - 2025.09.30",
      image: "/images/poster12.png",
      bgColor: "from-pink-400 to-rose-500",
      tag: "창작뮤지컬",
    },
    {
      id: 7,
      title: "지킬앤하이드",
      subtitle: "인간 내면의 이중성을 그린 작품",
      date: "2025.08.15 - 2025.11.15",
      image: "/images/poster13.png",
      bgColor: "from-gray-600 to-gray-800",
      tag: "클래식뮤지컬",
    },
    {
      id: 8,
      title: "명성황후",
      subtitle: "한국사를 담은 창작뮤지컬",
      date: "2025.09.10 - 2025.12.10",
      image: "/images/poster14.png",
      bgColor: "from-amber-400 to-yellow-500",
      tag: "창작뮤지컬",
    },
  ]

  const filters = ["전체", "대형뮤지컬", "브로드웨이", "창작뮤지컬", "클래식뮤지컬", "팝뮤지컬", "소극장뮤지컬"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = [
    "뮤지컬 전체보기",
    "대형뮤지컬",
    "브로드웨이",
    "창작뮤지컬",
    "클래식뮤지컬",
    "팝뮤지컬",
    "소극장뮤지컬",
    "라이선스",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[얼리버드] 뮤지컬 시카고",
      subtitle: "(-25.07.31)",
      date: "2025.05.27 - 2025.07.31",
      image: "/images/poster11.png",
    },
    {
      id: 2,
      title: "[프리미엄] 뮤지컬 캣츠 VIP석",
      date: "2025.07.18 - 2025.08.10",
      image: "/images/poster12.png",
    },
    {
      id: 3,
      title: "뮤지컬 팬텀 오브 오페라 (-7/11)",
      date: "2025.06.28 - 2025.07.11",
      image: "/images/poster13.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-yellow-100 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">뮤지컬</h1>
            <p className="text-lg text-gray-600">감동과 환상이 어우러진 무대 위의 마법</p>
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
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">총 {filteredShows.length}개의 공연</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredShows.map((show) => (
            <Link key={show.id} href={`/performance/${show.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-80">
                <div className={`relative h-full bg-gradient-to-br ${show.bgColor} text-white`}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div>
                      <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                        {show.tag}
                      </span>
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
            <Link key={index} href={`/contents/genre/musical/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
