import Link from "next/link";
import { Mascot } from "@/components/Mascot";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <Mascot label="？" bob className="h-24 w-24" />
      <h1 className="mt-6 font-display text-3xl font-black text-ink">
        ページが見つかりません
      </h1>
      <p className="mt-3 text-ink-soft">
        さがしているページは、なくなったか、引っこしたみたいです。
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-brand px-8 py-4 text-lg font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-brand-dark"
      >
        🏠 ホームにもどる
      </Link>
    </div>
  );
}
