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
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("latest")
  const [showModal, setShowModal] = useState(false)
  const [detailRes, setDetailRes] = useState<Reservation | null>(null)

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      router.push("/login?returnUrl=" + encodeURIComponent("/my-reservations"))
      return
    }
    setIsLoggedIn(true)
    setTimeout(() => {
      const mock: Reservation[] = [
        { id:1,title:"뮤지컬 라이온킹",venue:"샬롯데씨어터", date:"2024.07.15",time:"19:00",seats:"VIP석 A열 5-6번",status:"confirmed",image:"/images/poster1.png",price:"340,000원",reservationNumber:"TK240715001",paymentMethod:"신용카드",bookingDate:"2024.06.20" },
        { id:2,title:"BTS 월드투어",venue:"잠실올림픽주경기장", date:"2024.08.17",time:"19:00",seats:"R석 15열 12-13번",status:"confirmed",image:"/images/poster2.png",price:"240,000원",reservationNumber:"TK240817002",paymentMethod:"신용카드",bookingDate:"2024.06.21" },
        { id:3,title:"뮤지컬 위키드",venue:"블루스퀘어 인터파크홀", date:"2024.05.20",time:"14:00",seats:"S석 10열 8번",status:"completed",image:"/images/poster3.png",price:"130,000원",reservationNumber:"TK240520003",paymentMethod:"신용카드",bookingDate:"2024.04.15" },
        { id:4,title:"연극 햄릿",venue:"대학로 예술극장", date:"2024.06.10",time:"19:30",seats:"R석 5열 3번",status:"cancelled",image:"/images/poster4.png",price:"60,000원",reservationNumber:"TK240610004",paymentMethod:"신용카드",bookingDate:"2024.05.25" },
      ]
      setReservations(mock)
      setIsLoading(false)
    }, 0)
  }, [router])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed": return <Badge className="bg-green-100 text-green-800">예약완료</Badge>
      case "cancelled": return <Badge className="bg-red-100 text-red-800">취소됨</Badge>
      case "completed": return <Badge className="bg-blue-100 text-blue-800">관람완료</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const filterReservations = (status: string) =>
    reservations.filter(r => r.status === status)

  const sortReservations = (list: Reservation[]) => {
    switch (sortBy) {
      case "latest": return [...list].sort((a,b)=> new Date(b.bookingDate).getTime() - new Date(a.bookingDate).getTime())
      case "oldest": return [...list].sort((a,b)=> new Date(a.bookingDate).getTime() - new Date(b.bookingDate).getTime())
      case "performance-date": return [...list].sort((a,b)=> new Date(a.date).getTime() - new Date(b.date).getTime())
      default: return list
    }
  }

  const handleCancel = (id: number) => {
    if (confirm('정말로 예약을 취소하시겠습니까?')) {
      setReservations(prev => prev.map(r => r.id===id?{...r,status:'cancelled'}:r))
      setShowModal(false)
    }
   // todo: 리다이렉션 추가
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

          <Tabs defaultValue="confirmed" className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="confirmed">예약완료 ({filterReservations("confirmed").length})</TabsTrigger>
              <TabsTrigger value="completed">관람완료 ({filterReservations("completed").length})</TabsTrigger>
              <TabsTrigger value="cancelled">취소/환불 ({filterReservations("cancelled").length})</TabsTrigger>
            </TabsList>
            { ["confirmed","completed","cancelled"].map(tab=> (
              <TabsContent key={tab} value={tab} className="mt-6 space-y-4">
                { sortReservations(filterReservations(tab)).length===0
                  ? <div className="text-center py-16"><p className="text-gray-500">{`${tab} 상태의 예약이 없습니다.`}</p><Button onClick={()=>router.push('/')}>공연 둘러보기</Button></div>
                  : sortReservations(filterReservations(tab)).map(res=>(
                    <Card key={res.id} className="p-4 hover:shadow-md">
                      <div className="flex">
                        <div className="w-24 h-32">
                          <Image src={res.image} alt={res.title} width={96} height={128} className="rounded object-cover"/>
                        </div>
                        <div className="flex-1 ml-6">
                          <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold">{res.title}</h3>
                            {getStatusBadge(res.status)}
                          </div>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-5"><MapPin/>{res.venue}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-2"><Calendar/>{res.date}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-2 mt-2"><Clock/>{res.time}</p>
                        </div>
                        <div className="ml-6 w-32 flex flex-col">
                          <span className="text-2xl font-bold text-blue-600 ">{res.price}</span>
                          <Button size="sm" variant="outline" className="w-full mt-2" onClick={()=>{setDetailRes(res);setShowModal(true)}}>예약상세</Button>
                          {res.status==='confirmed' && <Button size="sm" variant="destructive" className="w-full mt-2" onClick={()=>handleCancel(res.id)}>예약취소</Button>}
                        </div>
                      </div>
                    </Card>
                  ))
                }
              </TabsContent>
            )) }
          </Tabs>
        </div>
        <Footer />
      </div>

      { showModal && detailRes && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h3 className="text-lg font-semibold">예약 상세 정보</h3>
              <Button variant="ghost" size="sm" onClick={()=>setShowModal(false)}><X/></Button>
            </div>
            <div className="p-4 space-y-2">
              <p><strong>공연명:</strong> {detailRes.title}</p>
              <p><strong>장소:</strong> {detailRes.venue}</p>
              <p><strong>날짜:</strong> {detailRes.date} {detailRes.time}</p>
              <p><strong>좌석:</strong> {detailRes.seats}</p>
              <p><strong>예약번호:</strong> {detailRes.reservationNumber}</p>
              <p><strong>결제방법:</strong> {detailRes.paymentMethod}</p>
              <p><strong>예약일:</strong> {detailRes.bookingDate}</p>
            </div>
            <div className="p-4 text-right border-t">
              <Button onClick={()=>setShowModal(false)}>닫기</Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}