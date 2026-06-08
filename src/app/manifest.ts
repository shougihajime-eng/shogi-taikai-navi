import type { MetadataRoute } from "next";

// スマホの「ホーム画面に追加」で、本物のアプリのように全画面で開くための設定
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "小中高学生の将棋大会・教室あんない",
    short_name: "将棋あんない",
    description:
      "小学生・中学生・高校生の将棋大会や将棋教室を、全国からまとめてかんたんにさがせる案内サイト。",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fdf6ec",
    theme_color: "#ef7a1a",
    lang: "ja",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "maskable" },
    ],
  };
}
