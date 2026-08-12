import { Category, Country, Movie, MovieDetail, Pagination } from "@/types/movie";
import { fetchWithRetry } from "@/lib/fetch-utils";

export const VSMOV_BASE_URL =
  process.env.NEXT_PUBLIC_VSMOV_BASE_URL || "https://vsmov.com/api";

export const MOVIE_LIST_REVALIDATE = 60;
export const MOVIE_DETAIL_REVALIDATE = 3600;

const FETCH_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  timeout: 20000,
};

const LIST_SLUG_MAP: Record<string, string> = {
  "phim-moi": "phim-moi-cap-nhat",
  "phim-long-tien": "phim-long-tieng",
};

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "hai-huoc": "hai",
  "khoa-hoc": "khoa-hoc-vien-tuong",
  "tinh-cam": "lang-man",
};

const COUNTRY_SLUG_MAP: Record<string, string> = {
  "trung-quoc": "china",
  "au-my": "hoa-ky",
};

type VsmovListResponse = {
  status?: boolean | string;
  items?: unknown[];
  data?: {
    items?: unknown[];
  };
  pagination?: Partial<Record<keyof Pagination, unknown>>;
};

type VsmovTaxonomyItem = {
  id: string;
  name: string;
  slug: string;
  thumb_url?: string;
};

type VsmovDetailResponse = {
  status?: boolean | string;
  movie?: Record<string, unknown>;
  episodes?: unknown[];
};

function isSuccess(status: unknown) {
  return status === true || status === "success";
}

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/+$/, "");
}

function normalizeString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeNumber(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function normalizeId(value: unknown) {
  const id = normalizeString(value);
  return id || String(value ?? "");
}

function normalizeImageUrl(value: unknown) {
  return normalizeString(value);
}

function getResponseItems(data: VsmovListResponse) {
  return data.items || data.data?.items || [];
}

function normalizeTextList(value: unknown) {
  return Array.isArray(value) ? value.map(normalizeString).filter(Boolean) : [];
}

function normalizeTaxonomy(value: unknown) {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const name = normalizeString(record.name);
      const slug = normalizeString(record.slug);

      if (!name || !slug) return null;

      return {
        id: normalizeId(record.id ?? record._id),
        name,
        slug,
      };
    })
    .filter((item): item is { id: string; name: string; slug: string } => Boolean(item));
}

function normalizeTaxonomyItem(value: unknown): VsmovTaxonomyItem | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const name = normalizeString(record.name);
  const slug = normalizeString(record.slug);

  if (!name || !slug) return null;

  return {
    id: normalizeId(record.id ?? record._id),
    name,
    slug,
    thumb_url: normalizeImageUrl(record.thumb_url) || undefined,
  };
}

function normalizeMovie(value: unknown): Movie | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const name = normalizeString(record.name);
  const slug = normalizeString(record.slug);

  if (!name || !slug) return null;

  return {
    _id: normalizeId(record._id ?? record.id),
    name,
    slug,
    origin_name: normalizeString(record.origin_name),
    thumb_url: normalizeImageUrl(record.thumb_url),
    poster_url: normalizeImageUrl(record.poster_url),
    year: normalizeNumber(record.year),
  };
}

function sortMoviesByYearDesc(movies: Movie[]) {
  return [...movies].sort((a, b) => b.year - a.year);
}

function normalizeEpisodeServer(value: unknown): MovieDetail["episodes"][number] | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const serverData = Array.isArray(record.server_data) ? record.server_data : [];
  const normalizedData = serverData
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const episode = item as Record<string, unknown>;
      const slug = normalizeString(episode.slug);
      const linkEmbed = normalizeString(episode.link_embed);
      const linkM3u8 = normalizeString(episode.link_m3u8);

      if (!slug || (!linkEmbed && !linkM3u8)) return null;

      return {
        name: normalizeString(episode.name) || slug,
        slug,
        filename: normalizeString(episode.filename),
        link_embed: linkEmbed,
        link_m3u8: linkM3u8,
      };
    })
    .filter((item): item is MovieDetail["episodes"][number]["server_data"][number] => Boolean(item));

  if (normalizedData.length === 0) return null;

  return {
    server_name: normalizeString(record.server_name).replace(/\s+/g, " "),
    server_data: normalizedData,
  };
}

