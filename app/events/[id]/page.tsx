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

interface Review {
  id: number
  content: string
  rating: number
  memberName: string
}

interface ReviewData {
  reviewCount: number
  averageRating: number
  totalPages: number
  currentPage: number
  reviews: Review[]
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

function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function ReviewSection({ eventId }: { eventId: number }) {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchReviews = async (page: number = 1) => {
    try {
      setIsLoading(true)

      const response = await fetch(`/api/v1/reviews/${eventId}?page=${page}&limit=10`)

      if (!response.ok) {
        throw new Error('리뷰 데이터를 가져오는데 실패했습니다.')
      }

      const data: ReviewData = await response.json()
      setReviewData(data)
      setCurrentPage(data.currentPage)

    } catch (err) {
      console.error('리뷰 데이터 로딩 오류:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews(1)
  }, [eventId])

  const loadPageReviews = (page: number) => {
    fetchReviews(page)
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </Card>
    )
  }

  if (!reviewData) {
    return (
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">리뷰</h3>
        <p className="text-gray-500 text-center py-8">리뷰 정보를 불러올 수 없습니다.</p>
      </Card>
    )
  }

  // 페이지네이션 버튼 생성
  const renderPagination = () => {
    if (!reviewData || reviewData.totalPages <= 1) return null

    const totalPages = reviewData.totalPages
    const current = reviewData.currentPage
    const delta = 2 // 현재 페이지 앞뒤로 보여줄 페이지 수

    let pages: (number | string)[] = []

    // 첫 페이지
    if (current > delta + 1) {
      pages.push(1)
      if (current > delta + 2) {
        pages.push('...')
      }
    }

    // 현재 페이지 주변
    for (let i = Math.max(1, current - delta); i <= Math.min(totalPages, current + delta); i++) {
      pages.push(i)
    }

    // 마지막 페이지
    if (current < totalPages - delta) {
      if (current < totalPages - delta - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }

    return (
      <div className="flex justify-center items-center gap-2 mt-6 pt-4 border-t">
        <button
          onClick={() => loadPageReviews(current - 1)}
          disabled={current === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          이전
        </button>

        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && loadPageReviews(page)}
            disabled={typeof page !== 'number'}
            className={`px-3 py-1 text-sm rounded ${
              page === current
                ? 'bg-blue-600 text-white'
                : typeof page === 'number'
                  ? 'border hover:bg-gray-50'
                  : 'cursor-default'
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => loadPageReviews(current + 1)}
          disabled={current === totalPages}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          다음
        </button>
      </div>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">리뷰</h3>
        <div className="flex items-center gap-2">
          <StarRating rating={Math.round(reviewData.averageRating)} size="md" />
          <span className="text-lg font-semibold">{reviewData.averageRating.toFixed(1)}</span>
          <span className="text-gray-500">({reviewData.reviewCount.toLocaleString()}개)</span>
        </div>
      </div>

      {reviewData.reviews.length === 0 ? (
        <p className="text-gray-500 text-center py-8">아직 리뷰가 없습니다.</p>
      ) : (
        <div className="space-y-4">
          {reviewData.reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
              <div className="flex items-center gap-2 mb-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-gray-600">{review.rating}.0</span>
                <span className="text-sm text-gray-500 font-medium">{review.memberName}</span>
              </div>
              <p className="text-gray-700">{review.content}</p>
            </div>
          ))}

          {/* 페이지네이션 */}
          {renderPagination()}
        </div>
      )}
    </Card>
  )
}

export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [reviewData, setReviewData] = useState<ReviewData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const eventId = Array.isArray(params.id) ? params.id[0] : params.id;
      if (!eventId) return

      try {
        setIsLoading(true)

        // 이벤트 정보와 리뷰 정보를 병렬로 가져오기
        const [eventResponse, reviewResponse] = await Promise.all([
          fetch(`/api/v1/event/${eventId}`),
          fetch(`/api/v1/reviews/${eventId}`)
        ])

        if (!eventResponse.ok) {
          throw new Error('데이터를 가져오는데 실패했습니다.')
        }

        const eventData: Event = await eventResponse.json()

        // 리뷰 데이터가 성공적으로 로드되면 이벤트 정보에 추가
        if (reviewResponse.ok) {
          const reviewData: ReviewData = await reviewResponse.json()
          setReviewData(reviewData)
          // 이벤트 객체에 리뷰 정보 추가
          eventData.rating = reviewData.averageRating
          eventData.reviewCount = reviewData.reviewCount
        }

        setEvent(eventData)

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

              {/* 평점 정보 추가 */}
              {reviewData && (
                <div className="flex items-center gap-2 mt-3">
                  <StarRating rating={Math.round(5)} size="md" />
                  <span className="text-lg font-semibold">{reviewData.averageRating.toFixed(1)}</span>
                  <span className="text-gray-500">(1000 개 리뷰)</span>
                </div>
              )}
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

        {/* 리뷰 섹션 추가 */}
        <div className="mt-12">
          <ReviewSection eventId={event.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}