import Image from "next/image"
import Link from "next/link"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"

export default function MdGenrePage() {
  const mainShows = [
    {
      id: 1,
      title: "공연 굿즈",
      subtitle: "좋아하는 공연의 특별한 기념품",
      date: "상시 판매",
      image: "/images/poster8.png",
      bgColor: "from-purple-500 to-pink-500",
    },
    {
      id: 2,
      title: "아티스트 MD",
      subtitle: "아티스트 공식 굿즈",
      date: "한정 판매",
      image: "/images/poster9.png",
      bgColor: "from-blue-500 to-purple-600",
    },
    {
      id: 3,
      title: "시즌 한정 상품",
      subtitle: "특별한 시즌을 기념하는 상품",
      date: "2024.06.01 - 2024.08.31",
      image: "/images/poster10.png",
      bgColor: "from-orange-400 to-red-500",
    },
    {
      id: 4,
      title: "콜라보 상품",
      subtitle: "브랜드와의 특별한 만남",
      date: "2024.07.01 - 2024.09.30",
      image: "/images/poster11.png",
      bgColor: "from-green-400 to-teal-500",
    },
  ]

  const categories = [
    "MD상품 전체보기",
    "공연굿즈",
    "아티스트MD",
    "의류",
    "액세서리",
    "문구용품",
    "생활용품",
    "한정상품",
  ]

  const mdRecommendations = [
    {
      id: 1,
      title: "[한정판] 라이온킹 OST 바이닐",
      subtitle: "(-20%)",
      date: "한정 1000장",
      image: "/images/poster12.png",
    },
    {
      id: 2,
      title: "[신상] BTS 공식 후드티",
      date: "2024.06.15 출시",
      image: "/images/poster13.png",
    },
    {
      id: 3,
      title: "뮤지컬 굿즈 세트",
      date: "선착순 500세트",
      image: "/images/poster14.png",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-violet-100 to-purple-100 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">MD상품</h1>
            <p className="text-lg text-gray-600">특별한 순간을 기념하는 소중한 아이템</p>
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
              공연굿즈
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              아티스트MD
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              의류
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              액세서리
            </Button>
            <Button variant="outline" size="sm" className="whitespace-nowrap">
              문구용품
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
            <Link key={index} href={`/contents/genre/md/${category.toLowerCase().replace(/\s+/g, "-")}`}>
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
                <div className="aspect-[4/3] overflow-hidden">
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
                  {item.subtitle && <p className="text-sm text-gray-600 mb-1">{item.subtitle}</p>}
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
