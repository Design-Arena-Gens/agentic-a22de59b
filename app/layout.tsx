import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Cold Email Agent',
  description: 'Generate personalized cold emails with AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
