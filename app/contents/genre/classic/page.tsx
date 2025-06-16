"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ClassicGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "베토벤 교향곡 전곡 연주회",
      subtitle: "서울시향과 함께하는 특별한 밤",
      date: "2024.09.15 - 2024.09.17",
      image: "/images/poster1.png",
      bgColor: "from-indigo-500 to-purple-600",
      tag: "클래식",
    },
    {
      id: 2,
      title: "백조의 호수",
      subtitle: "러시아 국립발레단 내한공연",
      date: "2024.10.20 - 2024.10.25",
      image: "/images/poster2.png",
      bgColor: "from-pink-400 to-rose-500",
      tag: "발레",
    },
    {
      id: 3,
      title: "쇼팽 피아노 리사이틀",
      subtitle: "세계적 피아니스트 조성진",
      date: "2024.11.08 - 2024.11.09",
      image: "/images/poster3.png",
      bgColor: "from-amber-400 to-orange-500",
      tag: "클래식",
    },
    {
      id: 4,
      title: "오페라 라 트라비아타",
      subtitle: "베르디의 불멸의 명작",
      date: "2024.12.01 - 2024.12.10",
      image: "/images/poster4.png",
      bgColor: "from-red-500 to-pink-600",
      tag: "오페라",
    },
    {
      id: 5,
      title: "한국무용 춘향전",
      subtitle: "전통과 현대의 만남",
      date: "2024.11.15 - 2024.11.20",
      image: "/images/poster5.png",
      bgColor: "from-emerald-500 to-teal-600",
      tag: "무용",
    },
    {
      id: 6,
      title: "국악 관현악 연주회",
      subtitle: "우리 음악의 아름다움",
      date: "2024.12.15 - 2024.12.16",
      image: "/images/poster6.png",
      bgColor: "from-yellow-500 to-amber-600",
      tag: "국악",
    },
  ]

  const filters = ["전체", "클래식", "오페라", "발레", "무용", "국악", "실내악"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = ["클래식/무용 전체보기", "클래식", "오페라", "발레", "무용", "국악", "실내악", "오케스트라"]

  const mdRecommendations = [
    {
      id: 1,
      title: "[시즌권] 서울시향 2024-25 시즌패스",
      subtitle: "(-20%)",
      date: "2024.09.01 - 2025.06.30",
      image: "/images/poster5.png",
    },
    {
      id: 2,
      title: "[프리미엄] 국립오페라단 VIP석",
      date: "2024.10.01 - 2024.12.31",
      image: "/images/poster6.png",
    },
    {
      id: 3,
      title: "청소년 클래식 할인권",
      date: "2024.01.01 - 2024.12.31",
      image: "/images/poster7.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-indigo-100 to-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">클래식/무용</h1>
            <p className="text-lg text-gray-600">우아함과 품격이 살아있는 고전의 세계</p>
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
            <Link key={index} href={`/contents/genre/classic/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
