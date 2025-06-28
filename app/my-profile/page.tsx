'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Key, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"
import {authAPI, getCookie, deleteCookie, User} from "@/lib/utils"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";

interface UserProfile {
  id: number
  name: string
  email: string
  birth: string
}

export default function MyProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    async function init() {
      // JWT 검증 및 재발급
      const jwtUser: User | null = await authAPI.checkAndRefreshToken();
      if (!jwtUser) {
        router.push(
          "/login?returnUrl=" + encodeURIComponent("/my-profile")
        );
        return;
      }

      // 액세스 토큰 헤더에 포함
      const accessToken = getCookie('accessToken');
      // 프로필 정보 API 호출
      try {
        const res = await fetch(
          "http://localhost:8080/api/v1/member",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!res.ok) throw new Error("Failed to fetch profile");
        const data = await res.json();
        setUserProfile({
          id: data.id,
          name: data.name,
          email: data.email,
          birth: data.birth
        });
      } catch (error) {
        console.error("Profile fetch error:", error);
        router.push(
          "/login?returnUrl=" + encodeURIComponent("/my-profile")
        );
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);


  // 비밀번호 변경 폼을 여는 핸들러
  const handlePasswordChange = () => {
    setShowPasswordForm(true)
  }

  // 비밀번호 변경 제출 핸들러 (API 호출)
  const handlePasswordSubmit = async () => {
    if (newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }

    try {
      const accessToken = getCookie('accessToken');
      const response = await fetch('http://localhost:8080/api/v1/member/password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (response.ok) {
        alert('비밀번호가 성공적으로 변경되었습니다.')
        setShowPasswordForm(false)
        setNewPassword("")
        setConfirmPassword("")
      } else {
        const errorData = await response.json();
        alert(`비밀번호 변경에 실패했습니다: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('비밀번호 변경 중 오류가 발생했습니다.');
    }
  }

  // 계정 삭제 핸들러 (API 호출)
  const handleAccountDelete = async () => {
    if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      try {
        // 서버에 로그아웃/계정삭제 요청
        const accessToken = getCookie('accessToken');
        const response = await fetch('http://localhost:8080/api/v1/member', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          }
        });
        if (response.ok) {
          await authAPI.logout() // 서버 세션 및 쿠키 무효화

          // 클라이언트 측 쿠키도 정리
          deleteCookie('accessToken')

          alert("계정이 삭제되었습니다.")
          router.push("/")
        }
      } catch (error) {
        console.error('Account deletion error:', error)
        alert("계정 삭제 중 오류가 발생했습니다.")
      }
    }
  }

  // 로딩 중일 때 스피너 표시
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  // 사용자 정보가 없을 경우 (이론상 여기까지 오지 않음)
  if (!userProfile) return null;


  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">내 정보</h1>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarFallback className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center text-white text-5xl">
                  🐱
                </AvatarFallback>
              </Avatar>
            </div>
            <Button variant="secondary" onClick={handlePasswordChange}>
              비밀번호 수정 <Key className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <Separator />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">이름</Label>
              <div className="relative">
                <div id="name" className="pl-10" /> {userProfile.name}
              </div>
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <div id="name" className="pl-10" /> {userProfile.email}
              </div>
            </div>
            <div>
              <Label htmlFor="birthDate">생년월일</Label>
              <div className="relative">
                <div id="name" className="pl-10" /> {userProfile.birth}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <Button variant="destructive" onClick={handleAccountDelete}>
              계정 삭제
            </Button>
          </div>
        </Card>

        {showPasswordForm && (
          <Card className="p-6 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">비밀번호 변경</h3>
              <Button variant="ghost" size="sm" onClick={() => setShowPasswordForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="newPassword">새 비밀번호</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={handlePasswordSubmit}>
                  변경
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  )
}