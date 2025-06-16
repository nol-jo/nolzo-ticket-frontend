"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { User, Mail, Phone, Calendar, Edit, Camera, Shield, Bell, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface UserProfile {
  name: string
  email: string
  phone: string
  birthDate: string
  joinDate: string
  provider: string
  profileImage?: string
}

interface NotificationSettings {
  emailMarketing: boolean
  smsMarketing: boolean
  performanceAlerts: boolean
  reservationAlerts: boolean
}

export default function MyProfilePage() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null)
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailMarketing: true,
    smsMarketing: false,
    performanceAlerts: true,
    reservationAlerts: true,
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true"
    const user = localStorage.getItem("userInfo")

    if (!loggedIn) {
      router.push("/login?returnUrl=" + encodeURIComponent("/my-profile"))
      return
    }

    setIsLoggedIn(loggedIn)
    if (user) {
      const userData = JSON.parse(user)
      const profile: UserProfile = {
        name: userData.name || "홍길동",
        email: userData.email || "user@example.com",
        phone: "010-1234-5678",
        birthDate: "1990-01-01",
        joinDate: "2024-01-15",
        provider: userData.provider || "email",
        profileImage: userData.profileImage,
      }
      setUserProfile(profile)
      setEditedProfile(profile)
    }
  }, [router])

  const handleEditToggle = () => {
    if (isEditing) {
      // 저장
      if (editedProfile) {
        setUserProfile(editedProfile)
        // 로컬스토리지 업데이트
        const currentUser = JSON.parse(localStorage.getItem("userInfo") || "{}")
        const updatedUser = { ...currentUser, ...editedProfile }
        localStorage.setItem("userInfo", JSON.stringify(updatedUser))
        alert("프로필이 성공적으로 업데이트되었습니다.")
      }
    } else {
      // 편집 모드 시작
      setEditedProfile(userProfile)
    }
    setIsEditing(!isEditing)
  }

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value })
    }
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("새 비밀번호가 일치하지 않습니다.")
      return
    }
    if (passwordData.newPassword.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.")
      return
    }
    // 실제로는 API 호출
    alert("비밀번호가 성공적으로 변경되었습니다.")
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  const handleNotificationChange = (key: keyof NotificationSettings, value: boolean) => {
    setNotifications({ ...notifications, [key]: value })
  }

  const handleAccountDelete = () => {
    if (confirm("정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      // 실제로는 API 호출
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("userInfo")
      alert("계정이 삭제되었습니다.")
      router.push("/")
    }
  }

  const handleProfileImageChange = () => {
    // 실제로는 파일 업로드 구현
    alert("프로필 사진 변경 기능은 준비 중입니다.")
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">내 정보</h1>
          <p className="text-gray-600">개인정보 및 계정 설정을 관리하세요.</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="security">보안</TabsTrigger>
            <TabsTrigger value="notifications">알림</TabsTrigger>
            <TabsTrigger value="account">계정</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">프로필 정보</h2>
                <Button onClick={handleEditToggle} variant={isEditing ? "default" : "outline"}>
                  {isEditing ? "저장" : "편집"}
                  <Edit className="w-4 h-4 ml-2" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* 프로필 사진 */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={userProfile.profileImage || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">{userProfile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                        onClick={handleProfileImageChange}
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium">{userProfile.name}</h3>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <p className="text-sm text-gray-500">
                      {userProfile.provider === "email" ? "이메일 계정" : `${userProfile.provider} 계정`}
                    </p>
                  </div>
                </div>

                <Separator />

                {/* 기본 정보 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">이름</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="name"
                        value={isEditing ? editedProfile?.name || "" : userProfile.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="email"
                        type="email"
                        value={isEditing ? editedProfile?.email || "" : userProfile.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">전화번호</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="phone"
                        value={isEditing ? editedProfile?.phone || "" : userProfile.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">생년월일</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        id="birthDate"
                        type="date"
                        value={isEditing ? editedProfile?.birthDate || "" : userProfile.birthDate}
                        onChange={(e) => handleInputChange("birthDate", e.target.value)}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 가입 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">가입 정보</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>가입일: {new Date(userProfile.joinDate).toLocaleDateString("ko-KR")}</p>
                    <p>로그인 방식: {userProfile.provider === "email" ? "이메일" : userProfile.provider}</p>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">보안 설정</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    비밀번호 변경
                  </h3>

                  {userProfile.provider === "email" ? (
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">현재 비밀번호</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">새 비밀번호</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">새 비밀번호 확인</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        />
                      </div>
                      <Button onClick={handlePasswordChange}>비밀번호 변경</Button>
                    </div>
                  ) : (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-blue-800">
                        {userProfile.provider} 계정으로 로그인하셨습니다. 비밀번호 변경은 {userProfile.provider} 계정
                        설정에서 가능합니다.
                      </p>
                    </div>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4">로그인 기록</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">현재 세션</p>
                        <p className="text-sm text-gray-600">Chrome, Windows • 서울, 대한민국</p>
                      </div>
                      <span className="text-sm text-green-600">활성</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">이전 로그인</p>
                        <p className="text-sm text-gray-600">Mobile App, iOS • 2시간 전</p>
                      </div>
                      <span className="text-sm text-gray-500">종료됨</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                알림 설정
              </h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">이메일 마케팅</h3>
                    <p className="text-sm text-gray-600">새로운 공연 정보 및 할인 혜택을 이메일로 받아보세요</p>
                  </div>
                  <Switch
                    checked={notifications.emailMarketing}
                    onCheckedChange={(checked) => handleNotificationChange("emailMarketing", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">SMS 마케팅</h3>
                    <p className="text-sm text-gray-600">긴급 할인 정보 및 티켓 오픈 알림을 SMS로 받아보세요</p>
                  </div>
                  <Switch
                    checked={notifications.smsMarketing}
                    onCheckedChange={(checked) => handleNotificationChange("smsMarketing", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">공연 알림</h3>
                    <p className="text-sm text-gray-600">관심 있는 공연의 티켓 오픈 및 할인 정보를 받아보세요</p>
                  </div>
                  <Switch
                    checked={notifications.performanceAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("performanceAlerts", checked)}
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">예약 알림</h3>
                    <p className="text-sm text-gray-600">예약 확인, 공연 당일 알림 등을 받아보세요</p>
                  </div>
                  <Switch
                    checked={notifications.reservationAlerts}
                    onCheckedChange={(checked) => handleNotificationChange("reservationAlerts", checked)}
                  />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="account" className="mt-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-6">계정 관리</h2>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">데이터 다운로드</h3>
                  <p className="text-gray-600 mb-4">
                    개인정보 보호법에 따라 회원님의 개인정보를 다운로드할 수 있습니다.
                  </p>
                  <Button variant="outline">내 데이터 다운로드</Button>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium mb-4 text-red-600 flex items-center">
                    <Trash2 className="w-5 h-5 mr-2" />
                    계정 삭제
                  </h3>
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <p className="text-red-800 text-sm">
                      ⚠️ 계정을 삭제하면 모든 예약 내역, 개인정보가 영구적으로 삭제됩니다. 이 작업은 되돌릴 수 없습니다.
                    </p>
                  </div>
                  <Button variant="destructive" onClick={handleAccountDelete}>
                    계정 삭제
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  )
}
