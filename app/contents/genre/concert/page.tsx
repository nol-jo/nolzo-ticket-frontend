"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEventsByCategory } from "@/hooks/use-events-by-category"

export default function ConcertGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")
  const { events, loading, error, usingFallback } = useEventsByCategory("concert")

  const filters = ["전체", "인기순", "최신순", "가격낮은순", "가격높은순"]

  const handleFilterClick = (filter: string) => {
    setSelectedFilter(filter)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">콘서트 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* API 상태 알림 */}
      {usingFallback && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-sm">⚠️ {error} 현재 샘플 데이터를 표시하고 있습니다.</p>
          </div>
        </div>
      )}

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
          <h2 className="text-xl font-semibold text-gray-800">총 {events.length}개의 공연</h2>
          <select className="border border-gray-300 rounded px-3 py-1 text-sm">
            <option>인기순</option>
            <option>최신순</option>
            <option>가격낮은순</option>
            <option>가격높은순</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/goods/${event.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden">
                  <Image
                    src={event.poster || "/placeholder.svg"}
                    alt={event.title}
                    width={300}
                    height={400}
                    className="w-full h-full object-cover hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                    콘서트
                  </span>
                  <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">{event.venue}</p>
                  <p className="text-sm text-gray-600 mb-2">
                    {event.startDate} - {event.endDate}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {event.price?.r || event.price?.s || event.price?.a || "가격 문의"}
                  </p>
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
