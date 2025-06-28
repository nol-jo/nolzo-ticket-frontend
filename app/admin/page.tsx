"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Plus, Edit, Trash2, Save, X, Search, RefreshCw, Calendar, Clock,} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {Dialog, DialogContent, DialogTitle, DialogTrigger,} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Header from "@/components/header"
import Footer from "@/components/footer"
import Image from "next/image"
import {createEvent, deleteEvent, getAllEvents, updateEvent} from "@/lib/events";


export interface Event {
  id: number
  title: string
  venue: string
  description: string
  posterImageUrl?: string
  startDate: string // LocalDate format (YYYY-MM-DD)
  endDate: string   // LocalDate format (YYYY-MM-DD)
  schedules?: Schedule[]
  eventCategory: string // EventCategory enum value
  runtime: number
  ageLimit: number
}

export interface Schedule {
  showDate: string // LocalDate format (YYYY-MM-DD)
  showTime: string // LocalTime format (HH:MM:SS)
}

const initialFormData: Event = {
  id : 0,
  title: "",
  venue: "",
  description: "",
  posterImageUrl: "",
  startDate: "",
  endDate: "",
  eventCategory: "",
  runtime: 0,
  ageLimit: 0,
}

export default function Page() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [apiConnected, setApiConnected] = useState<boolean | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<Event>(initialFormData)
  const [formLoading, setFormLoading] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null)

  // 스케줄 관리를 위한 상태들
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [newScheduleDate, setNewScheduleDate] = useState("")
  const [newScheduleTime, setNewScheduleTime] = useState("")
  const [editingScheduleIndex, setEditingScheduleIndex] = useState<number | null>(null)

  // 초기 데이터 로드
  useEffect(() => {
    loadEvents()
  }, [])

  const showAlert = (type: "success" | "error" | "warning", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const loadEvents = async () => {
    try {
      setLoading(true)
      const apiEvents = await getAllEvents()
      setEvents(apiEvents)
      setApiConnected(true)
    } catch (error) {
      showAlert("error", "API 서버에 연결에 실패했습니다.")
      setApiConnected(false)
    } finally {
      setLoading(false)
    }
  }

  const refreshEvents = async () => {
    await loadEvents()
  }

  const handleInputChange = (field: keyof Event, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // 스케줄 추가
  const addSchedule = () => {
    if (!newScheduleDate || !newScheduleTime) {
      return
    }

    const newSchedule: Schedule = {
      showDate: newScheduleDate,
      showTime: newScheduleTime,
    }

    // 중복 체크
    const isDuplicate = schedules.some(
      (schedule) => schedule.showDate === newSchedule.showDate && schedule.showTime === newSchedule.showTime,
    )

    if (isDuplicate) {
      return
    }

    setSchedules((prev) =>
      [...prev, newSchedule].sort((a, b) => {
        const dateA = new Date(`${a.showDate} ${a.showTime}`)
        const dateB = new Date(`${b.showDate} ${b.showTime}`)
        return dateA.getTime() - dateB.getTime()
      }),
    )

    // 입력 필드 초기화
    setNewScheduleDate("")
    setNewScheduleTime("")
  }

  const cancelEditSchedule = () => {
    setNewScheduleDate("")
    setNewScheduleTime("")
    setEditingScheduleIndex(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      const eventData: Event = {
        id : formData.id,
        title: formData.title,
        venue: formData.venue,
        description: formData.description,
        posterImageUrl: formData.posterImageUrl || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        eventCategory: formData.eventCategory,
        runtime: formData.runtime,
        ageLimit: formData.ageLimit,
        schedules:
          schedules.length > 0
            ? schedules.map((schedule) => ({
                showDate: schedule.showDate,
                showTime: schedule.showTime + ":00", // HH:MM:SS 형식으로 변환
              }))
            : undefined,
      }

      if (editingEvent) {
        if (apiConnected) {
          const updatedEvent = await updateEvent(editingEvent.id, eventData)
          setEvents((prev) => prev.map((event) => (event.id === editingEvent.id ? updatedEvent : event)))
          showAlert("success", "이벤트가 성공적으로 수정되었습니다.")
        }
      } else {
        if (apiConnected) {
          const newEvent = await createEvent(eventData)
          setEvents((prev) => [...prev, newEvent])
          showAlert("success", "새 이벤트가 성공적으로 생성되었습니다.")
        } else {
        }
      }

      setIsDialogOpen(false)
      setEditingEvent(null)
      setFormData(initialFormData)
      setSchedules([])
      setNewScheduleDate("")
      setNewScheduleTime("")
      setEditingScheduleIndex(null)
    } catch (error) {
      showAlert("error", editingEvent ? "이벤트 수정에 실패했습니다." : "이벤트 생성에 실패했습니다.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      id: event.id,
      title: event.title,
      venue: event.venue,
      description: event.description,
      posterImageUrl: event.posterImageUrl || "",
      startDate: event.startDate,
      endDate: event.endDate,
      eventCategory: event.eventCategory,
      runtime: event.runtime,
      ageLimit: event.ageLimit,
    })

    // 스케줄 설정
    setSchedules(
      event.schedules?.map((schedule: Schedule) => ({
        showDate: schedule.showDate,
        showTime: schedule.showTime.substring(0, 5), // HH:MM:SS -> HH:MM
      })) || [],
    )

    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("정말로 이 이벤트를 삭제하시겠습니까?")) return

    setLoading(true)
    try {
      if (apiConnected) {
        await deleteEvent(id)
        setEvents((prev) => prev.filter((event) => event.id !== id))
        showAlert("success", "이벤트가 성공적으로 삭제되었습니다.")
      }
    } catch (error) {
      showAlert("error", "이벤트 삭제에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    setFormData(initialFormData)
    setSchedules([])
    setNewScheduleDate("")
    setNewScheduleTime("")
    setEditingScheduleIndex(null)
    setIsDialogOpen(true)
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || event.eventCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "MUSICAL", "CONCERT", "PLAY"]
  const categoryLabels = {
    all: "모든 카테고리",
    MUSICAL: "뮤지컬",
    CONCERT: "콘서트",
    PLAY: "연극",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-gray-600">공연 및 이벤트를 생성, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleNewEvent} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />새 이벤트 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
              <DialogTitle/>
              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="basic">기본 정보</TabsTrigger>
                    <TabsTrigger value="details">상세 정보</TabsTrigger>
                    <TabsTrigger value="schedules">공연 일정</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">제목 *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) => handleInputChange("title", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue">공연장 *</Label>
                        <Input
                          id="venue"
                          value={formData.venue}
                          onChange={(e) => handleInputChange("venue", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">설명 *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventCategory">카테고리 *</Label>
                        <Select
                          value={formData.eventCategory}
                          onValueChange={(value) => handleInputChange("eventCategory", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="카테고리 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MUSICAL">뮤지컬</SelectItem>
                            <SelectItem value="CONCERT">콘서트</SelectItem>
                            <SelectItem value="PLAY">연극</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="posterImageUrl">포스터 이미지 URL</Label>
                        <Input
                          id="posterImageUrl"
                          value={formData.posterImageUrl}
                          onChange={(e) => handleInputChange("posterImageUrl", e.target.value)}
                          placeholder="https://example.com/poster.jpg"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="startDate">시작일 *</Label>
                        <Input
                          id="startDate"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange("startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">종료일 *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange("endDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="runtime">공연시간 (분) *</Label>
                        <Input
                          id="runtime"
                          type="number"
                          value={formData.runtime}
                          onChange={(e) => handleInputChange("runtime", e.target.value)}
                          placeholder="예: 120"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="ageLimit">관람연령 *</Label>
                        <Input
                          id="ageLimit"
                          type="number"
                          value={formData.ageLimit}
                          onChange={(e) => handleInputChange("ageLimit", e.target.value)}
                          placeholder="예: 8 (0은 전체관람가)"
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="schedules" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <Label className="text-base font-semibold mb-3 block">
                        {editingScheduleIndex !== null ? "공연 일정 수정" : "새 공연 일정 추가"}
                      </Label>
                      <div className="grid grid-cols-4 gap-4 items-end">
                        <div>
                          <Label htmlFor="newScheduleDate">공연일</Label>
                          <Input
                            id="newScheduleDate"
                            type="date"
                            value={newScheduleDate}
                            onChange={(e) => setNewScheduleDate(e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="newScheduleTime">공연시간</Label>
                          <Input
                            id="newScheduleTime"
                            type="time"
                            value={newScheduleTime}
                            onChange={(e) => setNewScheduleTime(e.target.value)}
                          />
                        </div>
                        <div>
                          <Button type="button" onClick={addSchedule} className="w-full">
                            {editingScheduleIndex !== null ? (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                수정
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                추가
                              </>
                            )}
                          </Button>
                        </div>
                        {editingScheduleIndex !== null && (
                          <div>
                            <Button type="button" variant="outline" onClick={cancelEditSchedule} className="w-full">
                              <X className="w-4 h-4 mr-2" />
                              취소
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold mb-3 block">
                        등록된 공연 일정 ({schedules.length}개)
                      </Label>
                      {schedules.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 border rounded-lg bg-gray-50">
                          <Calendar className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                          <p>등록된 공연 일정이 없습니다.</p>
                          <p className="text-sm">위에서 공연 일정을 추가해주세요.</p>
                        </div>
                      ) : (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {schedules.map((schedule, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 border rounded-lg bg-white"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  <span className="font-medium">{schedule.showDate}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <Clock className="w-4 h-4 text-green-500" />
                                  <span>{schedule.showTime}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    <X className="w-4 h-4 mr-2" />
                    취소
                  </Button>
                  <Button type="submit" disabled={formLoading}>
                    <Save className="w-4 h-4 mr-2" />
                    {formLoading ? "저장 중..." : editingEvent ? "수정" : "생성"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            className={`mb-6 ${
              alert.type === "success"
                ? "border-green-500 bg-green-50"
                : alert.type === "warning"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-red-500 bg-red-50"
            }`}
          >
            <AlertDescription
              className={
                alert.type === "success"
                  ? "text-green-700"
                  : alert.type === "warning"
                    ? "text-yellow-700"
                    : "text-red-700"
              }
            >
              {alert.message}
            </AlertDescription>
          </Alert>
        )}

        {/* Filters */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="제목 또는 공연장으로 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {categoryLabels[category as keyof typeof categoryLabels]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={refreshEvents} disabled={loading}>
              <RefreshCw className="w-4 h-4 mr-2" />
              새로고침
            </Button>
          </div>
        </Card>

        {/* Events List */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">이벤트 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">총 {filteredEvents.length}개의 이벤트</h2>
            </div>

            {filteredEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">검색 조건에 맞는 이벤트가 없습니다.</p>
                <Button onClick={handleNewEvent}>
                  <Plus className="w-4 h-4 mr-2" />첫 번째 이벤트 추가하기
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map((event: Event) => (
                  <Card key={event.id} className="p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-6">
                      <div className="w-24 h-32 flex-shrink-0">
                        <Image
                          src={event.posterImageUrl || "/placeholder.svg"}
                          alt={event.title}
                          width={96}
                          height={128}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                              <Badge variant="secondary">
                                {categoryLabels[event.eventCategory as keyof typeof categoryLabels] ||
                                  event.eventCategory}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                              <div>
                                <p>
                                  <span className="font-medium">공연장:</span> {event.venue}
                                </p>
                                <p>
                                  <span className="font-medium">기간:</span> {event.startDate} ~ {event.endDate}
                                </p>
                              </div>
                              <div>
                                <p>
                                  <span className="font-medium">시간:</span> {event.runtime}분
                                </p>
                                <p>
                                  <span className="font-medium">연령:</span>{" "}
                                  {event.ageLimit === 0 ? "전체관람가" : `${event.ageLimit}세 이상`}
                                </p>
                                {event.schedules && event.schedules.length > 0 && (
                                  <p>
                                    <span className="font-medium">공연 일정:</span> {event.schedules.length}개
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-gray-700 text-sm line-clamp-2">{event.description}</p>

                            {/* 스케줄 미리보기 */}
                            {event.schedules && event.schedules.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-xs text-gray-500 mb-2">공연 일정:</p>
                                <div className="flex flex-wrap gap-2">
                                  {event.schedules.slice(0, 3).map((schedule, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {schedule.showDate} {schedule.showTime}
                                    </Badge>
                                  ))}
                                  {event.schedules.length > 3 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{event.schedules.length - 3}개 더
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <Button variant="outline" size="sm" onClick={() => handleEdit(event)} disabled={loading}>
                              <Edit className="w-4 h-4 mr-1" />
                              수정
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(event.id)}
                              disabled={loading}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              삭제
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
