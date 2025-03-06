import './globals.css'
import type { Metadata, Viewport } from 'next'
import { Poppins } from 'next/font/google'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ThemeProvider } from '@/components/theme-provider'
import dynamic from 'next/dynamic'
import Link from 'next/link'

// Dynamically import components that aren't needed for initial render
const Toaster = dynamic(() => import('@/components/ui/toaster').then(mod => mod.Toaster), { ssr: false })

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ThinkTact | Master Logical Reasoning',
    template: '%s | ThinkTact',
  },
  description: 'Elevate your argumentation skills with AI-powered analysis and training.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://thinktact.com',
    title: 'ThinkTact | Master the Art of Logical Reasoning',
    description: 'Elevate your argumentation skills with AI-powered analysis and training.',
    siteName: 'ThinkTact',
    images: [
      {
        url: 'https://thinktact.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ThinkTact: Master the Art of Logical Reasoning',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ThinkTact | Master the Art of Logical Reasoning',
    description: 'Elevate your argumentation skills with AI-powered analysis and training.',
    images: ['https://thinktact.com/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.svg',
      },
    ],
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${poppins.className} min-h-screen bg-background antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'