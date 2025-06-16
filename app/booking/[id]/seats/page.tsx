"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, Clock, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface SeatsPageProps {
  params: {
    id: string
  }
}

interface Seat {
  id: string
  row: string
  number: number
  section: string
  price: number
  status: "available" | "selected" | "occupied" | "disabled"
}

// 상품 정보
const productInfo = {
  1: {
    title: "뮤지컬 라이온킹",
    venue: "샬롯데씨어터",
    poster: "/images/poster1.png",
  },
  2: {
    title: "BTS 월드투어",
    venue: "잠실올림픽주경기장",
    poster: "/images/poster2.png",
  },
}

export default function SeatsPage({ params }: SeatsPageProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const productId = Number.parseInt(params.id, 10)
  const product = productInfo[productId as keyof typeof productInfo] || productInfo[1]

  const selectedDate = searchParams.get("date")
  const selectedTime = searchParams.get("time")

  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])

  // 좌석 데이터 생성
  useEffect(() => {
    const generateSeats = () => {
      const seatData: Seat[] = []
      const sections = [
        { name: "VIP", rows: ["A", "B", "C"], seatsPerRow: 20, price: 170000 },
        { name: "R", rows: ["D", "E", "F", "G", "H"], seatsPerRow: 24, price: 140000 },
        { name: "S", rows: ["I", "J", "K", "L", "M", "N"], seatsPerRow: 26, price: 110000 },
        { name: "A", rows: ["O", "P", "Q", "R"], seatsPerRow: 28, price: 80000 },
      ]

      sections.forEach((section) => {
        section.rows.forEach((row) => {
          for (let i = 1; i <= section.seatsPerRow; i++) {
            const isOccupied = Math.random() < 0.3 // 30% 확률로 이미 예약된 좌석
            seatData.push({
              id: `${row}${i}`,
              row,
              number: i,
              section: section.name,
              price: section.price,
              status: isOccupied ? "occupied" : "available",
            })
          }
        })
      })

      setSeats(seatData)
    }

    generateSeats()
  }, [])

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "disabled") return

    const isSelected = selectedSeats.find((s) => s.id === seat.id)

    if (isSelected) {
      // 선택 해제
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
      setSeats(seats.map((s) => (s.id === seat.id ? { ...s, status: "available" } : s)))
    } else {
      // 최대 4석까지 선택 가능
      if (selectedSeats.length < 4) {
        setSelectedSeats([...selectedSeats, seat])
        setSeats(seats.map((s) => (s.id === seat.id ? { ...s, status: "selected" } : s)))
      }
    }
  }

  const handleBooking = () => {
    if (selectedSeats.length > 0) {
      const seatIds = selectedSeats.map((s) => s.id).join(",")
      router.push(`/booking/${productId}/payment?date=${selectedDate}&time=${selectedTime}&seats=${seatIds}`)
    }
  }

  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const getSeatColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-200 hover:bg-green-300 border-green-400"
      case "selected":
        return "bg-blue-500 border-blue-600 text-white"
      case "occupied":
        return "bg-gray-400 border-gray-500 cursor-not-allowed"
      case "disabled":
        return "bg-gray-200 border-gray-300 cursor-not-allowed"
      default:
        return "bg-gray-200"
    }
  }

  const groupedSeats = seats.reduce(
    (acc, seat) => {
      if (!acc[seat.row]) acc[seat.row] = []
      acc[seat.row].push(seat)
      return acc
    },
    {} as Record<string, Seat[]>,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <nav className="border-b border-gray-200 py-3 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-gray-900">
              홈
            </Link>
            <span>›</span>
            <Link href={`/goods/${productId}`} className="hover:text-gray-900">
              {product.title}
            </Link>
            <span>›</span>
            <Link href={`/booking/${productId}`} className="hover:text-gray-900">
              예매하기
            </Link>
            <span>›</span>
            <span className="text-gray-900">좌석 선택</span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 상품 정보 헤더 */}
        <Card className="p-6 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-32 flex-shrink-0">
                <Image
                  src={product.poster || "/placeholder.svg"}
                  alt={product.title}
                  width={96}
                  height={128}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{product.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {selectedDate} {selectedTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={() => router.back()}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              이전 단계
            </Button>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 좌석 배치도 */}
          <div className="lg:col-span-3">
            <Card className="p-6">
              <div className="text-center mb-6">
                <div className="bg-gray-800 text-white py-2 px-8 rounded-lg inline-block mb-4">STAGE</div>
                <h2 className="text-xl font-semibold">좌석 선택</h2>
                <p className="text-sm text-gray-600 mt-2">최대 4석까지 선택 가능합니다</p>
              </div>

              {/* 좌석 범례 */}
              <div className="flex justify-center space-x-6 mb-6 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                  <span>선택가능</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded"></div>
                  <span>선택됨</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gray-400 border border-gray-500 rounded"></div>
                  <span>예약불가</span>
                </div>
              </div>

              {/* 좌석 배치 */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(groupedSeats).map(([row, rowSeats]) => (
                  <div key={row} className="flex items-center justify-center space-x-1">
                    <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                    <div className="flex space-x-1">
                      {rowSeats.map((seat) => (
                        <button
                          key={seat.id}
                          onClick={() => handleSeatClick(seat)}
                          disabled={seat.status === "occupied" || seat.status === "disabled"}
                          className={`
                            w-6 h-6 text-xs border rounded transition-colors
                            ${getSeatColor(seat.status)}
                          `}
                          title={`${seat.row}${seat.number} - ${seat.price.toLocaleString()}원`}
                        >
                          {seat.number}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* 선택 정보 */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-8">
              <h3 className="text-lg font-semibold mb-4">선택한 좌석</h3>

              <div className="space-y-4">
                {selectedSeats.length === 0 ? (
                  <p className="text-gray-500 text-sm">좌석을 선택해주세요</p>
                ) : (
                  <div className="space-y-2">
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                        <div>
                          <span className="font-medium">{seat.section}석</span>
                          <span className="text-sm text-gray-600 ml-2">{seat.id}</span>
                        </div>
                        <span className="font-medium">{seat.price.toLocaleString()}원</span>
                      </div>
                    ))}
                  </div>
                )}

                {selectedSeats.length > 0 && (
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold">총 금액</span>
                      <span className="text-lg font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <div className="text-sm text-gray-600 mb-2">예매 단계</div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs">
                        ✓
                      </div>
                      <span className="text-sm">날짜/시간 선택</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        2
                      </div>
                      <span className="text-sm">좌석 선택</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full mt-6" disabled={selectedSeats.length === 0} onClick={handleBooking}>
                결제하기
              </Button>

              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500">선택한 좌석: {selectedSeats.length}/4</p>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
