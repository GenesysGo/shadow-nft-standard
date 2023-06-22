import { Metadata } from "next"
import { Head, Html, Main, NextScript } from "next/document"

import { siteConfig } from "@/config/site"
import { fontSans } from "@/lib/fonts"
import { cn } from "@/lib/utils"

export default function Document() {
  return (
    <Html>
      <Head />

      <html lang="en" suppressHydrationWarning>
        <body
          className={cn("bg-background min-h-screen font-sans antialiased")}
        >
          <Main />
          <NextScript />
        </body>
      </html>
    </Html>
  )
}
