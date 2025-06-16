"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ConcertGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")

  const concerts = [
    {
      id: 1,
      title: "BTS 월드투어",
      venue: "잠실올림픽주경기장",
      date: "2024.08.15 - 2024.08.17",
      price: "120,000원~",
      image: "/images/poster13.png",
      tag: "K-POP",
    },
    {
      id: 2,
      title: "아이유 콘서트",
      venue: "KSPO DOME",
      date: "2024.09.01 - 2024.09.03",
      price: "99,000원~",
      image: "/images/poster14.png",
      tag: "발라드",
    },
    {
      id: 3,
      title: "임영웅 전국투어",
      venue: "고척스카이돔",
      date: "2024.10.05 - 2024.10.07",
      price: "110,000원~",
      image: "/images/poster1.png",
      tag: "트로트",
    },
    {
      id: 4,
      title: "데이식스 콘서트",
      venue: "올림픽공원 체조경기장",
      date: "2024.11.10 - 2024.11.12",
      price: "88,000원~",
      image: "/images/poster2.png",
      tag: "밴드",
    },
    {
      id: 5,
      title: "태연 단독콘서트",
      venue: "블루스퀘어 마스터카드홀",
      date: "2024.12.01 - 2024.12.03",
      price: "132,000원~",
      image: "/images/poster3.png",
      tag: "K-POP",
    },
    {
      id: 6,
      title: "윤종신 월간 콘서트",
      venue: "롯데콘서트홀",
      date: "2024.07.20 - 2024.07.21",
      price: "77,000원~",
      image: "/images/poster4.png",
      tag: "발라드",
    },
    {
      id: 7,
      title: "NewJeans 콘서트",
      venue: "잠실실내체육관",
      date: "2024.08.25 - 2024.08.27",
      price: "95,000원~",
      image: "/images/poster5.png",
      tag: "K-POP",
    },
    {
      id: 8,
      title: "장범준 콘서트",
      venue: "올림픽홀",
      date: "2024.09.15 - 2024.09.16",
      price: "85,000원~",
      image: "/images/poster6.png",
      tag: "발라드",
    },
    {
      id: 9,
      title: "혁오 단독공연",
      venue: "예스24 라이브홀",
      date: "2024.10.20 - 2024.10.21",
      price: "75,000원~",
      image: "/images/poster7.png",
      tag: "밴드",
    },
    {
      id: 10,
      title: "송가인 콘서트",
      venue: "세종문화회관",
      date: "2024.11.05 - 2024.11.06",
      price: "90,000원~",
      image: "/images/poster8.png",
      tag: "트로트",
    },
  ]

  const filters = ["전체", "K-POP", "발라드", "트로트", "밴드", "힙합"]

  const filteredConcerts =
    selectedFilter === "전체" ? concerts : concerts.filter((concert) => concert.tag === selectedFilter)

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">콘서트</h1>
            <p className="text-lg text-gray-600">최고의 아티스트들과 함께하는 특별한 무대</p>
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

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">총 {filteredConcerts.length}개의 공연</h2>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>인기순</option>
            <option>최신순</option>
            <option>가격낮은순</option>
            <option>가격높은순</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConcerts.map((concert) => (
            <Link key={concert.id} href={`/performance/${concert.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={concert.image || "/placeholder.svg"}
                    alt={concert.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      {concert.tag}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1">{concert.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{concert.venue}</p>
                  <p className="text-sm text-gray-600 mb-2">{concert.date}</p>
                  <p className="text-lg font-bold text-blue-600">{concert.price}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            더 많은 공연 보기
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
