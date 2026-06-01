import { searchMovies } from "@/lib/ophim";
import { MOVIE_CATEGORY_LABELS, type MovieCategorySlug } from "@/lib/constants";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/shared/Pagination";
import { parsePageParam, parseSortParam, sortMovies } from "@/lib/utils";
import ListingToolbar from "@/components/shared/ListingToolbar";

interface Props {
  searchParams: Promise<{ keyword?: string; page?: string; sort?: string }>;
}

export default async function SearchPage(props: Props) {
  const searchParams = await props.searchParams;
  const keyword = searchParams.keyword || "";
  const page = parsePageParam(searchParams.page);
  const sort = parseSortParam(searchParams.sort);

  // Map slug to Vietnamese label, fallback to original keyword
  const displayKeyword =
    MOVIE_CATEGORY_LABELS[keyword as MovieCategorySlug] || keyword;

  const { items, pagination } = await searchMovies(keyword, page);
  const sortedItems = sortMovies(items, sort);

  return (
    <div className="container py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Kết quả tìm kiếm cho: {displayKeyword}
        </h1>
        {pagination && (
          <p className="text-muted-foreground mt-1">
            Tìm thấy {pagination.totalItems.toLocaleString()} phim
          </p>
        )}
      </div>

      <ListingToolbar pathname="/tim-kiem" sort={sort} keyword={keyword} />

      {items.length > 0 ? (
        <>
          <MovieGrid movies={sortedItems} />
          {pagination && (
            <Pagination
              pagination={pagination}
              baseUrl={`/tim-kiem?keyword=${encodeURIComponent(keyword)}${sort === "latest" ? "" : `&sort=${sort}`}`}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào.</p>
      )}
    </div>
  );
}
