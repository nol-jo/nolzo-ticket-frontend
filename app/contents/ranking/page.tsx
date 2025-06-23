"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function RankingPage() {
  const searchParams = useSearchParams()
  const genre = searchParams.get("genre") || "MUSICAL"

  const [selectedGenre, setSelectedGenre] = useState(genre)
  const [currentDate] = useState(new Date())

  // 뮤지컬 랭킹 데이터
  const musicalRankings = [
    {
      rank: 1,
      id: 1,
      title: "뮤지컬 팬텀",
      subtitle: "10주년 기념 공연",
      venue: "세종문화회관 대극장",
      period: "2025.5.31 ~ 8.11",
      image: "/images/poster1.png",
      bookingRate: 98.4,
      category: "뮤지컬",
      type: "license",
      rankChange: "same",
    },
    {
      rank: 2,
      id: 2,
      title: "뮤지컬 팬텀",
      subtitle: "10주년 기념 공연",
      venue: "세종문화회관 대극장",
      period: "2025.5.31 ~ 8.11",
      image: "/images/poster2.png",
      bookingRate: 96.9,
      category: "뮤지컬",
      type: "license",
      rankChange: "up",
      previousRank: 3,
    },
    {
      rank: 3,
      id: 3,
      title: "뮤지컬 위키드",
      subtitle: "내한 공연(WICKED The Musical)",
      venue: "블루스퀘어 신한카드홀",
      period: "2025.7.12 ~ 10.26",
      image: "/images/poster3.png",
      bookingRate: 94.9,
      category: "뮤지컬",
      type: "visit",
      rankChange: "down",
      previousRank: 1,
    },
    {
      rank: 4,
      id: 4,
      title: "뮤지컬 라이온킹",
      subtitle: "디즈니 대표작",
      venue: "샬롯데씨어터",
      period: "2025.6.1 ~ 12.31",
      image: "/images/poster4.png",
      bookingRate: 92.1,
      category: "뮤지컬",
      type: "license",
      rankChange: "up",
      previousRank: 6,
    },
    {
      rank: 5,
      id: 5,
      title: "뮤지컬 맘마미아",
      subtitle: "ABBA 히트곡 뮤지컬",
      venue: "충무아트센터",
      period: "2025.8.1 ~ 10.31",
      image: "/images/poster5.png",
      bookingRate: 89.7,
      category: "뮤지컬",
      type: "license",
      rankChange: "new",
    },
    {
      rank: 6,
      id: 6,
      title: "뮤지컬 시카고",
      subtitle: "브로드웨이 명작",
      venue: "디큐브 링크 아트센터",
      period: "2025.9.15 ~ 11.30",
      image: "/images/poster6.png",
      bookingRate: 87.3,
      category: "뮤지컬",
      type: "license",
      rankChange: "down",
      previousRank: 4,
    },
    {
      rank: 7,
      id: 7,
      title: "뮤지컬 빨간머리 앤",
      subtitle: "한국 창작 뮤지컬",
      venue: "예술의전당 오페라극장",
      period: "2025.7.1 ~ 9.30",
      image: "/images/poster7.png",
      bookingRate: 85.2,
      category: "뮤지컬",
      type: "original",
      rankChange: "same",
    },
    {
      rank: 8,
      id: 8,
      title: "뮤지컬 레미제라블",
      subtitle: "불멸의 클래식",
      venue: "블루스퀘어 인터파크홀",
      period: "2025.10.1 ~ 12.15",
      image: "/images/poster8.png",
      bookingRate: 83.8,
      category: "뮤지컬",
      type: "license",
      rankChange: "up",
      previousRank: 10,
    },
    {
      rank: 9,
      id: 9,
      title: "뮤지컬 명성황후",
      subtitle: "한국사 창작 뮤지컬",
      venue: "세종문화회관 대극장",
      period: "2025.11.1 ~ 12.31",
      image: "/images/poster9.png",
      bookingRate: 81.5,
      category: "뮤지컬",
      type: "original",
      rankChange: "down",
      previousRank: 7,
    },
    {
      rank: 10,
      id: 10,
      title: "뮤지컬 지킬앤하이드",
      subtitle: "인간 내면의 이중성",
      venue: "충무아트센터 대극장",
      period: "2025.8.15 ~ 11.15",
      image: "/images/poster10.png",
      bookingRate: 79.9,
      category: "뮤지컬",
      type: "license",
      rankChange: "new",
    },
  ]

  // 콘서트 랭킹 데이터
  const concertRankings = [
    {
      rank: 1,
      id: 11,
      title: "BTS 월드투어",
      subtitle: "Yet To Come",
      venue: "잠실올림픽주경기장",
      period: "2025.8.15 ~ 8.17",
      image: "/images/poster11.png",
      bookingRate: 99.8,
      category: "콘서트",
      type: "visit",
      rankChange: "same",
    },
    {
      rank: 2,
      id: 12,
      title: "아이유 콘서트",
      subtitle: "The Golden Hour",
      venue: "KSPO DOME",
      period: "2025.9.1 ~ 9.3",
      image: "/images/poster12.png",
      bookingRate: 98.5,
      category: "콘서트",
      type: "original",
      rankChange: "up",
      previousRank: 3,
    },
    {
      rank: 3,
      id: 13,
      title: "임영웅 전국투어",
      subtitle: "IM HERO",
      venue: "고척스카이돔",
      period: "2025.10.5 ~ 10.7",
      image: "/images/poster13.png",
      bookingRate: 97.2,
      category: "콘서트",
      type: "original",
      rankChange: "down",
      previousRank: 1,
    },
  ]

  const genres = [
    {key: "MUSICAL", label: "뮤지컬", data: musicalRankings},
    {key: "CONCERT", label: "콘서트", data: concertRankings},
    {key: "THEATER", label: "연극", data: []},
  ]

  const types = ["전체", "라이선스/내한", "창작"]
  const periods = ["일간", "주간", "월간"]

  const getCurrentData = () => {
    const currentGenreData = genres.find((g) => g.key === selectedGenre)?.data || []
    return currentGenreData
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  const currentData = getCurrentData()
  const top3 = currentData.slice(0, 3)
  const rest = currentData.slice(3)

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">장르별 랭킹</h1>
        </div>

        {/* Genre Tabs */}
        <Tabs value={selectedGenre} onValueChange={setSelectedGenre} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-8 bg-gray-100">
            {genres.map((genre) => (
              <TabsTrigger
                key={genre.key}
                value={genre.key}
                className={`${
                  selectedGenre === genre.key
                    ? "bg-gray-800 text-white"
                    : "bg-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {genre.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sub Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4"/>
              <span>{formatDate(currentDate)} 기준</span>
            </div>
          </div>
        </div>

        {currentData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">해당 장르의 랭킹 데이터가 준비 중입니다.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {top3.map((item) => (
                <Link key={item.id} href={`/goods/${item.id}`}>
                  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          item.rank === 1 ? "bg-yellow-500" : item.rank === 2 ? "bg-gray-400" : "bg-amber-600"
                        }`}
                      >
                        {item.rank}
                      </div>
                    </div>

                    {/* Poster Image */}
                    <div className="aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        width={400}
                        height={533}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                      {item.subtitle && <p className="text-sm text-gray-600 mb-2">{item.subtitle}</p>}
                      <p className="text-sm text-gray-600 mb-1">{item.venue}</p>
                      <p className="text-sm text-gray-600 mb-3">{item.period}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Rankings 4-10 */}
            {rest.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">4위 ~ 10위</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((item) => (
                    <Link key={item.id} href={`/goods/${item.id}`}>
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start space-x-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div
                              className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {item.rank}
                            </div>
                          </div>

                          {/* Poster */}
                          <div className="w-16 h-20 flex-shrink-0">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {item.subtitle && <p className="text-xs text-gray-600 mb-1 truncate">{item.subtitle}</p>}
                            <p className="text-xs text-gray-600 mb-1 truncate">{item.venue}</p>
                            <p className="text-xs text-gray-600 mb-2">{item.period}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  )
}
