import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function FridayGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "금요일 특가",
      subtitle: "주말을 앞둔 특별한 할인",
      date: "매주 금요일",
      image: "/images/poster12.png",
      bgColor: "from-yellow-400 to-orange-500",
    },
    {
      id: 2,
      title: "금요 야간 공연",
      subtitle: "퇴근 후 즐기는 문화생활",
      date: "금요일 19:00~",
      image: "/images/poster13.png",
      bgColor: "from-indigo-500 to-purple-600",
    },
    {
      id: 3,
      title: "주말 준비 패키지",
      subtitle: "금요일부터 시작하는 주말",
      date: "금~일 연속 공연",
      image: "/images/poster14.png",
      bgColor: "from-pink-500 to-red-600",
    },
    {
      id: 4,
      title: "금요 데이트 코스",
      subtitle: "커플을 위한 특별한 밤",
      date: "금요일 한정",
      image: "/images/poster1.png",
      bgColor: "from-rose-400 to-pink-500",
    },
  ]

  const categories = [
    "금요일장 전체보기",
    "금요특가",
    "야간공연",
    "데이트코스",
    "주말패키지",
    "할인쿠폰",
    "이벤트",
    "한정상품",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[금요특가] 뮤지컬 티켓 40% 할인",
      subtitle: "금요일 밤 공연 한정",
      date: "매주 금요일",
      image: "/images/poster2.png",
    },
    {
      id: 2,
      title: "[커플패키지] 2인 관람권 + 디너",
      date: "금요일 19:00 공연",
      image: "/images/poster3.png",
    },
    {
      id: 3,
      title: "[주말준비] 금토일 연속 관람권",
      date: "주말 패키지 할인",
      image: "/images/poster4.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-amber-100 to-yellow-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">금요일장</h1>
            <p className="text-lg text-gray-600">금요일만의 특별한 혜택과 이벤트</p>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="border-b border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-4 overflow-x-auto">
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              전체
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              금요특가
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              야간공연
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              데이트코스
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              주말패키지
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              이벤트
            </Button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mainShows.map((show) => (
            <Link key={show.id} href={`/goods/${show.id}`}>
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-80">
                <div className={`relative h-full bg-gradient-to-br ${show.bgColor} text-white`}>
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-yellow-400 text-yellow-900 font-bold">금요일장</Badge>
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
            <Link key={index} href={`/contents/genre/friday/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
                  <Badge className="absolute top-2 left-2 bg-yellow-500 text-white z-10">금요특가</Badge>
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
                  {item.subtitle && <p className="text-sm text-yellow-600 mb-1">{item.subtitle}</p>}
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