function normalizeMovieDetail(value: unknown, episodes: unknown[]): MovieDetail | null {
  const movie = normalizeMovie(value);
  if (!movie || !value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const normalizedEpisodes = episodes
    .map(normalizeEpisodeServer)
    .filter((episode): episode is MovieDetail["episodes"][number] => Boolean(episode));

  return {
    ...movie,
    content: normalizeString(record.content),
    type: normalizeString(record.type) as MovieDetail["type"],
    status: normalizeString(record.status),
    time: normalizeString(record.time),
    episode_current: normalizeString(record.episode_current),
    episode_total: normalizeString(record.episode_total),
    quality: normalizeString(record.quality),
    lang: normalizeString(record.lang),
    actor: normalizeTextList(record.actor),
    director: normalizeTextList(record.director),
    category: normalizeTaxonomy(record.category),
    country: normalizeTaxonomy(record.country),
    episodes: normalizedEpisodes,
    chieurap: Boolean(record.chieurap),
    sub_docquyen: Boolean(record.sub_docquyen),
    trailer_url: normalizeString(record.trailer_url),
    view: normalizeNumber(record.view),
  };
}

function normalizePagination(value: VsmovListResponse["pagination"]) {
  if (!value) return null;

  return {
    totalItems: normalizeNumber(value.totalItems),
    totalItemsPerPage: normalizeNumber(value.totalItemsPerPage),
    currentPage: normalizeNumber(value.currentPage, 1),
    totalPages: normalizeNumber(value.totalPages, 1),
  };
}

async function fetchMovieList(path: string, page = 1) {
  try {
    const url = `${normalizeBaseUrl(VSMOV_BASE_URL)}${path}?page=${page}`;
    const res = await fetchWithRetry(url, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_LIST_REVALIDATE },
    });

    if (res.status === 404) return { items: [], pagination: null };
    if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);

    const data = (await res.json()) as VsmovListResponse;
    if (!isSuccess(data.status)) return { items: [], pagination: null };

    return {
      items: sortMoviesByYearDesc(
        getResponseItems(data).map(normalizeMovie).filter((item): item is Movie => Boolean(item)),
      ),
      pagination: normalizePagination(data.pagination),
    };
  } catch (error) {
    console.error(`VSMov list error for "${path}":`, error);
    return { items: [], pagination: null };
  }
}

async function fetchTaxonomyList(path: string) {
  try {
    const res = await fetchWithRetry(`${normalizeBaseUrl(VSMOV_BASE_URL)}${path}`, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_DETAIL_REVALIDATE },
    });

    if (res.status === 404) return [];
    if (!res.ok) throw new Error(`Failed to fetch taxonomy: ${res.status}`);

    const data = (await res.json()) as VsmovListResponse;
    if (!isSuccess(data.status)) return [];

    return getResponseItems(data)
      .map(normalizeTaxonomyItem)
      .filter((item): item is VsmovTaxonomyItem => Boolean(item));
  } catch (error) {
    console.error(`VSMov taxonomy error for "${path}":`, error);
    return [];
  }
}

