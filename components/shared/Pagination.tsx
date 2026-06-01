import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Pagination as PaginationType } from "@/types/movie";
import { cn } from "@/lib/utils";

interface PaginationProps {
  pagination: PaginationType;
  baseUrl: string;
}

export default function Pagination({ pagination, baseUrl }: PaginationProps) {
  const { currentPage, totalPages } = pagination;
  const previousPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const getPageUrl = (page: number) => {
    const [pathWithQuery, hash = ""] = baseUrl.split("#");
    const hashSuffix = hash ? `#${hash}` : "";

    if (pathWithQuery.includes("?")) {
      return `${pathWithQuery}&page=${page}${hashSuffix}`;
    }

    return `${pathWithQuery}?page=${page}${hashSuffix}`;
  };

  if (totalPages <= 1) return null;

  const windowStart = Math.max(1, currentPage - 2);
  const windowEnd = Math.min(totalPages, currentPage + 2);
  const pages: number[] = [];

  for (let page = windowStart; page <= windowEnd; page += 1) {
    pages.push(page);
  }

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-wrap items-center justify-center gap-2 py-8"
    >
      <Button variant="outline" size="icon" asChild>
        <Link
          href={getPageUrl(previousPage)}
          aria-disabled={currentPage <= 1}
          aria-label="Previous Page"
          tabIndex={currentPage <= 1 ? -1 : undefined}
          className={cn(currentPage <= 1 && "pointer-events-none opacity-50")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      {windowStart > 1 && (
        <>
          <Button variant={currentPage === 1 ? "default" : "outline"} size="sm" asChild>
            <Link href={getPageUrl(1)}>
              1
            </Link>
          </Button>
          {windowStart > 2 && (
            <span className="px-1 text-sm text-muted-foreground">...</span>
          )}
        </>
      )}

      {pages.map((page) => (
        <Button key={page} variant={page === currentPage ? "default" : "outline"} size="sm" asChild>
          <Link href={getPageUrl(page)}>
            {page}
          </Link>
        </Button>
      ))}

      {windowEnd < totalPages && (
        <>
          {windowEnd < totalPages - 1 && (
            <span className="px-1 text-sm text-muted-foreground">...</span>
          )}
          <Button
            variant={currentPage === totalPages ? "default" : "outline"}
            size="sm"
            asChild
          >
            <Link href={getPageUrl(totalPages)}>
              {totalPages}
            </Link>
          </Button>
        </>
      )}

      <Button variant="outline" size="icon" asChild>
        <Link
          href={getPageUrl(nextPage)}
          aria-disabled={currentPage >= totalPages}
          aria-label="Next Page"
          tabIndex={currentPage >= totalPages ? -1 : undefined}
          className={cn(currentPage >= totalPages && "pointer-events-none opacity-50")}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </nav>
  );
}
