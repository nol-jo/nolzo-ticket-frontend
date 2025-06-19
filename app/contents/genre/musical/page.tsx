"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEventsByCategory } from "@/hooks/use-events-by-category"

export default function MusicalGenrePage() {
  const [selectedFilter, setSelectedFilter] = useState("전체")
  const { events, loading, error, usingFallback } = useEventsByCategory("musical")

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
            <p className="text-gray-600">뮤지컬 정보를 불러오는 중...</p>
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
          <h2 className="text-xl font-semibold text-gray-800">총 {events.length}개의 공연</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {events.map((event, index) => {
            const gradients = [
              "from-yellow-400 to-orange-500",
              "from-green-400 to-emerald-500",
              "from-blue-400 to-purple-500",
              "from-red-400 to-pink-500",
              "from-purple-400 to-indigo-500",
              "from-pink-400 to-rose-500",
              "from-gray-600 to-gray-800",
              "from-amber-400 to-yellow-500",
            ]

            return (
              <Link key={event.id} href={`/goods/${event.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-80">
                  <div
                    className={`relative h-full bg-gradient-to-br ${gradients[index % gradients.length]} text-white`}
                  >
                    <div className="absolute inset-0 p-6 flex flex-col justify-between">
                      <div>
                        <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                          뮤지컬
                        </span>
                        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
                        <p className="text-sm opacity-90 mb-4">{event.subtitle || event.description}</p>
                      </div>
                      <div>
                        <p className="text-sm opacity-90">
                          {event.startDate} - {event.endDate}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4">
                      <Image
                        src={event.poster || "/placeholder.svg"}
                        alt={event.title}
                        width={80}
                        height={100}
                        className="rounded shadow-lg"
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <Footer />
    </div>
  )
}
