// API 호출 함수들
export interface EventRequest {
  title: string
  venue: string
  description: string
  posterImageUrl?: string
  startDate: string
  endDate: string
  schedules?: {
    showDate: string
    showTime: string
  }[]
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
  schedules?: {
    showDate: string
    showTime: string
  }[]
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

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log(options)
    const data = await response.json()
    return data
  } catch (error) {
    throw error
  }
}

// Event API 함수들
export async function getAllEvents(): Promise<EventResponse[]> {
  try {
    return await apiCall<EventResponse[]>("/event")
  } catch (error) {
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
    const response = await fetch(`http://localhost:8080/api/v1/event/delete/${id}`, {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

  } catch (error) {
    throw error
  }
}
