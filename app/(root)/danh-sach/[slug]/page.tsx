import { getMoviesList } from "@/lib/movie-api";
import { LIST_MOVIES_TYPE } from "@/lib/constants";
import { Metadata } from "next";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/shared/Pagination";
import { parsePageParam, parseSortParam, sortMovies } from "@/lib/utils";
import ListingToolbar from "@/components/shared/ListingToolbar";
import { DEFAULT_LISTING_SORT } from "@/lib/constants";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const typeFilm = LIST_MOVIES_TYPE.find((item) => item.value === params.slug)?.label || params.slug;

  return {
    title: `Danh sách phim ${typeFilm} - Daily Film`,
    description: `Xem phim ${typeFilm} mới nhất, chất lượng cao. Cập nhật liên tục phim ${typeFilm} hay nhất.`,
  };
}

export default async function ListTypeMoviePage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug } = params;
  const page = parsePageParam(searchParams.page);
  const sort = parseSortParam(searchParams.sort);

  // Get type film label for display
  const typeFilm = LIST_MOVIES_TYPE.find((item) => item.value === slug)?.label || slug;

  const { items, pagination } = await getMoviesList(slug, page);
  const visibleItems =
    sort === DEFAULT_LISTING_SORT ? items : sortMovies(items, sort);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-2">Phim {typeFilm}</h1>

      {pagination && (
        <p className="text-muted-foreground mb-4">
          Tổng cộng {pagination.totalItems.toLocaleString()} phim
        </p>
      )}

      <ListingToolbar pathname={`/danh-sach/${slug}`} sort={sort} />

      {items.length > 0 ? (
        <>
          <MovieGrid movies={visibleItems} />
          {pagination && (
            <Pagination
              pagination={pagination}
              baseUrl={`/danh-sach/${slug}${sort === DEFAULT_LISTING_SORT ? "" : `?sort=${sort}`}`}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
