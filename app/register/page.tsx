"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

export default function RegisterPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [birth, setBirth] = useState("")

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // 모든 필드가 입력됐는지 확인
    if (!email || !password || !name || !birth) {
      alert("이메일, 비밀번호, 이름, 생년월일을 모두 입력해주세요.")
      return
    }

    try {
      const response = await fetch("http://localhost:8080/api/v1/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          name,
          birth, // YYYY-MM-DD 형식
        }),
      })

      if (!response.ok) {
        // 서버가 error 메시지를 JSON으로 반환한다면 파싱해서 보여줄 수도 있습니다.
        const err = await response.json().catch(() => null)
        alert(err?.message || "회원가입에 실패했습니다.")
        return
      }

      // 회원가입 성공 시 메인 페이지로 이동
      router.push("/login?returnUrl=" + encodeURIComponent("/my-profile"))
    } catch (error) {
      console.error("회원가입 중 오류 발생:", error)
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 로고 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-blue-600 mb-2">NOL</h2>
          <p className="text-gray-600 mb-1">놀수록 놀라운 세상, NOL</p>
          <p className="text-gray-500 text-sm">새로워진 NOL에서</p>
          <p className="text-gray-500 text-sm">더 많은 즐거움과 혜택을 만나보세요!</p>
        </div>

        {/* 회원가입 폼 */}
        <Card className="p-8 space-y-4">
          <form onSubmit={handleRegister} className="space-y-4">
            <Input
              type="email"
              placeholder="이메일 주소"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full py-3"
              required
            />
            <Input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full py-3"
              required
            />
            <Input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full py-3"
              required
            />
            <Input
              type="date"
              placeholder="생년월일"
              value={birth}
              onChange={(e) => setBirth(e.target.value)}
              className="w-full py-3"
              required
            />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg">
              회원가입
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}