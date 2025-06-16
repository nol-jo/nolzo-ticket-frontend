export interface BannerData {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  backgroundImage: string
  category: string
  featured?: boolean
  startDate?: string
  endDate?: string
  venue?: string
  price?: {
    min: number
    max: number
    currency: string
  }
  tags?: string[]
}

export interface BannerResponse {
  banners: BannerData[]
  total: number
  page: number
  limit: number
}
