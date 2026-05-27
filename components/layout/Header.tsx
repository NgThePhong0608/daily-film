"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { Menu } from "lucide-react";

import SearchInput from "@/components/layout/SearchInput";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  POPULAR_COUNTRY_SLUGS,
  COUNTRY_SLUGS,
  COUNTRY_LABELS,
  MOVIE_CATEGORY_SLUGS,
  MOVIE_CATEGORY_LABELS,
  type PopularCountrySlug,
  type MovieCategorySlug,
  LIST_MOVIES_TYPE,
} from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center gap-4">
        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px] p-0">
              <SheetHeader className="p-4 border-b text-left">
                <SheetTitle>Daily Film</SheetTitle>
              </SheetHeader>
              <ScrollArea className="h-[calc(100vh-65px)]">
                <div className="flex flex-col p-4 gap-4">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="text-lg font-medium hover:text-primary"
                  >
                    Trang Chủ
                  </Link>
                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground text-sm">Thể Loại</h4>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                      {MOVIE_CATEGORY_SLUGS.map(slug => (
                        <Link
                          key={slug}
                          href={`/the-loai/${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm hover:text-primary text-muted-foreground hover:underline"
                        >
                          {MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug]}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Library Section */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground text-sm">Tủ Phim</h4>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                      <Link
                        href="/yeu-thich"
                        onClick={() => setOpen(false)}
                        className="text-sm hover:text-primary text-muted-foreground hover:underline flex items-center gap-2"
                      >
                        Yêu Thích
                      </Link>
                      <Link
                        href="/theo-doi"
                        onClick={() => setOpen(false)}
                        className="text-sm hover:text-primary text-muted-foreground hover:underline flex items-center gap-2"
                      >
                        Theo Dõi
                      </Link>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground text-sm">Quốc Gia</h4>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                      {COUNTRY_SLUGS.map(slug => (
                        <Link
                          key={slug}
                          href={`/quoc-gia/${slug}`}
                          onClick={() => setOpen(false)}
                          className="text-sm hover:text-primary text-muted-foreground hover:underline"
                        >
                          {COUNTRY_LABELS[slug as PopularCountrySlug]}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-muted-foreground text-sm">Danh Sách</h4>
                    <div className="grid grid-cols-2 gap-2 pl-2">
                      {LIST_MOVIES_TYPE.map(slug => (
                        <Link
                          key={slug.value}
                          href={`/danh-sach/${slug.value}`}
                          onClick={() => setOpen(false)}
                          className="text-sm hover:text-primary text-muted-foreground hover:underline"
                        >
                          {slug.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo (Visible on all screens) */}
        <Link href="/" className="flex items-center space-x-2 mr-2 lg:mr-4">
          <span className="font-bold inline-block">Daily Film</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-6 text-xs lg:text-sm font-medium flex-1">
          {/* Category Dropdown */}
          <div className="relative group">
            <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
              Thể Loại
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 md:-left-20 lg:-left-28 xl:-left-36 mt-1 p-4 w-[480px] md:w-[660px] lg:w-[840px] xl:w-[960px] bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 z-50">
              {MOVIE_CATEGORY_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/the-loai/${slug}`}
                  className="block px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:font-medium"
                >
                  {MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug]}
                </Link>
              ))}
            </div>
          </div>

          {/* Country Dropdown */}
          <div className="relative group">
            <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
              Quốc Gia
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 md:-left-40 lg:-left-60 xl:-left-64 mt-1 p-4 w-[480px] md:w-[660px] lg:w-[840px] xl:w-[960px] bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-2 z-50">
              {COUNTRY_SLUGS.map((slug) => (
                <Link
                  key={slug}
                  href={`/quoc-gia/${slug}`}
                  className="block px-2 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:font-medium"
                >
                  {COUNTRY_LABELS[slug as PopularCountrySlug]}
                </Link>
              ))}
            </div>
          </div>

          <div className="relative group">
            <button className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1">
              Danh sách
              <svg
                className="w-4 h-4 transition-transform group-hover:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div className="absolute top-full left-0 md:-left-20 lg:-left-40 mt-1 p-4 w-[280px] md:w-[420px] lg:w-[560px] bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2 z-50">
              {LIST_MOVIES_TYPE.map((item) => (
                <Link
                  key={item.value}
                  href={`/danh-sach/${item.value}`}
                  className="block px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground rounded-md transition-colors whitespace-nowrap text-muted-foreground hover:font-medium"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/yeu-thich"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Yêu Thích
          </Link>
          <Link
            href="/theo-doi"
            className="transition-colors hover:text-foreground/80 text-foreground/60"
          >
            Theo Dõi
          </Link>
        </div>

        {/* Search Input */}
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full max-w-[140px] lg:max-w-[200px] xl:max-w-[300px]">
            <Suspense fallback={null}>
              <SearchInput />
            </Suspense>
          </div>
        </div>
      </div>
    </header>
  );
}
