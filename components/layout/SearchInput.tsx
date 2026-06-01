"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useDeferredValue, useState } from "react";
import {
  COUNTRY_LABELS,
  COUNTRY_SLUGS,
  MOVIE_CATEGORY_LABELS,
  MOVIE_CATEGORY_SLUGS,
  type CountrySlug,
  type MovieCategorySlug,
} from "@/lib/constants";

export default function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("keyword") || "");
  const deferredValue = useDeferredValue(value);
  const normalizedValue = deferredValue.trim().toLowerCase();

  const categorySuggestions = normalizedValue
    ? MOVIE_CATEGORY_SLUGS.filter((slug) => {
        const label = MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug];
        return (
          slug.includes(normalizedValue) ||
          label.toLowerCase().includes(normalizedValue)
        );
      }).slice(0, 4)
    : [];

  const countrySuggestions = normalizedValue
    ? COUNTRY_SLUGS.filter((slug) => {
        const label = COUNTRY_LABELS[slug as CountrySlug];
        return (
          slug.includes(normalizedValue) ||
          label.toLowerCase().includes(normalizedValue)
        );
      }).slice(0, 4)
    : [];

  const showSuggestions =
    normalizedValue.length > 0 &&
    (categorySuggestions.length > 0 || countrySuggestions.length > 0);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      router.push(`/tim-kiem?keyword=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Tìm kiếm phim..."
        className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />

      {showSuggestions && (
        <div className="absolute top-full z-50 mt-2 w-full min-w-[280px] rounded-xl border bg-background p-3 shadow-lg">
          <div className="mb-3">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Tìm nhanh
            </p>
            <Link
              href={`/tim-kiem?keyword=${encodeURIComponent(value.trim())}`}
              className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
            >
              Tìm kiếm với từ khóa: <span className="font-medium">{value.trim()}</span>
            </Link>
          </div>

          {categorySuggestions.length > 0 && (
            <div className="mb-3">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Thể loại
              </p>
              <div className="space-y-1">
                {categorySuggestions.map((slug) => (
                  <Link
                    key={slug}
                    href={`/the-loai/${slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
                  >
                    {MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug]}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {countrySuggestions.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Quốc gia
              </p>
              <div className="space-y-1">
                {countrySuggestions.map((slug) => (
                  <Link
                    key={slug}
                    href={`/quoc-gia/${slug}`}
                    className="block rounded-lg px-3 py-2 text-sm hover:bg-accent"
                  >
                    {COUNTRY_LABELS[slug as CountrySlug]}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </form>
  );
}
