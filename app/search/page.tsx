"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Event {
  id: number
  title: string
  description: string
  venue: string
  startDate: string
  endDate: string
  posterImageUrl: string
  eventCategory: string
}

const categoryMap: Record<string, string> = {
  CONCERT: "콘서트",
  MUSICAL: "뮤지컬",
  PLAY: "연극",
}

const categoryClassMap: Record<string, string> = {
  CONCERT: "bg-blue-100 text-blue-800",
  PLAY: "bg-red-100 text-red-800",
  MUSICAL: "bg-yellow-100 text-yellow-800",
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = useState<Event[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setIsLoading(true)

    try {
      setIsLoading(true)
      const response = await fetch(`/api/v1/event/search?search=${encodeURIComponent(searchTerm)}`)

      console.log(response)
      if (!response.ok) {
        throw new Error('데이터를 가져오는데 실패했습니다.')
      }

      const data: Event[] = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("검색 중 오류 발생:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 페이지 로드 시 검색 실행
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query])

  const hasResults = searchResults && searchResults.length > 0

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? (
          // 로딩 상태
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">검색 중...</p>
          </div>
        ) : searchResults ? (
          <>
            {hasResults ? (
              <div className="space-y-12">
                {/* 공연 결과 */}
                {searchResults.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      공연 ({searchResults.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.map((event) => (
                        <Link key={event.id} href={`/goods/${event.id}`}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden">
                              <Image
                                src={event.posterImageUrl || "/placeholder.svg"}
                                alt={event.title}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className={categoryClassMap[event.eventCategory]}>
                                  {categoryMap[event.eventCategory]}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-gray-800 mb-1">{event.title}</h3>
                              {event.description && (
                                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                              )}
                              <div className="space-y-1 text-sm text-gray-600">
                                {event.venue && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.venue}</span>
                                  </div>
                                )}
                                {event.startDate && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{event.startDate} ~ {event.endDate}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            ) : (
              // 검색 결과 없음
              <div className="text-center py-16">
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    "{query}"에 대한 판매중/예약 공연이 없습니다.
                  </h2>
                  <p className="text-gray-600 mb-6">다른 검색어로 시도해보시거나 아래 버튼을 클릭해주세요.</p>
                  <Link href="/">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">판매중인 공연 보기</Button>
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          // 초기 상태 (검색어 없음)
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">검색어를 입력해주세요</h2>
            <p className="text-gray-600 mb-8">공연명, 아티스트명, 공연장명으로 검색할 수 있습니다.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
