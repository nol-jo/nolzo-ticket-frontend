"use client"

import { useState, useEffect } from "react"
import { getEventDetail, type EventDetailResponse } from "@/lib/api/events"
import { fallbackEvents } from "@/lib/data/fallback-events"

export function useEventDetail(id: number) {
  const [eventDetail, setEventDetail] = useState<EventDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchEventDetail() {
      setLoading(true)
      setError(null)
      setUsingFallback(false)

      try {
        const data = await getEventDetail(id)
        setEventDetail(data)
        console.log(`✅ 이벤트 상세 정보 로드 완료: ${data.title}`)
      } catch (err) {
        console.error(`❌ 이벤트 상세 정보 로드 실패 (ID: ${id}):`, err)

        // fallback 데이터에서 해당 ID 찾기
        const fallbackEvent = fallbackEvents.find((event) => event.id === id)
        if (fallbackEvent) {
          // EventResponse를 EventDetailResponse 형태로 변환
          const fallbackDetail: EventDetailResponse = {
            eventId: fallbackEvent.id,
            title: fallbackEvent.title,
            venue: fallbackEvent.venue || "미정",
            description: fallbackEvent.description,
            startDate: fallbackEvent.startDate,
            endDate: fallbackEvent.endDate,
            ageLimit: Number.parseInt(fallbackEvent.ageLimit) || 0,
            posterUrl: fallbackEvent.poster || "",
            schedules: fallbackEvent.schedule
              ? [
                  {
                    scheduleId: fallbackEvent.id,
                    schedule: {
                      showDate: fallbackEvent.schedule.showDate,
                      showTime: fallbackEvent.schedule.showTime,
                    },
                  },
                ]
              : [],
          }
          setEventDetail(fallbackDetail)
        }

        setError(`API 연결에 실패했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
        setUsingFallback(true)
        console.log(`🔄 fallback 데이터 사용`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEventDetail()
    }
  }, [id])

  return { eventDetail, loading, error, usingFallback }
}
