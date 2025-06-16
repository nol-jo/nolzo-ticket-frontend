import { Search, User } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function Component() {
  return (
    <div className="min-h-screen bg-white">
      {/* Top Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">NOL</div>
                <span className="text-gray-800 font-medium">interpark</span>
              </Link>

              {/* Search */}
              <div className="hidden md:flex items-center">
                <div className="relative">
                  <Input placeholder="인기 공연 티켓팅 & 해외 모음" className="w-80 pr-10 border-gray-300" />
                  <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
                <Button className="ml-2 bg-blue-600 hover:bg-blue-700">
                  <div className="bg-white text-blue-600 px-2 py-1 rounded text-xs font-bold mr-2">NOL</div>
                  내외 통합검색
                </Button>
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-6">
              <nav className="hidden lg:flex items-center space-x-6 text-sm text-gray-600">
                <Link href="#" className="hover:text-gray-900">
                  NOL
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  TRIPLE
                </Link>
                <Link href="#" className="hover:text-gray-900">
                  Interpark Global
                </Link>
              </nav>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-600">
                  <User className="w-4 h-4 mr-1" />
                  로그인
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-600">
                  내 예약
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-14">
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              홈
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium">
              투어
            </Link>
            <Link href="#" className="text-blue-600 font-medium border-b-2 border-blue-600 pb-4">
              티켓
            </Link>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 text-sm">
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              뮤지컬
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              콘서트
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              스포츠
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              전시/행사
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              클래식/무용
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              아동/가족
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              연극
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              레저/캠핑
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              투어
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              MD상품
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              할인
            </Link>
            <Link href="#" className="text-blue-600 hover:text-blue-700">
              오픈예정
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              지역별
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-900">
              금요일장
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Banner */}
      <section className="bg-black relative h-96">
        <div className="absolute inset-0 flex items-end justify-center pb-8">
          <div className="flex space-x-2">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="w-12 h-16 bg-gray-700 rounded overflow-hidden">
                <Image
                  src="/placeholder.svg?height=64&width=48"
                  alt={`공연 포스터 ${i + 1}`}
                  width={48}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 육상재 밴드 */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-blue-600">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">THE BLUE JOURNEY</div>
                <h3 className="text-xl font-bold mb-2">육상재 밴드</h3>
                <p className="text-sm opacity-90">6.4(수) 20:00 일반예매 티켓오픈</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <Image
                  src="/placeholder.svg?height=80&width=60"
                  alt="육상재 밴드"
                  width={60}
                  height={80}
                  className="rounded"
                />
              </div>
            </div>
          </Card>

          {/* 뮤지컬 구텐베르크 */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-yellow-400 to-orange-500">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">두 남자가 쓴 가장 위대한 뮤지컬</div>
                <h3 className="text-xl font-bold mb-2">뮤지컬 구텐베르크</h3>
                <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
              </div>
              <div className="absolute bottom-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                GUTENBERG
              </div>
            </div>
          </Card>

          {/* 킬링시저 */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-red-600 to-red-800">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">나는, 사자의, 죽일 것이다.</div>
                <h3 className="text-xl font-bold mb-2">연극 킬링시저</h3>
                <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <Image
                  src="/placeholder.svg?height=80&width=60"
                  alt="킬링시저"
                  width={60}
                  height={80}
                  className="rounded"
                />
              </div>
            </div>
          </Card>

          {/* 제19회 DIMF */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-pink-300 to-pink-500">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">세계인의 뮤지컬축제</div>
                <h3 className="text-xl font-bold mb-2">제19회 DIMF</h3>
                <p className="text-sm opacity-90">6.4(수) 14:00 티켓오픈</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="flex space-x-1">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    D
                  </div>
                  <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    I
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    M
                  </div>
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    F
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 청년문화예술패스 */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">응원까지 시작 가능!</div>
                <h3 className="text-xl font-bold mb-2">청년문화예술패스</h3>
                <p className="text-sm opacity-90">지금 공연 · 전시 예약하세요</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
          </Card>

          {/* 손민수 & 임윤찬 */}
          <Card className="overflow-hidden">
            <div className="relative h-48 bg-gradient-to-br from-gray-800 to-black">
              <div className="absolute inset-0 p-6 text-white">
                <div className="text-sm opacity-90 mb-2">인디카토 음악프로젝트 30</div>
                <h3 className="text-xl font-bold mb-2">손민수 & 임윤찬</h3>
                <p className="text-sm opacity-90">6.4(수) 14:00 신예매 티켓오픈</p>
              </div>
              <div className="absolute bottom-4 right-4">
                <div className="text-white text-4xl opacity-50">🎹</div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
