'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';

import Header from '@/components/header';
import Footer from '@/components/footer';
import EventFilter from '@/components/EventFilter';

interface Event {
  id: number;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  posterImageUrl: string;
  category: string;
}

interface EventSlice {
  content: Event[];
  last: boolean;
}

export default function MusicalPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [condition, setSort] = useState('ranking');
  const [age, setAge] = useState('');

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchEvents = async (pageNum: number, condition: string, age: string) => {
    pageNum === 0 ? setIsLoading(true) : setIsFetchingMore(true);
    try {
      const qs = new URLSearchParams({
        category: 'MUSICAL',
        page: String(pageNum),
        condition,
        ...(age && { age }),
      }).toString();

      const res = await fetch(`/api/v1/event?${qs}`);
      if (!res.ok) throw new Error('데이터를 가져오는데 실패했습니다.');

      const data: EventSlice = await res.json();
      setEvents(prev =>
        pageNum === 0
          ? data.content
          : Array.from(
              new Map(
                [...prev, ...data.content].map(e => [e.id, e])
              ).values()
            )
      );
      setHasNext(!data.last);
      if (!data.last) setPage(pageNum + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  // 초기 및 필터 변경 시 재요청
  useEffect(() => {
    setPage(0);
    fetchEvents(0, condition, age);
  }, [condition, age]);

  // 무한 스크롤 옵저버
  useEffect(() => {
    if (!hasNext || isFetchingMore || isLoading) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchEvents(page, condition, age);
        }
      },
      { threshold: 0.1 }
    );

    const current = sentinelRef.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
      observer.disconnect();
    };
  }, [hasNext, isFetchingMore, isLoading, page, condition, age]);

  // 로딩 초기 상태
  if (isLoading && page === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>데이터를 불러오는 중...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button
              onClick={() => fetchEvents(0, condition, age)}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              다시 시도
            </button>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-gradient-to-r from-yellow-100 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">뮤지컬</h1>
          <p className="text-lg text-gray-600">감동과 환상이 어우러진 무대 위의 마법</p>
        </div>
      </section>

      {/* Filter */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <EventFilter
          condition={condition}
          age={age}
          onChange={(newSort, newAge) => {
            setSort(newSort);
            setAge(newAge);
          }}
        />
      </section>

      {/* Main Cards */}
      <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {events.map(event => (
          <Link key={event.id} href={`/performance/${event.id}`}> 
            <div className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg shadow-lg mb-4 aspect-[3/4] bg-gray-200">
                <Image
                  src={event.posterImageUrl || '/placeholder.svg'}
                  alt={event.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-600">{event.venue}</p>
                <p className="text-sm font-medium text-gray-800">{event.startDate} - {event.endDate}</p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      {/* Sentinel & Loader */}
      <div ref={sentinelRef} style={{ height: '1px' }} />
      {isFetchingMore && (
        <div className="text-center py-6">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mx-auto" />
        </div>
      )}
      {!hasNext && events.length > 0 && (
        <div className="text-center py-6 text-gray-500">
          <p>모든 공연을 불러왔습니다.</p>
        </div>
      )}

      <Footer />
    </div>
  );
}
