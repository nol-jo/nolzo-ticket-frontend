"use client"
import React, {useState} from 'react';
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import Header from "@/components/header";

// Mock data structure for zones
const mockData = {
  date: '2025-06-28',
  time: '17:00',
  zones: [
    {
      id: 1,
      name: '1구역',
      rows: Array.from({length: 10}, (_, rowIndex) => ({
        row: String.fromCharCode(65 + rowIndex), // A-J
        seats: Array.from({length: 20}, (_, i) => ({id: i, status: 'available'}))
      })),
      price: 150000,
      color: 'red'
    },
    {
      id: 2,
      name: '2구역',
      rows: Array.from({length: 10}, (_, rowIndex) => ({
        row: String.fromCharCode(65 + rowIndex), // A-J
        seats: Array.from({length: 20}, (_, i) => ({id: i, status: 'available'}))
      })),
      price: 120000,
      color: 'blue'
    },
    {
      id: 3,
      name: '3구역',
      rows: Array.from({length: 10}, (_, rowIndex) => ({
        row: String.fromCharCode(65 + rowIndex), // A-J
        seats: Array.from({length: 20}, (_, i) => ({id: i, status: 'available'}))
      })),
      price: 120000,
      color: 'green'
    },
    {
      id: 4,
      name: '4구역',
      rows: Array.from({length: 10}, (_, rowIndex) => ({
        row: String.fromCharCode(65 + rowIndex), // A-J
        seats: Array.from({length: 20}, (_, i) => ({id: i, status: 'available'}))
      })),
      price: 80000,
      color: 'yellow'
    },
    {
      id: 5,
      name: '5구역',
      rows: Array.from({length: 10}, (_, rowIndex) => ({
        row: String.fromCharCode(65 + rowIndex), // A-J
        seats: Array.from({length: 20}, (_, i) => ({id: i, status: 'available'}))
      })),
      price: 80000,
      color: 'purple'
    }
  ]
};

// Mock 공연 정보 데이터
const mockShowInfo = {
  title: '뮤지컬 라이온킹',
  venue: '샬롯데씨어터',
  poster: '/images/poster1.png',
  schedules: [
    {date: '2025-06-15', time: '14:00', available: true},
    {date: '2025-06-15', time: '19:00', available: true},
    {date: '2025-06-16', time: '14:00', available: true},
    {date: '2025-06-16', time: '19:00', available: true},
    {date: '2025-06-17', time: '19:00', available: true},
    {date: '2025-06-18', time: '14:00', available: true},
    {date: '2025-06-18', time: '19:00', available: true},
  ]
};

// 각 구역별로 일부 좌석을 이미 예약된 상태로 설정
const initializeOccupiedSeats = (data) => {
  const newData = JSON.parse(JSON.stringify(data));

  newData.zones.forEach((zone, zoneIndex) => {
    // 각 구역당 5-10개의 랜덤 좌석을 점유 상태로 설정
    const numOccupied = Math.floor(Math.random() * 6) + 5;
    const occupiedPositions = new Set();

    while (occupiedPositions.size < numOccupied) {
      const rowIndex = Math.floor(Math.random() * 10);
      const seatIndex = Math.floor(Math.random() * 10);
      const position = `${rowIndex}-${seatIndex}`;
      occupiedPositions.add(position);
    }

    occupiedPositions.forEach(position => {
      const [rowIndex, seatIndex] = position.split('-').map(Number);
      newData.zones[zoneIndex].rows[rowIndex].seats[seatIndex].status = 'occupied';
    });
  });

  return newData;
};

