'use client'

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Star, ArrowLeft } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { authAPI, getSessionToken, User } from "@/lib/utils"

interface Event {
  id: number;
  title: string;
  image: string | null;
}

interface Review {
  id: number;
  rating: number;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export default function ReviewWritePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [event, setEvent] = useState<Event | null>(null)
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasExistingReview, setHasExistingReview] = useState(false)
  const [existingReview, setExistingReview] = useState<Review | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const eventId = searchParams.get('eventId')

  useEffect(() => {
    async function initializePage() {
      const jwtUser: User | null = await authAPI.checkAndRefreshToken();
      if (!jwtUser) {
        router.push("/login?returnUrl=" + encodeURIComponent(window.location.pathname + window.location.search));
        return;
      }
      setIsLoggedIn(true);

      if (!eventId) {
        alert('잘못된 접근입니다.');
        router.push('/my-reservations');
        return;
      }

      try {
        const accessToken = getSessionToken('accessToken');

        // 공연 정보 조회
        const eventRes = await fetch(`/api/v1/event/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!eventRes.ok) {
          throw new Error('Failed to fetch event');
        }

        const eventData = await eventRes.json();
        setEvent(eventData);

        // 기존 리뷰 조회 (존재 여부 확인 + 리뷰 데이터 가져오기를 한 번에)
        const reviewRes = await fetch(`/api/v1/reviews/events/${eventId}/my`, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (reviewRes.ok) {
          const reviewData = await reviewRes.json();
          if (reviewData && reviewData.id) {
            setHasExistingReview(true);
            setExistingReview(reviewData);
            setRating(reviewData.rating);
            setReviewText(reviewData.content);
          }
        } else if (reviewRes.status === 500) {
          setHasExistingReview(false);
        } else {
          // 다른 에러인 경우
          console.error("Failed to fetch review:", reviewRes.status);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
        alert('정보를 불러올 수 없습니다.');
        router.push('/my-reservations');
      } finally {
        setIsLoading(false);
      }
    }

    initializePage();
  }, [router, eventId]);

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoveredRating(starRating);
  };

  const handleStarLeave = () => {
    setHoveredRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }

    if (reviewText.trim().length === 0) {
      alert('리뷰 내용을 입력해주세요.');
      return;
    }

    if (reviewText.length > 100) {
      alert('리뷰는 100자 이내로 작성해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const accessToken = getSessionToken('accessToken');
      const url = hasExistingReview && existingReview
        ? `/api/v1/reviews/${existingReview.id}`
        : '/api/v1/reviews';
      const method = hasExistingReview ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          eventId: parseInt(eventId!),
          rating: rating,
          content: reviewText.trim()
        })
      });

      if (!res.ok) {
        throw new Error('Failed to submit review');
      }

      const message = hasExistingReview ? '리뷰가 성공적으로 수정되었습니다.' : '리뷰가 성공적으로 등록되었습니다.';
      alert(message);
      router.push('/review?eventId=' + eventId);
    } catch (error) {
      console.error("Failed to submit review:", error);
      const errorMessage = hasExistingReview ? '리뷰 수정에 실패했습니다. 다시 시도해주세요.' : '리뷰 등록에 실패했습니다. 다시 시도해주세요.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoggedIn) return null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16">
          <p>공연 정보를 불러오는 중...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="text-center py-16">
          <p>공연 정보를 찾을 수 없습니다.</p>
          <Button onClick={() => router.push('/my-reservations')} className="mt-4">
            예약 목록으로 돌아가기
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  // 이미 리뷰가 존재하는 경우
  if (hasExistingReview && !isEditMode && existingReview) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-2xl font-bold">리뷰 확인</h1>
          </div>

          <Card className="p-6">
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">작성한 리뷰</h3>

              {/* 기존 별점 표시 */}
              <div className="mb-4">
                <label className="text-base font-medium mb-2 block">별점</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-6 h-6 ${
                        star <= existingReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {existingReview.rating}점
                </p>
              </div>

              {/* 기존 리뷰 내용 표시 */}
              <div className="mb-6">
                <label className="text-base font-medium mb-2 block">리뷰 내용</label>
                <div className="p-3 bg-gray-50 rounded-md border">
                  <p className="text-gray-800">{existingReview.content}</p>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  작성일: {new Date(existingReview.createdAt).toLocaleString()}
                </p>
                {existingReview.updatedAt && existingReview.updatedAt !== existingReview.createdAt && (
                  <p className="text-sm text-gray-500">
                    수정일: {new Date(existingReview.updatedAt).toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => router.push('/my-reservations')}
                className="flex-1"
              >
                목록으로
              </Button>
              <Button
                onClick={() => setIsEditMode(true)}
                className="flex-1"
              >
                리뷰 수정
              </Button>
            </div>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <h1 className="text-2xl font-bold">{hasExistingReview ? '리뷰 수정' : '리뷰 작성'}</h1>
        </div>

        <Card className="p-6">
          {/* 공연 정보 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">제목: {event.title}</h3>
          </div>

          {/* 별점 선택 */}
          <div className="mb-6">
            <label className="text-base font-medium mb-3 block">별점을 선택해주세요</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 transition-colors"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    } transition-colors`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating}점을 선택하셨습니다.
              </p>
            )}
          </div>

          {/* 리뷰 텍스트 */}
          <div className="mb-6">
            <label htmlFor="review-text" className="text-base font-medium mb-3 block">
              리뷰 내용 (100자 이내)
            </label>
            <textarea
              id="review-text"
              placeholder="공연에 대한 솔직한 후기를 남겨주세요."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              maxLength={100}
              rows={4}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">
                {reviewText.length}/100자
              </p>
              {reviewText.length > 100 && (
                <p className="text-sm text-red-500">
                  100자를 초과했습니다.
                </p>
              )}
            </div>
          </div>

          {/* 제출 버튼 */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                if (hasExistingReview) {
                  setIsEditMode(false);
                  // 수정 취소 시 기존 데이터로 복원
                  if (existingReview) {
                    setRating(existingReview.rating);
                    setReviewText(existingReview.content);
                  }
                } else {
                  router.push('/my-reservations');
                }
              }}
              className="flex-1"
            >
              {hasExistingReview ? '수정 취소' : '취소'}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || rating === 0 || reviewText.trim().length === 0 || reviewText.length > 100}
              className="flex-1"
            >
              {isSubmitting ? (hasExistingReview ? '수정 중...' : '등록 중...') : (hasExistingReview ? '리뷰 수정' : '리뷰 등록')}
            </Button>
          </div>
        </Card>
      </div>
      <Footer />
    </div>
  );
}