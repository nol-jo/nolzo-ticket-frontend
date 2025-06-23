"use client"

import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function TheaterGenrePage() {
  const shows = [
    {
      id: 1,
      title: "햄릿",
      subtitle: "셰익스피어의 불멸의 명작",
      date: "2024.08.01 - 2024.10.31",
      image: "/images/poster8.png",
      bgColor: "from-gray-700 to-gray-900",
      tag: "셰익스피어",
    },
    {
      id: 2,
      title: "죽음의 덫",
      subtitle: "아가사 크리스티의 추리극",
      date: "2024.09.15 - 2024.12.15",
      image: "/images/poster9.png",
      bgColor: "from-red-600 to-black",
      tag: "번역연극",
    },
    {
      id: 3,
      title: "로미오와 줄리엣",
      subtitle: "영원한 사랑 이야기",
      date: "2024.10.01 - 2024.11.30",
      image: "/images/poster10.png",
      bgColor: "from-pink-500 to-purple-600",
      tag: "셰익스피어",
    },
    {
      id: 4,
      title: "맥베스",
      subtitle: "권력과 야망의 비극",
      date: "2024.11.15 - 2025.01.31",
      image: "/images/poster11.png",
      bgColor: "from-purple-700 to-indigo-800",
      tag: "셰익스피어",
    },
    {
      id: 5,
      title: "옥탑방 고양이",
      subtitle: "한국 창작연극의 대표작",
      date: "2024.09.01 - 2024.11.30",
      image: "/images/poster12.png",
      bgColor: "from-blue-500 to-cyan-600",
      tag: "창작연극",
    },
    {
      id: 6,
      title: "웃음의 대학",
      subtitle: "유쾌한 코미디 연극",
      date: "2024.10.15 - 2024.12.31",
      image: "/images/poster13.png",
      bgColor: "from-yellow-500 to-orange-600",
      tag: "코미디",
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
      <Footer />
    </div>
  )
}
