import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  COUNTRY_LABELS,
  MOVIE_CATEGORY_LABELS,
  MOVIE_CATEGORY_SLUGS,
  POPULAR_COUNTRY_SLUGS,
  type MovieCategorySlug,
  type PopularCountrySlug,
} from "@/lib/constants";

export default function QuickBrowseSection() {
  return (
    <section className="py-8">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Khám phá nhanh</h2>
          <p className="text-sm text-muted-foreground">
            Đi thẳng tới thể loại và quốc gia phổ biến.
          </p>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/kham-pha">Xem tất cả</Link>
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="gap-4">
          <CardHeader className="pb-0">
            <CardTitle>Thể loại nổi bật</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {MOVIE_CATEGORY_SLUGS.slice(0, 8).map((slug) => (
              <Button key={slug} variant="outline" size="sm" asChild>
                <Link href={`/the-loai/${slug}`}>
                  {MOVIE_CATEGORY_LABELS[slug as MovieCategorySlug]}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card className="gap-4">
          <CardHeader className="pb-0">
            <CardTitle>Quốc gia phổ biến</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {POPULAR_COUNTRY_SLUGS.map((slug) => (
              <Button key={slug} variant="outline" size="sm" asChild>
                <Link href={`/quoc-gia/${slug}`}>
                  {COUNTRY_LABELS[slug as PopularCountrySlug]}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
