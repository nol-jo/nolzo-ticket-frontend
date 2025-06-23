// src/lib/data/fallback-events.ts

export interface EventResponse {
  id: number
  title: string
  venue: string
  description: string
  posterImageUrl?: string
  startDate: string
  endDate: string
  eventCategory: string
  runtime: number
  ageLimit: number
  schedule?: {
    showDate: string
    showTime: string
  }
  rating: number
  reviewCount: number
}

export const fallbackEvents: EventResponse[] = [
  {
    id: 1,
    title: "샘플 뮤지컬",
    venue: "샘플 극장",
    description: "이것은 더미 데이터입니다.",
    posterImageUrl: "/placeholder.svg",
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    eventCategory: "MUSICAL",
    runtime: 120,
    ageLimit: 0,
    schedule: { showDate: "2024-06-02", showTime: "19:00:00" },
    rating: 4,
    reviewCount: 10,
  },

  {
    id: 2,
    title: "샘플 뮤지컬",
    venue: "샘플 극장",
    description: "이것은 더미 데이터입니다.",
    posterImageUrl: "/placeholder.svg",
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    eventCategory: "MUSICAL",
    runtime: 120,
    ageLimit: 0,
    schedule: { showDate: "2024-06-02", showTime: "19:00:00" },
    rating: 4,
    reviewCount: 10,
  },

  {
    id: 3,
    title: "샘플 뮤지컬",
    venue: "샘플 극장",
    description: "이것은 더미 데이터입니다.",
    posterImageUrl: "/placeholder.svg",
    startDate: "2024-06-01",
    endDate: "2024-06-05",
    eventCategory: "MUSICAL",
    runtime: 120,
    ageLimit: 0,
    schedule: { showDate: "2024-06-02", showTime: "19:00:00" },
    rating: 4,
    reviewCount: 10,
  },
  // ...원하는 만큼 더미 이벤트 추가
]