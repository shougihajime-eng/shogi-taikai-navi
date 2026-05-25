import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "将棋大会ナビ｜小中高生の将棋大会・将棋教室をさがそう";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// SNS共有（YouTube・X・LINEなど）で表示されるカード画像。
// 日本語フォントの埋め込みは環境差が大きいため、確実に表示できるよう
// 図形＋英字で構成している（日本語のタイトル・説明はSNS側がテキストで表示する）。
function Koma({ size: s, rotate }: { size: number; rotate: number }) {
  return (
    <div
      style={{
        width: s,
        height: s * 1.1,
        background: "#d8a14a",
        border: "6px solid #d96a0d",
        transform: `rotate(${rotate}deg)`,
        clipPath: "polygon(50% 4%, 84% 28%, 76% 100%, 24% 100%, 16% 28%)",
      }}
    />
  );
}

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff3e0 0%, #fdf6ec 55%, #ffe9d2 100%)",
          color: "#2b2620",
        }}
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 36 }}>
          <Koma size={120} rotate={-8} />
          <Koma size={150} rotate={0} />
          <Koma size={120} rotate={8} />
        </div>
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: 2 }}>
          SHOGI TAIKAI NAVI
        </div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: "#d96a0d", fontWeight: 700 }}>
          Kids&apos; Shogi Tournaments &amp; Classes — across Japan
        </div>
      </div>
    ),
    { ...size },
  );
}
