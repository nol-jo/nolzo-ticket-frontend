// API 호출 함수들
export interface EventRequest {
  title: string
  venue: string
  description: string
  posterImageUrl?: string
  startDate: string
  endDate: string
  schedule?: {
    showDate: string
    showTime: string
  }
  eventCategory: string
  runtime: number
  ageLimit: number
}

export interface EventResponse {
  id: number
  title: string
  venue: string
  description: string
  posterImageUrl?: string
  startDate: string
  endDate: string
  schedule?: {
    showDate: string
    showTime: string
  }
  eventCategory: string
  runtime: number
  ageLimit: number
  rating?: number
  reviewCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Schedule {
  showDate: string
  showTime: string
}

export interface ScheduleInfo {
  scheduleId: number
  schedule: Schedule
}

export interface EventDetailResponse {
  eventId: number
  title: string
  venue: string
  description: string
  startDate: string
  endDate: string
  ageLimit: number
  posterUrl: string
  schedules: ScheduleInfo[]
}

const API_BASE_URL = "http://localhost:8080/api/v1"

// API 호출 헬퍼 함수
async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  console.log(`🌐 API 요청: ${options?.method || "GET"} ${url}`)
  if (options?.body) {
    console.log(`📤 요청 데이터:`, JSON.parse(options.body as string))
  }

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    console.log(`📡 응답 상태: ${response.status} ${response.statusText}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("📦 응답 데이터:", data)
    return data
  } catch (error) {
    console.error(`❌ API 호출 실패 (${endpoint}):`, error)
    throw error
  }
}

// Event API 함수들
export async function getAllEvents(): Promise<EventResponse[]> {
  try {
    return await apiCall<EventResponse[]>("/event")
  } catch (error) {
    console.error("Failed to fetch events from API")
    throw error
  }
}

export async function getDistinctEventsByCategory(category: string): Promise<EventResponse[]> {
  try {
    const categoryParam = category.toUpperCase()
    return await apiCall<EventResponse[]>(`/event?category=${categoryParam}`)
  } catch (error) {
    console.error(`Failed to fetch distinct events by category ${category} from API`)
    throw error
  }
}

export async function getEventDetail(id: number): Promise<EventDetailResponse> {
  try {
    return await apiCall<EventDetailResponse>(`/event/${id}`)
  } catch (error) {
    console.error(`Failed to fetch event detail ${id} from API`)
    throw error
  }
}

// 기존 호환성을 위한 함수들
export async function getEventsByCategory(category: string): Promise<EventResponse[]> {
  return getDistinctEventsByCategory(category)
}

export async function getEventById(id: number): Promise<EventResponse> {
  try {
    return await apiCall<EventResponse>(`/event/${id}`)
  } catch (error) {
    console.error(`Failed to fetch event ${id} from API`)
    throw error
  }
}

export async function createEvent(eventData: EventRequest): Promise<EventResponse> {
  try {
    return await apiCall<EventResponse>("/event/", {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    console.error("Failed to create event:", error)
    throw error
  }
}

export async function updateEvent(id: number, eventData: EventRequest): Promise<EventResponse> {
  try {
    return await apiCall<EventResponse>(`/event/update/${id}`, {
      method: "POST",
      body: JSON.stringify(eventData),
    })
  } catch (error) {
    console.error(`Failed to update event ${id}:`, error)
    throw error
  }
}

export async function deleteEvent(id: number): Promise<void> {
  try {
    await apiCall<void>(`/event/delete/${id}`, {
      method: "POST",
    })
  } catch (error) {
    console.error(`Failed to delete event ${id}:`, error)
    throw error
  }
}
