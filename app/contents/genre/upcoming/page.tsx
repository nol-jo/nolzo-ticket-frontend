"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function UpcomingGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const mainShows = [
    {
      id: 1,
      title: "뮤지컬 위키드",
      subtitle: "2025년 대한민국 초연",
      date: "2025.03.01 오픈 예정",
      image: "/images/poster8.png",
      bgColor: "from-green-500 to-emerald-600",
      status: "오픈예정",
      tag: "뮤지컬",
    },
    {
      id: 2,
      title: "BTS 월드투어",
      subtitle: "서울 앵콜 콘서트",
      date: "2025.02.15 티켓오픈",
      image: "/images/poster9.png",
      bgColor: "from-purple-500 to-pink-600",
      status: "사전예약",
      tag: "콘서트",
    },
    {
      id: 3,
      title: "연극 킹 리어",
      subtitle: "셰익스피어 4대 비극",
      date: "2025.01.20 예매시작",
      image: "/images/poster10.png",
      bgColor: "from-gray-600 to-gray-800",
      status: "알림신청",
      tag: "연극",
    },
    {
      id: 4,
      title: "클래식 갈라 콘서트",
      subtitle: "세계적 거장들의 만남",
      date: "2025.04.01 공개 예정",
      image: "/images/poster11.png",
      bgColor: "from-blue-500 to-indigo-600",
      status: "공개예정",
      tag: "클래식",
    },
    {
      id: 5,
      title: "모네 특별전",
      subtitle: "인상주의 거장전",
      date: "2025.03.15 오픈 예정",
      image: "/images/poster12.png",
      bgColor: "from-teal-500 to-cyan-600",
      status: "오픈예정",
      tag: "전시",
    },
    {
      id: 6,
      title: "뽀로로 신작 뮤지컬",
      subtitle: "아이들이 기다린 새로운 이야기",
      date: "2025.05.01 오픈 예정",
      image: "/images/poster13.png",
      bgColor: "from-pink-500 to-rose-600",
      status: "오픈예정",
      tag: "아동/가족",
    },
  ]

  const filters = ["전체", "뮤지컬", "콘서트", "연극", "클래식", "전시", "아동/가족"]

  const filteredShows = selectedFilter === "전체" ? mainShows : mainShows.filter((show) => show.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  const categories = ["오픈예정 전체보기", "뮤지컬", "콘서트", "연극", "클래식", "전시", "스포츠", "레저"]

  const mdRecommendations = [
    {
      id: 1,
      title: "[사전예약] 뮤지컬 위키드 얼리버드",
      subtitle: "30% 할인 혜택",
      date: "2024.12.01 사전예약 시작",
      image: "/images/poster12.png",
    },
    {
      id: 2,
      title: "[알림신청] BTS 콘서트 우선예매",
      date: "팬클럽 회원 우선",
      image: "/images/poster13.png",
    },
    {
      id: 3,
      title: "[예약접수] 2025 시즌 패스",
      date: "연간 이용권 사전 판매",
      image: "/images/poster14.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-orange-100 to-yellow-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">오픈예정</h1>
            <p className="text-lg text-gray-600">곧 만나볼 수 있는 기대되는 공연들</p>
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
                variant="outline"
                size="sm"
                className={`whitespace-nowrap ${selectedFilter === filter ? "bg-gray-200" : ""}`}
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
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-orange-400 text-orange-900 font-bold">{show.status}</Badge>
                  </div>
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
            <Link key={index} href={`/contents/genre/upcoming/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
                <div className="aspect-[4/3] overflow-hidden relative">
                  <Badge className="absolute top-2 left-2 bg-orange-500 text-white z-10">예약</Badge>
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
                  {item.subtitle && <p className="text-sm text-orange-600 mb-1">{item.subtitle}</p>}
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
