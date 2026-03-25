import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import type { Metadata } from 'next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Pills — Gerenciamento de Medicação',
  description: 'Nunca esqueça seus medicamentos novamente',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={inter.variable}>
      <body className="font-inter antialiased bg-background text-text-primary">
        <ClerkProvider>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
