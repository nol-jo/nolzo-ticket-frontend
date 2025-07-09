import { useEffect, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

// Types
interface Review {
  id: number
  content: string
  rating: number
  author: string
  createdAt: string
}

interface ReviewPageResponse {
  averageRating: number
  totalReviewCount: number
  reviews: Review[]
  currentPage: number
  totalPages: number
  pageSize: number
  hasNext: boolean
  hasPrevious: boolean
}

interface ReviewSectionProps {
  eventId: number
}

// Utility functions
const formatDisplayDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Components
interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
}

function StarRating({ rating, size = 'sm' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  }

  return (
    <div className="flex items-center gap-1" role="img" aria-label={`${rating}점 평점`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClasses[size]} ${
            star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  )
}

function ReviewSection({ eventId }: ReviewSectionProps) {
  const [reviewData, setReviewData] = useState<ReviewPageResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch(`/api/v1/reviews/events/${eventId}?page=${page}&size=5`)
      if (!response.ok) {
        throw new Error('리뷰 데이터를 가져오는데 실패했습니다.')
      }

      const data: ReviewPageResponse = await response.json()
      setReviewData(data)
      setCurrentPage(page)
    } catch (err) {
      console.error('리뷰 데이터 로딩 오류:', err)
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchReviews(0)
  }, [fetchReviews])

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && reviewData && newPage < reviewData.totalPages) {
      fetchReviews(newPage)
    }
  }

  const renderPageNumbers = () => {
    if (!reviewData || reviewData.totalPages <= 1) return null

    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(0, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(reviewData.totalPages - 1, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(0, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 rounded ${
            i === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label={`${i + 1}페이지로 이동`}
        >
          {i + 1}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">리뷰</h2>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {isLoading && currentPage === 0 ? (
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => fetchReviews(currentPage)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              다시 시도
            </button>
          </div>
        ) : !reviewData || !reviewData.totalReviewCount || reviewData.totalReviewCount === 0 ? (
          <p className="text-gray-500 text-center py-8">아직 리뷰가 없습니다.</p>
        ) : (
          <>
            {/* 평점 요약 */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b">
              <div className="flex items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                <span className="text-2xl font-bold">{reviewData.averageRating?.toFixed(1) || '0.0'}</span>
              </div>
              <div className="text-gray-600">
                총 {(reviewData.totalReviewCount || 0).toLocaleString()}개의 리뷰
              </div>
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-6">
              {isLoading && currentPage !== 0 ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                reviewData.reviews.map((review) => (
                  <article key={review.id} className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                        {review.author.charAt(0)}
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{review.author}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <StarRating rating={review.rating} size="sm" />
                            <span>·</span>
                            <time dateTime={review.createdAt}>
                              {formatDisplayDate(review.createdAt)}
                            </time>
                          </div>
                        </div>
                      </div>
                      <p className="mt-2 text-gray-700">{review.content}</p>
                    </div>
                  </article>
                ))
              )}
            </div>

            {/* 페이지네이션 */}
            {reviewData.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!reviewData.hasPrevious}
                  className={`p-2 rounded ${
                    reviewData.hasPrevious
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="이전 페이지"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <div className="flex gap-1">
                  {renderPageNumbers()}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!reviewData.hasNext}
                  className={`p-2 rounded ${
                    reviewData.hasNext
                      ? 'text-gray-700 hover:bg-gray-100'
                      : 'text-gray-300 cursor-not-allowed'
                  }`}
                  aria-label="다음 페이지"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ReviewSection