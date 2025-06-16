"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, User, LogOut } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

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
    router.push(`/login?returnUrl=${encodeURIComponent(currentPath)}`)
  }

  const handleMyReservationClick = () => {
    if (!isLoggedIn) {
      const currentPath = window.location.pathname
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
                <span className="text-gray-800 font-medium">interpark</span>
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
                {!isLoggedIn ? (
                  <>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleLoginClick}>
                      <User className="w-4 h-4 mr-1" />
                      로그인
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReservationClick}>
                      내 예약
                    </Button>
                  </>
                ) : (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-600">
                          <User className="w-4 h-4 mr-1" />
                          {userInfo?.name || "사용자"}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => router.push("/my-profile")}>내 정보</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push("/my-reservations")}>내 예약</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          로그아웃
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button variant="ghost" size="sm" className="text-gray-600" onClick={handleMyReservationClick}>
                      내 예약
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-14">
            <Link href="/" className="text-blue-600 font-medium">
              티켓
            </Link>
          </div>
        </div>
      </nav>

      {/* Sub Navigation */}
      <nav className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 h-12 text-sm overflow-x-auto">
            <Link href="/contents/genre/musical" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              뮤지컬
            </Link>
            <Link href="/contents/genre/concert" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              콘서트
            </Link>
            <Link href="/contents/genre/exhibition" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              전시/행사
            </Link>
            <Link href="/contents/genre/classic" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              클래식/무용
            </Link>
            <Link href="/contents/genre/family" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              아동/가족
            </Link>
            <Link href="/contents/genre/theater" className="text-gray-600 hover:text-gray-900 whitespace-nowrap">
              연극
            </Link>
            <Link href="/contents/genre/upcoming" className="text-blue-600 hover:text-blue-700 whitespace-nowrap">
              오픈예정
            </Link>
            <Link
              href="/contents/ranking?genre=MUSICAL"
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
