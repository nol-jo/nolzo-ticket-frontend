interface ApiStatusBannerProps {
  usingFallback: boolean
  error?: string | null
}

export default function ApiStatusBanner({ usingFallback, error }: ApiStatusBannerProps) {
  if (!usingFallback) return null

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
      <div className="max-w-7xl mx-auto px-4">
        <p className="text-sm">⚠️ {error || "API 연결에 실패했습니다."} 현재 샘플 데이터를 표시하고 있습니다.</p>
      </div>
    </div>
  )
}
