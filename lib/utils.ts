import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface User {
  sub: string  // user id
  email: string
  role: 'USER' | 'ADMIN'
  iat: number
  exp: number
}

// JWT 토큰 디코딩 함수
export function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (error) {
    console.error('JWT decode error:', error)
    return null
  }
}

// 쿠키에서 토큰 가져오기
export function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift() || null
  }
  return null
}

// 쿠키 삭제
export function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}

// API 유틸리티 함수들
export const authAPI = {
  // 현재 사용자 정보 가져오기 (accessToken에서 추출)
  getCurrentUser(): User | null {
    try {
      const accessToken = getCookie('accessToken')
      if (!accessToken) return null

      const decoded = decodeJWT(accessToken)
      if (!decoded) return null

      // 토큰 만료 체크
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp < currentTime) {
        return null // 토큰 만료
      }

      return decoded as User
    } catch (error) {
      console.error('getCurrentUser error:', error)
      return null
    }
  },

  // 로그아웃
  async logout(): Promise<boolean> {
    try {
      await fetch('http://localhost:8080/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 자동으로 포함하여 전송
      })

      return true
    } catch (error) {
      console.error('logout error:', error)
      return true
    }
  },

  // 액세스 토큰 재발급
  async reissueAccessToken(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8080/api/v1/auth/reissue', {
        method: 'GET',
        credentials: 'include', // 쿠키 포함
      })

      return response.ok
    } catch (error) {
      console.error('reissueAccessToken error:', error)
      return false
    }
  },

  // 토큰 만료 체크 및 자동 갱신
  async checkAndRefreshToken(): Promise<User | null> {
    const user = this.getCurrentUser()

    if (!user) {
      const refreshSuccess = await this.reissueAccessToken()

      if (refreshSuccess) {
        return this.getCurrentUser()
      }

      return null
    }

    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = user.exp - currentTime

    if (timeUntilExpiry < 300) { // 5분
      const refreshSuccess = await this.reissueAccessToken()
      if (refreshSuccess) {
        return this.getCurrentUser()
      }
    }

    return user
  }
}
