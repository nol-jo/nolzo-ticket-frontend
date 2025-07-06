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

// SessionStorage에서 토큰 가져오기
export function getSessionToken(key: string): string | null {
  try {
    return sessionStorage.getItem(key)
  } catch (error) {
    console.error('SessionStorage access error:', error)
    return null
  }
}

// SessionStorage에 토큰 저장
export function setSessionToken(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value)
  } catch (error) {
    console.error('SessionStorage save error:', error)
  }
}

// SessionStorage에서 토큰 삭제
export function removeSessionToken(key: string) {
  try {
    sessionStorage.removeItem(key)
  } catch (error) {
    console.error('SessionStorage remove error:', error)
  }
}

export function clearAuthTokens(): void {
  try {
    sessionStorage.removeItem('accessToken')
    // 필요시 다른 인증 관련 데이터도 삭제
    sessionStorage.removeItem('userInfo')
  } catch (error) {
    console.error('SessionStorage clear error:', error)
  }
}

// API 유틸리티 함수들
export const authAPI = {
  // 현재 사용자 정보 가져오기 (accessToken에서 추출)
  saveAccessToken(token: string): void {
    setSessionToken('accessToken', token)
  },

  // AccessToken 가져오기
  getAccessToken(): string | null {
    return getSessionToken('accessToken')
  },

  // 현재 사용자 정보 가져오기 (accessToken에서 추출)
  getCurrentUser(): User | null {
    try {
      const accessToken = this.getAccessToken()
      if (!accessToken) return null

      const decoded = decodeJWT(accessToken)
      if (!decoded) return null

      // 토큰 만료 체크
      const currentTime = Math.floor(Date.now() / 1000)
      if (decoded.exp < currentTime) {
        this.clearTokens() // 만료된 토큰 삭제
        return null
      }

      return decoded as User
    } catch (error) {
      console.error('getCurrentUser error:', error)
      return null
    }
  },

  // 토큰 정리
  clearTokens(): void {
    clearAuthTokens()
  },

  async login(credentials: { email: string; password: string }): Promise<{ success: boolean; user?: User }> {
    try {
      const response = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        credentials: 'include', // RefreshToken 쿠키 받기
      })

      if (response.ok) {
        const data = await response.json()

        // AccessToken을 SessionStorage에 저장
        this.saveAccessToken(data.accessToken)

        const user = this.getCurrentUser()
        return { success: true, user: user || undefined }
      }

      return { success: false }
    } catch (error) {
      console.error('login error:', error)
      return { success: false }
    }
  },

  // 로그아웃
  async logout(): Promise<boolean> {
    try {
      await fetch('/api/v1/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // RefreshToken 쿠키 자동 전송
      })

      // SessionStorage 정리
      this.clearTokens()

      return true
    } catch (error) {
      console.error('logout error:', error)
      // 에러가 발생해도 로컬 토큰은 정리
      this.clearTokens()
      return true
    }
  },

  // 액세스 토큰 재발급
  async reissueAccessToken(): Promise<boolean> {
    try {
      const response = await fetch('/api/v1/auth/reissue', {
        method: 'GET',
        credentials: 'include', // RefreshToken 쿠키 자동 전송
      })

      if (response.ok) {
        const data = await response.json()

        // 새로운 AccessToken을 SessionStorage에 저장
        this.saveAccessToken(data.accessToken)

        return true
      }

      // 재발급 실패시 토큰 정리
      this.clearTokens()
      return false
    } catch (error) {
      console.error('reissueAccessToken error:', error)
      this.clearTokens()
      return false
    }
  },

  // 토큰 만료 체크 및 자동 갱신
  async checkAndRefreshToken(): Promise<User | null> {
    const user = this.getCurrentUser()

    // 토큰이 없거나 만료된 경우 재발급 시도
    if (!user) {
      const refreshSuccess = await this.reissueAccessToken()

      if (refreshSuccess) {
        return this.getCurrentUser()
      }

      return null
    }

    // 토큰이 5분 이내 만료될 경우 미리 갱신
    const currentTime = Math.floor(Date.now() / 1000)
    const timeUntilExpiry = user.exp - currentTime

    if (timeUntilExpiry < 300) { // 5분
      const refreshSuccess = await this.reissueAccessToken()
      if (refreshSuccess) {
        return this.getCurrentUser()
      }
    }

    return user
  },

  // 인증이 필요한 페이지에서 사용할 가드 함수
  async requireAuth(): Promise<User | null> {
    const user = await this.checkAndRefreshToken()

    if (!user) {
      // 인증 실패시 로그인 페이지로 리다이렉트
      window.location.href = '/login'
      return null
    }

    return user
  }
}
