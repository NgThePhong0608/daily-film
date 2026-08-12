import { getMoviesByYear } from "@/lib/movie-api";
import { Metadata } from "next";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/shared/Pagination";
import { parsePageParam, parseSortParam, sortMovies } from "@/lib/utils";
import ListingToolbar from "@/components/shared/ListingToolbar";
import { DEFAULT_LISTING_SORT } from "@/lib/constants";

interface Props {
  params: Promise<{ year: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;

  return {
    title: `Phim năm ${params.year} - Daily Film`,
    description: `Xem phim năm ${params.year} mới nhất, chất lượng cao.`,
  };
}

export default async function YearPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const page = parsePageParam(searchParams.page);
  const sort = parseSortParam(searchParams.sort);

  const { items, pagination } = await getMoviesByYear(params.year, page);
  const visibleItems =
    sort === DEFAULT_LISTING_SORT ? items : sortMovies(items, sort);

  return (
    <div className="container py-8">
      <h1 className="mb-2 text-2xl font-bold">Phim năm {params.year}</h1>

      {pagination && (
        <p className="mb-4 text-muted-foreground">
          Tổng cộng {pagination.totalItems.toLocaleString()} phim
        </p>
      )}

      <ListingToolbar pathname={`/nam/${params.year}`} sort={sort} />

      {items.length > 0 ? (
        <>
          <MovieGrid movies={visibleItems} />
          {pagination && (
            <Pagination
              pagination={pagination}
              baseUrl={`/nam/${params.year}${sort === DEFAULT_LISTING_SORT ? "" : `?sort=${sort}`}`}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
