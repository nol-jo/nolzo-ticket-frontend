"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {Search, User, Siren, UserRoundPlus, TicketCheck, UserRoundX} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userInfo, setUserInfo] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    // 클라이언트에서만 localStorage 접근
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("userInfo")

    setIsLoggedIn(loggedIn)
    if (user) {
      setUserInfo(JSON.parse(user))
    }
  }, [])

  const handleLoginClick = () => {
    const currentPath = window.location.pathname
    router.push(`/login`)
  }

  const handleRegisterClick = () => {
    const currentPath = window.location.pathname
    router.push(`/register`)
  }

  const handleAdminClick = () => {
    router.push(`/admin`)
  }

  const handleMyReservationClick = () => {
    if (!isLoggedIn) {
      router.push(`/login?returnUrl=${encodeURIComponent("/my-reservations")}`)
    } else {
      router.push("/my-reservations")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn")
    localStorage.removeItem("userInfo")
    setIsLoggedIn(false)
    setUserInfo(null)
    router.push("/")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
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
                      <User className="w-4 h-4 mb-1" />
                      로그인
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleRegisterClick}>
                      <UserRoundPlus className="w-4 h-4 mb-1" />
                      회원가입
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReservationClick}>
                      <TicketCheck className="w-4 h-4 mb-1" />
                      내 예약
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={() => router.push("/my-profile")}>
                      <User className="w-4 h-4 mb-1" />
                      {userInfo?.name || "사용자"}
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReservationClick}>
                      <TicketCheck className="w-4 h-4 mb-1" />
                      내 예약
                    </Button>

                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleLogout}>
                      <UserRoundX className="w-4 h-4 mb-1" />
                      로그아웃
                    </Button>

                    <Button variant="ghost" size="sm" className="text-red-600" onClick={handleAdminClick}>
                      <Siren className="w-4 h-4 mb-1" />
                      관리자
                    </Button>
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
