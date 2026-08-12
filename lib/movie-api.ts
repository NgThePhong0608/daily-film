import * as vsmov from "@/lib/providers/vsmov";

const FALLBACK_MOVIE_IMAGE = "/window.svg";

export function resolveMovieImageUrl(path?: string | null) {
  const trimmedPath = path?.trim();

  if (!trimmedPath) return FALLBACK_MOVIE_IMAGE;

  if (
    trimmedPath.startsWith("http://") ||
    trimmedPath.startsWith("https://") ||
    trimmedPath.startsWith("/")
  ) {
    return vsmov.resolveVsmovImageUrl(trimmedPath);
  }

  return FALLBACK_MOVIE_IMAGE;
}

export function getLatestMovies(page = 1) {
  return vsmov.getLatestMovies(page);
}

export function getMovieDetail(slug: string) {
  return vsmov.getMovieDetail(slug);
}

export function searchMovies(keyword: string, page = 1) {
  return vsmov.searchMovies(keyword, page);
}

export function getMoviesByCategory(slug: string, page = 1) {
  return vsmov.getMoviesByCategory(slug, page);
}

export function getMoviesByCountry(slug: string, page = 1) {
  return vsmov.getMoviesByCountry(slug, page);
}

export function getMoviesByYear(year: string | number, page = 1) {
  return vsmov.getMoviesByYear(year, page);
}

export function getMoviesList(slug: string, page = 1) {
  return vsmov.getMoviesList(slug, page);
}

export function getCategories() {
  return vsmov.getCategories();
}

export function getCountries() {
  return vsmov.getCountries();
}

export function getYears() {
  return vsmov.getYears();
}

export function getActors(limit?: number) {
  return vsmov.getActors(limit);
}

export function resolveEpisodeHlsUrl(episode: {
  link_embed?: string | null;
  link_m3u8?: string | null;
}) {
  return vsmov.resolveEpisodeHlsUrl(episode);
}
