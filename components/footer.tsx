import Link from "next/link"
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">NOL</div>
              <span className="text-gray-800 font-medium">interpark</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>㈜인터파크트리플</p>
              <p>대표이사: 최휘영</p>
              <p>사업자등록번호: 220-81-99482</p>
              <p>통신판매업신고: 2017-서울강남-01779</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">고객센터</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>티켓 1588-1555</p>
              <p>투어 1588-3443</p>
              <p>평일 09:00~18:00</p>
              <p>주말/공휴일 휴무</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">바로가기</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <Link href="#" className="block hover:text-gray-900">
                공지사항
              </Link>
              <Link href="#" className="block hover:text-gray-900">
                이용약관
              </Link>
              <Link href="#" className="block hover:text-gray-900">
                개인정보처리방침
              </Link>
              <Link href="#" className="block hover:text-gray-900">
                청소년보호정책
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">소셜미디어</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Facebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Instagram className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Youtube className="w-5 h-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-600">
                <Twitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-sm text-gray-500">
          <p>© 2024 Interpark Triple Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
