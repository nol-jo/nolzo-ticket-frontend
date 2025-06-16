import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function DiscountGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "얼리버드 특가",
      subtitle: "미리 예약하고 최대 50% 할인",
      date: "한정 기간",
      image: "/images/poster1.png",
      bgColor: "from-red-500 to-pink-600",
      discount: "50%",
    },
    {
      id: 2,
      title: "학생 할인",
      subtitle: "학생증 제시 시 특별 할인",
      date: "상시 할인",
      image: "/images/poster2.png",
      bgColor: "from-blue-500 to-indigo-600",
      discount: "30%",
    },
    {
      id: 3,
      title: "그룹 할인",
      subtitle: "4인 이상 단체 예약 할인",
      date: "2024.06.01 - 2024.12.31",
      image: "/images/poster3.png",
      bgColor: "from-green-500 to-emerald-600",
      discount: "25%",
    },
    {
      id: 4,
      title: "시니어 할인",
      subtitle: "65세 이상 어르신 특별 혜택",
      date: "상시 할인",
      image: "/images/poster4.png",
      bgColor: "from-purple-500 to-violet-600",
      discount: "20%",
    },
  ]

  const categories = [
    "할인 전체보기",
    "얼리버드",
    "학생할인",
    "그룹할인",
    "시니어할인",
    "멤버십할인",
    "쿠폰할인",
    "특가상품",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[타임세일] 뮤지컬 라이온킹 50% 할인",
      subtitle: "오늘 밤 12시까지",
      date: "2024.06.15 23:59까지",
      image: "/images/poster5.png",
      originalPrice: "140,000원",
      salePrice: "70,000원",
    },
    {
      id: 2,
      title: "[주말특가] 콘서트 티켓 30% 할인",
      date: "주말 한정",
      image: "/images/poster6.png",
      originalPrice: "99,000원",
      salePrice: "69,300원",
    },
    {
      id: 3,
      title: "[마감임박] 연극 햄릿 40% 할인",
      date: "잔여석 한정",
      image: "/images/poster7.png",
      originalPrice: "60,000원",
      salePrice: "36,000원",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-red-100 to-pink-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">할인</h1>
            <p className="text-lg text-gray-600">더 저렴하게 즐기는 문화생활의 기회</p>
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
              얼리버드
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              학생할인
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              그룹할인
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              시니어할인
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              멤버십할인
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
                    <Badge className="bg-yellow-400 text-yellow-900 font-bold text-lg">{show.discount} OFF</Badge>
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
            <Link key={index} href={`/contents/genre/discount/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
                  <Badge className="absolute top-2 left-2 bg-red-500 text-white z-10">특가</Badge>
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
                  {item.subtitle && <p className="text-sm text-red-600 mb-1">{item.subtitle}</p>}
                  <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                  {item.originalPrice && item.salePrice && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400 line-through">{item.originalPrice}</span>
                      <span className="text-lg font-bold text-red-600">{item.salePrice}</span>
                    </div>
                  )}
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