function extractEmbeddedHlsUrl(embedHtml: string, embedUrl: string) {
  const directMatch = embedHtml.match(/["']([^"']+\.m3u8[^"']*)["']/);
  if (directMatch?.[1]) {
    try {
      return new URL(directMatch[1], embedUrl).toString();
    } catch {
      return null;
    }
  }

  const baseUrlMatch = embedHtml.match(/\bconst\s+baseUrl\s*=\s*["']([^"']+)["']/);
  const videoHashMatch = embedHtml.match(/\bconst\s+videoHash\s*=\s*["']([^"']+)["']/);

  if (!baseUrlMatch?.[1] || !videoHashMatch?.[1]) return null;

  try {
    return new URL(`/stream/${videoHashMatch[1]}/master.m3u8`, baseUrlMatch[1]).toString();
  } catch {
    return null;
  }
}

export function resolveVsmovImageUrl(path?: string | null) {
  return normalizeImageUrl(path);
}

export async function resolveEpisodeHlsUrl(episode: {
  link_embed?: string | null;
  link_m3u8?: string | null;
}) {
  const fallbackUrl = episode.link_m3u8?.trim() || "";
  const embedUrl = episode.link_embed?.trim();

  if (!embedUrl) return fallbackUrl;

  try {
    const res = await fetchWithRetry(embedUrl, {
      retries: 1,
      retryDelay: 500,
      timeout: 5000,
      next: { revalidate: 300 },
    });

    if (!res.ok) return fallbackUrl;

    return extractEmbeddedHlsUrl(await res.text(), embedUrl) || fallbackUrl;
  } catch (error) {
    console.warn("VSMov resolveEpisodeHlsUrl fallback:", error);
    return fallbackUrl;
  }
}

export async function getLatestMovies(page = 1) {
  return fetchMovieList("/danh-sach/phim-moi-cap-nhat", page);
}

export async function searchMovies(keyword: string, page = 1) {
  const path = `/tim-kiem?keyword=${encodeURIComponent(keyword)}&page=${page}`;

  try {
    const res = await fetchWithRetry(`${normalizeBaseUrl(VSMOV_BASE_URL)}${path}`, {
      ...FETCH_CONFIG,
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error(`Failed to fetch search results: ${res.status}`);

    const data = (await res.json()) as VsmovListResponse;
    if (!isSuccess(data.status)) return { items: [], pagination: null };

    return {
      items: sortMoviesByYearDesc(
        getResponseItems(data).map(normalizeMovie).filter((item): item is Movie => Boolean(item)),
      ),
      pagination: normalizePagination(data.pagination),
    };
  } catch (error) {
    console.error("VSMov searchMovies error:", error);
    return { items: [], pagination: null };
  }
}

export async function getMoviesByCategory(slug: string, page = 1) {
  return fetchMovieList(`/the-loai/${CATEGORY_SLUG_MAP[slug] || slug}`, page);
}

export async function getMoviesByCountry(slug: string, page = 1) {
  return fetchMovieList(`/quoc-gia/${COUNTRY_SLUG_MAP[slug] || slug}`, page);
}

export async function getMoviesByYear(year: string | number, page = 1) {
  return fetchMovieList(`/nam/${year}`, page);
}

export async function getMoviesList(slug: string, page = 1) {
  return fetchMovieList(`/danh-sach/${LIST_SLUG_MAP[slug] || slug}`, page);
}

export async function getCategories(): Promise<Category[]> {
  return fetchTaxonomyList("/the-loai");
}

export async function getCountries(): Promise<Country[]> {
  return fetchTaxonomyList("/quoc-gia");
}

export async function getYears() {
  return fetchTaxonomyList("/nam");
}

export async function getActors(limit = 120) {
  const actors = await fetchTaxonomyList("/dien-vien");
  return limit > 0 ? actors.slice(0, limit) : actors;
}

export async function getMovieDetail(slug: string) {
  try {
    const res = await fetchWithRetry(`${normalizeBaseUrl(VSMOV_BASE_URL)}/phim/${slug}`, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_DETAIL_REVALIDATE },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch movie detail: ${res.status}`);

    const data = (await res.json()) as VsmovDetailResponse;
    if (!isSuccess(data.status) || !data.movie) return null;

    const movie = normalizeMovieDetail(data.movie, data.episodes || []);
    if (!movie) return null;

    return {
      movie,
      episodes: movie.episodes,
    };
  } catch (error) {
    console.error(`VSMov getMovieDetail error for slug "${slug}":`, error);
    return null;
  }
}
