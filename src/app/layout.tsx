import type { Metadata, Viewport } from "next";
import { Zen_Maru_Gothic, Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// 見出し用：まるくてやさしいフォント
const zenMaru = Zen_Maru_Gothic({
  weight: ["500", "700", "900"],
  subsets: ["latin"],
  variable: "--font-zen-maru",
  display: "swap",
  preload: false,
});

// 本文用：読みやすいフォント
const notoSansJP = Noto_Sans_JP({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-noto-sans-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://shogi-taikai-navi.vercel.app"),
  title: {
    default: "将棋大会ナビ｜小中高生の将棋大会・将棋教室をさがそう",
    template: "%s｜将棋大会ナビ",
  },
  description:
    "小学生・中学生・高校生の将棋大会や将棋教室を、全国からまとめて、かんたんにさがせる案内サイト。学年や地域でぴったりの大会・教室が見つかります。",
  keywords: ["将棋", "将棋大会", "将棋教室", "小学生", "中学生", "高校生", "こども将棋", "全国"],
  openGraph: {
    title: "将棋大会ナビ｜小中高生の将棋大会・将棋教室をさがそう",
    description: "小中高生の将棋大会・将棋教室を全国からまとめた案内サイト",
    url: "/",
    siteName: "将棋大会ナビ",
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "将棋大会ナビ",
    description: "小中高生の将棋大会・将棋教室を全国からまとめた案内サイト",
  },
};

export const viewport: Viewport = {
  themeColor: "#ef7a1a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja" className={`${zenMaru.variable} ${notoSansJP.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
