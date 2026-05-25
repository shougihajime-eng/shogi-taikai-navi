import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "将棋大会ナビ｜小中高生の将棋大会・将棋教室をさがそう";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// SNS共有（YouTube・X・LINEなど）で表示されるカード画像。
// 日本語フォントを読み込めれば日本語で、もし失敗したら英字デザインに自動で切り替える（画像が壊れない安全策）。

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

// 必要な文字だけを Google Fonts から取り出して読み込む（軽くて確実）。
async function loadJapaneseFont(text: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=Zen+Maru+Gothic:wght@700&text=${encodeURIComponent(text)}`;
    // 古いAndroidのUAにすると、Satori が読める TrueType(ttf) 形式で返ってくる
    // （新しいUAだと woff2 になり Satori が読めないため）。
    const ua =
      "Mozilla/5.0 (Linux; U; Android 4.0.3; ko-kr; LG-L160L Build/IML74K) AppleWebkit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30";
    const css = await (await fetch(url, { headers: { "User-Agent": ua } })).text();
    const m = css.match(/src:\s*url\(([^)]+)\)/);
    if (!m) return null;
    const res = await fetch(m[1]);
    if (res.status !== 200) return null;
    return await res.arrayBuffer();
  } catch {
    return null;
  }
}

export default async function OpengraphImage() {
  const title = "将棋大会ナビ";
  const subtitle = "小中高生の将棋大会・教室をさがそう";
  const fontData = await loadJapaneseFont(title + subtitle);

  // 共通：上の駒の飾り
  const komas = (
    <div style={{ display: "flex", gap: 24, marginBottom: 36 }}>
      <Koma size={120} rotate={-8} />
      <Koma size={150} rotate={0} />
      <Koma size={120} rotate={8} />
    </div>
  );

  const bg = "linear-gradient(135deg, #fff3e0 0%, #fdf6ec 55%, #ffe9d2 100%)";

  // 日本語フォントが読めたとき → 日本語デザイン
  if (fontData) {
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
            background: bg,
            color: "#2b2620",
            fontFamily: "ZenMaru",
          }}
        >
          {komas}
          <div style={{ display: "flex", fontSize: 100, fontWeight: 700, letterSpacing: 2 }}>{title}</div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 40, color: "#d96a0d", fontWeight: 700 }}>
            {subtitle}
          </div>
        </div>
      ),
      {
        ...size,
        fonts: [{ name: "ZenMaru", data: fontData, weight: 700, style: "normal" }],
      },
    );
  }

  // 読めなかったとき → 英字デザイン（フォント埋め込み不要で確実）
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
          background: bg,
          color: "#2b2620",
        }}
      >
        {komas}
        <div style={{ display: "flex", fontSize: 84, fontWeight: 800, letterSpacing: 2 }}>SHOGI TAIKAI NAVI</div>
        <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: "#d96a0d", fontWeight: 700 }}>
          Kids&apos; Shogi Tournaments &amp; Classes — across Japan
        </div>
      </div>
    ),
    { ...size },
  );
}
