'use client'

import Image from "next/image"
import {Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, Star} from "lucide-react"
import {useState} from "react"

import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Badge} from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {useRouter} from "next/navigation";

// 더미 API 경로: /api/book

const eventData = {
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
  category: "뮤지컬",
  description: "아프리카 대초원을 배경으로 펼쳐지는 디즈니의 대표작 라이온킹이 뮤지컬로 찾아옵니다.",
  schedules: [
    {date: '2025-06-15', time: '14:00', available: true},
    {date: '2025-06-15', time: '19:00', available: true},
    {date: '2025-06-16', time: '14:00', available: true},
    {date: '2025-06-16', time: '19:00', available: true},
    {date: '2025-06-17', time: '19:00', available: true},
    {date: '2025-06-18', time: '14:00', available: true},
    {date: '2025-06-18', time: '19:00', available: true},
  ]
}

type BookingCalendarProps = {
  selected: string | null
  onSelect: (d: string) => void
}

function BookingCalendar({selected, onSelect}: BookingCalendarProps) {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates: (number | null)[] = [
    ...Array.from({length: firstDay}, () => null),
    ...Array.from({length: daysInMonth}, (_, i) => i + 1)
  ]

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const isAvailable = (day: number) => {
    const dateStr = formatDate(day)
    return eventData.schedules.some(
      sch => sch.date === dateStr && sch.available
    )
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => {
          if (month === 0) {
            setMonth(11);
            setYear(y => y - 1)
          } else setMonth(m => m - 1)
        }}><ChevronLeft/></button>
        <strong>{year}. {String(month + 1).padStart(2, "0")}</strong>
        <button onClick={() => {
          if (month === 11) {
            setMonth(0);
            setYear(y => y + 1)
          } else setMonth(m => m + 1)
        }}><ChevronRight/></button>
      </div>
      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {['일', '월', '화', '수', '목', '금', '토'].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-sm">
        {dates.map((d, idx) => {
          const day = d
          const dateStr = day !== null ? formatDate(day) : null
          const available = day !== null && isAvailable(day)
          const isActive = day !== null && selected === dateStr
          const hoverClass = available && !isActive ? "hover:bg-gray-100" : ""

          return (
            <button
              key={idx}
              disabled={!available}
              onClick={() => day !== null && available && onSelect(dateStr!)}
              className={
                `aspect-square rounded text-center ` +
                `${available ? "text-black" : "text-gray-300"} ` +
                `${hoverClass} ` +
                `${isActive ? "bg-blue-600 text-white font-bold" : ""}`
              }
            >{day || ''}</button>
          )
        })}
      </div>
    </div>
  )
}

export default function ProductPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // 변경: eventData.schedule → eventData.schedules
  const times = selectedDate
    ? eventData.schedules
      .filter(sch => sch.date === selectedDate && sch.available)
      .map(sch => sch.time)
    : []

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return
    const params = new URLSearchParams({
      date: selectedDate,
      time: selectedTime
    }).toString()
    router.push(`/booking/${eventData.id}?${params}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header/>
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Image
              src={eventData.poster}
              alt={eventData.title}
              width={400}
              height={533}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Badge className="bg-red-100 text-red-800">{eventData.category}</Badge>
              <h1 className="text-3xl font-bold mt-2">{eventData.title}</h1>
              <p className="text-gray-600 mt-1">{eventData.subtitle}</p>
              <div className="flex items-center gap-1 mt-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400"/>
                <span className="font-semibold">{eventData.rating}</span>
                <span className="text-gray-600">({eventData.reviewCount})</span>
              </div>
            </div>
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4"/><span>{eventData.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4"/><span>{eventData.period}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4"/><span>{eventData.runtime}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4"/><span>{eventData.ageLimit}</span>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              {/* 관람일 헤더에 선택한 날짜 표시 */}
              <h3 className="flex items-baseline justify-between font-semibold text-lg mb-4">
                <span>관람일</span>
                {selectedDate && (
                  <span className="text-black">{selectedDate.replace(/-/g, '.')}</span>
                )}
              </h3>
              <BookingCalendar
                selected={selectedDate}
                onSelect={(d) => {
                  setSelectedDate(d);
                  setSelectedTime(null);
                }}
              />
              {selectedDate && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <h4 className="text-lg font-semibold">회차</h4>
                  {times.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTime(t)}
                      className={`w-full text-center font-semibold px-4 py-2 rounded mb-2 ${
                        selectedTime === t ? 'bg-blue-600 text-white' : 'border border-blue-500 text-blue-600'
                      }`}
                    >{`${idx + 1}회 ${t}`}</button>
                  ))}
                </div>
              )}
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">예매하기</h3>
              <Button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full text-lg font-semibold py-3"
              >
                {loading ? '예매 중...' : '예매하기'}
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer/>
    </div>
  )
}
