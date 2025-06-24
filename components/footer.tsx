import Link from "next/link"
import {Facebook, Instagram, Youtube, Twitter} from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">NOL</div>
              <span className="text-gray-800 font-medium">Ticket</span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>NOL Ticket</p>
            </div>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">고객센터</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p>티켓 1588-XXXX</p>
              <p>투어 1588-XXXX</p>
              <p>평일 09:00~18:00</p>
              <p>주말/공휴일 휴무</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">바로가기</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                공지사항
              </div>
              <div>
                이용약관
              </div>
              <div>
                개인정보처리방침
              </div>
              <div>
                청소년보호정책
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800">소셜미디어</h3>
            <div className="flex space-x-4">
              <Facebook className="w-5 h-5"/>
              <Instagram className="w-5 h-5"/>
              <Youtube className="w-5 h-5"/>
              <Twitter className="w-5 h-5"/>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-sm text-gray-500">
          <p>© 2025 NOL Ticket Corp. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
