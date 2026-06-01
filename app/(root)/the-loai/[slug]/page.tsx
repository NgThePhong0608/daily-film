import { getMoviesByCategory } from "@/lib/ophim";
import { Metadata } from "next";
import MovieGrid from "@/components/movie/MovieGrid";
import Pagination from "@/components/shared/Pagination";
import { parsePageParam, parseSortParam, sortMovies } from "@/lib/utils";
import ListingToolbar from "@/components/shared/ListingToolbar";

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  // We can try to format the slug to a display name if we don't have a map
  // or just use the slug for now, or fetch the category details if an API exists.
  // The current API behavior for getMoviesByCategory returns items but maybe not the category name explicitly in a simple way without mapping.
  // Converting slug "hanh-dong" -> "Hanh Dong" -> "Hành Động" is hard without a map.
  // For now, let's just capitalize the slug.
  const title = params.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: `Phim ${title} - Daily Film`,
    description: `Xem phim ${title} mới nhất, tuyển chọn hay nhất.`,
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { slug } = params;
  const page = parsePageParam(searchParams.page);
  const sort = parseSortParam(searchParams.sort);
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  const { items, pagination } = await getMoviesByCategory(slug, page);
  const sortedItems = sortMovies(items, sort);

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Phim {title}</h1>

      {pagination && (
        <p className="text-muted-foreground mb-4">
          Tổng cộng {pagination.totalItems.toLocaleString()} phim
        </p>
      )}

      <ListingToolbar pathname={`/the-loai/${slug}`} sort={sort} />

      {items.length > 0 ? (
        <>
          <MovieGrid movies={sortedItems} />
          {pagination && (
            <Pagination
              pagination={pagination}
              baseUrl={`/the-loai/${slug}${sort === "latest" ? "" : `?sort=${sort}`}`}
            />
          )}
        </>
      ) : (
        <p className="text-muted-foreground">Không tìm thấy phim nào trong thể loại này.</p>
      )}
    </div>
  );
}
