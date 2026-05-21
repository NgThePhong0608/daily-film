"use client";

import { useState, useSyncExternalStore } from "react";
import { ArrowUpRight, Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

const AFFILIATE_URL = "https://gild.website";
const SESSION_STORAGE_KEY = "daily-film:gild-banner-dismissed";
const subscribe = () => () => {};

export default function AffiliateBanner() {
  const [isDismissedLocally, setIsDismissedLocally] = useState(false);
  const isDismissedForSession = useSyncExternalStore(
    subscribe,
    () => window.sessionStorage.getItem(SESSION_STORAGE_KEY) === "1",
    () => true
  );

  if (isDismissedLocally || isDismissedForSession) {
    return null;
  }

  const handleDismiss = () => {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, "1");
    setIsDismissedLocally(true);
  };

  const handleOpenAffiliate = () => {
    window.open(AFFILIATE_URL, "_blank", "noopener,noreferrer");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleOpenAffiliate();
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-2 z-40">
      <div className="container">
        <div className="rounded-2xl border border-emerald-500/15 bg-background/95 px-3 py-2.5 shadow-lg backdrop-blur sm:px-4 sm:py-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              role="link"
              tabIndex={0}
              onClick={handleOpenAffiliate}
              onKeyDown={handleKeyDown}
              className="group flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-xl outline-none transition-colors hover:bg-emerald-500/5 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:gap-3"
              aria-label="Mở trang Gild"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 sm:h-9 sm:w-9">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:text-emerald-300">
                    Gild
                  </span>
                  <span className="hidden text-xs font-medium text-muted-foreground sm:inline">
                    Shopee + TikTok orders
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-xs font-medium leading-4 text-foreground sm:text-sm">
                  Nhận tiền free từ đơn hàng Shopee và TikTok của chính mình.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
              <Button
                type="button"
                onClick={handleOpenAffiliate}
                size="sm"
                className="rounded-full bg-emerald-600 px-3 text-white hover:bg-emerald-500"
              >
                Xem ngay
                <ArrowUpRight className="h-4 w-4" />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="rounded-full text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Đóng quảng cáo Gild"
                onClick={handleDismiss}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
