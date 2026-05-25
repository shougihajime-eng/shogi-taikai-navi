import type { Tournament, ShogiClass } from "./types";

/**
 * 土台（バックボーン）データ。
 *
 * 【本気版の方針：正直であること】
 *  全国の人が見るサイトなので「うその日付」は出さない。
 *  ここに載せるのは「毎年ひらかれる、実在する全国規模の主要大会」だけ。
 *  今年の具体的な日程・会場は変わるので、各カードから公式ページに飛んで確認してもらう。
 *
 *  地域の細かい大会や、各地の将棋教室は「みんなの申請フォーム」で本物だけを集めて増やす。
 */

type SeedTournament = Omit<Tournament, "status">;

export const SEED_TOURNAMENTS: SeedTournament[] = [
  {
    id: "nat-monka",
    title: "文部科学大臣杯 小・中学校将棋団体戦",
    organizer: "日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年6〜8月ごろ（都道府県予選 → 全国大会）",
    ageGroups: ["elementary", "junior"],
    gradeDetail: "小学生・中学生（3人1チームの団体戦）",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "1チーム3人で戦う、学校対こうの団体戦。まず各都道府県で予選があり、勝ち抜くと全国大会に進みます。学校のお友だちとチームを組んで出られます。今年の日程・会場は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-shogakusei-meijin",
    title: "小学生将棋名人戦",
    organizer: "日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 春〜夏（地区予選 → 全国大会）",
    ageGroups: ["elementary"],
    gradeDetail: "小学生",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "小学生の日本一を決める、いちばん有名な大会のひとつ。各地で地区予選があり、勝ち抜くと全国大会に出られます。テレビで放送されることもあります。今年の日程は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-chugakusei-osho",
    title: "中学生将棋王将戦",
    organizer: "日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 夏ごろ（地区予選 → 全国大会）",
    ageGroups: ["junior"],
    gradeDetail: "中学生",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "中学生の日本一を決める大会。地区予選を勝ち抜いた代表が全国大会で対戦します。今年の日程・会場は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-kurashiki-osho",
    title: "倉敷王将戦（全国小学生選抜将棋大会）",
    organizer: "倉敷市・日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    venue: "全国大会は岡山県倉敷市",
    isRecurring: true,
    recurrenceNote: "毎年8月ごろ（各地で予選 → 倉敷市で全国大会）",
    ageGroups: ["elementary"],
    gradeDetail: "小学生（低学年・高学年の部）",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "岡山県倉敷市でひらかれる、小学生の全国大会。各地の予選を勝ち抜いた代表が集まります。低学年・高学年に分かれて戦います。今年の日程は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-jt-cup",
    title: "JT将棋日本シリーズ テーブルマークこども大会",
    organizer: "日本たばこ産業（JT）",
    organizerType: "private",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 夏〜秋（全国各地の会場で開催）",
    ageGroups: ["elementary"],
    gradeDetail: "小学生（低学年・高学年の部）",
    fee: "無料",
    officialUrl: "https://www.jti.co.jp/sports/shogi/",
    description:
      "プロの公式戦と同じ日にひらかれる、小学生向けの大きな大会。札幌・仙台・東京・名古屋・大阪・広島・福岡など全国各地で行われ、参加賞ももらえます。はじめての子にもおすすめ。会場と日程は公式ページで確認してね。",
    sourceName: "JT将棋日本シリーズ",
    sourceUrl: "https://www.jti.co.jp/sports/shogi/",
  },
  {
    id: "nat-koukou-senshuken",
    title: "全国高等学校将棋選手権大会",
    organizer: "全国高等学校文化連盟・日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 夏ごろ（都道府県予選 → 全国大会）",
    ageGroups: ["high"],
    gradeDetail: "高校生（男子・女子／団体戦・個人戦）",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "高校生の日本一を決める大会。各都道府県の予選を勝ち抜いた代表が全国で対戦します。団体戦と個人戦があります。今年の日程・会場は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-joshi",
    title: "全国小学生・中学生女子将棋大会",
    organizer: "日本将棋連盟",
    organizerType: "jsa",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 夏ごろ",
    ageGroups: ["elementary", "junior"],
    gradeDetail: "女子（小学生・中学生）",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "女の子のための全国大会。同じ年ごろの女子どうしで対局できるので、はじめてでも参加しやすい大会です。今年の日程は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
  {
    id: "nat-tsume",
    title: "詰将棋解答選手権",
    organizer: "詰将棋解答選手権実行委員会",
    organizerType: "other",
    prefecture: "全国",
    nationwide: true,
    isRecurring: true,
    recurrenceNote: "毎年 春ごろ（全国各地の会場で同日開催）",
    ageGroups: ["elementary", "junior", "high"],
    gradeDetail: "だれでも（初級戦・一般戦・チャンピオン戦）",
    officialUrl: "https://www.shogi.or.jp/event/",
    description:
      "対局ではなく「詰将棋」をどれだけ速く正しく解けるかを競う大会。初級戦は入門〜級位者向けで、子どもも多く参加します。全国各地の会場で同じ日に行われます。今年の日程・会場は公式ページで確認してね。",
    sourceName: "詰将棋解答選手権",
    sourceUrl: "https://www.shogi.or.jp/event/",
  },
];

export const SEED_CLASSES: ShogiClass[] = [
  {
    id: "nat-class-tokyo-kaikan",
    name: "東京・将棋会館 こども将棋スクール",
    prefecture: "東京都",
    city: "渋谷区",
    schedule: "公式ページで確認",
    target: "幼児〜中学生",
    ageGroups: ["elementary", "junior"],
    officialUrl: "https://www.shogi.or.jp/",
    description:
      "日本将棋連盟の将棋会館でひらかれる、こども向けの教室。駒の動かし方から強くなるコツまで教えてもらえます。くわしい曜日・料金は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/",
  },
  {
    id: "nat-class-kansai-kaikan",
    name: "関西将棋会館 こども将棋教室",
    prefecture: "大阪府",
    city: "高槻市",
    schedule: "公式ページで確認",
    target: "年長〜中学生",
    ageGroups: ["elementary", "junior"],
    officialUrl: "https://www.shogi.or.jp/",
    description:
      "西日本の将棋の中心、関西将棋会館のこども教室。レベルに合わせて教えてもらえます。くわしい曜日・料金は公式ページで確認してね。",
    sourceName: "日本将棋連盟",
    sourceUrl: "https://www.shogi.or.jp/",
  },
];
