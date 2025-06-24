"use client"

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"

interface LoginRequest {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    const loginData: LoginRequest = {
      email,
      password
    }

    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify(loginData),
      })

      if (response.ok) {
        // 로그인 성공 이벤트 발생 (Header 컴포넌트에서 감지)
        window.dispatchEvent(new CustomEvent('loginSuccess'))

        // 리다이렉트
        const returnUrl = searchParams.get('returnUrl') || '/'
        router.push(returnUrl)
      } else {
        // 에러 응답 처리
        if (response.status === 401) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.')
        } else if (response.status === 400) {
          setError('입력 정보를 확인해주세요.')
        } else {
          setError('로그인에 실패했습니다. 다시 시도해주세요.')
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    handleEmailLogin(e)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault()
      const fakeEvent = {
        preventDefault: () => {}
      } as React.FormEvent
      handleEmailLogin(fakeEvent)
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

        {/* 로그인 폼 */}
        <Card className="p-8 space-y-4">
          {/* 에러 메시지 */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              {error}
            </div>
          )}

          {/* 이메일 로그인 폼 */}
          <div className="space-y-4" onKeyPress={handleKeyPress}>
            <div>
              <Input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full py-3"
                disabled={isLoading}
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
                disabled={isLoading}
                required
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg"
              disabled={isLoading || !email || !password}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </div>

          {/* 추가 링크들 */}
          <div className="space-y-3 pt-4">
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
                onClick={() => {
                  // 비밀번호 찾기 기능 구현 시 사용
                  alert('비밀번호 찾기 기능은 준비 중입니다.')
                }}
              >
                비밀번호를 잊으셨나요?
              </button>
            </div>

            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
              <span>아직 계정이 없으신가요?</span>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 font-medium"
                onClick={() => {
                  const returnUrl = searchParams.get('returnUrl')
                  const registerUrl = returnUrl
                    ? `/register?returnUrl=${encodeURIComponent(returnUrl)}`
                    : '/register'
                  router.push(registerUrl)
                }}
              >
                회원가입
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}