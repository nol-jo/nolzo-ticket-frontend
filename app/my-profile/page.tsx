'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Calendar as CalendarIcon, Edit, Key, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface UserProfile {
  name: string
  email: string
  birthDate: string
  joinDate: string
}

export default function MyProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("userInfo")

    if (!loggedIn) {
      router.push("/login?returnUrl=" + encodeURIComponent("/my-profile"))
      return
    }

    setIsLoggedIn(true)
    if (user) {
      const userData = JSON.parse(user)
      setUserProfile({
        name: userData.name || "홍길동",
        email: userData.email || "user@example.com",
        birthDate: "1990-01-01",
        joinDate: "2024-01-15",
      })
    }
  }, [router])

  const handlePasswordChange = () => {
    setShowPasswordForm(true)
  }

  const handlePasswordSubmit = () => {
    if (newPassword.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.')
      return
    }
    if (newPassword !== confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.')
      return
    }
    // 실제 API 호출 대체
    alert('비밀번호가 성공적으로 변경되었습니다.')
    setShowPasswordForm(false)
    setNewPassword("")
    setConfirmPassword("")
  }

  const handleAccountDelete = () => {
    if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userInfo")
      alert("계정이 삭제되었습니다.")
      router.push("/")
    }
  }

  if (!isLoggedIn || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로그인 정보를 확인하는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">내 정보</h1>

        <Card className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{userProfile.name}</h2>
                <p className="text-gray-600">{userProfile.email}</p>
              </div>
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
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="name" value={userProfile.name} disabled className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="email">이메일</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="email" value={userProfile.email} disabled className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="birthDate">생년월일</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="birthDate" type="date" value={userProfile.birthDate} disabled className="pl-10" />
              </div>
            </div>
            <div>
              <Label htmlFor="joinDate">가입 일</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input id="joinDate" type="date" value={userProfile.joinDate} disabled className="pl-10" />
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
                  저장
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
