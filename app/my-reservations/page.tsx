"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, Clock, Download, RefreshCw } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Reservation {
  id: number
  title: string
  venue: string
  date: string
  time: string
  seats: string
  status: "confirmed" | "cancelled" | "completed"
  image: string
  price: string
  reservationNumber: string
  paymentMethod: string
  bookingDate: string
}

export default function MyReservationsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("latest")

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("userInfo")

    if (!loggedIn) {
      router.push("/login?returnUrl=" + encodeURIComponent("/my-reservations"))
      return
    }

    setIsLoggedIn(loggedIn)
    if (user) {
      setUserInfo(JSON.parse(user))
    }

    // 예약 데이터 로드 시뮬레이션
    setTimeout(() => {
      const mockReservations: Reservation[] = [
        {
          id: 1,
          title: "뮤지컬 라이온킹",
          venue: "샬롯데씨어터",
          date: "2024.07.15",
          time: "19:00",
          seats: "VIP석 A열 5-6번",
          status: "confirmed",
          image: "/images/poster1.png",
          price: "340,000원",
          reservationNumber: "TK240715001",
          paymentMethod: "신용카드",
          bookingDate: "2024.06.20",
        },
        {
          id: 2,
          title: "BTS 월드투어",
          venue: "잠실올림픽주경기장",
          date: "2024.08.17",
          time: "19:00",
          seats: "R석 15열 12-13번",
          status: "confirmed",
          image: "/images/poster2.png",
          price: "240,000원",
          reservationNumber: "TK240817002",
          paymentMethod: "신용카드",
          bookingDate: "2024.06.21",
        },
        {
          id: 3,
          title: "뮤지컬 위키드",
          venue: "블루스퀘어 인터파크홀",
          date: "2024.05.20",
          time: "14:00",
          seats: "S석 10열 8번",
          status: "completed",
          image: "/images/poster3.png",
          price: "130,000원",
          reservationNumber: "TK240520003",
          paymentMethod: "신용카드",
          bookingDate: "2024.04.15",
        },
        {
          id: 4,
          title: "연극 햄릿",
          venue: "대학로 예술극장",
          date: "2024.06.10",
          time: "19:30",
          seats: "R석 5열 3번",
          status: "cancelled",
          image: "/images/poster4.png",
          price: "60,000원",
          reservationNumber: "TK240610004",
          paymentMethod: "신용카드",
          bookingDate: "2024.05.25",
        },
      ]
      setReservations(mockReservations)
      setIsLoading(false)
    }, 1000)
  }, [router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">예약완료</Badge>
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">취소됨</Badge>
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800">관람완료</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getStatusActions = (reservation: Reservation) => {
    switch (reservation.status) {
      case "confirmed":
        return (
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              티켓출력
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              예약상세
            </Button>
          </div>
        )
      case "completed":
        return (
          <div className="space-y-2">
            <Button size="sm" variant="outline" className="w-full">
              관람후기 작성
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              예약상세
            </Button>
          </div>
        )
      case "cancelled":
        return (
          <Button size="sm" variant="outline" className="w-full">
            취소상세
          </Button>
        )
      default:
        return null
    }
  }

  const filterReservations = (status?: string) => {
    if (!status || status === "all") return reservations
    return reservations.filter((r) => r.status === status)
  }

  const sortReservations = (reservations: Reservation[]) => {
    switch (sortBy) {
      case "latest":
        return [...reservations].sort((a, b) => new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      case "oldest":
        return [...reservations].sort((a, b) => new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
      case "performance-date":
        return [...reservations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      default:
        return reservations
    }
  }

  if (!isLoggedIn) {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">예약 내역을 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">내 예약</h1>
            <p className="text-gray-600">예약하신 공연 정보를 확인하세요.</p>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="performance-date">공연일순</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">전체 ({reservations.length})</TabsTrigger>
            <TabsTrigger value="confirmed">예약완료 ({filterReservations("confirmed").length})</TabsTrigger>
            <TabsTrigger value="completed">관람완료 ({filterReservations("completed").length})</TabsTrigger>
            <TabsTrigger value="cancelled">취소/환불 ({filterReservations("cancelled").length})</TabsTrigger>
          </TabsList>

          {["all", "confirmed", "completed", "cancelled"].map((tabValue) => (
            <TabsContent key={tabValue} value={tabValue} className="mt-6">
              <div className="space-y-4">
                {sortReservations(filterReservations(tabValue === "all" ? undefined : tabValue)).length === 0 ? (
                  <div className="text-center py-16">
                    <p className="text-gray-500 text-lg mb-4">
                      {tabValue === "all" ? "예약 내역이 없습니다." : `${tabValue} 상태의 예약이 없습니다.`}
                    </p>
                    <Button onClick={() => router.push("/")}>공연 둘러보기</Button>
                  </div>
                ) : (
                  sortReservations(filterReservations(tabValue === "all" ? undefined : tabValue)).map((reservation) => (
                    <Card key={reservation.id} className="p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start space-x-6">
                        <div className="w-24 h-32 flex-shrink-0">
                          <Image
                            src={reservation.image || "/placeholder.svg"}
                            alt={reservation.title}
                            width={96}
                            height={128}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <h3 className="text-xl font-semibold text-gray-800">{reservation.title}</h3>
                                {getStatusBadge(reservation.status)}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" />
                                    <span>{reservation.venue}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    <span>{reservation.date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    <span>{reservation.time}</span>
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <p>
                                    <span className="font-medium">좌석:</span> {reservation.seats}
                                  </p>
                                  <p>
                                    <span className="font-medium">예약번호:</span> {reservation.reservationNumber}
                                  </p>
                                  <p>
                                    <span className="font-medium">결제방법:</span> {reservation.paymentMethod}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center justify-between">
                                <div>
                                  <span className="text-2xl font-bold text-blue-600">{reservation.price}</span>
                                  <p className="text-xs text-gray-500 mt-1">예약일: {reservation.bookingDate}</p>
                                </div>
                              </div>
                            </div>

                            <div className="ml-6 w-32">{getStatusActions(reservation)}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
