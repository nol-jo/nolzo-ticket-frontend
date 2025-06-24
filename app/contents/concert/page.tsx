"use client"

import Image from "next/image"
import Link from "next/link"

import Header from "@/components/header"
import Footer from "@/components/footer"
import {useEffect, useState} from "react";

interface Event {
  id: number
  title: string
  venue: string
  startDate: string
  endDate: string
  posterImageUrl: string
  category: string
}

export default function ConcertGenrePage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('http://localhost:8080/api/v1/event?category=CONCERT')

        console.log(response)
        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.')
        }

        const data: Event[] = await response.json()
        setEvents(data)

      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              다시 시도
            </button>
          </div>
        </section>
        <Footer />
      </div>
    )
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

      {/* Main Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">총 {events.length}개의 공연</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <Link key={event.id} href={`/performance/${event.id}`}>
              <div className="group cursor-pointer">
                {/* 포스터 이미지 영역 */}
                <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 aspect-[3/4] bg-gray-200">
                  <Image
                    src={event.posterImageUrl || "/placeholder.svg"}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* 공연 정보 영역 */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-sm text-gray-600">{event.venue}</p>
                  <p className="text-sm font-medium text-gray-800">{event.startDate} - {event.endDate}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  )
}
