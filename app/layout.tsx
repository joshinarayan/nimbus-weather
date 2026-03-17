import type { Metadata } from "next"
import "./globals.css"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "NIMBUS - Intelligent Weather Companion",
  description: "Beautiful weather forecasts with voice control and stunning animations",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&family=Orbitron:wght@700;900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        {children}
      </body>
    </html>
  )
}