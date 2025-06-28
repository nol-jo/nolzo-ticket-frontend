'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, Clock, RefreshCw, X } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { authAPI, getCookie, User } from "@/lib/utils"

interface Seat {
  id: number;
  rowName: string;
  seatNumber: number;
  seatSection: string;
  floor: string;
  price: number;
  status: string;
}

interface Event {
  id: number;
  title: string;
  venue: string;
  date: string;
  time: string;
  image: string | null;
}

interface ReservationDetail {
  id: number | null;
  seats: Seat[];
  status: string;
  totalPrice: number;
  reservationNumber: string;
  createdAt: string;
  paymentMethod: string | null;
}

interface Reservation {
  event: Event;
  detail: ReservationDetail;
}

export default function MyReservationsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("latest")
  const [showModal, setShowModal] = useState(false)
  const [detailRes, setDetailRes] = useState<Reservation | null>(null)

  useEffect(() => {
    async function fetchReservations() {
      const jwtUser: User | null = await authAPI.checkAndRefreshToken();
      if (!jwtUser) {
        router.push("/login?returnUrl=" + encodeURIComponent("/my-reservations"));
        return;
      }
      setIsLoggedIn(true);

      try {
        const accessToken = getCookie('accessToken');
        const res = await fetch("http://localhost:8080/api/v1/reservations", {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch reservations');
        }

        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error("Failed to fetch reservations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReservations();
  }, [router]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING": return <Badge className="bg-yellow-100 text-yellow-800">결제대기</Badge>
      case "WAITING": return <Badge className="bg-blue-100 text-blue-800">예약완료</Badge>
      case "CANCELLED": return <Badge className="bg-red-100 text-red-800">취소됨</Badge>
      case "COMPLETED": return <Badge className="bg-green-100 text-green-800">관람완료</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filterReservations = (status: string) => {
    // 상태별 필터링 로직 조정
    if (status === "RESERVED") {
      return reservations.filter(r => r.detail.status === "WAITING" || r.detail.status === "PENDING")
    }
    return reservations.filter(r => r.detail.status === status)
  }

  const sortReservations = (list: Reservation[]) => {
    switch (sortBy) {
      case "latest": return [...list].sort((a, b) => new Date(b.detail.createdAt).getTime() - new Date(a.detail.createdAt).getTime())
      case "oldest": return [...list].sort((a, b) => new Date(a.detail.createdAt).getTime() - new Date(b.detail.createdAt).getTime())
      case "performance-date": return [...list].sort((a, b) => new Date(a.event.date).getTime() - new Date(b.event.date).getTime())
      default: return list
    }
  }

  const handleCancel = (reservationNumber: string) => {
    if (confirm('정말로 예약을 취소하시겠습니까?')) {
      // TODO: Add API call to cancel reservation
      console.log("Cancelling reservation", reservationNumber)
      setShowModal(false)
    }
  }

  const getTotalPrice = (seats: Seat[]) => {
    return seats.reduce((sum, seat) => sum + seat.price, 0)
  }

  if (!isLoggedIn) return null
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="text-center py-16"><RefreshCw className="animate-spin mx-auto h-12 w-12 text-blue-600"/><p>예약 내역을 불러오는 중...</p></div>
      <Footer />
    </div>
  )

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div><h1 className="text-3xl font-bold">내 예약</h1><p>예약하신 공연 정보를 확인하세요.</p></div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">최신순</SelectItem>
                <SelectItem value="oldest">오래된순</SelectItem>
                <SelectItem value="performance-date">공연일순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="RESERVED" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="RESERVED">예약완료 ({filterReservations("RESERVED").length})</TabsTrigger>
              <TabsTrigger value="COMPLETED">관람완료 ({filterReservations("COMPLETED").length})</TabsTrigger>
              <TabsTrigger value="CANCELLED">취소/환불 ({filterReservations("CANCELLED").length})</TabsTrigger>
            </TabsList>
            { ["RESERVED", "COMPLETED", "CANCELLED"].map(tab => (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-4">
                { sortReservations(filterReservations(tab)).length === 0
                  ? <div className="text-center py-16"><p className="text-gray-500">{`${tab === 'RESERVED' ? '예약완료' : tab === 'COMPLETED' ? '관람완료' : '취소/환불'} 상태의 예약이 없습니다.`}</p><Button onClick={() => router.push('/')}>공연 둘러보기</Button></div>
                  : sortReservations(filterReservations(tab)).map(res => (
                    <Card key={res.detail.reservationNumber} className="p-4 hover:shadow-md">
                      <div className="flex">
                        <div className="w-24 h-32">
                          {res.event.image ? (
                            <Image src={res.event.image} alt={res.event.title} width={96} height={128} className="rounded object-cover"/>
                          ) : (
                            <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                              이미지 없음
                            </div>
                          )}
                        </div>
                        <div className="flex-1 ml-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{res.event.title}</h3>
                            {getStatusBadge(res.detail.status)}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-5"><MapPin/>{res.event.venue}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-2"><Calendar/>{res.event.date}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-2"><Clock/>{res.event.time}</p>
                        </div>
                        <div className="ml-6 w-32 flex flex-col">
                          <span className="text-2xl font-bold text-blue-600 ">
                            {res.detail.totalPrice > 0
                              ? res.detail.totalPrice.toLocaleString()
                              : getTotalPrice(res.detail.seats).toLocaleString()
                            }원
                          </span>
                          <Button size="sm" variant="outline" className="w-full mt-2" onClick={() => { setDetailRes(res); setShowModal(true) }}>예약상세</Button>
                          {(res.detail.status === 'WAITING' || res.detail.status === 'PENDING') &&
                            <Button size="sm" variant="destructive" className="w-full mt-2" onClick={() => handleCancel(res.detail.reservationNumber)}>예약취소</Button>
                          }
                        </div>
                      </div>
                    </Card>
                  ))
                }
              </TabsContent>
            ))}
          </Tabs>
        </div>
        <Footer />
      </div>

      { showModal && detailRes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-semibold">예약 상세 정보</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowModal(false)}><X/></Button>
            </div>
            <div className="p-4 space-y-2">
              <p><strong>공연명:</strong> {detailRes.event.title}</p>
              <p><strong>장소:</strong> {detailRes.event.venue}</p>
              <p><strong>날짜:</strong> {detailRes.event.date} {detailRes.event.time}</p>
              <p><strong>좌석:</strong> {detailRes.detail.seats.map(s => `${s.seatSection} ${s.rowName}열 ${s.seatNumber}번 (${s.floor})`).join(', ')}</p>
              <p><strong>예약번호:</strong> {detailRes.detail.reservationNumber}</p>
              <p><strong>결제방법:</strong> {detailRes.detail.paymentMethod || '미결제'}</p>
              <p><strong>예약일:</strong> {new Date(detailRes.detail.createdAt).toLocaleString()}</p>
              <p><strong>총 가격:</strong> {
                detailRes.detail.totalPrice > 0
                  ? detailRes.detail.totalPrice.toLocaleString()
                  : getTotalPrice(detailRes.detail.seats).toLocaleString()
              }원</p>
            </div>
            <div className="p-4 text-right border-t">
              <Button onClick={() => setShowModal(false)}>닫기</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}