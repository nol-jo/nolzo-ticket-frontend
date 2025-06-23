"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Search, MapPin, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface SearchResult {
  id: number
  title: string
  subtitle?: string
  category: string
  venue?: string
  period?: string
  price?: string
  image: string
  type: "performance" | "venue"
}

interface SearchResponse {
  query: string
  totalResults: number
  performances: SearchResult[]
  venues: SearchResult[]
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q") || ""

  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState(query)

  // 검색 API 호출 함수 (실제로는 서버 API를 호출)
  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return

    setIsLoading(true)

    try {
      // 실제 API 호출 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 800))

      // 모의 검색 결과 데이터
      const mockResults: SearchResponse = {
        query: searchTerm,
        totalResults: 0,
        performances: [],
        venues: [],
      }

      // 검색어에 따른 결과 생성
      if (searchTerm.includes("라이온킹") || searchTerm.includes("뮤지컬")) {
        mockResults.performances = [
          {
            id: 1,
            title: "뮤지컬 라이온킹",
            subtitle: "디즈니의 감동 대서사시",
            category: "뮤지컬",
            venue: "샬롯데씨어터",
            period: "2024.06.01 ~ 2024.12.31",
            price: "80,000원~",
            image: "/images/poster1.png",
            type: "performance",
          },
        ]
        mockResults.totalResults += mockResults.performances.length
      }

      if (searchTerm.includes("BTS") || searchTerm.includes("콘서트")) {
        mockResults.performances.push({
          id: 2,
          title: "BTS 월드투어",
          subtitle: "Yet To Come in Cinemas",
          category: "콘서트",
          venue: "잠실올림픽주경기장",
          period: "2024.08.15 ~ 2024.08.17",
          price: "120,000원~",
          image: "/images/poster2.png",
          type: "performance",
        })
        mockResults.totalResults += 1
      }

      setSearchResults(mockResults)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.history.pushState({}, "", `/search?q=${encodeURIComponent(searchQuery)}`)
      performSearch(searchQuery)
    }
  }

  const hasResults = searchResults && searchResults.totalResults > 0

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
                {searchResults.performances.length > 0 && (
                  <section>
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">
                      공연 ({searchResults.performances.length})
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {searchResults.performances.map((performance) => (
                        <Link key={performance.id} href={`/goods/${performance.id}`}>
                          <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                            <div className="aspect-[3/4] overflow-hidden">
                              <Image
                                src={performance.image || "/placeholder.svg"}
                                alt={performance.title}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            </div>
                            <div className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  {performance.category}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-gray-800 mb-1">{performance.title}</h3>
                              {performance.subtitle && (
                                <p className="text-sm text-gray-600 mb-2">{performance.subtitle}</p>
                              )}
                              <div className="space-y-1 text-sm text-gray-600">
                                {performance.venue && (
                                  <div className="flex items-center gap-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{performance.venue}</span>
                                  </div>
                                )}
                                {performance.period && (
                                  <div className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    <span>{performance.period}</span>
                                  </div>
                                )}
                              </div>
                              {performance.price && (
                                <p className="text-lg font-bold text-blue-600 mt-2">{performance.price}</p>
                              )}
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
                    "{searchResults.query}"에 대한 판매중/예약 공연이 없습니다.
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
