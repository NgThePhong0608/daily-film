import * as nguonc from "@/lib/providers/nguonc";

const FALLBACK_MOVIE_IMAGE = "/window.svg";

export function resolveMovieImageUrl(path?: string | null) {
  const trimmedPath = path?.trim();

  if (!trimmedPath) return FALLBACK_MOVIE_IMAGE;

  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("/")
  ) {
    return nguonc.resolveNguoncImageUrl(trimmedPath);
  }

  return FALLBACK_MOVIE_IMAGE;
}

export function getLatestMovies(page = 1) {
  return nguonc.getLatestMovies(page);
}

export function getMovieDetail(slug: string) {
  return nguonc.getMovieDetail(slug);
}

export function searchMovies(keyword: string, page = 1) {
  return nguonc.searchMovies(keyword, page);
}

export function getMoviesByCategory(slug: string, page = 1) {
  return nguonc.getMoviesByCategory(slug, page);
}

export function getMoviesByCountry(slug: string, page = 1) {
  return nguonc.getMoviesByCountry(slug, page);
}

export function getMoviesByYear(year: string | number, page = 1) {
  return nguonc.getMoviesByYear(year, page);
}

export function getMoviesList(slug: string, page = 1) {
  return nguonc.getMoviesList(slug, page);
}

export function getCategories() {
  return nguonc.getCategories();
}

export function getCountries() {
  return nguonc.getCountries();
}

export function getYears() {
  return nguonc.getYears();
}

export function getActors(limit?: number) {
  return nguonc.getActors(limit);
}

export function resolveEpisodeHlsUrl(episode: {
  link_embed?: string | null;
  link_m3u8?: string | null;
}) {
  return nguonc.resolveEpisodeHlsUrl(episode);
}

