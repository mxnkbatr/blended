"use client";

import * as Tabs from "@radix-ui/react-tabs";
import clsx from "clsx";

const tabTrigger =
  "flex-1 rounded-full px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] transition-colors";

export function ProductDetailTabs({
  description,
}: {
  description: string;
}) {
  return (
    <Tabs.Root defaultValue="desc" className="mt-10">
      <Tabs.List className="flex gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
        <Tabs.Trigger
          value="desc"
          className={clsx(
            tabTrigger,
            "data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 hover:text-white",
          )}
        >
          Тайлбар
        </Tabs.Trigger>
        <Tabs.Trigger
          value="ship"
          className={clsx(
            tabTrigger,
            "data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 hover:text-white",
          )}
        >
          Хүргэлт
        </Tabs.Trigger>
        <Tabs.Trigger
          value="pay"
          className={clsx(
            tabTrigger,
            "data-[state=active]:bg-white data-[state=active]:text-black text-zinc-400 hover:text-white",
          )}
        >
          Төлбөр
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="desc" className="mt-5">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/20 p-5 backdrop-blur-md">
          <p className="text-sm leading-relaxed text-zinc-400">{description}</p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="ship" className="mt-5">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/20 p-5 backdrop-blur-md">
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>- Улаанбаатар хот дотор 24–48 цагийн дотор хүргэнэ.</li>
            <li>- Захиалга баталгаажмагц хүргэлтийн мэдээлэл илгээнэ.</li>
            <li>- Бараа гэмтсэн/зөрсөн тохиолдолд 48 цагийн дотор мэдэгдэнэ.</li>
          </ul>
        </div>
      </Tabs.Content>

      <Tabs.Content value="pay" className="mt-5">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/20 p-5 backdrop-blur-md">
          <ul className="space-y-2 text-sm text-zinc-400">
            <li>- QPay / SocialPay QR‑ээр төлөх боломжтой.</li>
            <li>- Төлбөр баталгаажсаны дараа захиалга боловсруулагдана.</li>
          </ul>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}

