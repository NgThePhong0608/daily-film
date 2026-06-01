"use server";

import {
  getMoviesByCountry,
  getMoviesByCategory,
  searchMovies,
} from "@/lib/ophim";

export async function fetchMoreMoviesByCountry(slug: string, page: number) {
  const { items, pagination } = await getMoviesByCountry(slug, page);

  return {
    items,
    hasMore: pagination ? page < pagination.totalPages : false,
  };
}

export async function fetchMoreMoviesByCategory(slug: string, page: number) {
  const { items, pagination } = await getMoviesByCategory(slug, page);

  return {
    items,
    hasMore: pagination ? page < pagination.totalPages : false,
  };
}

export async function fetchMoreSearchResults(keyword: string, page: number) {
  const { items, pagination } = await searchMovies(keyword, page);

  return {
    items,
    hasMore: pagination ? page < pagination.totalPages : false,
  };
}
