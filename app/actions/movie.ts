"use server";

import { getLatestMovies } from "@/lib/ophim";
import { Movie } from "@/types/movie";

export type LoadMoreMoviesResult = {
  items: Movie[];
  nextPage: number | null;
};

export async function loadMoreMovies(page: number): Promise<LoadMoreMoviesResult> {
  const data = await getLatestMovies(page);

  const hasMore =
    data.pagination &&
    data.pagination.currentPage < data.pagination.totalPages;

  return {
    items: data.items,
    nextPage: hasMore ? page + 1 : null,
  };
}
