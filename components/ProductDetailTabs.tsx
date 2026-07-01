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
      <Tabs.List className="flex gap-1 rounded-full border border-achira-blue/12 bg-achira-paper/50 p-1 dark:border-achira-cream/10 dark:bg-achira-blue/10">
        <Tabs.Trigger
          value="desc"
          className={clsx(
            tabTrigger,
            "text-achira-blue/55 hover:text-achira-blue-dark data-[state=active]:bg-achira-blue data-[state=active]:text-achira-cream dark:text-achira-cream/50 dark:hover:text-achira-cream dark:data-[state=active]:bg-achira-cream dark:data-[state=active]:text-achira-blue-dark",
          )}
        >
          Тайлбар
        </Tabs.Trigger>
        <Tabs.Trigger
          value="ship"
          className={clsx(
            tabTrigger,
            "text-achira-blue/55 hover:text-achira-blue-dark data-[state=active]:bg-achira-blue data-[state=active]:text-achira-cream dark:text-achira-cream/50 dark:hover:text-achira-cream dark:data-[state=active]:bg-achira-cream dark:data-[state=active]:text-achira-blue-dark",
          )}
        >
          Хүргэлт
        </Tabs.Trigger>
        <Tabs.Trigger
          value="pay"
          className={clsx(
            tabTrigger,
            "text-achira-blue/55 hover:text-achira-blue-dark data-[state=active]:bg-achira-blue data-[state=active]:text-achira-cream dark:text-achira-cream/50 dark:hover:text-achira-cream dark:data-[state=active]:bg-achira-cream dark:data-[state=active]:text-achira-blue-dark",
          )}
        >
          Төлбөр
        </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="desc" className="mt-5">
        <div className="rounded-2xl border border-achira-blue/10 bg-white/70 p-5 dark:border-achira-cream/10 dark:bg-achira-navy/40">
          <p className="text-sm leading-relaxed text-achira-blue-dark dark:text-achira-cream/80">
            {description}
          </p>
        </div>
      </Tabs.Content>

      <Tabs.Content value="ship" className="mt-5">
        <div className="rounded-2xl border border-achira-blue/10 bg-white/70 p-5 dark:border-achira-cream/10 dark:bg-achira-navy/40">
          <ul className="space-y-2 text-sm text-achira-blue/75 dark:text-achira-cream/70">
            <li>- Улаанбаатар хот дотор 24–48 цагийн дотор хүргэнэ.</li>
            <li>- Захиалга баталгаажмагц хүргэлтийн мэдээлэл илгээнэ.</li>
            <li>- Бараа гэмтсэн/зөрсөн тохиолдолд 48 цагийн дотор мэдэгдэнэ.</li>
          </ul>
        </div>
      </Tabs.Content>

      <Tabs.Content value="pay" className="mt-5">
        <div className="rounded-2xl border border-achira-blue/10 bg-white/70 p-5 dark:border-achira-cream/10 dark:bg-achira-navy/40">
          <ul className="space-y-2 text-sm text-achira-blue/75 dark:text-achira-cream/70">
            <li>- QPay / SocialPay QR‑ээр төлөх боломжтой.</li>
            <li>- Төлбөр баталгаажсаны дараа захиалга боловсруулагдана.</li>
          </ul>
        </div>
      </Tabs.Content>
    </Tabs.Root>
  );
}
