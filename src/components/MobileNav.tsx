"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "@/lib/clsx";

/**
 * スマホ用の下メニュー（タブバー）。
 * 指で押しやすいように大きめ。パソコン（md以上）では出さない。
 */

const TABS = [
  { href: "/", label: "ホーム", icon: "🏠", color: "text-brand-dark", softBg: "bg-brand-soft" },
  { href: "/taikai", label: "大会", icon: "🏆", color: "text-brand-dark", softBg: "bg-brand-soft" },
  { href: "/kyoshitsu", label: "教室", icon: "🎓", color: "text-sky-dark", softBg: "bg-sky-soft" },
  { href: "/joshi", label: "女子", icon: "👧", color: "text-girls", softBg: "bg-girls-soft" },
  { href: "/toroku", label: "登録", icon: "✏️", color: "text-sky-dark", softBg: "bg-sky-soft" },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="メインメニュー"
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-line bg-card/95 backdrop-blur md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="mx-auto flex max-w-md items-stretch justify-around">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "flex flex-col items-center justify-center gap-0.5 py-2 transition",
                  active ? tab.color : "text-ink-soft",
                )}
              >
                <span
                  className={clsx(
                    "flex h-9 w-9 items-center justify-center rounded-2xl text-xl transition",
                    active ? `scale-110 ${tab.softBg}` : "scale-100",
                  )}
                  aria-hidden
                >
                  {tab.icon}
                </span>
                <span className={clsx("text-[11px] font-black leading-none", active && "scale-105")}>
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
