// API 호출 함수들
export interface EventRequest {
    title: string
    venue: string
    description: string
    // posterImageUrl is removed as it's not sent to the server
    startDate: string
    endDate: string
    schedules?: {
        id : number
        reservationStart: string,
        reservationEnd: string
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
        id : number
        showDate: string
        showTime: string
        reservationStart: string,
        reservationEnd: string
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

const API_BASE_URL = "/api/v1"

async function apiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`

    // When sending FormData, the browser automatically sets the Content-Type header with the correct boundary.
    // Manually setting it to 'application/json' or 'multipart/form-data' can cause issues.
    const headers: HeadersInit = options?.body instanceof FormData ? {} : { "Content-Type": "application/json" };

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...headers,
                ...options?.headers,
            },
        })

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("API Error Response:", errorBody);
            throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`)
        }

        // Handle cases where the response might be empty (e.g., for a 204 No Content)
        const responseText = await response.text();
        if (!responseText) {
            return null as T;
        }

        return JSON.parse(responseText) as T;
    } catch (error) {
        console.error("API Call failed:", error)
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

export async function createEvent(payload: FormData): Promise<EventResponse> {
    try {
        return await apiCall<EventResponse>("/event", {
            method: "POST",
            body: payload,
        })
    } catch (error) {
        console.error("Failed to create event:", error)
        throw error
    }
}

export async function updateEvent(id: number, payload: FormData): Promise<EventResponse> {
    try {
        // The payload already contains the event data and the image (if any)
        return await apiCall<EventResponse>(`/event/${id}`, {
            method: "PATCH",
            body: payload,
        })
    } catch (error) {
        console.error(`Failed to update event ${id}:`, error)
        throw error
    }
}

export async function deleteEvent(id: number): Promise<void> {
    try {
        await apiCall<null>(`/event/delete/${id}`, {
            method: "POST",
        });
    } catch (error) {
        console.error(`Failed to delete event ${id}:`, error)
        throw error
    }
}