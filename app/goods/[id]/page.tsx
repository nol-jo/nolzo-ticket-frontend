"use client"

import { useState } from "react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Calendar, Clock, MapPin, Users, Star, Heart, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { useEventDetail } from "@/hooks/use-event-detail"

export default function GoodsDetailPage() {
  const params = useParams()
  const id = Number(params.id)
  const { eventDetail, loading, error, usingFallback } = useEventDetail(id)
  const [selectedSchedule, setSelectedSchedule] = useState<number | null>(null)

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">공연 정보를 불러오는 중...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!eventDetail) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">공연 정보를 찾을 수 없습니다.</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* API 상태 알림 */}
      {usingFallback && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
          <div className="max-w-7xl mx-auto px-4">
            <p className="text-sm">⚠️ {error} 현재 샘플 데이터를 표시하고 있습니다.</p>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 왼쪽: 포스터 이미지 */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card className="overflow-hidden">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={eventDetail.posterUrl || "/placeholder.svg"}
                    alt={eventDetail.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </Card>

              {/* 액션 버튼들 */}
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="w-4 h-4 mr-2" />
                  찜하기
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  공유하기
                </Button>
              </div>
            </div>
          </div>

          {/* 오른쪽: 상세 정보 */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* 제목 및 기본 정보 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">공연</Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">4.8</span>
                    <span className="text-sm text-gray-500">(1,234)</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{eventDetail.title}</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{eventDetail.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>
                      {eventDetail.startDate} - {eventDetail.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span>{eventDetail.ageLimit}세 이상 관람가능</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* 스케줄 선택 */}
              <div>
                <h3 className="text-lg font-semibold mb-4">공연 일정 선택</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {eventDetail.schedules.map((scheduleInfo) => (
                    <Card
                      key={scheduleInfo.scheduleId}
                      className={`cursor-pointer transition-all ${
                        selectedSchedule === scheduleInfo.scheduleId
                          ? "ring-2 ring-blue-500 bg-blue-50"
                          : "hover:shadow-md"
                      }`}
                      onClick={() => setSelectedSchedule(scheduleInfo.scheduleId)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{scheduleInfo.schedule.showDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-gray-500" />
                              <span className="text-sm text-gray-600">{scheduleInfo.schedule.showTime}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-blue-600">99,000원~</div>
                            <div className="text-xs text-gray-500">예매가능</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <Separator />

              {/* 예매 버튼 */}
              <div className="sticky bottom-0 bg-white p-4 border-t">
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!selectedSchedule}
                  onClick={() => {
                    if (selectedSchedule) {
                      window.location.href = `/booking/${selectedSchedule}`
                    }
                  }}
                >
                  {selectedSchedule ? "예매하기" : "공연 일정을 선택해주세요"}
                </Button>
              </div>

              {/* 탭 컨텐츠 */}
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">공연정보</TabsTrigger>
                  <TabsTrigger value="cast">출연진</TabsTrigger>
                  <TabsTrigger value="reviews">관람후기</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>공연 소개</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{eventDetail.description}</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="cast" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>출연진 정보</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">출연진 정보가 준비 중입니다.</p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="reviews" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>관람후기</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">관람후기가 준비 중입니다.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
