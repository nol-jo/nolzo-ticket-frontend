'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Calendar, MapPin, Clock, RefreshCw, Star, Edit3, Trash2 } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { authAPI, getCookie, User } from "@/lib/utils"

interface Event {
  id: number;
  title: string;
  venue: string;
  description: string;
  posterImageUrl?: string;
  startDate: string;
  endDate: string;
  schedules?: Schedule[];
  eventCategory: string;
  runtime: number;
  ageLimit: number;
}

interface Schedule {
  id: number;
  date: string;
  time: string;
}

interface Review {
  id: number;
  content: string;
  rating: number;
  eventId: number;
  createdAt: string;
  updatedAt?: string;
  event?: Event; // 선택적 필드로 변경
}

export default function MyReviewsPage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [reviews, setReviews] = useState<Review[]>([])
  const [events, setEvents] = useState<{[key: number]: Event}>({}) // 이벤트 정보 캐시
  const [isLoading, setIsLoading] = useState(true)
  const [sortBy, setSortBy] = useState("latest")

  useEffect(() => {
    async function fetchReviews() {
      const jwtUser: User | null = await authAPI.checkAndRefreshToken();
      if (!jwtUser) {
        router.push("/login?returnUrl=" + encodeURIComponent("/my-reviews"));
        return;
      }
      setIsLoggedIn(true);

      try {
        const accessToken = getCookie('accessToken');
        const res = await fetch("/api/v1/reviews/my", {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch reviews');
        }

        const data: Review[] = await res.json();
        setReviews(data);

        // 각 리뷰의 이벤트 정보를 별도로 가져오기
        const eventIds = [...new Set(data.map((review: Review) => review.eventId))];
        const eventPromises = eventIds.map(async (eventId: number) => {
          try {
            const eventRes = await fetch(`/api/v1/event/${eventId}`, {
              headers: {
                'Authorization': `Bearer ${accessToken}`
              }
            });
            if (eventRes.ok) {
              return await eventRes.json();
            }
          } catch (error) {
            console.error(`Failed to fetch event ${eventId}:`, error);
          }
          return null;
        });

        const eventResults = await Promise.all(eventPromises);
        const eventsMap: {[key: number]: Event} = {};
        eventResults.forEach((event, index) => {
          if (event) {
            eventsMap[eventIds[index]] = event;
          }
        });
        setEvents(eventsMap);
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReviews();
  }, [router]);

  const sortReviews = (list: Review[]) => {
    switch (sortBy) {
      case "latest": return [...list].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case "oldest": return [...list].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case "rating-high": return [...list].sort((a, b) => b.rating - a.rating)
      case "rating-low": return [...list].sort((a, b) => a.rating - b.rating)
      case "performance-date": return [...list].sort((a, b) => {
        const eventA = events[a.eventId];
        const eventB = events[b.eventId];
        if (!eventA || !eventB) return 0;
        return new Date(eventA.startDate).getTime() - new Date(eventB.startDate).getTime();
      })
      default: return list
    }
  }

  const handleEdit = (eventId: number) => {
    router.push(`/review?eventId=${eventId}`)
  }

  const handleDelete = async (reviewId: number) => {
    if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const accessToken = getCookie('accessToken');
      const res = await fetch(`/api/v1/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (!res.ok) {
        throw new Error('Failed to delete review');
      }

      alert('리뷰가 삭제되었습니다.');
      // 리뷰 목록에서 삭제된 리뷰 제거
      setReviews(reviews.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error("Failed to delete review:", error);
      alert('리뷰 삭제에 실패했습니다. 다시 시도해주세요.');
    }
  }

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (!isLoggedIn) return null
  if (isLoading) return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="text-center py-16">
        <RefreshCw className="animate-spin mx-auto h-12 w-12 text-blue-600"/>
        <p className="mt-4">내 리뷰를 불러오는 중...</p>
      </div>
      <Footer />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">내 리뷰</h1>
            <p className="text-gray-600">작성한 리뷰를 확인하고 관리하세요.</p>
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue/>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">최신순</SelectItem>
              <SelectItem value="oldest">오래된순</SelectItem>
              <SelectItem value="rating-high">별점 높은순</SelectItem>
              <SelectItem value="rating-low">별점 낮은순</SelectItem>
              <SelectItem value="performance-date">공연일순</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold mb-2">아직 작성한 리뷰가 없습니다</h2>
            <p className="text-gray-600 mb-6">
              관람하신 공연에 대한 소중한 후기를 남겨보세요.
            </p>
            <Button onClick={() => router.push('/my-reservations')}>
              내 예약 보기
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {sortReviews(reviews).map(review => {
              const event = events[review.eventId];

              return (
                <Card key={review.id} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* 공연 이미지 */}
                    <div className="w-24 h-32 flex-shrink-0">
                      {event?.posterImageUrl ? (
                        <Image
                          src={event.posterImageUrl}
                          alt={event.title || '공연'}
                          width={96}
                          height={128}
                          className="rounded object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-24 h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    {/* 공연 정보 및 리뷰 */}
                    <div className="flex-1 ml-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold mb-2">
                            {event?.title || '공연 정보 없음'}
                          </h3>
                          {event && (
                            <div className="space-y-1 mb-4">
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <MapPin className="w-4 h-4"/>
                                {event.venue}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Calendar className="w-4 h-4"/>
                                {event.startDate} ~ {event.endDate}
                              </p>
                              <p className="text-sm text-gray-600 flex items-center gap-2">
                                <Clock className="w-4 h-4"/>
                                {event.runtime}분
                              </p>
                            </div>
                          )}
                        </div>

                        {/* 액션 버튼 */}
                        <div className="flex gap-2 ml-4">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(review.eventId)}
                            className="flex items-center gap-1"
                          >
                            <Edit3 className="w-4 h-4"/>
                            수정
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(review.id)}
                            className="flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4"/>
                            삭제
                          </Button>
                        </div>
                      </div>

                      {/* 리뷰 내용 */}
                      <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm font-medium">{review.rating}점</span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {review.updatedAt && review.updatedAt !== review.createdAt ? '수정됨' : '작성됨'}: {new Date(review.updatedAt || review.createdAt).toLocaleString()}
                          </div>
                        </div>
                        <p className="text-gray-800 bg-gray-50 p-3 rounded-md">
                          {review.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}