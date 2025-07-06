"use client"
import React, {useEffect, useMemo, useState} from 'react';
import {useParams, useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";
import {authAPI, getSessionToken, User} from "@/lib/utils";

type SeatStatus = "AVAILABLE" | "RESERVED" | "WAITING" | "SELECTED";

interface Seat {
  id: number,
  rowName: string,
  seatNumber: number,
  seatSection: string
  floor: string
  price: number,
  status: SeatStatus
}

interface Event {
  id: number,
  title: string,
  venue: string,
  posterImageUrl: string,
  schedules: {
    id: number,
    showDate: string,
    showTime: string
  }[]
}


export default function MyReservationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = useParams()
  const path = typeof window !== 'undefined' ? window.location.pathname : ''
  const eventId = Number(path.split('/')[2]) || null
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const [event, setEvent] = useState<Event>({} as Event);
  const [seatList, setSeatList] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [selectedZone, setSelectedZone] = useState<string | null>(null); // 선택된 구역
  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('CREDIT_CARD');
  const [reservationId, setReservationId] = useState<number | null>(null);

  useEffect(() => {
    async function init() {
      // JWT 인증 확인
      const jwtUser: User | null = await authAPI.checkAndRefreshToken()
      if (!jwtUser) {
        router.push(`/login?returnUrl=${encodeURIComponent("events/" + params.id)}`)
        return
      }
    }

    async function loadSeats() {
      if (eventId && date && time) {
        try {
          const seats = await fetchSeats(date, time)
          setSeatList(seats)
        } catch (err) {
          console.error('Seat fetch error:', err)
        }
      }
    }

    async function loadEvent() {
      if (eventId) {
        try {
          const event = await fetchEvent(eventId)
          console.log(event)
          setEvent(event)
        } catch (err) {
          console.error('Event fetch error:', err)
        }
      }
    }

    init()
    loadSeats()
    loadEvent()
  }, [eventId, date, time, router, params.id])

  async function fetchSeats(date: string, time: string): Promise<Seat[]> {
    const res = await fetch(`/api/v1/reservations/reservation/${eventId}?date=${date}&time=${time}`)
    if (!res.ok) throw new Error('좌석 조회 실패')
    return res.json()
  }

  async function fetchEvent(eventId: number): Promise<Event> {
    const res = await fetch(`/api/v1/event/${eventId}`)
    if (!res.ok) throw new Error('이벤트 조회 실패')
    return res.json()
  }

  // 선택된 좌석의 총 금액 계산
  const totalPrice = useMemo(() => {
    return selectedSeats.reduce((sum, seat) => sum + seat.price, 0);
  }, [selectedSeats]);

  const handleZoneSelect = (zoneName: string) => {
    setSelectedZone(zoneName);
  };

  // 좌석 토글 핸들러
  const toggleSeat = (seatId: number) => {
    const currentSeat = seatList?.find(
      (s) => s.id === seatId
    );

    if (!currentSeat) return;

    if (currentSeat.status !== 'AVAILABLE' && currentSeat.status !== 'SELECTED') {
      return;
    }

    if (currentSeat.status === 'AVAILABLE' && selectedSeats.length >= 6) {
      alert('최대 6개의 좌석만 선택할 수 있습니다.');
      return;
    }

    // 좌석 정보 복사
    const seatInfo: Seat = { ...currentSeat };

    // 좌석 상태 업데이트
    setSeatList((prev) =>
      prev
        ? prev.map((seat) =>
          seat.id === currentSeat.id
            ? {
              ...seat,
              status: seat.status === 'SELECTED' ? 'AVAILABLE' : 'SELECTED',
            }
            : seat
        )
        : []
    );

    // 선택된 좌석 목록 업데이트
    setSelectedSeats((prev: Seat[]) => {
      const exists = prev.some((s) => s.id === currentSeat.id);
      return exists
        ? prev.filter((s) => s.id !== currentSeat.id)
        : [...prev, seatInfo];
    });
  };

  // 구역 색상 매핑
  const getZoneColorClasses = (color: string, status: string) => {
    const colorMap: Record<string, Record<string, string>> = {
      red: {
        available: 'border-red-500 bg-red-100 hover:bg-red-200',
        selected: 'border-red-600 bg-red-600 hover:bg-red-700 text-white'
      },
      blue: {
        available: 'border-blue-500 bg-blue-100 hover:bg-blue-200',
        selected: 'border-blue-600 bg-blue-600 hover:bg-blue-700 text-white'
      },
      green: {
        available: 'border-green-500 bg-green-100 hover:bg-green-200',
        selected: 'border-green-600 bg-green-600 hover:bg-green-700 text-white'
      },
      yellow: {
        available: 'border-yellow-500 bg-yellow-100 hover:bg-yellow-200',
        selected: 'border-yellow-600 bg-yellow-600 hover:bg-yellow-700 text-white'
      },
      purple: {
        available: 'border-purple-500 bg-purple-100 hover:bg-purple-200',
        selected: 'border-purple-600 bg-purple-600 hover:bg-purple-700 text-white'
      }
    };

    return colorMap[color]?.[status] || 'border-gray-500 bg-gray-100';
  };

// 좌석 새로고침
  const refreshSeats = async () => {
    setSelectedSeats([]);
    try {
      if (date === null || time === null) {
        throw new Error("date or time is null")
      }
      const seats = await fetchSeats(date, time);
      setSeatList(seats);
    } catch (err) {
      console.error('좌석 새로고침 실패:', err);
      alert('좌석 정보를 새로고침하는 데 실패했습니다.');
    } finally {
    }
  };

  const handleComplete = async () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }

    try {
      const accessToken = getSessionToken('accessToken');
      if (!accessToken) throw new Error('로그인이 필요합니다.');

      const currentRes = await fetch(
        `/api/v1/reservations/reservation/${eventId}?date=${date}&time=${time}`
      );
      if (!currentRes.ok) {
        throw new Error('좌석 정보를 가져오는데 실패했습니다.');
      }
      const currentSeats: { id: number; status: string }[] = await currentRes.json();

      const conflict = selectedSeats.find(sel => {
        const matched = currentSeats.find(cur => cur.id === sel.id);
        return matched && matched.status !== 'AVAILABLE';
      });
      if (conflict) {
        throw new Error('이미 선택된 좌석입니다.');
      }

      // 4. 예약(락) API 호출
      const res = await fetch('/api/v1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          eventId: eventId,
          seats: selectedSeats.map(seat => ({
            id: seat.id,
            rowName: seat.rowName,
            seatNumber: seat.seatNumber,
            seatSection: seat.seatSection,
            price: seat.price,
            status: seat.status,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('예약 과정에서 오류가 발생했습니다.');
      }

      const data: { id: number } = await res.json();
      setReservationId(data.id);

      // 5. 결제 단계로 이동
      setIsPayment(true);
    } catch (error: any) {
      console.error('예약 오류:', error);
      alert(error.message || '좌석 잠금 중 오류가 발생했습니다.');

      if (error.message.includes('이미 선택된 좌석입니다')) {
        refreshSeats();
      }
    }
  };

  const handlePayment = async () => {
    try {
      // JWT 토큰 가져오기
      const accessToken = getSessionToken('accessToken');
      if (!accessToken) throw new Error('로그인이 필요합니다.');

      const res = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reservationId: reservationId,
          paymentMethod: paymentMethod,
          paymentStatus: "SUCCESS",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '결제 실패');
      }

      alert(`결제 금액: ${totalPrice}원\n결제 성공!`);
      router.push('/my-reservations');

    } catch (error: any) {
      console.error('예약 오류:', error);
      alert(error.message || '결제 실패');
    }
  };

  const handleCancel = async () => {
    try {
      const accessToken = getSessionToken('accessToken');
      if (!accessToken) throw new Error('로그인이 필요합니다.');

      const res = await fetch('/api/v1/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          reservationId: reservationId,
          paymentMethod: paymentMethod,
          paymentStatus: 'CANCELED',
          price: totalPrice,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || '결제 실패');
      }

      alert('결제가 취소 되었습니다.');
      window.location.reload()
    } catch (error: any) {
      console.error('예약 오류:', error);
      alert(error.message || '결제 실패');
    }
  };

  const dateParam = searchParams.get('date') ?? Date.now().toString();
  // Payment view
  if (isPayment) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-6">
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold mb-4">결제정보</h2>

          <div className="mb-4">
            <h3 className="font-medium mb-2">공연 정보</h3>
            <p className="text-gray-800 font-semibold">{event.title}</p>
            <p className="text-gray-600">{new Date(dateParam).toLocaleDateString('ko-KR', {year:'numeric', month:'2-digit', day:'2-digit'})} {time}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">선택된 좌석</h3>
            <ul className="list-disc list-inside">
              {selectedSeats.map(seat => (
                <li key={seat.id} className="text-gray-700">{seat.seatSection} {seat.rowName}열 {seat.seatNumber}번</li>
              ))}
            </ul>
          </div>

          <div className="mb-4 flex justify-between items-center">
            <span className="font-medium">총 금액</span>
            <span className="text-xl font-bold text-blue-600">{totalPrice.toLocaleString()}원</span>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">결제 방식 선택</h3>
            <div className="space-y-2">
              {['CREDIT_CARD','DEBIT_CARD','PAYPAL','BANK_TRANSFER'].map(method => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="mr-2"
                  />
                  {{CREDIT_CARD:'신용카드', DEBIT_CARD:'체크카드', PAYPAL:'페이팔', BANK_TRANSFER:'계좌이체'}[method]}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200"
          >
            결제하기
          </button>
          <button
            onClick={handleCancel}
            className="w-full mt-2 bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            결제취소
          </button>
        </div>
      </div>
    );
  }

  const zones = Array.from(new Set(seatList.map(s => s.seatSection)));
  const zoneColors: Record<string, string> = {
    '1구역': 'red',
    '2구역': 'blue',
    '3구역': 'green',
    '4구역': 'yellow',
    '5구역': 'purple',
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 공연 정보 헤더 */}
      <Header/>
      <div className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto flex items-center p-4">
          <button
            onClick={() => router.push(`/goods/${eventId}`)}
            className="text-gray-800 font-medium"
          >
            ← 뒤로가기
          </button>
          <h1 className="flex-1 text-center text-lg font-bold text-gray-800">
            좌석 선택
          </h1>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Seat map */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* 공연장 정보 */}
            <div className="text-center mb-6">
              <div className="bg-gray-800 text-white py-3 px-8 rounded-lg inline-block text-xl font-bold">
                STAGE
              </div>
            </div>

            {/* 구역 선택이 안 된 경우 - 새로운 구역 선택 화면 */}
            {!selectedZone && (
              <div className="space-y-8">
                <h2 className="text-2xl font-bold text-center mb-8">구역을 선택해주세요</h2>
                <div className="flex justify-center mb-6">
                  {zones.slice(0, 1).map(zoneName => {
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.seatSection === zoneName).length;
                    const color = zoneColors[zoneName] || 'gray';
                    return (
                      <button
                        key={zoneName}
                        onClick={() => handleZoneSelect(zoneName)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 border-${color}-500 bg-${color}-50 hover:bg-${color}-100`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zoneName}</div>
                        {zoneSelectedCount > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            {zoneSelectedCount}석 선택됨
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-8 mb-6">
                  {zones.slice(1, 3).map(zoneName => {
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.seatSection === zoneName).length;
                    const color = zoneColors[zoneName] || 'gray';
                    return (
                      <button
                        key={zoneName}
                        onClick={() => handleZoneSelect(zoneName)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 border-${color}-500 bg-${color}-50 hover:bg-${color}-100`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zoneName}</div>
                        {zoneSelectedCount > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            {zoneSelectedCount}석 선택됨
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
                <div className="flex justify-center gap-8">
                  {zones.slice(3, 5).map(zoneName => {
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.seatSection === zoneName).length;
                    const color = zoneColors[zoneName] || 'gray';
                    return (
                      <button
                        key={zoneName}
                        onClick={() => handleZoneSelect(zoneName)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 border-${color}-500 bg-${color}-50 hover:bg-${color}-100`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zoneName}</div>
                        {zoneSelectedCount > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            {zoneSelectedCount}석 선택됨
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {selectedZone && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    ←
                  </button>
                  <span className={`px-6 py-3 rounded-lg font-bold text-white bg-${zoneColors[selectedZone]}-600`}>
                    {selectedZone}
                  </span>
                </div>
                <div className="space-y-2">
                  {Array.from(new Set(seatList.filter(s => s.seatSection === selectedZone).map(s => s.rowName))).map(rowName => (
                    <div key={rowName} className="flex items-center justify-center">
                      <span className="w-8 text-right mr-4 font-semibold text-gray-700">{rowName}</span>
                      <div className="flex gap-1">
                        {seatList.filter(s => s.seatSection === selectedZone && s.rowName === rowName).map(seat => {
                          const color = zoneColors[seat.seatSection] || 'gray';
                          const statusClass = seat.status === 'AVAILABLE'
                            ? `${getZoneColorClasses(color, 'available')} cursor-pointer`
                            : seat.status === 'SELECTED'
                              ? `${getZoneColorClasses(color, 'selected')} cursor-pointer`
                              : 'border-gray-400 bg-gray-400 cursor-not-allowed opacity-60';
                          return (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat.id)}
                              disabled={seat.status === 'RESERVED'}
                              className={`w-8 h-8 border-2 rounded-md font-semibold text-xs transition-all duration-200 ${statusClass}`}
                              title={`${seat.seatSection}-${seat.rowName}${seat.seatNumber}`}
                            >
                              {seat.seatNumber}
                            </button>
                          );
                        })}
                      </div>
                      <span className="w-8 text-left ml-4 font-semibold text-gray-700">{rowName}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 h-full bg-white border-l border-gray-200 p-6 flex flex-col shadow-lg">
          {/* 공연 정보 카드 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-3">
              <div className="w-16 h-20 bg-gray-300 rounded flex-shrink-0">
                {event.posterImageUrl && <Image src={event.posterImageUrl} alt={event.title} width={400} height={533} className="rounded-lg object-cover w-full h-full"/>}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{event.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{event.venue}</p>
              </div>
            </div>
          </div>

          {/* Zone Info */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">구역별 요금</h3>
            <div className="space-y-1">
              {zones.map(zoneName => {
                const price = seatList.find(s => s.seatSection === zoneName)?.price;
                const color = zoneColors[zoneName] || 'gray';
                return (
                  <div key={zoneName} className="flex justify-between text-sm">
                    <span className={`font-semibold text-${color}-600`}>{zoneName}</span>
                    <span className="font-semibold">{price?.toLocaleString()}원</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Selected Seats */}
          <div className="flex-1 mb-6 min-h-[120px] overflow-y-auto">
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              선택좌석 ({selectedSeats.length}/6)
            </h3>
            <div className="bg-gray-50 p-3 rounded-md">
              {selectedSeats.length === 0 ? (
                <div className="text-sm text-gray-500 italic">선택된 좌석이 없습니다.</div>
              ) : (
                <div className="space-y-1">
                  {zones.map(zoneName => {
                    const zoneSeats = selectedSeats.filter(seat => seat.seatSection === zoneName);
                    if (zoneSeats.length === 0) return null;
                    const color = zoneColors[zoneName] || 'gray';
                    return (
                      <div key={zoneName} className="mb-2">
                        <div className={`text-xs font-semibold mb-1 text-${color}-600`}>{zoneName} ({zoneSeats.length}석)</div>
                        {zoneSeats.map(seat => (
                          <div key={seat.id} className="text-sm text-gray-700 ml-2">
                            {seat.rowName}열 {seat.seatNumber}번
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Total Price */}
          {selectedSeats.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">총 금액</span>
                <span className="text-lg font-bold text-blue-600">
                  {totalPrice.toLocaleString()}원
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={handleComplete}
              className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200"
            >
              좌석선택완료
            </button>

            <button
              onClick={refreshSeats}
              className="w-full bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              🔄 좌석 새로고침
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};