import { redirect } from "next/navigation"

interface PerformancePageProps {
  params: {
    id: string
  }
}

export default function PerformancePage({ params }: PerformancePageProps) {
  // 기존 performance 경로를 events 경로로 리다이렉트
  redirect(`/events/${params.id}`)
}
