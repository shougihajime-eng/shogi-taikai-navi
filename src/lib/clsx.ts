/** クラス名をつなげる小さな道具（false や undefined は無視する） */
export function clsx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
