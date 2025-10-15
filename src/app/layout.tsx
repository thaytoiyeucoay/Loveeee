import React from 'react'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Providers from './providers'

const inter = Inter({ subsets: ['vietnamese', 'latin'] })

export const metadata: Metadata = {
  title: 'Loveeee - Ứng dụng tình yêu',
  description: 'Ứng dụng tình yêu dành riêng cho các cặp đôi - Ghi lại những khoảnh khắc đẹp nhất',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Loveeee'
  },
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png'
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#ec6b6b'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec6b6b" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Loveeee" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#ec6b6b" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={inter.className}>
        <div className="hearts-bg">
          {/* Floating hearts background */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={i}
              className="heart"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 6}s`,
              }}
            >
              ❤️
            </div>
          ))}
        </div>
        
        <div className="min-h-screen relative z-10">
          <Providers>
            {children}
          </Providers>
        </div>
        
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#333',
              boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
              borderRadius: '16px',
              padding: '16px',
            },
          }}
        />
      </body>
    </html>
  )
}
