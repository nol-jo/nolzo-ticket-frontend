import type { BannerData, BannerResponse } from "@/types/banner"

// 실제 API 호출 함수들
export async function fetchBanners(params?: {
  page?: number
  limit?: number
  category?: string
  featured?: boolean
}): Promise<BannerResponse> {
  const searchParams = new URLSearchParams()

  if (params?.page) searchParams.append("page", params.page.toString())
  if (params?.limit) searchParams.append("limit", params.limit.toString())
  if (params?.category) searchParams.append("category", params.category)
  if (params?.featured !== undefined) searchParams.append("featured", params.featured.toString())

  const response = await fetch(`/api/banners?${searchParams.toString()}`)

  if (!response.ok) {
    throw new Error("Failed to fetch banners")
  }

  return response.json()
}

export async function fetchBannerById(id: string): Promise<BannerData> {
  const response = await fetch(`/api/banners/${id}`)

  if (!response.ok) {
    throw new Error("Failed to fetch banner")
  }

  return response.json()
}

export async function fetchFeaturedBanners(): Promise<BannerData[]> {
  const response = await fetchBanners({ featured: true, limit: 14 })
  return response.banners
}
