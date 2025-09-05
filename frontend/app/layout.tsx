import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navigation } from '@/components/layout/navigation'
import { CustomCursor } from '@/components/ui/custom-cursor'
import { InteractiveBackground } from '@/components/ui/interactive-background'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ClearPath AI - Logistics Operations',
  description: 'Agentic AI system for package tracking and recovery',
  keywords: ['logistics', 'AI', 'package tracking', 'supply chain'],
  authors: [{ name: 'ClearPath AI Team' }],
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <CustomCursor>
            <InteractiveBackground />
            <div className="min-h-screen bg-background relative z-10">
              <Navigation />
              <main className="flex-1 space-y-4 p-4 md:p-8 pt-24">
                {children}
              </main>
            </div>
          </CustomCursor>
        </Providers>
      </body>
    </html>
  )
}
