"use client"
import React, {useState} from 'react';
import {useSearchParams} from "next/navigation";
import Image from "next/image";

// Mock data structure for seats
const mockData = {
  date: '2025-06-28',
  time: '17:00',
  floors: [
    {
      name: '1F',
      rows: [
        {row: 'A', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'B', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'C', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'D', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'E', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
      ],
      price: 80000,
    },
    {
      name: '2F',
      rows: [
        {row: 'P', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'Q', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'R', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'S', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
        {row: 'T', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
      ],
      price: 150000,
    },
  ],
};

// Mock 공연 정보 데이터 (나중에 API로 대체)
const mockShowInfo = {
  title: '뮤지컬 라이온킹',
  venue: '샬롯데씨어터',
  poster: '/images/poster1.png', // 실제로는 공연 포스터 이미지 URL
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

// 일부 좌석을 이미 예약된 상태로 설정
mockData.floors[0].rows[0].seats[3].status = 'occupied';
mockData.floors[0].rows[0].seats[4].status = 'occupied';
mockData.floors[0].rows[1].seats[7].status = 'occupied';
mockData.floors[1].rows[2].seats[2].status = 'occupied';
mockData.floors[1].rows[2].seats[9].status = 'occupied';

export default function MyReservationsPage() {
  const searchParams = useSearchParams()
  const eventId = searchParams.get('eventId')
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const [data, setData] = useState(mockData);
  const [showInfo, setShowInfo] = useState(mockShowInfo);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [chosenDate, setChosenDate] = useState(date);
  const [chosenTime, setChosenTime] = useState(time);



  // 선택된 좌석의 총 금액 계산
  const totalPrice = selectedSeats.reduce((sum, id) => {
    const floorName = id.split('-')[0];
    const floor = data.floors.find(f => f.name === floorName);
    return sum + (floor?.price ?? 0);
  }, 0);

  const toggleSeat = (floorIndex, rowIndex, seatIndex) => {
    const currentSeat = data.floors[floorIndex].rows[rowIndex].seats[seatIndex];

    // 이미 점유된 좌석은 선택할 수 없음
    if (currentSeat.status === 'occupied') {
      alert('이미 예약된 좌석입니다.');
      return;
    }

    // 4개 이상 선택하려고 할 때 방지
    if (currentSeat.status === 'available' && selectedSeats.length >= 6) {
      alert('최대 6개의 좌석만 선택할 수 있습니다.');
      return;
    }

    // 좌석 ID 생성
    const seatId = `${data.floors[floorIndex].name}-${data.floors[floorIndex].rows[rowIndex].row}${seatIndex + 1}`;

    // 상태 업데이트
    setData(prev => {
      const newData = JSON.parse(JSON.stringify(prev)); // 깊은 복사
      const seat = newData.floors[floorIndex].rows[rowIndex].seats[seatIndex];
      seat.status = seat.status === 'selected' ? 'available' : 'selected';
      return newData;
    });

    // 선택된 좌석 목록 업데이트
    setSelectedSeats(prev => {
      if (prev.includes(seatId)) {
        return prev.filter(id => id !== seatId);
      } else {
        return [...prev, seatId];
      }
    });
  };

  // API에서 좌석 정보를 가져오는 함수
  const fetchSeats = async (date, time) => {
    try {
      // 실제 API 호출 (나중에 활성화)
      // const response = await fetch(`/api/seats?date=${date}&time=${time}`);
      // const seatData = await response.json();
      // setData(seatData);

      // 현재는 Mock 데이터로 시뮬레이션
      const newMockData = {
        date: date,
        time: time,
        floors: [
          {
            name: '1F',
            rows: [
              {row: 'A', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'B', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'C', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'D', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'E', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
            ],
            price: 80000,
          },
          {
            name: '2F',
            rows: [
              {row: 'P', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'Q', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'R', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'S', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
              {row: 'T', seats: Array.from({length: 12}, (_, i) => ({id: i, status: 'available'}))},
            ],
            price: 150000,
          },
        ],
      };

      // 랜덤하게 일부 좌석을 점유 상태로 설정 (날짜/시간별로 다른 패턴)
      const occupiedPositions = new Set();
      const numOccupied = Math.floor(Math.random() * 6) + 4; // 4~9개

      while (occupiedPositions.size < numOccupied) {
        const floorIndex = Math.floor(Math.random() * 2);
        const rowIndex = Math.floor(Math.random() * 5);
        const seatIndex = Math.floor(Math.random() * 12);
        const position = `${floorIndex}-${rowIndex}-${seatIndex}`;
        occupiedPositions.add(position);
      }

      occupiedPositions.forEach(position => {
        const [floorIndex, rowIndex, seatIndex] = position.split('-').map(Number);
        newMockData.floors[floorIndex].rows[rowIndex].seats[seatIndex].status = 'occupied';
      });

      setData(newMockData);
      setSelectedSeats([]);

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
    alert(`${selectedSeats.length}개의 좌석이 선택되었습니다.\n좌석: ${selectedSeats.join(', ')}`);
  };

  const handlePrevious = () => {
    if (selectedSeats.length > 0) {
      const confirm = window.confirm('선택한 좌석이 초기화됩니다. 이전 단계로 이동하시겠습니까?');
      if (!confirm) return;
    }
    alert('이전 단계로 이동합니다.');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* 공연 정보 헤더 */}
      <div className="text-white p-4 shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-lg font-bold text-gray-800">
                좌석 선택
              </div>
              <div className="text-black px-4 py-2 rounded-lg pl-20">
                <div className="text-lg font-bold">
                  {showInfo.title}
                </div>
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

            {data.floors.map((floor, floorIndex) => (
              <div key={floor.name} className="mb-8">
                <div className="flex justify-center mb-4">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold">
                    {floor.name}
                  </span>
                </div>

                <div className="space-y-2">
                  {floor.rows.map((row, rowIndex) => (
                    <div key={row.row} className="flex items-center justify-center">
                      <span className="w-8 text-right mr-4 font-semibold text-gray-700">
                        {row.row}
                      </span>

                      <div className="flex gap-1">
                        {row.seats.map((seat, seatIndex) => {
                          // floor별로 색상 다르게 적용
                          const availableClass = floor.name === '1F'
                            ? 'border-green-500 bg-green-100 hover:bg-green-200'
                            : 'border-yellow-500 bg-yellow-100 hover:bg-yellow-200';
                          const selectedClass = 'border-blue-600 bg-blue-600 hover:bg-blue-700 text-white';
                          const disabledClass = 'border-gray-400 bg-gray-400 cursor-not-allowed opacity-60';
                          const statusClass = seat.status === 'available'
                            ? `${availableClass} cursor-pointer`
                            : seat.status === 'selected'
                              ? `${selectedClass} cursor-pointer`
                              : disabledClass;

                          return (
                            <button
                              key={seatIndex}
                              onClick={() => toggleSeat(floorIndex, rowIndex, seatIndex)}
                              disabled={seat.status === 'occupied'}
                              className={`w-8 h-8 border-2 rounded-md font-semibold text-xs transition-all duration-200 ${statusClass}`}
                              title={`${floor.name}-${row.row}${seatIndex + 1}`}
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
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 h-full bg-white border-l border-gray-200 p-6 flex flex-col shadow-lg">
          {/* 공연 정보 카드 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex space-x-3">
              <div
                className="w-16 h-20 bg-gray-300 rounded flex-shrink-0 flex items-center justify-center text-xs text-gray-600">
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

          {/* Legend */}
          <div className="mb-6">
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="inline-block w-5 h-5 border-2 border-blue-600 bg-blue-600 mr-3 rounded"></span>
                <span className="text-sm">선택됨</span>
              </div>
              <div className="flex items-center">
                <span
                  className="inline-block w-5 h-5 border-2 border-gray-400 bg-gray-400 opacity-60 mr-3 rounded"></span>
                <span className="text-sm">선택 불가</span>
              </div>
            </div>
          </div>

          {/* Seat Info */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">좌석등급 / 잔여석</h3>
            {/* 가격대 범례 추가 */}
            <div className="mb-2">
              <div className="flex justify-between text-sm">
                <span>1F 좌석</span>
                <span className="font-semibold text-green-600">{data.floors[0].price.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>2F 좌석</span>
                <span className="font-semibold text-yellow-600">{data.floors[1].price.toLocaleString()}원</span>
              </div>
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
                  {selectedSeats.map(seatId => (
                    <div key={seatId} className="text-sm font-medium text-blue-600">
                      {seatId}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Total Price */}
          {selectedSeats.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded-md">
              <div className="flex justify-between items-center">
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