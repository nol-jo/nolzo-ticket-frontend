"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {Search, Siren, UserRoundPlus, TicketCheck, UserRoundX, UserRoundSearch, UserRound, Star} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authAPI, User} from "@/lib/utils";

export default function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  // 초기 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true)

      const user = await authAPI.checkAndRefreshToken()

      if (user) {
        setIsLoggedIn(true)
        setUserInfo(user)
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
      }

      setIsLoading(false)
    }

    checkAuthStatus()
  }, [])

  // 주기적으로 토큰 상태 체크 (5분마다)
  useEffect(() => {
    if (!isLoggedIn) return

    const interval = setInterval(async () => {
      const user = await authAPI.checkAndRefreshToken()

      if (user) {
        setUserInfo(user)
      } else {
        setIsLoggedIn(false)
        setUserInfo(null)
        router.push('/login')
      }
    }, 5 * 60 * 1000) // 5분

    return () => clearInterval(interval)
  }, [isLoggedIn, router])

  // 로그인 성공 시 상태 업데이트를 위한 이벤트 리스너
  useEffect(() => {
    const handleLoginSuccess = async () => {
      const user = authAPI.getCurrentUser()
      if (user) {
        setIsLoggedIn(true)
        setUserInfo(user)
      }
    }

    // 커스텀 이벤트 리스너 (로그인 페이지에서 발생시킴)
    window.addEventListener('loginSuccess', handleLoginSuccess)

    return () => {
      window.removeEventListener('loginSuccess', handleLoginSuccess)
    }
  }, [])

  const handleLoginClick = () => {
    const currentPath = window.location.pathname
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
  }

  const handleRegisterClick = () => {
    const currentPath = window.location.pathname
    router.push(`/register?returnUrl=${encodeURIComponent(currentPath)}`)
  }

  const handleAdminClick = () => {
    // 관리자 권한 체크
    // if (userInfo?.role !== 'ADMIN') {
    //   alert('관리자 권한이 필요합니다.')
    //   return
    // }
    router.push(`/admin`)
  }

  const handleMyReservationClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?returnUrl=${encodeURIComponent("/my-reservations")}`)
    } else {
      window.location.href = "/my-reservations";
    }
  }

  const handleMyReviewsClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?returnUrl=${encodeURIComponent("/my-reviews")}`)
    } else {
      window.location.href = "/my-reviews";
    }
  }

  const handleLogout = async () => {
    setIsLoading(true)

    const success = await authAPI.logout()

    if (success) {
      setIsLoggedIn(false)
      setUserInfo(null)
      alert('로그아웃 되었습니다.')
      window.location.href = "/";
    } else {
      alert('로그아웃 중 오류가 발생했습니다.')
    }

    setIsLoading(false)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  // 로딩 중일 때는 스켈레톤 UI 표시
  if (isLoading) {
    return (
      <>
        {/* Top Header */}
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center space-x-8">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">NOL</div>
                  <span className="text-gray-800 font-medium">Ticket</span>
                </Link>

                {/* Search */}
                <div className="hidden md:flex items-center">
                  <form onSubmit={handleSearch} className="relative">
                    <Input
                      placeholder="인기 공연 티켓팅 & 해외 모음"
                      className="w-80 pr-10 border-gray-300"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <Search className="w-4 h-4 text-gray-400" />
                    </button>
                  </form>
                </div>
              </div>

              {/* Right Menu - Loading Skeleton */}
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Sub Navigation */}
        <nav className="bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center space-x-8 h-12 text-sm overflow-x-auto">
              <Link href="/contents/musical" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                뮤지컬
              </Link>
              <Link href="/contents/concert" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                콘서트
              </Link>
              <Link href="/contents/play" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
                연극
              </Link>
              <Link
                href="/contents/ranking"
                className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
              >
                랭킹
              </Link>
            </div>
          </div>
        </nav>
      </>
    )
  }

  return (
    <>
      {/* Top Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">NOL</div>
                <span className="text-gray-800 font-medium">Ticket</span>
              </Link>

              {/* Search */}
              <div className="hidden md:flex items-center">
                <form onSubmit={handleSearch} className="relative">
                  <Input
                    placeholder="인기 공연 티켓팅 & 해외 모음"
                    className="w-80 pr-10 border-gray-300"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Search className="w-4 h-4 text-gray-400" />
                  </button>
                </form>
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleLoginClick}>
                      <UserRound className="w-4 h-4 mb-1" />
                      로그인
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleRegisterClick}>
                      <UserRoundPlus className="w-4 h-4 mb-1" />
                      회원가입
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => router.push("/my-profile")}>
                      <UserRoundSearch className="w-4 h-4 mb-1" />
                      내 정보
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReservationClick}>
                      <TicketCheck className="w-4 h-4 mb-1" />
                      내 예약
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReviewsClick}>
                      <Star className="w-4 h-4 mb-1" />
                      작성한 리뷰
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600"
                      onClick={handleLogout}
                      disabled={isLoading}
                    >
                      <UserRoundX className="w-4 h-4 mb-1" />
                      로그아웃
                    </Button>

                    {userInfo?.role === 'ADMIN' && (
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={handleAdminClick}>
                        <Siren className="w-4 h-4 mb-1" />
                        관리자
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Sub Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 text-sm overflow-x-auto">
            <Link href="/contents/musical" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              뮤지컬
            </Link>
            <Link href="/contents/concert" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              콘서트
            </Link>
            <Link href="/contents/play" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              연극
            </Link>
            <Link
              href="/contents/ranking"
              className="text-blue-600 hover:text-blue-700 whitespace-nowrap"
            >
              랭킹
            </Link>
          </div>
        </div>
      </nav>
    </>
  )
}