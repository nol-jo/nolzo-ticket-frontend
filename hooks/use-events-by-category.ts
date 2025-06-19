"use client"

import { useState, useEffect } from "react"
import { getDistinctEventsByCategory, type EventResponse } from "@/lib/api/events"
import { fallbackEvents } from "@/lib/data/fallback-events"

export function useEventsByCategory(category: string) {
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
        const data = await getDistinctEventsByCategory(category)
        setEvents(data)
        console.log(`✅ ${category} 카테고리 중복 제거된 이벤트 ${data.length}개 로드 완료`)
      } catch (err) {
        console.error(`❌ ${category} 카테고리 이벤트 로드 실패:`, err)

        // 카테고리별 fallback 데이터 필터링
        const categoryFallback = fallbackEvents.filter(
          (event) => event.category.toLowerCase() === category.toLowerCase(),
        )

        setEvents(categoryFallback)
        setError(`API 연결에 실패했습니다: ${err instanceof Error ? err.message : "알 수 없는 오류"}`)
        setUsingFallback(true)
        console.log(`🔄 ${category} 카테고리 fallback 데이터 ${categoryFallback.length}개 사용`)
      } finally {
        setLoading(false)
      }
    }

    if (category) {
      fetchEvents()
    }
  }, [category])

  return { events, loading, error, usingFallback }
}
