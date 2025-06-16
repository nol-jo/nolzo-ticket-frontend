"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Clock, MapPin, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface BookingPageProps {
  params: {
    id: string
  }
}

interface ShowTime {
  time: string
  available: boolean
  soldOut?: boolean
}

interface CalendarDate {
  date: number
  fullDate: string
  isToday: boolean
  isSelected: boolean
  isDisabled: boolean
  showTimes: ShowTime[]
}

interface Seat {
  id: string
  row: string
  number: number
  section: string
  floor: number
  price: number
  status: "available" | "selected" | "occupied" | "disabled"
  x: number
  y: number
}

// 상품 정보 (실제로는 API에서 가져올 데이터)
const productInfo = {
  1: {
    title: "뮤지컬 라이온킹",
    venue: "샬롯데씨어터",
    poster: "/images/poster1.png",
    runtime: "150분",
    ageLimit: "8세 이상",
  },
  2: {
    title: "BTS 월드투어",
    venue: "잠실올림픽주경기장",
    poster: "/images/poster2.png",
    runtime: "180분",
    ageLimit: "전체관람가",
  },
}

export default function BookingPage({ params }: BookingPageProps) {
  const router = useRouter()
  const productId = Number.parseInt(params.id, 10)
  const product = productInfo[productId as keyof typeof productInfo] || productInfo[1]

  const [currentStep, setCurrentStep] = useState<"datetime" | "seats">("datetime")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([])
  const [seats, setSeats] = useState<Seat[]>([])
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([])
  const [ticketCount, setTicketCount] = useState<number>(1)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // 로그인 상태 확인 useEffect 추가 (기존 useEffect들 위에)
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true"
      setIsLoggedIn(loggedIn)
      setIsCheckingAuth(false)

      if (!loggedIn) {
        const currentPath = window.location.pathname + window.location.search
        router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
      }
    }

    checkAuthStatus()
  }, [router])

  // 캘린더 데이터 생성
  useEffect(() => {
    const generateCalendarDates = () => {
      const dates: CalendarDate[] = []
      const today = new Date()
      const year = currentDate.getFullYear()
      const month = currentDate.getMonth()

      // 이번 달의 첫 날과 마지막 날
      const firstDay = new Date(year, month, 1)
      const lastDay = new Date(year, month + 1, 0)

      // 이번 달의 첫 주 시작일 (일요일부터)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())

      // 6주간의 날짜 생성 (42일)
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + i)

        const isCurrentMonth = date.getMonth() === month
        const isToday = date.toDateString() === today.toDateString()
        const isPast = date < today
        const fullDateString = date.toISOString().split("T")[0]

        // 샘플 공연 시간 데이터
        const showTimes: ShowTime[] =
          isCurrentMonth && !isPast
            ? [
                { time: "14:00", available: true },
                { time: "19:00", available: true },
                { time: "19:30", available: false, soldOut: true },
              ]
            : []

        dates.push({
          date: date.getDate(),
          fullDate: fullDateString,
          isToday,
          isSelected: selectedDate === fullDateString,
          isDisabled: !isCurrentMonth || isPast,
          showTimes,
        })
      }

      setCalendarDates(dates)
    }

    generateCalendarDates()
  }, [currentDate, selectedDate])

  // 좌석 데이터 생성
  useEffect(() => {
    const generateSeats = () => {
      const seatData: Seat[] = []

      // 1층 좌석 (VIP, R석)
      const floor1Sections = [
        { name: "VIP", rows: ["A", "B", "C"], seatsPerRow: 20, price: 190000, floor: 1 },
        { name: "R", rows: ["D", "E", "F", "G", "H", "I", "J", "K", "L"], seatsPerRow: 24, price: 160000, floor: 1 },
      ]

      // 2층 좌석 (S석)
      const floor2Sections = [
        { name: "S", rows: ["A", "B", "C", "D", "E", "F"], seatsPerRow: 26, price: 130000, floor: 2 },
      ]

      // 3층 좌석 (A석)
      const floor3Sections = [
        { name: "A", rows: ["A", "B", "C", "D", "E", "F"], seatsPerRow: 28, price: 80000, floor: 3 },
      ]

      const allSections = [...floor1Sections, ...floor2Sections, ...floor3Sections]

      allSections.forEach((section) => {
        section.rows.forEach((row, rowIndex) => {
          for (let i = 1; i <= section.seatsPerRow; i++) {
            const isOccupied = Math.random() < 0.2 // 20% 확률로 이미 예약된 좌석
            seatData.push({
              id: `${section.floor}F-${row}${i}`,
              row,
              number: i,
              section: section.name,
              floor: section.floor,
              price: section.price,
              status: isOccupied ? "occupied" : "available",
              x: i,
              y: rowIndex,
            })
          }
        })
      })

      setSeats(seatData)
    }

    if (currentStep === "seats") {
      generateSeats()
    }
  }, [currentStep])

  const handleDateSelect = (dateInfo: CalendarDate) => {
    if (dateInfo.isDisabled) return
    setSelectedDate(dateInfo.fullDate)
    setSelectedTime(null)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const handleSeatClick = (seat: Seat) => {
    if (seat.status === "occupied" || seat.status === "disabled") return

    const isSelected = selectedSeats.find((s) => s.id === seat.id)

    if (isSelected) {
      // 선택 해제
      setSelectedSeats(selectedSeats.filter((s) => s.id !== seat.id))
      setSeats(seats.map((s) => (s.id === seat.id ? { ...s, status: "available" } : s)))
    } else {
      // ticketCount만큼만 선택 가능
      if (selectedSeats.length < ticketCount) {
        setSelectedSeats([...selectedSeats, seat])
        setSeats(seats.map((s) => (s.id === seat.id ? { ...s, status: "selected" } : s)))
      }
    }
  }

  const handleNextStep = () => {
    if (currentStep === "datetime" && selectedDate && selectedTime && ticketCount > 0) {
      setCurrentStep("seats")
      // Scroll to top when moving to seats selection
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  const handleBooking = async () => {
    // 로그인 상태 재확인
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (!loggedIn) {
      const currentPath = window.location.pathname + window.location.search
      router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
      return
    }

    if (selectedSeats.length > 0) {
      // 예매 완료 처리
      alert(
        `예매가 완료되었습니다!\n\n공연: ${product.title}\n날짜: ${selectedDate}\n시간: ${selectedTime}\n좌석: ${selectedSeats.map((s) => s.id).join(", ")}\n총 금액: ${totalPrice.toLocaleString()}원`,
      )
      router.push("/my-reservations")
    }
  }

  const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"]

  const selectedDateInfo = calendarDates.find((d) => d.fullDate === selectedDate)
  const totalPrice = selectedSeats.reduce((sum, seat) => sum + seat.price, 0)

  const getSeatColor = (seat: Seat) => {
    if (seat.status === "selected") return "bg-blue-500 border-blue-600 text-white"
    if (seat.status === "occupied") return "bg-gray-400 border-gray-500 cursor-not-allowed"

    switch (seat.section) {
      case "VIP":
        return "bg-purple-200 hover:bg-purple-300 border-purple-400"
      case "R":
        return "bg-green-200 hover:bg-green-300 border-green-400"
      case "S":
        return "bg-blue-200 hover:bg-blue-300 border-blue-400"
      case "A":
        return "bg-orange-200 hover:bg-orange-300 border-orange-400"
      default:
        return "bg-gray-200"
    }
  }

  const groupedSeats = seats.reduce(
    (acc, seat) => {
      const key = `${seat.floor}F`
      if (!acc[key]) acc[key] = {}
      if (!acc[key][seat.row]) acc[key][seat.row] = []
      acc[key][seat.row].push(seat)
      return acc
    },
    {} as Record<string, Record<string, Seat[]>>,
  )

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 상태를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // 리다이렉트 중이므로 아무것도 렌더링하지 않음
  }

  if (currentStep === "datetime") {
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
              <span className="text-gray-900">예매하기</span>
            </div>
          </div>
        </nav>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* 상품 정보 헤더 */}
          <Card className="p-6 mb-8">
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
                    <span>{product.runtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>{product.ageLimit}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 캘린더 */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">날짜 선택</h2>
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-lg font-medium">
                      {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </span>
                    <Button variant="ghost" size="sm" onClick={handleNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {dayNames.map((day, index) => (
                    <div
                      key={day}
                      className={`text-center text-sm font-medium py-2 ${
                        index === 0 ? "text-red-500" : index === 6 ? "text-blue-500" : "text-gray-700"
                      }`}
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* 캘린더 그리드 */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDates.map((dateInfo, index) => (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(dateInfo)}
                      disabled={dateInfo.isDisabled}
                      className={`
                        aspect-square p-2 text-sm rounded-lg transition-colors relative
                        ${dateInfo.isDisabled ? "text-gray-300 cursor-not-allowed" : "hover:bg-blue-50 cursor-pointer"}
                        ${
                          dateInfo.isSelected
                            ? "bg-blue-600 text-white"
                            : dateInfo.isToday
                              ? "bg-blue-100 text-blue-600 font-semibold"
                              : "text-gray-700"
                        }
                        ${index % 7 === 0 && !dateInfo.isDisabled ? "text-red-500" : ""}
                        ${index % 7 === 6 && !dateInfo.isDisabled ? "text-blue-500" : ""}
                      `}
                    >
                      {dateInfo.date}
                      {dateInfo.showTimes.length > 0 && !dateInfo.isDisabled && (
                        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                          <div className="w-1 h-1 bg-orange-400 rounded-full"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* 시간 선택 */}
              {selectedDateInfo && selectedDateInfo.showTimes.length > 0 && (
                <Card className="p-6 mt-6">
                  <h3 className="text-lg font-semibold mb-4">시간 선택</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {selectedDateInfo.showTimes.map((showTime) => (
                      <Button
                        key={showTime.time}
                        variant={selectedTime === showTime.time ? "default" : "outline"}
                        disabled={!showTime.available}
                        onClick={() => handleTimeSelect(showTime.time)}
                        className={`
                          ${!showTime.available ? "opacity-50 cursor-not-allowed" : ""}
                          ${selectedTime === showTime.time ? "bg-blue-600 text-white" : ""}
                        `}
                      >
                        {showTime.time}
                        {showTime.soldOut && (
                          <Badge variant="destructive" className="ml-2 text-xs">
                            매진
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* 예매 정보 */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="text-lg font-semibold mb-4">예매 정보</h3>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-gray-600">선택한 날짜</label>
                    <p className="font-medium">
                      {selectedDate
                        ? new Date(selectedDate).toLocaleDateString("ko-KR", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            weekday: "short",
                          })
                        : "날짜를 선택해주세요"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">선택한 시간</label>
                    <p className="font-medium">{selectedTime || "시간을 선택해주세요"}</p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-600">매수 선택</label>
                    <div className="flex items-center space-x-2 mt-1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                        disabled={ticketCount <= 1}
                      >
                        -
                      </Button>
                      <span className="font-medium px-3">{ticketCount}매</span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTicketCount(Math.min(4, ticketCount + 1))}
                        disabled={ticketCount >= 4}
                      >
                        +
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">최대 4매까지 선택 가능</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="text-sm text-gray-600 mb-2">예매 단계</div>
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs">
                        1
                      </div>
                      <span className="text-sm">날짜/시간 선택</span>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full mt-6"
                  disabled={!selectedDate || !selectedTime || ticketCount === 0}
                  onClick={handleNextStep}
                >
                  좌석 선택하기
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">다음 단계에서 좌석과 가격을 선택할 수 있습니다</p>
                </div>
              </Card>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  // 좌석 선택 화면
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* 상단 헤더 */}
      <div className="bg-red-600 text-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white text-red-600 px-3 py-1 rounded font-bold text-sm">02</div>
              <span className="font-semibold">좌석 선택</span>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <span>다른 관람일자 선택 :</span>
              <Select value={selectedDate || ""}>
                <SelectTrigger className="w-40 bg-white text-black">
                  <SelectValue placeholder="날짜 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedDate || ""}>{selectedDate}</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedTime || ""}>
                <SelectTrigger className="w-32 bg-white text-black">
                  <SelectValue placeholder="시간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={selectedTime || ""}>{selectedTime}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 좌석 배치도 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg p-6">
              {/* 무대 */}
              <div className="text-center mb-8">
                <div className="bg-gray-700 text-white py-3 px-12 rounded-lg inline-block text-lg font-semibold">
                  STAGE
                </div>
              </div>

              {/* 1층 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">객석1층</h3>
                <div className="space-y-2">
                  {Object.entries(groupedSeats["1F"] || {}).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center justify-center space-x-1">
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                      <div className="flex space-x-1">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === "occupied"}
                            className={`
                              w-5 h-5 text-xs border rounded transition-colors
                              ${getSeatColor(seat)}
                            `}
                            title={`${seat.id} - ${seat.price.toLocaleString()}원`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sound Console Booth */}
              <div className="text-center mb-8">
                <div className="bg-gray-500 text-white py-2 px-8 rounded inline-block text-sm">SOUND CONSOLE BOOTH</div>
              </div>

              {/* 2층 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">객석2층</h3>
                <div className="space-y-2">
                  {Object.entries(groupedSeats["2F"] || {}).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center justify-center space-x-1">
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                      <div className="flex space-x-1">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === "occupied"}
                            className={`
                              w-5 h-5 text-xs border rounded transition-colors
                              ${getSeatColor(seat)}
                            `}
                            title={`${seat.id} - ${seat.price.toLocaleString()}원`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3층 */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-center">객석3층</h3>
                <div className="space-y-2">
                  {Object.entries(groupedSeats["3F"] || {}).map(([row, rowSeats]) => (
                    <div key={row} className="flex items-center justify-center space-x-1">
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                      <div className="flex space-x-1">
                        {rowSeats.map((seat) => (
                          <button
                            key={seat.id}
                            onClick={() => handleSeatClick(seat)}
                            disabled={seat.status === "occupied"}
                            className={`
                              w-5 h-5 text-xs border rounded transition-colors
                              ${getSeatColor(seat)}
                            `}
                            title={`${seat.id} - ${seat.price.toLocaleString()}원`}
                          >
                            {seat.number}
                          </button>
                        ))}
                      </div>
                      <div className="w-8 text-center text-sm font-medium text-gray-600">{row}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 우측 정보 패널 */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* 좌석등급/잔여석 */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4 flex items-center justify-between">
                  좌석등급 / 잔여석
                  <span className="text-sm text-blue-600 cursor-pointer">기타 정보보기 ›</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-purple-400 rounded"></div>
                      <span>VIP석 41석</span>
                    </div>
                    <span className="font-semibold">190,000원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-green-400 rounded"></div>
                      <span>R석 300석</span>
                    </div>
                    <span className="font-semibold">160,000원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-blue-400 rounded"></div>
                      <span>S석 214석</span>
                    </div>
                    <span className="font-semibold">130,000원</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-orange-400 rounded"></div>
                      <span>A석 253석</span>
                    </div>
                    <span className="font-semibold">80,000원</span>
                  </div>
                </div>
              </Card>

              {/* 선택좌석 */}
              <Card className="p-4">
                <h3 className="font-semibold mb-4">선택좌석</h3>
                <div className="text-center text-red-600 mb-4">
                  총 {selectedSeats.length}/{ticketCount}석 선택되었습니다.
                </div>

                {selectedSeats.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-2 gap-4 text-sm font-semibold border-b pb-2">
                      <span>좌석등급</span>
                      <span>좌석번호</span>
                    </div>
                    {selectedSeats.map((seat) => (
                      <div key={seat.id} className="grid grid-cols-2 gap-4 text-sm">
                        <span>{seat.section}석</span>
                        <span>{seat.id}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 text-right">
                      <span className="text-lg font-bold text-red-600">{totalPrice.toLocaleString()}원</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">원하는 좌석의 위치를 선택해주세요.</div>
                )}
              </Card>

              {/* 예매 버튼 */}
              <div className="space-y-3">
                <Button
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-4 text-lg font-semibold"
                  disabled={selectedSeats.length !== ticketCount}
                  onClick={handleBooking}
                >
                  좌석선택완료
                </Button>

                <div className="grid grid-cols-2 gap-2">
                  <Button variant="outline" onClick={() => setCurrentStep("datetime")}>
                    ← 이전단계
                  </Button>
                  <Button variant="outline">좌석 다시 선택</Button>
                </div>
              </div>

              {/* 주의사항 */}
              <div className="text-xs text-gray-500 space-y-1">
                <p>⚠️ 좌석 선택시 유의사항</p>
                <p>• 선택한 매수({ticketCount}매)만큼 좌석을 선택해주세요</p>
                <p>• 선택된 좌석은 10분간 임시 배정됩니다</p>
                <p>• 좌석을 다시 클릭하면 선택이 취소됩니다</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
