import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin, Clock, Users, Heart, Share2, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface ProductPageProps {
  params: {
    id: string
  }
}

// 상품 데이터 타입 정의
interface ProductData {
  id: number
  title: string
  subtitle: string
  venue: string
  period: string
  runtime: string
  ageLimit: string
  price: {
    vip: string
    r: string
    s: string
    a: string
  }
  rating: number
  reviewCount: number
  poster: string
  gallery: string[]
  cast: Array<{
    name: string
    role: string
    image: string
  }>
  schedule: Array<{
    date: string
    times: string[]
  }>
  category: string
  description: string
}

// 상품 데이터베이스 (실제로는 서버에서 가져올 데이터)
const productDatabase: Record<number, ProductData> = {
  1: {
    id: 1,
    title: "뮤지컬 라이온킹",
    subtitle: "디즈니의 감동 대서사시",
    venue: "샬롯데씨어터",
    period: "2024.06.01 ~ 2024.12.31",
    runtime: "150분 (인터미션 20분 포함)",
    ageLimit: "8세 이상",
    price: {
      vip: "170,000원",
      r: "140,000원",
      s: "110,000원",
      a: "80,000원",
    },
    rating: 4.8,
    reviewCount: 1247,
    poster: "/images/poster1.png",
    gallery: ["/images/poster1.png", "/images/poster2.png", "/images/poster3.png", "/images/poster4.png"],
    cast: [
      { name: "정성화", role: "심바", image: "/images/poster1.png" },
      { name: "김소향", role: "날라", image: "/images/poster2.png" },
      { name: "정동화", role: "무파사", image: "/images/poster3.png" },
      { name: "서경수", role: "스카", image: "/images/poster4.png" },
    ],
    schedule: [
      { date: "2024.06.15", times: ["14:00", "19:00"] },
      { date: "2024.06.16", times: ["14:00", "19:00"] },
      { date: "2024.06.17", times: ["19:00"] },
      { date: "2024.06.18", times: ["14:00", "19:00"] },
    ],
    category: "뮤지컬",
    description: "아프리카 대초원을 배경으로 펼쳐지는 디즈니의 대표작 라이온킹이 뮤지컬로 찾아옵니다.",
  },
  2: {
    id: 2,
    title: "BTS 월드투어",
    subtitle: "Yet To Come in Cinemas",
    venue: "잠실올림픽주경기장",
    period: "2024.08.15 ~ 2024.08.17",
    runtime: "180분 (인터미션 15분 포함)",
    ageLimit: "전체관람가",
    price: {
      vip: "220,000원",
      r: "180,000원",
      s: "150,000원",
      a: "120,000원",
    },
    rating: 4.9,
    reviewCount: 2847,
    poster: "/images/poster2.png",
    gallery: ["/images/poster2.png", "/images/poster3.png", "/images/poster4.png", "/images/poster5.png"],
    cast: [
      { name: "RM", role: "리더", image: "/images/poster2.png" },
      { name: "진", role: "보컬", image: "/images/poster3.png" },
      { name: "슈가", role: "래퍼", image: "/images/poster4.png" },
      { name: "제이홉", role: "래퍼", image: "/images/poster5.png" },
    ],
    schedule: [
      { date: "2024.08.15", times: ["19:00"] },
      { date: "2024.08.16", times: ["18:00"] },
      { date: "2024.08.17", times: ["18:00"] },
    ],
    category: "콘서트",
    description: "전 세계를 감동시킨 BTS의 특별한 무대를 대형 스크린으로 만나보세요.",
  },
  3: {
    id: 3,
    title: "뮤지컬 위키드",
    subtitle: "브로드웨이 최고의 뮤지컬",
    venue: "블루스퀘어 인터파크홀",
    period: "2024.09.01 ~ 2024.12.15",
    runtime: "165분 (인터미션 20분 포함)",
    ageLimit: "8세 이상",
    price: {
      vip: "160,000원",
      r: "130,000원",
      s: "100,000원",
      a: "70,000원",
    },
    rating: 4.7,
    reviewCount: 892,
    poster: "/images/poster3.png",
    gallery: ["/images/poster3.png", "/images/poster4.png", "/images/poster5.png", "/images/poster6.png"],
    cast: [
      { name: "옥주현", role: "엘파바", image: "/images/poster3.png" },
      { name: "정선아", role: "글린다", image: "/images/poster4.png" },
      { name: "정성화", role: "피에로", image: "/images/poster5.png" },
      { name: "김법래", role: "마법사", image: "/images/poster6.png" },
    ],
    schedule: [
      { date: "2024.09.15", times: ["14:00", "19:30"] },
      { date: "2024.09.16", times: ["14:00", "19:30"] },
      { date: "2024.09.17", times: ["19:30"] },
    ],
    category: "뮤지컬",
    description: "마법사 오즈의 숨겨진 이야기를 그린 브로드웨이 최고의 뮤지컬입니다.",
  },
  4: {
    id: 4,
    title: "연극 햄릿",
    subtitle: "셰익스피어의 불멸의 명작",
    venue: "대학로 예술극장",
    period: "2024.08.01 ~ 2024.10.31",
    runtime: "140분 (인터미션 15분 포함)",
    ageLimit: "12세 이상",
    price: {
      vip: "80,000원",
      r: "60,000원",
      s: "45,000원",
      a: "30,000원",
    },
    rating: 4.6,
    reviewCount: 456,
    poster: "/images/poster4.png",
    gallery: ["/images/poster4.png", "/images/poster5.png", "/images/poster6.png", "/images/poster7.png"],
    cast: [
      { name: "이정성", role: "햄릿", image: "/images/poster4.png" },
      { name: "김영옥", role: "거트루드", image: "/images/poster5.png" },
      { name: "박정자", role: "오필리어", image: "/images/poster6.png" },
      { name: "손숙", role: "클로디어스", image: "/images/poster7.png" },
    ],
    schedule: [
      { date: "2024.08.20", times: ["19:30"] },
      { date: "2024.08.21", times: ["14:00", "19:30"] },
      { date: "2024.08.22", times: ["19:30"] },
    ],
    category: "연극",
    description: "복수와 광기, 그리고 인간의 본성을 그린 셰익스피어의 걸작입니다.",
  },
  // 기본 데이터 (ID가 없는 경우)
  0: {
    id: 0,
    title: "공연 정보 없음",
    subtitle: "해당 공연을 찾을 수 없습니다",
    venue: "-",
    period: "-",
    runtime: "-",
    ageLimit: "-",
    price: {
      vip: "-",
      r: "-",
      s: "-",
      a: "-",
    },
    rating: 0,
    reviewCount: 0,
    poster: "/placeholder.svg",
    gallery: ["/placeholder.svg"],
    cast: [],
    schedule: [],
    category: "-",
    description: "해당 공연 정보를 찾을 수 없습니다.",
  },
}

