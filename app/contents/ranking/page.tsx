"use client"

import {useEffect, useState} from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Calendar } from "lucide-react"

import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Header from "@/components/header"
import Footer from "@/components/footer"

interface Event {
  id: number
  title: string
  venue: string
  description: string
  startDate: string
  endDate: string
  posterImageUrl: string
  category: string
  rank?: number // Add optional rank property
}

export default function RankingPage() {
  const searchParams = useSearchParams()
  // Ensure the initial genre matches one of your keys
  const genre = searchParams.get("genre") || "MUSICAL"

  const [selectedGenre, setSelectedGenre] = useState(genre)
  const [currentDate] = useState(new Date())
  const [concertRankings, setConcertRankings] = useState<Event[]>([])
  const [playRankings, setPlayRankings] = useState<Event[]>([])
  const [musicalRankings, setMusicalRankings] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const categories = ["CONCERT", "PLAY", "MUSICAL"];
        const fetchedData: { [key: string]: Event[] } = {};

        for (const category of categories) {
          const response = await fetch(`http://localhost:8080/api/v1/event/rankings?category=${category}`);
          if (!response.ok) {
            throw new Error(`${category} 데이터를 가져오는데 실패했습니다.`);
          }
          const data: Event[] = await response.json();
          const rankedData = data.map((item, index) => ({ ...item, rank: index + 1 }));
          fetchedData[category] = rankedData;
        }

        setConcertRankings(fetchedData["CONCERT"] || []);
        setPlayRankings(fetchedData["PLAY"] || []);
        setMusicalRankings(fetchedData["MUSICAL"] || []);

      } catch (err) {
        setError(err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const genres = [
    {key: "MUSICAL", label: "뮤지컬", data: musicalRankings},
    {key: "CONCERT", label: "콘서트", data: concertRankings},
    {key: "PLAY", label: "연극", data: playRankings}, // Changed "THEATER" to "PLAY" for consistency
  ]

  const getCurrentData = () => {
    const currentGenreData = genres.find((g) => g.key === selectedGenre)?.data || []
    return currentGenreData
  }

  const formatDate = (date: Date) => {
    return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`
  }

  const currentData = getCurrentData()
  const top3 = currentData.slice(0, 3)
  const rest = currentData.slice(3, 10) // Ensure only up to 10 items are displayed

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <section className="relative h-[500px] bg-black flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-red-400 mb-4">⚠️ {error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              다시 시도
            </button>
          </div>
        </section>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header/>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">장르별 랭킹</h1>
        </div>

        {/* Genre Tabs */}
        <Tabs value={selectedGenre} onValueChange={setSelectedGenre} className="w-full mb-6">
          <TabsList className="grid w-full grid-cols-3 bg-gray-100"> {/* Adjusted grid-cols to 3 */}
            {genres.map((genre) => (
              <TabsTrigger
                key={genre.key}
                value={genre.key}
                className={`${
                  selectedGenre === genre.key
                    ? "bg-gray-800 text-white"
                    : "bg-transparent text-gray-600 hover:text-gray-800"
                }`}
              >
                {genre.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Sub Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4"/>
              <span>{formatDate(currentDate)} 기준</span>
            </div>
          </div>
        </div>

        {currentData.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">해당 장르의 랭킹 데이터가 준비 중입니다.</p>
          </div>
        ) : (
          <>
            {/* Top 3 Rankings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {top3.map((item) => (
                <Link key={item.id} href={`/goods/${item.id}`}>
                  <Card className="relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    {/* Rank Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                          item.rank === 1 ? "bg-yellow-500" : item.rank === 2 ? "bg-gray-400" : "bg-amber-600"
                        }`}
                      >
                        {item.rank}
                      </div>
                    </div>

                    {/* Poster Image */}
                    <div className="aspect-[3/4] overflow-hidden">
                      <Image
                        src={item.posterImageUrl || "/placeholder.svg"}
                        alt={item.title}
                        width={400}
                        height={533}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1">{item.title}</h3>
                      {item.description && <p className="text-sm text-gray-600 mb-2 truncate">{item.description}</p>}
                      <p className="text-sm text-gray-600 mb-1">{item.venue}</p>
                      <p className="text-sm text-gray-600 mb-3">{item.startDate} ~ {item.endDate}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Rankings 4-10 */}
            {rest.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">4위 ~ 10위</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rest.map((item) => (
                    <Link key={item.id} href={`/goods/${item.id}`}>
                      <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-start space-x-4">
                          {/* Rank */}
                          <div className="flex-shrink-0">
                            <div
                              className="w-8 h-8 bg-gray-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                              {item.rank}
                            </div>
                          </div>

                          {/* Poster */}
                          <div className="w-16 h-20 flex-shrink-0">
                            <Image
                              src={item.posterImageUrl || "/placeholder.svg"}
                              alt={item.title}
                              width={64}
                              height={80}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base text-gray-800 mb-1 truncate">{item.title}</h3>
                            {item.description && <p className="text-xs text-gray-600 mb-1 truncate">{item.description}</p>}
                            <p className="text-xs text-gray-600 mb-1 truncate">{item.venue}</p>
                            <p className="text-xs text-gray-600 mb-2">{item.startDate} ~ {item.endDate}</p>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <Footer/>
    </div>
  )
}