import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LISTING_SORT_OPTIONS,
  type ListingSortValue,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

interface ListingToolbarProps {
  pathname: string;
  sort: ListingSortValue;
  keyword?: string;
  sectionId?: string;
}

export default function ListingToolbar({
  pathname,
  sort,
  keyword,
  sectionId,
}: ListingToolbarProps) {
  const hash = sectionId ? `#${sectionId}` : "";

  const getSortHref = (nextSort: ListingSortValue) => {
    const params = new URLSearchParams();

    if (keyword) {
      params.set("keyword", keyword);
    }

    if (nextSort !== "latest") {
      params.set("sort", nextSort);
    }

    const query = params.toString();
    return `${pathname}${query ? `?${query}` : ""}${hash}`;
  };

  return (
    <div className="mb-6 rounded-xl border bg-card/60 p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium">Sắp xếp</p>
      <div className="flex flex-wrap gap-2">
        {LISTING_SORT_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={sort === option.value ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link
              href={getSortHref(option.value)}
              className={cn(sort === option.value && "pointer-events-none")}
              aria-current={sort === option.value ? "page" : undefined}
            >
              {option.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
}
