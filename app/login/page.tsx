"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showEmailLogin, setShowEmailLogin] = useState(false)

  const handleSocialLogin = (provider: string) => {
    // 실제로는 각 소셜 로그인 API를 호출
    console.log(`${provider} 로그인 시도`)

    // 로그인 성공 시뮬레이션
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        name: "홍길동",
        email: "user@example.com",
        provider: provider,
      }),
    )

    // 이전 페이지로 돌아가거나 홈으로 이동
    const returnUrl = new URLSearchParams(window.location.search).get("returnUrl")
    router.push(returnUrl || "/")
  }

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      alert("이메일과 비밀번호를 입력해주세요.")
      return
    }

    // 이메일 로그인 처리
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        name: "홍길동",
        email: email,
        provider: "email",
      }),
    )

    const returnUrl = new URLSearchParams(window.location.search).get("returnUrl")
    router.push(returnUrl || "/")
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <div className="bg-blue-600 text-white px-4 py-2 rounded text-2xl font-bold mb-4">NOL</div>
          </Link>
          <h2 className="text-3xl font-bold text-blue-600 mb-2">NOL</h2>
          <p className="text-gray-600 mb-1">놀수록 놀라운 세상, NOL</p>
          <p className="text-gray-500 text-sm">새로워진 NOL에서</p>
          <p className="text-gray-500 text-sm">더 많은 즐거움과 혜택을 만나보세요!</p>
        </div>

        {/* 로그인 폼 */}
        <Card className="p-8 space-y-4">
          {!showEmailLogin ? (
            <>
              {/* 소셜 로그인 버튼들 */}
              <Button
                onClick={() => handleSocialLogin("kakao")}
                className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs font-bold">●</span>
                </div>
                카카오로 시작하기
              </Button>

              <Button
                onClick={() => handleSocialLogin("naver")}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center">
                  <span className="text-white text-xs font-bold">N</span>
                </div>
                네이버로 시작하기
              </Button>

              <Button
                onClick={() => handleSocialLogin("google")}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-white border rounded flex items-center justify-center">
                  <span className="text-blue-500 text-xs font-bold">G</span>
                </div>
                구글로 시작하기
              </Button>

              <Button
                onClick={() => handleSocialLogin("apple")}
                className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                <div className="w-5 h-5 bg-black rounded flex items-center justify-center">
                  <span className="text-white text-xs">🍎</span>
                </div>
                애플로 시작하기
              </Button>

              <Button
                onClick={() => setShowEmailLogin(true)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 py-3"
              >
                이메일로 시작하기 ›
              </Button>
            </>
          ) : (
            <>
              {/* 이메일 로그인 폼 */}
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3"
                    required
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3"
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
                  로그인
                </Button>
              </form>

              <Button
                onClick={() => setShowEmailLogin(false)}
                variant="ghost"
                className="w-full text-gray-600 hover:text-gray-800 py-2"
              >
                ← 다른 방법으로 로그인
              </Button>
            </>
          )}
        </Card>

        {/* 아이디 찾기 */}
        <div className="text-center">
          <Link href="#" className="text-gray-500 hover:text-gray-700 text-sm">
            아이디 찾기
          </Link>
        </div>

        {/* 프로모션 배너 */}
        <div className="bg-yellow-100 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-800">첫 구매 10% 할인 쿠폰</p>
            <p className="text-xs text-gray-600">지금 시작하고 가져가세요!</p>
          </div>
          <div className="text-2xl">🎫</div>
        </div>
      </div>
    </div>
  )
}
