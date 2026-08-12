import { Movie, MovieDetail } from "@/types/movie";
import { fetchWithRetry } from "./fetch-utils";

export const OPHIM_BASE_URL = process.env.NEXT_PUBLIC_OPHIM_BASE_URL;
const DEFAULT_OPHIM_IMAGE_URL = "https://img.ophim.live/uploads/movies";

function normalizeOphimImageBase(url?: string | null) {
  if (!url) return DEFAULT_OPHIM_IMAGE_URL;

  const trimmedUrl = url.trim().replace(/\/+$/, "");

  if (
    trimmedUrl.includes("img.ophim1.com") ||
    trimmedUrl.includes("img.ophim18.cc")
  ) {
    return DEFAULT_OPHIM_IMAGE_URL;
  }

  return trimmedUrl;
}

export const OPHIM_IMAGE_URL = normalizeOphimImageBase(
  process.env.NEXT_PUBLIC_OPHIM_IMAGE_URL,
);

export function resolveOphimImageUrl(
  path?: string | null,
  imageBase = OPHIM_IMAGE_URL,
) {
  if (!path) return "";

  const trimmedPath = path.trim();

  if (!trimmedPath) return "";
  if (trimmedPath.startsWith("http://") || trimmedPath.startsWith("https://")) {
    return trimmedPath;
  }

  return `${normalizeOphimImageBase(imageBase)}/${trimmedPath.replace(/^\/+/, "")}`;
}

// Re-export constants
export const MOVIE_LIST_REVALIDATE = 60; // 1 minute
export const MOVIE_DETAIL_REVALIDATE = 3600; // 1 hour

// Fetch configuration
const FETCH_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  timeout: 20000, // 20 seconds
};

function isPlayableEpisode(
  episode: MovieDetail["episodes"][number]["server_data"][number],
) {
  return Boolean(
    episode.slug?.trim() && (episode.link_m3u8?.trim() || episode.link_embed?.trim()),
  );
}

function filterPlayableEpisodes(episodes: MovieDetail["episodes"]) {
  return episodes
    .map((server) => ({
      ...server,
      server_data: server.server_data.filter(isPlayableEpisode),
    }))
    .filter((server) => server.server_data.length > 0);
}

export async function getLatestMovies(page = 1) {
  try {
    const res = await fetchWithRetry(
      `${OPHIM_BASE_URL}/danh-sach/phim-moi-cap-nhat?page=${page}`,
      {
        ...FETCH_CONFIG,
        next: { revalidate: MOVIE_LIST_REVALIDATE },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch movies");

    const data = await res.json();
    return {
      items: (data.items || []) as Movie[],
      pagination: data.pagination,
    };
  } catch (error) {
    console.error("getLatestMovies error:", error);
    return { items: [], pagination: null };
  }
}

export async function getMovieDetail(slug: string) {
  try {
    const res = await fetchWithRetry(`${OPHIM_BASE_URL}/phim/${slug}`, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_DETAIL_REVALIDATE },
    });

    if (!res.ok) throw new Error(`Failed to fetch movie detail: ${res.status} ${res.statusText}`);

    const data = await res.json();

    if (!data.status || !data.movie) {
      return null;
    }

    const movie = data.movie as MovieDetail;
    const episodes = filterPlayableEpisodes(
      (data.episodes || []) as MovieDetail["episodes"],
    );

    return {
      movie: { ...movie, episodes }, // Ensure episodes are attached to movie object
      episodes,
    };
  } catch (error) {
    console.error(`getMovieDetail error for slug "${slug}":`, error);
    return null;
  }
}

export async function searchMovies(keyword: string, page = 1) {
  try {
    const url = `${OPHIM_BASE_URL}/v1/api/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`;

    const res = await fetchWithRetry(url, {
      ...FETCH_CONFIG,
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Failed to fetch search results");
    const data = await res.json();

    const items = data?.data?.items || [];
    const apiPagination = data?.data?.params?.pagination;

    const pagination = apiPagination
      ? {
          totalItems: apiPagination.totalItems,
          totalItemsPerPage: apiPagination.totalItemsPerPage,
          currentPage: apiPagination.currentPage,
          totalPages: Math.ceil(
            apiPagination.totalItems / apiPagination.totalItemsPerPage,
          ),
        }
      : null;

    return {
      items: items as Movie[],
      pagination,
    };
  } catch (error) {
    console.error("searchMovies error:", error);
    return { items: [], pagination: null };
  }
}

export async function getMoviesByCategory(slug: string, page = 1) {
  try {
    const res = await fetchWithRetry(
      `${OPHIM_BASE_URL}/v1/api/the-loai/${slug}?page=${page}`,
      {
        ...FETCH_CONFIG,
        next: { revalidate: MOVIE_LIST_REVALIDATE },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch movies by category");

    const data = await res.json();
    const items = data?.data?.items || [];
    const apiPagination = data?.data?.params?.pagination;

    const pagination = apiPagination
      ? {
          totalItems: apiPagination.totalItems,
          totalItemsPerPage: apiPagination.totalItemsPerPage,
          currentPage: apiPagination.currentPage,
          totalPages: Math.ceil(
            apiPagination.totalItems / apiPagination.totalItemsPerPage,
          ),
        }
      : null;

    return {
      items: items as Movie[],
      pagination,
    };
  } catch (error) {
    console.error("getMoviesByCategory error:", error);
    return { items: [], pagination: null };
  }
}

export async function getMoviesByCountry(slug: string, page = 1) {
  try {
    const res = await fetchWithRetry(
      `${OPHIM_BASE_URL}/v1/api/quoc-gia/${slug}?page=${page}`,
      {
        ...FETCH_CONFIG,
        next: { revalidate: MOVIE_LIST_REVALIDATE },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch movies by country");

    const data = await res.json();
    const items = data?.data?.items || [];
    const apiPagination = data?.data?.params?.pagination;

    const pagination = apiPagination
      ? {
          totalItems: apiPagination.totalItems,
          totalItemsPerPage: apiPagination.totalItemsPerPage,
          currentPage: apiPagination.currentPage,
          totalPages: Math.ceil(
            apiPagination.totalItems / apiPagination.totalItemsPerPage,
          ),
        }
      : null;

    return {
      items: items as Movie[],
      pagination,
    };
  } catch (error) {
    console.error("getMoviesByCountry error:", error);
    return { items: [], pagination: null };
  }
}

export async function getMoviesList(slug: string, page = 1) {
  try {
    const res = await fetchWithRetry(
      `${OPHIM_BASE_URL}/v1/api/danh-sach/${slug}?page=${page}`,
      {
        ...FETCH_CONFIG,
        next: { revalidate: MOVIE_LIST_REVALIDATE },
      },
    );

    if (!res.ok) throw new Error("Failed to fetch movies by country");

    const data = await res.json();
    const items = data?.data?.items || [];
    const apiPagination = data?.data?.params?.pagination;

    const pagination = apiPagination
      ? {
          totalItems: apiPagination.totalItems,
          totalItemsPerPage: apiPagination.totalItemsPerPage,
          currentPage: apiPagination.currentPage,
          totalPages: Math.ceil(
            apiPagination.totalItems / apiPagination.totalItemsPerPage,
          ),
        }
      : null;

    return {
      items: items as Movie[],
      pagination,
    };
  } catch (error) {
    console.error("getMoviesList error:", error);
    return { items: [], pagination: null };
  }
}
