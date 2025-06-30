'use client'

import Image from "next/image"
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useParams, useRouter } from "next/navigation"

interface Schedule {
  id: number
  showDate: string
  showTime: string
}

interface Event {
  id: number
  title: string
  description: string
  venue: string
  startDate: string
  endDate: string
  eventCategory: string
  posterImageUrl: string
  runtime: number
  ageLimit: number
  rating: number
  reviewCount: number
  schedules: Schedule[]
}

const categoryMap: Record<string, string> = {
  CONCERT: "콘서트",
  MUSICAL: "뮤지컬",
  PLAY: "연극",
}

const categoryClassMap: Record<string, string> = {
  CONCERT: "bg-blue-100 text-blue-800",
  PLAY: "bg-red-100 text-red-800",
  MUSICAL: "bg-yellow-100 text-yellow-800",
}

type BookingCalendarProps = {
  selected: string | null
  onSelect: (d: string) => void
  schedules: Schedule[]
}

function BookingCalendar({ selected, onSelect, schedules }: BookingCalendarProps) {
  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const dates: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ]

  const formatDate = (day: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

  const isAvailable = (day: number) => {
    const dateStr = formatDate(day)
    return schedules.some(sch => sch.showDate === dateStr)
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <button onClick={() => {
          if (month === 0) {
            setMonth(11);
            setYear(y => y - 1)
          } else setMonth(m => m - 1)
        }}><ChevronLeft /></button>
        <strong>{year}. {String(month + 1).padStart(2, "0")}</strong>
        <button onClick={() => {
          if (month === 11) {
            setMonth(0);
            setYear(y => y + 1)
          } else setMonth(m => m + 1)
        }}><ChevronRight /></button>
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
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!eventId) return

      try {
        setIsLoading(true)
        const response = await fetch(`http://localhost:8080/api/v1/event/${eventId}`)

        if (!response.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.')
        }

        const data: Event = await response.json()
        setEvent(data)

      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const times = selectedDate
    ? (event?.schedules ?? [])
      .filter(sch => sch.showDate === selectedDate)
      .map(sch => sch.showTime)
    : []

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || !event) return
    setLoading(true);
    const queryParams = new URLSearchParams({
      date: selectedDate,
      time: selectedTime
    }).toString()
    router.push(`/booking/${event.id}?${queryParams}`)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] flex items-center justify-center">
          <div className="text-white text-center p-4 bg-red-800 rounded-lg">
            <p className="mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              다시 시도
            </button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  if (!event) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Image
              src={event.posterImageUrl}
              alt={event.title}
              width={400}
              height={533}
              className="rounded-lg object-cover w-full"
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div>
                <Badge variant="secondary" className={categoryClassMap[event.eventCategory]}>
                  {categoryMap[event.eventCategory]}
                </Badge>
              <h1 className="text-3xl font-bold mt-2">{event.title}</h1>
              <p className="text-gray-600 mt-1">{event.description}</p>
            </div>
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" /><span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" /><span>{event.startDate} ~ {event.endDate}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="w-4 h-4" /><span>{event.runtime}분</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" /><span>{event.ageLimit === 0 ? '전체이용가' : `${event.ageLimit}세 이상`}</span>
              </div>
            </Card>
          </div>
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
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
                schedules={event.schedules ?? []}
              />
              {selectedDate && (
                <div className="mt-4 border-t pt-4 space-y-2">
                  <h4 className="text-lg font-semibold">회차</h4>
                  {times.length > 0 ? (
                    times.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedTime(t)}
                        className={`w-full text-center font-semibold px-4 py-2 rounded mb-2 ${
                          selectedTime === t ? 'bg-blue-600 text-white' : 'border border-blue-500 text-blue-600 hover:bg-blue-50'
                        }`}
                      >{`${idx + 1}회 ${t.slice(0, 5)}`}</button>
                    ))
                  ) : (
                    <p className="text-center text-gray-500">선택 가능한 회차가 없습니다.</p>
                  )}
                </div>
              )}
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">예매하기</h3>
              <Button
                onClick={handleBook}
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full text-lg font-semibold py-3 disabled:bg-gray-300"
              >
                {loading ? '예매 중...' : '예매하기'}
              </Button>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}