"use client"

import React, { useState, useEffect } from "react"
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  Search,
  RefreshCw,
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"

import Header from "@/components/header"
import Footer from "@/components/footer"
import { fallbackEvents } from "@/lib/data/fallback-events"

// 폼 데이터 타입
interface EventFormData {
  title: string
  venue: string
  description: string
  posterImageUrl: string
  startDate: string
  endDate: string
  showDate: string
  showTime: string
  eventCategory: string
  runtime: string
  ageLimit: string
}

// 폼 초기값
const initialFormData: EventFormData = {
  title: "",
  venue: "",
  description: "",
  posterImageUrl: "",
  startDate: "",
  endDate: "",
  showDate: "",
  showTime: "",
  eventCategory: "",
  runtime: "",
  ageLimit: "",
}

export default function AdminPage() {
  // 이벤트 목록 (mock)
  const [events, setEvents] = useState<typeof fallbackEvents>([])
  const [loading, setLoading] = useState(true)

  // 검색/필터
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  // 다이얼로그 & 폼
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<typeof fallbackEvents[number] | null>(null)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [formLoading, setFormLoading] = useState(false)

  // 알림
  const [alert, setAlert] = useState<{ type: "success" | "error" | "warning"; message: string } | null>(null)

  // 초기 mock 데이터 세팅
  useEffect(() => {
    setEvents(fallbackEvents)
    setLoading(false)
  }, [])

  const showAlert = (type: "success" | "error" | "warning", message: string) => {
    setAlert({ type, message })
    setTimeout(() => setAlert(null), 5000)
  }

  const refreshEvents = () => {
    setLoading(true)
    setEvents(fallbackEvents)
    setLoading(false)
    showAlert("success", "이벤트 목록이 새로고침되었습니다.")
  }

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormLoading(true)

    try {
      // 폼에서 보낼 데이터 객체
      const eventData = {
        title: formData.title,
        venue: formData.venue,
        description: formData.description,
        posterImageUrl: formData.posterImageUrl || undefined,
        startDate: formData.startDate,
        endDate: formData.endDate,
        eventCategory: formData.eventCategory,
        runtime: Number.parseInt(formData.runtime) || 0,
        ageLimit: Number.parseInt(formData.ageLimit) || 0,
        schedule:
          formData.showDate && formData.showTime
            ? {
              showDate: formData.showDate,
              showTime: formData.showTime + ":00",
            }
            : undefined,
      }

      if (editingEvent) {
        // 수정: 로컬 상태만 업데이트
        setEvents(prev =>
          prev.map(ev =>
            ev.id === editingEvent.id ? { ...ev, ...eventData } : ev
          )
        )
        showAlert("success", "이벤트가 수정되었습니다.")
      } else {
        // 생성: 임시 ID로 추가
        const newEvent = {
          id: Date.now(),
          rating: 0,
          reviewCount: 0,
          ...eventData,
        }
        setEvents(prev => [...prev, newEvent as typeof fallbackEvents[number]])
        showAlert("success", "새 이벤트가 생성되었습니다.")
      }

      setIsDialogOpen(false)
      setEditingEvent(null)
      setFormData(initialFormData)
    } catch (error) {
      console.error(error)
      showAlert("error", editingEvent ? "이벤트 수정에 실패했습니다." : "이벤트 생성에 실패했습니다.")
    } finally {
      setFormLoading(false)
    }
  }

  const handleEdit = (event: typeof fallbackEvents[number]) => {
    setEditingEvent(event)
    setFormData({
      title: event.title,
      venue: event.venue,
      description: event.description,
      posterImageUrl: event.posterImageUrl || "",
      startDate: event.startDate,
      endDate: event.endDate,
      eventCategory: event.eventCategory,
      runtime: event.runtime.toString(),
      ageLimit: event.ageLimit.toString(),
      showDate: event.schedule?.showDate || "",
      showTime: event.schedule?.showTime?.substring(0, 5) || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: number) => {
    if (!confirm("정말로 이 이벤트를 삭제하시겠습니까?")) return
    setEvents(prev => prev.filter(ev => ev.id !== id))
    showAlert("success", "이벤트가 삭제되었습니다.")
  }

  const handleNewEvent = () => {
    setEditingEvent(null)
    setFormData(initialFormData)
    setIsDialogOpen(true)
  }

  // 검색 + 카테고리 필터
  const filteredEvents = events.filter(ev => {
    const matchesSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || ev.eventCategory === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ["all", "MUSICAL", "CONCERT", "PLAY"]
  const categoryLabels: Record<string, string> = {
    all: "모든 카테고리",
    MUSICAL: "뮤지컬",
    CONCERT: "콘서트",
    PLAY: "연극",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">이벤트 관리</h1>
            <p className="text-gray-600">공연 및 이벤트를 생성, 수정, 삭제할 수 있습니다.</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleNewEvent}>
                <Plus className="w-4 h-4 mr-2" /> 새 이벤트 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingEvent ? "이벤트 수정" : "새 이벤트 추가"}</DialogTitle>
                <DialogDescription>
                  {editingEvent
                    ? "기존 이벤트 정보를 수정합니다."
                    : "새로운 이벤트를 생성합니다."}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="basic">기본 정보</TabsTrigger>
                    <TabsTrigger value="details">상세 정보</TabsTrigger>
                  </TabsList>

                  {/* 기본 정보 탭 */}
                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">제목 *</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={e => handleInputChange("title", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="venue">공연장 *</Label>
                        <Input
                          id="venue"
                          value={formData.venue}
                          onChange={e => handleInputChange("venue", e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">설명 *</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={e => handleInputChange("description", e.target.value)}
                        rows={3}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="eventCategory">카테고리 *</Label>
                        <Select
                          value={formData.eventCategory}
                          onValueChange={value => handleInputChange("eventCategory", value)}
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
                          onChange={e => handleInputChange("posterImageUrl", e.target.value)}
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
                          onChange={e => handleInputChange("startDate", e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="endDate">종료일 *</Label>
                        <Input
                          id="endDate"
                          type="date"
                          value={formData.endDate}
                          onChange={e => handleInputChange("endDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </TabsContent>

                  {/* 상세 정보 탭 */}
                  <TabsContent value="details" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="runtime">공연시간 (분) *</Label>
                        <Input
                          id="runtime"
                          type="number"
                          value={formData.runtime}
                          onChange={e => handleInputChange("runtime", e.target.value)}
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
                          onChange={e => handleInputChange("ageLimit", e.target.value)}
                          placeholder="예: 8 (0은 전체관람가)"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label className="text-base font-semibold">공연 스케줄</Label>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                          <Label htmlFor="showDate">공연일</Label>
                          <Input
                            id="showDate"
                            type="date"
                            value={formData.showDate}
                            onChange={e => handleInputChange("showDate", e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="showTime">공연시간</Label>
                          <Input
                            id="showTime"
                            type="time"
                            value={formData.showTime}
                            onChange={e => handleInputChange("showTime", e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
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

        {/* 알림 */}
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

        {/* 검색 & 필터 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="제목 또는 공연장으로 검색..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>
                    {categoryLabels[cat]}
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

        {/* 이벤트 리스트 */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">이벤트 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-800">
                총 {filteredEvents.length}개의 이벤트
              </h2>
              <div className="text-sm text-gray-500">샘플 데이터</div>
            </div>

            {filteredEvents.length === 0 ? (
              <Card className="p-12 text-center">
                <p className="text-gray-500 text-lg mb-4">
                  검색 조건에 맞는 이벤트가 없습니다.
                </p>
                <Button onClick={handleNewEvent}>
                  <Plus className="w-4 h-4 mr-2" /> 첫 번째 이벤트 추가하기
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {filteredEvents.map(event => (
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
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">
                            {event.title}
                          </h3>
                          <Badge variant="secondary">
                            {categoryLabels[event.eventCategory]}
                          </Badge>
                          {event.id > 1000000 && (
                            <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                              로컬
                            </Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div>
                            <p>
                              <span className="font-medium">공연장:</span> {event.venue}
                            </p>
                            <p>
                              <span className="font-medium">기간:</span> {event.startDate} ~{" "}
                              {event.endDate}
                            </p>
                          </div>
                          <div>
                            <p>
                              <span className="font-medium">시간:</span> {event.runtime}분
                            </p>
                            <p>
                              <span className="font-medium">연령:</span>{" "}
                              {event.ageLimit === 0
                                ? "전체관람가"
                                : `${event.ageLimit}세 이상`}
                            </p>
                            {event.schedule && (
                              <p>
                                <span className="font-medium">공연:</span>{" "}
                                {event.schedule.showDate} {event.schedule.showTime}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm line-clamp-2">
                          {event.description}
                        </p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(event)}
                          disabled={loading}
                        >
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