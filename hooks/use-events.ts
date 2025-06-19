"use client"

import { useState, useEffect } from "react"
import { getAllEvents, getEventDetail, type EventResponse, type EventDetailResponse } from "@/lib/api/events"
import { fallbackEvents } from "@/lib/data/fallback-events"

export function useEvents() {
  const [events, setEvents] = useState<EventResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true)
      setError(null)
      setUsingFallback(false)

      try {
        const data = await getAllEvents()
        setEvents(data)
        console.log(`✅ 이벤트 로드 완료: ${data.length}개`)
      } catch (err) {
        console.error("❌ 이벤트 로드 실패:", err)
        setEvents(fallbackEvents)
        setError(`API 연결에 실패했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
        setUsingFallback(true)
        console.log(`🔄 fallback 데이터 사용: ${fallbackEvents.length}개`)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  return { events, loading, error, usingFallback }
}

export function useEvent(id: number) {
  const [event, setEvent] = useState<EventDetailResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)

  useEffect(() => {
    async function fetchEvent() {
      setLoading(true)
      setError(null)
      setUsingFallback(false)

      try {
        const data = await getEventDetail(id)
        setEvent(data)
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
            schedules: fallbackEvent.schedule ? [fallbackEvent.schedule] : [],
          }
          setEvent(fallbackDetail)
        }

        setError(`API 연결에 실패했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
        setUsingFallback(true)
        console.log(`🔄 fallback 데이터 사용`)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  return { event, loading, error, usingFallback }
}
