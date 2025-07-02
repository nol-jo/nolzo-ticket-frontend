import type { Metadata } from 'next'
import './globals.css'
import { Suspense } from 'react'
import Loading from './Loading'
export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <html lang="en">
          <Suspense fallback={<Loading/>}>
      <body>{children}</body>
      </Suspense>
    </html>
    
  )
}