export default function MyReservationsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const [data, setData] = useState(() => initializeOccupiedSeats(mockData));
  const [showInfo, setShowInfo] = useState(mockShowInfo);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null); // 선택된 구역
  const [chosenDate, setChosenDate] = useState(date);
  const [chosenTime, setChosenTime] = useState(time);
  const [isPayment, setIsPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('creditCard');

  // 선택된 좌석의 총 금액 계산
  const totalPrice = selectedSeats.reduce((sum, seatInfo) => {
    const zone = data.zones.find(z => z.id === seatInfo.zoneId);
    return sum + (zone?.price ?? 0);
  }, 0);

  // 구역 선택 핸들러
  const handleZoneSelect = (zoneId) => {
    setSelectedZone(zoneId);
  };

  // 좌석 토글 핸들러
  const toggleSeat = (zoneIndex, rowIndex, seatIndex) => {
    const currentSeat = data.zones[zoneIndex].rows[rowIndex].seats[seatIndex];
    const zone = data.zones[zoneIndex];

    // 이미 점유된 좌석은 선택할 수 없음
    if (currentSeat.status === 'occupied') {
      alert('이미 예약된 좌석입니다.');
      return;
    }

    // 6개 이상 선택하려고 할 때 방지
    if (currentSeat.status === 'available' && selectedSeats.length >= 6) {
      alert('최대 6개의 좌석만 선택할 수 있습니다.');
      return;
    }

    // 좌석 정보 객체 생성
    const seatInfo = {
      id: `${zone.name}-${zone.rows[rowIndex].row}${seatIndex + 1}`,
      zoneId: zone.id,
      zoneName: zone.name,
      row: zone.rows[rowIndex].row,
      seatNumber: seatIndex + 1,
      price: zone.price
    };

    // 상태 업데이트
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      const seat = newData.zones[zoneIndex].rows[rowIndex].seats[seatIndex];
      seat.status = seat.status === 'selected' ? 'available' : 'selected';
      return newData;
    });

    // 선택된 좌석 목록 업데이트
    setSelectedSeats(prev => {
      const existingIndex = prev.findIndex(seat => seat.id === seatInfo.id);
      if (existingIndex !== -1) {
        return prev.filter((_, index) => index !== existingIndex);
      } else {
        return [...prev, seatInfo];
      }
    });
  };

  // 구역 색상 매핑
  const getZoneColorClasses = (color, status) => {
    const colorMap = {
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

  // API에서 좌석 정보를 가져오는 함수
  const fetchSeats = async (date, time) => {
    try {
      const newMockData = {
        date: date,
        time: time,
        zones: data.zones.map(zone => ({
          ...zone,
          rows: zone.rows.map(row => ({
            ...row,
            seats: row.seats.map(() => ({id: Math.random(), status: 'available'}))
          }))
        }))
      };

      const finalData = initializeOccupiedSeats(newMockData);
      setData(finalData);
      setSelectedSeats([]);
      setSelectedZone(null);

    } catch (error) {
      console.error('좌석 정보를 가져오는데 실패했습니다:', error);
      alert('좌석 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (newDate) => {
    if (selectedSeats.length > 0) {
      const confirm = window.confirm('선택한 좌석이 초기화됩니다. 날짜를 변경하시겠습니까?');
      if (!confirm) return;
    }
    setChosenDate(newDate);
    fetchSeats(newDate, chosenTime);
  };

  // 시간 변경 핸들러
  const handleTimeChange = (newTime) => {
    if (selectedSeats.length > 0) {
      const confirm = window.confirm('선택한 좌석이 초기화됩니다. 시간을 변경하시겠습니까?');
      if (!confirm) return;
    }
    setChosenTime(newTime);
    fetchSeats(chosenDate, newTime);
  };

  const refreshSeats = () => {
    const confirmRefresh = window.confirm('좌석 정보를 새로고침하시겠습니까?\n선택한 좌석이 모두 해제됩니다.');
    if (!confirmRefresh) return;
    fetchSeats(chosenDate, chosenTime);
  };

  const handleComplete = () => {
    if (selectedSeats.length === 0) {
      alert('좌석을 선택해주세요.');
      return;
    }
    setIsPayment(true);
  };

  const handlePayment = () => {
    alert(
      `결제 방식: ${{
        creditCard: '신용카드',
        kakaoPay: '카카오페이',
        payPal: '페이팔',
        bankTransfer: '계좌이체',
      }[paymentMethod]}\n결제 금액: ${totalPrice.toLocaleString()}원\n결제 성공!`
    );
    router.push('/my-reservations');
  };


  // Payment view
  if (isPayment) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-gray-100 p-6">
        <Header/>
        <div className="w-full max-w-md bg-white rounded-lg shadow p-6">
          <button onClick={() => setIsPayment(false)} className="mb-4 text-sm text-gray-500 hover:underline">
            &larr; 뒤로
          </button>

          <h2 className="text-2xl font-bold mb-4">결제하기</h2>

          <div className="mb-4">
            <h3 className="font-medium mb-2">공연 정보</h3>
            <p className="text-gray-800 font-semibold">{showInfo.title}</p>
            <p className="text-gray-600">{new Date(chosenDate).toLocaleDateString('ko-KR', {year:'numeric', month:'2-digit', day:'2-digit'})} {chosenTime}</p>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">선택된 좌석</h3>
            <ul className="list-disc list-inside">
              {selectedSeats.map(seat => (
                <li key={seat.id} className="text-gray-700">{seat.id}</li>
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
              {['creditCard','kakaoPay','payPal','bankTransfer'].map(method => (
                <label key={method} className="flex items-center">
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    checked={paymentMethod === method}
                    onChange={() => setPaymentMethod(method)}
                    className="mr-2"
                  />
                  {{creditCard:'신용카드', kakaoPay:'카카오페이', payPal:'페이팔', bankTransfer:'계좌이체'}[method]}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handlePayment}
            className="w-full bg-red-600 text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors duration-200"
          >
            결제하기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 공연 정보 헤더 */}
      <Header/>
      <div className="text-white p-1 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-lg font-bold text-gray-800">
                좌석 선택
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-black px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-4 text-sm">
                  <span>다른 관람일자 선택:</span>
                  <select
                    value={chosenDate}
                    onChange={e => handleDateChange(e.target.value)}
                    className="bg-gray-100 text-black px-2 py-1 rounded text-sm border"
                  >
                    {showInfo.schedules.map((dateInfo, index) => (
                      <option key={index} value={dateInfo.date}>
                        {new Date(dateInfo.date).toLocaleDateString('ko-KR', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit',
                          weekday: 'short'
                        })}
                      </option>
                    ))}
                  </select>
                  <span>시간:</span>
                  <select
                    value={chosenTime}
                    onChange={e => handleTimeChange(e.target.value)}
                    className="bg-gray-100 text-black px-2 py-1 rounded text-sm border"
                  >
                    <option value="17:00">19시 00분</option>
                    <option value="14:00">14시 00분</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
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

                {/* 첫 번째 줄: 1구역만 */}
                <div className="flex justify-center mb-6">
                  {(() => {
                    const zone = data.zones[0]; // 1구역
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.zoneId === zone.id).length;

                    return (
                      <button
                        key={zone.id}
                        onClick={() => handleZoneSelect(zone.id)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 ${
                          zone.color === 'red' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                            zone.color === 'blue' ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' :
                              zone.color === 'green' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                                zone.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100' :
                                  'border-purple-500 bg-purple-50 hover:bg-purple-100'
                        }`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zone.name}</div>
                        {zoneSelectedCount > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            {zoneSelectedCount}석 선택됨
                          </div>
                        )}
                      </button>
                    );
                  })()}
                </div>

                {/* 두 번째 줄: 2구역, 3구역 */}
                <div className="flex justify-center gap-8 mb-6">
                  {[1, 2].map((index) => {
                    const zone = data.zones[index]; // 2구역, 3구역
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.zoneId === zone.id).length;

                    return (
                      <button
                        key={zone.id}
                        onClick={() => handleZoneSelect(zone.id)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 ${
                          zone.color === 'red' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                            zone.color === 'blue' ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' :
                              zone.color === 'green' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                                zone.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100' :
                                  'border-purple-500 bg-purple-50 hover:bg-purple-100'
                        }`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zone.name}</div>
                        {zoneSelectedCount > 0 && (
                          <div className="text-sm text-red-600 font-semibold">
                            {zoneSelectedCount}석 선택됨
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* 세 번째 줄: 4구역, 5구역 */}
                <div className="flex justify-center gap-8">
                  {[3, 4].map((index) => {
                    const zone = data.zones[index]; // 4구역, 5구역
                    const zoneSelectedCount = selectedSeats.filter(seat => seat.zoneId === zone.id).length;

                    return (
                      <button
                        key={zone.id}
                        onClick={() => handleZoneSelect(zone.id)}
                        className={`p-8 rounded-lg border-4 transition-all duration-200 hover:shadow-lg relative w-64 h-32 ${
                          zone.color === 'red' ? 'border-red-500 bg-red-50 hover:bg-red-100' :
                            zone.color === 'blue' ? 'border-blue-500 bg-blue-50 hover:bg-blue-100' :
                              zone.color === 'green' ? 'border-green-500 bg-green-50 hover:bg-green-100' :
                                zone.color === 'yellow' ? 'border-yellow-500 bg-yellow-50 hover:bg-yellow-100' :
                                  'border-purple-500 bg-purple-50 hover:bg-purple-100'
                        }`}
                      >
                        {zoneSelectedCount > 0 && (
                          <div className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                            {zoneSelectedCount}
                          </div>
                        )}
                        <div className="text-2xl font-bold mb-2">{zone.name}</div>
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

            {/* 구역이 선택된 경우 - 좌석 선택 화면 */}
            {selectedZone && (
              <div>
                <div className="flex items-center justify-center mb-6">
                  <button
                    onClick={() => setSelectedZone(null)}
                    className="mr-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                  >
                    ←
                  </button>
                  <span className={`px-6 py-3 rounded-lg font-bold text-white ${
                    data.zones.find(z => z.id === selectedZone)?.color === 'red' ? 'bg-red-600' :
                      data.zones.find(z => z.id === selectedZone)?.color === 'blue' ? 'bg-blue-600' :
                        data.zones.find(z => z.id === selectedZone)?.color === 'green' ? 'bg-green-600' :
                          data.zones.find(z => z.id === selectedZone)?.color === 'yellow' ? 'bg-yellow-600' :
                            'bg-purple-600'
                  }`}>
                    {data.zones.find(z => z.id === selectedZone)?.name}
                  </span>
                </div>

                {(() => {
                  const zone = data.zones.find(z => z.id === selectedZone);
                  const zoneIndex = data.zones.findIndex(z => z.id === selectedZone);

                  return (
                    <div className="space-y-2">
                      {zone.rows.map((row, rowIndex) => (
                        <div key={row.row} className="flex items-center justify-center">
                          <span className="w-8 text-right mr-4 font-semibold text-gray-700">
                            {row.row}
                          </span>

                          <div className="flex gap-1">
                            {row.seats.map((seat, seatIndex) => {
                              const availableClass = getZoneColorClasses(zone.color, 'available');
                              const selectedClass = getZoneColorClasses(zone.color, 'selected');
                              const disabledClass = 'border-gray-400 bg-gray-400 cursor-not-allowed opacity-60';

                              const statusClass = seat.status === 'available'
                                ? `${availableClass} cursor-pointer`
                                : seat.status === 'selected'
                                  ? `${selectedClass} cursor-pointer`
                                  : disabledClass;

                              return (
                                <button
                                  key={seatIndex}
                                  onClick={() => toggleSeat(zoneIndex, rowIndex, seatIndex)}
                                  disabled={seat.status === 'occupied'}
                                  className={`w-8 h-8 border-2 rounded-md font-semibold text-xs transition-all duration-200 ${statusClass}`}
                                  title={`${zone.name}-${row.row}${seatIndex + 1}`}
                                >
                                  {seatIndex + 1}
                                </button>
                              );
                            })}
                          </div>

                          <span className="w-8 text-left ml-4 font-semibold text-gray-700">
                            {row.row}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 h-full bg-white border-l border-gray-200 p-6 flex flex-col shadow-lg">
          {/* 공연 정보 카드 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-3">
              <div className="w-16 h-20 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-600">
                <div className="lg:col-span-1">
                  <Image
                    src={showInfo.poster}
                    alt={showInfo.title}
                    width={400}
                    height={533}
                    className="rounded-lg object-cover w-full"
                  />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-sm mb-1">{showInfo.title}</h3>
                <p className="text-xs text-gray-600 mb-1">{showInfo.venue}</p>
              </div>
            </div>
          </div>

          {/* Zone Info */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">구역별 요금</h3>
            <div className="space-y-1">
              {data.zones.map((zone) => (
                <div key={zone.id} className="flex justify-between text-sm">
                  <span className={`font-semibold ${
                    zone.color === 'red' ? 'text-red-600' :
                      zone.color === 'blue' ? 'text-blue-600' :
                        zone.color === 'green' ? 'text-green-600' :
                          zone.color === 'yellow' ? 'text-yellow-600' :
                            'text-purple-600'
                  }`}>
                    {zone.name}
                  </span>
                  <span className="font-semibold">{zone.price.toLocaleString()}원</span>
                </div>
              ))}
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
                  {/* 구역별로 그룹화하여 표시 */}
                  {data.zones.map(zone => {
                    const zoneSeats = selectedSeats.filter(seat => seat.zoneId === zone.id);
                    if (zoneSeats.length === 0) return null;

                    return (
                      <div key={zone.id} className="mb-2">
                        <div className={`text-xs font-semibold mb-1 ${
                          zone.color === 'red' ? 'text-red-600' :
                            zone.color === 'blue' ? 'text-blue-600' :
                              zone.color === 'green' ? 'text-green-600' :
                                zone.color === 'yellow' ? 'text-yellow-600' :
                                  'text-purple-600'
                        }`}>
                          {zone.name} ({zoneSeats.length}석)
                        </div>
                        {zoneSeats.map(seat => (
                          <div key={seat.id} className="text-sm text-gray-700 ml-2">
                            {seat.row}{seat.seatNumber}번
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
              {/* 구역별 금액 표시 */}
              <div className="text-xs space-y-1 text-gray-600">
                {data.zones.map(zone => {
                  const zoneSeats = selectedSeats.filter(seat => seat.zoneId === zone.id);
                  if (zoneSeats.length === 0) return null;
                  const zoneTotal = zoneSeats.length * zone.price;

                  return (
                    <div key={zone.id} className="flex justify-between">
                      <span>{zone.name}: {zoneSeats.length}석</span>
                      <span>{zoneTotal.toLocaleString()}원</span>
                    </div>
                  );
                })}
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