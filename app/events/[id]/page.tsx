'use client'

import Image from "next/image"
import { Calendar, MapPin, Clock, Users, ChevronLeft, ChevronRight, Star } from "lucide-react"
import { useEffect, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useParams, useRouter } from "next/navigation"

// Types
interface Schedule {
  id: number
  showDate: string
  showTime: string
}

interface Review {
  id: number
  content: string
  rating: number
  author: string
  createdAt: string
}

interface ReviewDetail {
  averageRating: number
  reviewCount: number
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

// Constants
const CATEGORY_MAP: Record<string, string> = {
  CONCERT: "콘서트",
  MUSICAL: "뮤지컬",
  PLAY: "연극",
}

const CATEGORY_CLASS_MAP: Record<string, string> = {
  CONCERT: "bg-blue-100 text-blue-800",
  PLAY: "bg-red-100 text-red-800",
  MUSICAL: "bg-yellow-100 text-yellow-800",
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

// Utility functions
const formatDate = (year: number, month: number, day: number): string =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatTimeDisplay = (time: string): string => time.slice(0, 5)

// Components
interface BookingCalendarProps {
  selected: string | null
  onSelect: (date: string) => void
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

  const isAvailable = useCallback((day: number): boolean => {
    const dateStr = formatDate(year, month, day)
    return schedules.some(schedule => schedule.showDate === dateStr)
  }, [year, month, schedules])

  const handlePrevMonth = () => {
    if (month === 0) {
      setMonth(11)
      setYear(prev => prev - 1)
    } else {
      setMonth(prev => prev - 1)
    }
  }

  const handleNextMonth = () => {
    if (month === 11) {
      setMonth(0)
      setYear(prev => prev + 1)
    } else {
      setMonth(prev => prev + 1)
    }
  }

  const handleDateSelect = (day: number) => {
    const dateStr = formatDate(year, month, day)
    if (isAvailable(day)) {
      onSelect(dateStr)
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={handlePrevMonth}
          className="p-1 hover:bg-gray-200 rounded"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="font-semibold text-lg">
          {year}. {String(month + 1).padStart(2, "0")}
        </h3>
        <button
          onClick={handleNextMonth}
          className="p-1 hover:bg-gray-200 rounded"
          aria-label="다음 달"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-sm text-gray-500 mb-2">
        {WEEKDAYS.map(day => (
          <div key={day} className="py-1">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-sm">
        {dates.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="aspect-square" />
          }

          const dateStr = formatDate(year, month, day)
          const available = isAvailable(day)
          const isActive = selected === dateStr

          return (
            <button
              key={day}
              disabled={!available}
              onClick={() => handleDateSelect(day)}
              className={`
                aspect-square rounded text-center transition-colors
                ${available
                ? 'text-black hover:bg-gray-100 cursor-pointer'
                : 'text-gray-300 cursor-not-allowed'
              }
                ${isActive ? 'bg-blue-600 text-white font-bold hover:bg-blue-700' : ''}
              `}
              aria-label={`${year}년 ${month + 1}월 ${day}일 ${available ? '예약 가능' : '예약 불가'}`}
            >
              {day}
            </button>
          )
        })}
      </div>
    </div>
  )
}

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating}점 평점`}>
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

interface ReviewSectionProps {
  eventId: number
}

function ReviewSection({ eventId }: ReviewSectionProps) {
  const [reviewInfo, setReviewInfo] = useState<ReviewDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/v1/reviews/events/${eventId}`)
      if (!response.ok) {
        throw new Error('리뷰 데이터를 가져오는데 실패했습니다.')
      }

