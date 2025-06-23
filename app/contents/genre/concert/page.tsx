"use client"

import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function ConcertGenrePage() {
  const shows = [
    {
      id: 1,
      title: "BTS 월드투어",
      venue: "잠실올림픽주경기장",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-gray-700 to-gray-900",
      tag: "K-POP",
    },
    {
      id: 2,
      title: "아이유 콘서트",
      venue: "KSPO DOME",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-pink-400 to-rose-500",
      tag: "발라드",
    },
    {
      id: 3,
      title: "임영웅 전국투어",
      venue: "고척스카이돔",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-green-400 to-emerald-500",
      tag: "트로트",
    },
    {
      id: 4,
      title: "데이식스 콘서트",
      venue: "올림픽공원 체조경기장",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-purple-400 to-indigo-500",
      tag: "밴드",
    },
    {
      id: 5,
      title: "태연 단독콘서트",
      venue: "블루스퀘어 마스터카드홀",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-blue-400 to-purple-500",
      tag: "K-POP",
    },
    {
      id: 6,
      title: "윤종신 월간 콘서트",
      venue: "롯데콘서트홀",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-red-400 to-pink-500",
      tag: "발라드",
    },
    {
      id: 7,
      title: "NewJeans 콘서트",
      venue: "잠실실내체육관",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-gray-700 to-gray-900",
      tag: "K-POP",
    },
    {
      id: 8,
      title: "장범준 콘서트",
      venue: "올림픽홀",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-amber-400 to-yellow-500",
      tag: "발라드",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-yellow-100 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">연극</h1>
            <p className="text-lg text-gray-600">인간의 삶과 감정을 그려내는 진정한 예술</p>
          </div>
        </div>
      </section>

      {/* Main Cards Section */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800">총 {shows.length}개의 공연</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {shows.map((show) => (
            <Link key={show.id} href={`/performance/${show.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-80">
                <div className={`relative h-full bg-gradient-to-br ${show.bgColor} text-white`}>
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div>
                      <span className="bg-white text-gray-800 px-2 py-1 rounded text-xs font-medium mb-2 inline-block">
                        {show.tag}
                      </span>
                      <h2 className="text-2xl font-bold mb-2">{show.title}</h2>
                      <p className="text-sm opacity-90 mb-4">{show.venue}</p>
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
      <Footer />
    </div>
  )
}