export default function ProductPage({ params }: ProductPageProps) {
  const productId = Number.parseInt(params.id, 10)

  // ID에 해당하는 데이터 가져오기, 없으면 기본 데이터 사용
  const productData = productDatabase[productId] || productDatabase[0]

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <nav className="border-b border-gray-200 py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              홈
            </Link>
            <span>›</span>
            <Link href={`/contents/genre/${productData.category.toLowerCase()}`} className="hover:text-gray-900">
              {productData.category}
            </Link>
            <span>›</span>
            <span className="text-gray-900">{productData.title}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-[3/4] overflow-hidden rounded-lg mb-4">
                <Image
                  src={productData.poster || "/placeholder.svg"}
                  alt={productData.title}
                  width={400}
                  height={533}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {productData.gallery.map((image, index) => (
                  <div key={index} className="aspect-square overflow-hidden rounded cursor-pointer">
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`갤러리 ${index + 1}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Middle Column - Product Info */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Title and Rating */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    {productData.category}
                  </Badge>
                  {productData.category === "뮤지컬" && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      대형뮤지컬
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{productData.title}</h1>
                <p className="text-lg text-gray-600 mb-4">{productData.subtitle}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{productData.rating}</span>
                    <span className="text-gray-600">({productData.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4 mr-1" />
                      찜하기
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4 mr-1" />
                      공유하기
                    </Button>
                  </div>
                </div>
              </div>

              {/* Performance Info */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">공연 정보</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">공연장소</span>
                      <p className="font-medium">{productData.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">공연기간</span>
                      <p className="font-medium">{productData.period}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">공연시간</span>
                      <p className="font-medium">{productData.runtime}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-gray-400" />
                    <div>
                      <span className="text-gray-600">관람연령</span>
                      <p className="font-medium">{productData.ageLimit}</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Cast Info */}
              {productData.cast.length > 0 && (
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-4">캐스팅</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {productData.cast.map((actor, index) => (
                      <div key={index} className="text-center">
                        <div className="w-16 h-16 mx-auto mb-2 overflow-hidden rounded-full">
                          <Image
                            src={actor.image || "/placeholder.svg"}
                            alt={actor.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="font-medium text-sm">{actor.name}</p>
                        <p className="text-xs text-gray-600">{actor.role}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Right Column - Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">예매하기</h3>

                {/* Price Info */}
                <div className="mb-6">
                  <h4 className="font-medium mb-3">가격 정보</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>VIP석</span>
                      <span className="font-semibold">{productData.price.vip}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>R석</span>
                      <span className="font-semibold">{productData.price.r}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>S석</span>
                      <span className="font-semibold">{productData.price.s}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>A석</span>
                      <span className="font-semibold">{productData.price.a}</span>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                {productData.schedule.length > 0 && (
                  <div className="mb-6">
                    <h4 className="font-medium mb-3">공연 일정</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {productData.schedule.map((day, index) => (
                        <div key={index} className="border rounded p-3">
                          <p className="font-medium text-sm mb-1">{day.date}</p>
                          <div className="flex gap-2">
                            {day.times.map((time, timeIndex) => (
                              <Button key={timeIndex} variant="outline" size="sm" className="text-xs">
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Link href={`/booking/${productData.id}`}>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg font-semibold">
                    예매하기
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">예매 수수료 별도</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="mt-12">
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="details">상세정보</TabsTrigger>
              <TabsTrigger value="venue">공연장정보</TabsTrigger>
              <TabsTrigger value="reviews">관람후기</TabsTrigger>
              <TabsTrigger value="qna">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">공연 상세정보</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">{productData.description}</p>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    화려한 무대와 의상, 그리고 아름다운 음악이 어우러져 관객들에게 잊을 수 없는 감동을 선사합니다. 전
                    세계적으로 사랑받는 이 작품을 한국 최고의 배우들이 선보입니다.
                  </p>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="venue" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">공연장 정보</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">{productData.venue}</h4>
                    <p className="text-gray-700 mb-4">서울특별시 송파구 올림픽로 240</p>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">지하철:</span> 2호선 잠실새내역 4번 출구
                      </p>
                      <p>
                        <span className="font-medium">버스:</span> 잠실새내역 정류장
                      </p>
                      <p>
                        <span className="font-medium">주차:</span> 공연장 주차장 이용
                      </p>
                    </div>
                  </div>
                  <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500">지도 영역</span>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">관람후기</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-gray-200 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">user***</span>
                        <span className="text-sm text-gray-400">2024.06.10</span>
                      </div>
                      <p className="text-gray-700">
                        정말 감동적인 공연이었습니다. 배우들의 연기와 노래가 훌륭했고, 무대 연출도 화려해서 눈을 뗄 수
                        없었어요. 강력 추천합니다!
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="qna" className="mt-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-4">Q&A</h3>
                <div className="space-y-4">
                  <div className="border-b border-gray-200 pb-4">
                    <p className="font-medium mb-2">Q. 공연 중 사진 촬영이 가능한가요?</p>
                    <p className="text-gray-700">
                      A. 공연 중 사진 및 동영상 촬영은 금지되어 있습니다. 공연 시작 전 로비에서만 촬영 가능합니다.
                    </p>
                  </div>
                  <div className="border-b border-gray-200 pb-4">
                    <p className="font-medium mb-2">Q. 어린이도 관람 가능한가요?</p>
                    <p className="text-gray-700">
                      A. {productData.ageLimit} 관람 가능하며, 미취학 아동은 입장이 제한될 수 있습니다.
                    </p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  )
}