      const data: ReviewDetail = await response.json()
      setReviewInfo(data)
    } catch (err) {
      console.error('리뷰 데이터 로딩 오류:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchReviews()
  }, [fetchReviews])

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">리뷰</h2>
      <Card className="p-6">
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchReviews} variant="outline" size="sm">
              다시 시도
            </Button>
          </div>
        ) : !reviewInfo || reviewInfo.reviewCount === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 리뷰가 없습니다.</p>
        ) : (
          <>
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold">{reviewInfo.averageRating.toFixed(1)}</span>
              </div>
              <div className="text-gray-600">
                총 {reviewInfo.reviewCount.toLocaleString()}개의 리뷰
              </div>
            </div>
            <div className="space-y-6">
              {reviewInfo.reviews.map((review) => (
                <article key={review.id} className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {/* You can add user avatars here if available */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                      {review.author.charAt(0)}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{review.author}</p>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <StarRating rating={review.rating} size="sm" />
                          <span>·</span>
                          <time dateTime={review.createdAt}>
                            {formatDisplayDate(review.createdAt)}
                          </time>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{review.content}</p>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

interface LoadingSpinnerProps {
  message?: string
}

function LoadingSpinner({ message = "데이터를 불러오는 중..." }: LoadingSpinnerProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      </section>
      <Footer />
    </div>
  )
}

interface ErrorDisplayProps {
  error: string
  onRetry: () => void
}

function ErrorDisplay({ error, onRetry }: ErrorDisplayProps) {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <section className="relative h-[500px] flex items-center justify-center">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
          <p className="text-red-600 mb-4">⚠️ {error}</p>
          <Button onClick={onRetry} variant="outline">
            다시 시도
          </Button>
        </div>
      </section>
      <Footer />
    </div>
  )
}

// Main component
export default function ProductPage() {
  const router = useRouter()
  const params = useParams()
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const eventId = Array.isArray(params.id) ? params.id[0] : params.id

  const fetchEventData = useCallback(async () => {
    if (!eventId) return

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/v1/event/${eventId}`)
      if (!response.ok) {
        throw new Error('이벤트 데이터를 가져오는데 실패했습니다.')
      }

      const eventData: Event = await response.json()
      setEvent(eventData)
    } catch (err) {
      console.error('이벤트 데이터 로딩 오류:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchEventData()
  }, [fetchEventData])

  const availableTimes = selectedDate && event
    ? event.schedules
      .filter(schedule => schedule.showDate === selectedDate)
      .map(schedule => schedule.showTime)
    : []

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedTime(null) // Reset selected time when date changes
  }

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !event) return

    setLoading(true)
    try {
      const queryParams = new URLSearchParams({
        date: selectedDate,
        time: selectedTime
      }).toString()

      router.push(`/booking/${event.id}?${queryParams}`)
    } catch (err) {
      console.error('예매 페이지 이동 오류:', err)
      setLoading(false)
    }
  }

  const getAgeDisplay = (ageLimit: number): string =>
    ageLimit === 0 ? '전체이용가' : `${ageLimit}세 이상`

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (error) {
    return <ErrorDisplay error={error} onRetry={fetchEventData} />
  }

  if (!event) {
    return <LoadingSpinner message="이벤트 정보를 찾을 수 없습니다." />
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poster Image */}
          <div className="lg:col-span-1">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src={event.posterImageUrl}
                alt={`${event.title} 포스터`}
                fill
                className="rounded-lg object-cover"
                priority
              />
            </div>
          </div>

          {/* Event Information */}
          <div className="lg:col-span-1 space-y-6">
            <div>
              <Badge
                variant="secondary"
                className={CATEGORY_CLASS_MAP[event.eventCategory]}
              >
                {CATEGORY_MAP[event.eventCategory]}
              </Badge>
              <h1 className="text-3xl font-bold mt-2 mb-2">{event.title}</h1>
              <p className="text-gray-600 leading-relaxed">{event.description}</p>
            </div>

            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-3 text-gray-700">
                <MapPin className="w-5 h-5 text-gray-500" />
                <span>{event.venue}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Calendar className="w-5 h-5 text-gray-500" />
                <span>{event.startDate} ~ {event.endDate}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Clock className="w-5 h-5 text-gray-500" />
                <span>{event.runtime}분</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Users className="w-5 h-5 text-gray-500" />
                <span>{getAgeDisplay(event.ageLimit)}</span>
              </div>
            </Card>
          </div>

          {/* Booking Section */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-semibold text-lg">관람일 선택</h3>
                {selectedDate && (
                  <span className="text-blue-600 font-medium">
                    {selectedDate.replace(/-/g, '.')}
                  </span>
                )}
              </div>

              <BookingCalendar
                selected={selectedDate}
                onSelect={handleDateSelect}
                schedules={event.schedules}
              />

              {selectedDate && (
                <div className="mt-6 pt-4 border-t">
                  <h4 className="font-semibold text-lg mb-3">시간 선택</h4>
                  {availableTimes.length > 0 ? (
                    <div className="space-y-2">
                      {availableTimes.map((time, idx) => (
                        <button
                          key={`${time}-${idx}`}
                          onClick={() => setSelectedTime(time)}
                          className={`
                            w-full px-4 py-3 rounded-lg font-medium transition-colors
                            ${selectedTime === time
                            ? 'bg-blue-600 text-white'
                            : 'border border-blue-500 text-blue-600 hover:bg-blue-50'
                          }
                          `}
                        >
                          {`${idx + 1}회 ${formatTimeDisplay(time)}`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-4">
                      선택 가능한 시간이 없습니다.
                    </p>
                  )}
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">예매하기</h3>
              <Button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || loading}
                className="w-full text-lg font-semibold py-3"
                size="lg"
              >
                {loading ? '예매 처리 중...' : '예매하기'}
              </Button>
            </Card>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12">
          <ReviewSection eventId={event.id} />
        </div>
      </main>
      <Footer />
    </div>
  )
}