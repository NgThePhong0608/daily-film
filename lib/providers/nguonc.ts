import { Category, Country, Movie, MovieDetail, Pagination } from "@/types/movie";
import { fetchWithRetry } from "@/lib/fetch-utils";

export const NGUONC_BASE_URL =
  process.env.NEXT_PUBLIC_NGUONC_BASE_URL || "https://phim.nguonc.com/api";

export const MOVIE_LIST_REVALIDATE = 60;
export const MOVIE_DETAIL_REVALIDATE = 3600;

const FETCH_CONFIG = {
  retries: 3,
  retryDelay: 1000,
  timeout: 20000,
};

const CATEGORY_SLUG_MAP: Record<string, string> = {
  "hai-huoc": "phim-hai",
  "hai": "phim-hai",
  "am-nhac": "phim-nhac",
  "nhac": "phim-nhac",
  "khoa-hoc": "khoa-hoc-vien-tuong",
  "vien-tuong": "khoa-hoc-vien-tuong",
  "lang-man": "lang-man",
  "tinh-cam": "tinh-cam",
};

const COUNTRY_SLUG_MAP: Record<string, string> = {
  "hoa-ky": "au-my",
  "china": "trung-quoc",
  "korea": "han-quoc",
  "japan": "nhat-ban",
};

const LIST_SLUG_MAP: Record<string, string> = {
  "phim-moi": "phim-moi-cap-nhat",
  "phim-moi-cap-nhat": "phim-moi-cap-nhat",
  "phim-bo": "phim-bo",
  "phim-le": "phim-le",
  "tv-shows": "tv-shows",
  "shows": "tv-shows",
  "dang-chieu": "dang-chieu",
  "phim-bo-dang-chieu": "dang-chieu",
  "phim-chieu-rap": "phim-le",
  "phim-vietsub": "phim-moi-cap-nhat",
  "phim-thuyet-minh": "phim-moi-cap-nhat",
  "phim-long-tieng": "phim-moi-cap-nhat",
  "phim-long-tien": "phim-moi-cap-nhat",
  "phim-bo-hoan-thanh": "phim-bo",
  "phim-sap-chieu": "dang-chieu",
};

const KNOWN_CATEGORY_NAMES: Record<string, string> = {
  "hành động": "hanh-dong",
  "phiêu lưu": "phieu-luu",
  "hoạt hình": "hoat-hinh",
  "hài": "phim-hai",
  "phim hài": "phim-hai",
  "hài hước": "phim-hai",
  "hình sự": "hinh-su",
  "tài liệu": "tai-lieu",
  "chính kịch": "chinh-kich",
  "gia đình": "gia-dinh",
  "giả tưởng": "gia-tuong",
  "lịch sử": "lich-su",
  "kinh dị": "kinh-di",
  "nhạc": "phim-nhac",
  "phim nhạc": "phim-nhac",
  "âm nhạc": "phim-nhac",
  "bí ẩn": "bi-an",
  "lãng mạn": "lang-man",
  "khoa học viễn tưởng": "khoa-hoc-vien-tuong",
  "viễn tưởng": "khoa-hoc-vien-tuong",
  "khoa học": "khoa-hoc-vien-tuong",
  "gây cấn": "gay-can",
  "chiến tranh": "chien-tranh",
  "tâm lý": "tam-ly",
  "tình cảm": "tinh-cam",
  "cổ trang": "co-trang",
  "miền tây": "mien-tay",
  "phim 18+": "phim-18",
  "18+": "phim-18",
  "phim 18": "phim-18",
};

const KNOWN_COUNTRY_NAMES: Record<string, string> = {
  "âu mỹ": "au-my",
  "anh": "anh",
  "trung quốc": "trung-quoc",
  "indonesia": "indonesia",
  "việt nam": "viet-nam",
  "pháp": "phap",
  "hồng kông": "hong-kong",
  "hàn quốc": "han-quoc",
  "south korea": "han-quoc",
  "nhật bản": "nhat-ban",
  "thái lan": "thai-lan",
  "đài loan": "dai-loan",
  "nga": "nga",
  "hà lan": "ha-lan",
  "philippines": "philippines",
  "ấn độ": "an-do",
  "quốc gia khác": "quoc-gia-khac",
};

export const NGUONC_CATEGORIES: Category[] = [
  { id: "hanh-dong", name: "Hành Động", slug: "hanh-dong" },
  { id: "phieu-luu", name: "Phiêu Lưu", slug: "phieu-luu" },
  { id: "hoat-hinh", name: "Hoạt Hình", slug: "hoat-hinh" },
  { id: "phim-hai", name: "Hài", slug: "phim-hai" },
  { id: "hinh-su", name: "Hình Sự", slug: "hinh-su" },
  { id: "tai-lieu", name: "Tài Liệu", slug: "tai-lieu" },
  { id: "chinh-kich", name: "Chính Kịch", slug: "chinh-kich" },
  { id: "gia-dinh", name: "Gia Đình", slug: "gia-dinh" },
  { id: "gia-tuong", name: "Giả Tưởng", slug: "gia-tuong" },
  { id: "lich-su", name: "Lịch Sử", slug: "lich-su" },
  { id: "kinh-di", name: "Kinh Dị", slug: "kinh-di" },
  { id: "phim-nhac", name: "Nhạc", slug: "phim-nhac" },
  { id: "bi-an", name: "Bí Ẩn", slug: "bi-an" },
  { id: "lang-man", name: "Lãng Mạn", slug: "lang-man" },
  { id: "khoa-hoc-vien-tuong", name: "Khoa Học Viễn Tưởng", slug: "khoa-hoc-vien-tuong" },
  { id: "gay-can", name: "Gây Cấn", slug: "gay-can" },
  { id: "chien-tranh", name: "Chiến Tranh", slug: "chien-tranh" },
  { id: "tam-ly", name: "Tâm Lý", slug: "tam-ly" },
  { id: "tinh-cam", name: "Tình Cảm", slug: "tinh-cam" },
  { id: "co-trang", name: "Cổ Trang", slug: "co-trang" },
  { id: "mien-tay", name: "Miền Tây", slug: "mien-tay" },
  { id: "phim-18", name: "Phim 18+", slug: "phim-18" },
];

export const NGUONC_COUNTRIES: Country[] = [
  { id: "au-my", name: "Âu Mỹ", slug: "au-my" },
  { id: "anh", name: "Anh", slug: "anh" },
  { id: "trung-quoc", name: "Trung Quốc", slug: "trung-quoc" },
  { id: "indonesia", name: "Indonesia", slug: "indonesia" },
  { id: "viet-nam", name: "Việt Nam", slug: "viet-nam" },
  { id: "phap", name: "Pháp", slug: "phap" },
  { id: "hong-kong", name: "Hồng Kông", slug: "hong-kong" },
  { id: "han-quoc", name: "Hàn Quốc", slug: "han-quoc" },
  { id: "nhat-ban", name: "Nhật Bản", slug: "nhat-ban" },
  { id: "thai-lan", name: "Thái Lan", slug: "thai-lan" },
  { id: "dai-loan", name: "Đài Loan", slug: "dai-loan" },
  { id: "nga", name: "Nga", slug: "nga" },
  { id: "ha-lan", name: "Hà Lan", slug: "ha-lan" },
  { id: "philippines", name: "Philippines", slug: "philippines" },
  { id: "an-do", name: "Ấn Độ", slug: "an-do" },
  { id: "quoc-gia-khac", name: "Quốc gia khác", slug: "quoc-gia-khac" },
];

type NguoncListResponse = {
  status?: string;
  items?: unknown[];
  paginate?: {
    current_page?: number;
    total_page?: number;
    total_items?: number;
    items_per_page?: number;
  };
};

type NguoncDetailResponse = {
  status?: string;
  movie?: Record<string, unknown>;
};

function isSuccess(status: unknown) {
  return status === "success" || status === true;
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

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeMovie(value: unknown): Movie | null {
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const name = normalizeString(record.name);
  const slug = normalizeString(record.slug);

  if (!name || !slug) return null;

  return {
    _id: normalizeId(record.id ?? record._id ?? slug),
    name,
    slug,
    origin_name: normalizeString(record.original_name ?? record.origin_name),
    thumb_url: normalizeImageUrl(record.thumb_url),
    poster_url: normalizeImageUrl(record.poster_url ?? record.thumb_url),
    year: normalizeNumber(record.year),
  };
}

function normalizeCategoryList(categoryObj: unknown): Category[] {
  if (!categoryObj || typeof categoryObj !== "object") return [];

  // If array
  if (Array.isArray(categoryObj)) {
    return categoryObj
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const name = normalizeString(item.name);
        if (!name) return null;
        const slug =
          normalizeString(item.slug) ||
          KNOWN_CATEGORY_NAMES[name.toLowerCase()] ||
          slugify(name);
        return {
          id: normalizeId(item.id ?? slug),
          name,
          slug,
        };
      })
      .filter((item): item is Category => Boolean(item));
  }

  // If object with groups (e.g., { "1": { group: {...}, list: [...] }, "2": {...} })
  const result: Category[] = [];
  const entries = Object.values(categoryObj as Record<string, unknown>);

  for (const groupContainer of entries) {
    if (!groupContainer || typeof groupContainer !== "object") continue;
    const groupRecord = groupContainer as Record<string, unknown>;
    const groupName = normalizeString(
      (groupRecord.group as Record<string, unknown> | undefined)?.name
    ).toLowerCase();

    // Skip Country or Year groups
    if (groupName === "quốc gia" || groupName === "năm") continue;

    const list = Array.isArray(groupRecord.list) ? groupRecord.list : [];
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const name = normalizeString(rec.name);
      if (!name) continue;

      const slug =
        normalizeString(rec.slug) ||
        KNOWN_CATEGORY_NAMES[name.toLowerCase()] ||
        slugify(name);

      result.push({
        id: normalizeId(rec.id ?? slug),
        name,
        slug,
      });
    }
  }

  return result;
}

function normalizeCountryList(categoryObj: unknown): Country[] {
  if (!categoryObj || typeof categoryObj !== "object") return [];

  // If array
  if (Array.isArray(categoryObj)) {
    return categoryObj
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const name = normalizeString(item.name);
        if (!name) return null;
        const slug =
          normalizeString(item.slug) ||
          KNOWN_COUNTRY_NAMES[name.toLowerCase()] ||
          slugify(name);
        return {
          id: normalizeId(item.id ?? slug),
          name,
          slug,
        };
      })
      .filter((item): item is Country => Boolean(item));
  }

  // If object with groups
  const result: Country[] = [];
  const entries = Object.values(categoryObj as Record<string, unknown>);

  for (const groupContainer of entries) {
    if (!groupContainer || typeof groupContainer !== "object") continue;
    const groupRecord = groupContainer as Record<string, unknown>;
    const groupName = normalizeString(
      (groupRecord.group as Record<string, unknown> | undefined)?.name
    ).toLowerCase();

    if (groupName !== "quốc gia") continue;

    const list = Array.isArray(groupRecord.list) ? groupRecord.list : [];
    for (const item of list) {
      if (!item || typeof item !== "object") continue;
      const rec = item as Record<string, unknown>;
      const name = normalizeString(rec.name);
      if (!name) continue;

      const slug =
        normalizeString(rec.slug) ||
        KNOWN_COUNTRY_NAMES[name.toLowerCase()] ||
        slugify(name);

      result.push({
        id: normalizeId(rec.id ?? slug),
        name,
        slug,
      });
    }
  }

  return result;
}

function normalizeStringList(value: unknown): string[] {
  if (typeof value === "string") {
    return value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (Array.isArray(value)) {
    return value.map(normalizeString).filter(Boolean);
  }
  return [];
}

function normalizeEpisodeServers(episodesData: unknown): MovieDetail["episodes"] {
  if (!Array.isArray(episodesData)) return [];

  return episodesData
    .map((server) => {
      if (!server || typeof server !== "object") return null;
      const sRecord = server as Record<string, unknown>;
      const serverName = normalizeString(sRecord.server_name) || "Server #1";
      const rawItems = Array.isArray(sRecord.items)
        ? sRecord.items
        : Array.isArray(sRecord.server_data)
        ? sRecord.server_data
        : [];

      const serverData = rawItems
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const iRecord = item as Record<string, unknown>;
          const slug = normalizeString(iRecord.slug);
          const name = normalizeString(iRecord.name) || slug;
          const linkEmbed = normalizeString(iRecord.embed ?? iRecord.link_embed);
          const linkM3u8 = normalizeString(iRecord.m3u8 ?? iRecord.link_m3u8);

          if (!slug || (!linkEmbed && !linkM3u8)) return null;

          return {
            name,
            slug,
            filename: normalizeString(iRecord.filename ?? name),
            link_embed: linkEmbed,
            link_m3u8: linkM3u8,
          };
        })
        .filter((item): item is MovieDetail["episodes"][number]["server_data"][number] => Boolean(item));

      if (serverData.length === 0) return null;

      return {
        server_name: serverName,
        server_data: serverData,
      };
    })
    .filter((server): server is MovieDetail["episodes"][number] => Boolean(server));
}

function normalizeMovieDetail(value: unknown): MovieDetail | null {
  const movie = normalizeMovie(value);
  if (!movie || !value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const totalEpisodes = normalizeNumber(record.total_episodes);
  const episodes = normalizeEpisodeServers(record.episodes);
  const categories = normalizeCategoryList(record.category);
  const countries = normalizeCountryList(record.category);

  let type: MovieDetail["type"] = "single";
  const formatList = (record.category as Record<string, { list?: { name?: string }[] }> | undefined)?.[
    "1"
  ]?.list;
  const isSeries =
    formatList?.some((f) => f.name?.includes("Phim bộ") || f.name?.includes("TV")) ||
    totalEpisodes > 1;
  const isAnime = categories.some((c) => c.slug === "hoat-hinh");

  if (isAnime) {
    type = "hoathinh";
  } else if (isSeries) {
    type = "series";
  }

  return {
    ...movie,
    content: normalizeString(record.description ?? record.content),
    type,
    status: normalizeString(record.current_episode ?? record.status),
    time: normalizeString(record.time),
    episode_current: normalizeString(record.current_episode ?? record.episode_current),
    episode_total: totalEpisodes > 0 ? String(totalEpisodes) : normalizeString(record.episode_total),
    quality: normalizeString(record.quality),
    lang: normalizeString(record.language ?? record.lang),
    actor: normalizeStringList(record.casts ?? record.actor),
    director: normalizeStringList(record.director),
    category: categories,
    country: countries,
    episodes,
    chieurap: Boolean(record.chieurap),
    sub_docquyen: Boolean(record.sub_docquyen),
    trailer_url: normalizeString(record.trailer_url),
    view: normalizeNumber(record.view),
  };
}

function normalizePagination(value: NguoncListResponse["paginate"]): Pagination | null {
  if (!value) return null;

  return {
    totalItems: normalizeNumber(value.total_items),
    totalItemsPerPage: normalizeNumber(value.items_per_page, 10),
    currentPage: normalizeNumber(value.current_page, 1),
    totalPages: normalizeNumber(value.total_page, 1),
  };
}

async function fetchMovieList(path: string, page = 1) {
  try {
    const separator = path.includes("?") ? "&" : "?";
    const url = `${normalizeBaseUrl(NGUONC_BASE_URL)}${path}${separator}page=${page}`;
    const res = await fetchWithRetry(url, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_LIST_REVALIDATE },
    });

    if (res.status === 404) return { items: [], pagination: null };
    if (!res.ok) throw new Error(`Failed to fetch movies: ${res.status}`);

    const data = (await res.json()) as NguoncListResponse;
    if (!isSuccess(data.status)) return { items: [], pagination: null };

    const items = Array.isArray(data.items)
      ? data.items.map(normalizeMovie).filter((item): item is Movie => Boolean(item))
      : [];

    return {
      items,
      pagination: normalizePagination(data.paginate),
    };
  } catch (error) {
    console.error(`phim.nguonc.com list error for "${path}":`, error);
    return { items: [], pagination: null };
  }
}

export function resolveNguoncImageUrl(path?: string | null) {
  return normalizeImageUrl(path);
}

export async function resolveEpisodeHlsUrl(episode: {
  link_embed?: string | null;
  link_m3u8?: string | null;
}) {
  return episode.link_m3u8?.trim() || "";
}

export async function getLatestMovies(page = 1) {
  return fetchMovieList("/films/phim-moi-cap-nhat", page);
}

export async function searchMovies(keyword: string, page = 1) {
  const path = `/films/search?keyword=${encodeURIComponent(keyword)}`;
  return fetchMovieList(path, page);
}

export async function getMoviesByCategory(slug: string, page = 1) {
  const mappedSlug = CATEGORY_SLUG_MAP[slug] || slug;
  return fetchMovieList(`/films/the-loai/${mappedSlug}`, page);
}

export async function getMoviesByCountry(slug: string, page = 1) {
  const mappedSlug = COUNTRY_SLUG_MAP[slug] || slug;
  return fetchMovieList(`/films/quoc-gia/${mappedSlug}`, page);
}

export async function getMoviesByYear(year: string | number, page = 1) {
  return fetchMovieList(`/films/nam-phat-hanh/${year}`, page);
}

export async function getMoviesList(slug: string, page = 1) {
  const mappedSlug = LIST_SLUG_MAP[slug] || slug;
  if (mappedSlug === "phim-moi-cap-nhat") {
    return getLatestMovies(page);
  }
  if (slug === "hoat-hinh") {
    return getMoviesByCategory("hoat-hinh", page);
  }
  return fetchMovieList(`/films/danh-sach/${mappedSlug}`, page);
}

export async function getCategories(): Promise<Category[]> {
  return NGUONC_CATEGORIES;
}

export async function getCountries(): Promise<Country[]> {
  return NGUONC_COUNTRIES;
}

export async function getYears() {
  const currentYear = new Date().getFullYear();
  const years: { id: string; name: string; slug: string }[] = [];
  for (let year = currentYear; year >= 2000; year--) {
    const yearStr = String(year);
    years.push({
      id: yearStr,
      name: yearStr,
      slug: yearStr,
    });
  }
  return years;
}

export async function getActors(limit = 120) {
  try {
    const { items } = await getLatestMovies(1);
    const actorMap = new Map<string, { id: string; name: string; slug: string; thumb_url?: string }>();

    for (const movie of items.slice(0, 10)) {
      const detail = await getMovieDetail(movie.slug);
      if (detail?.movie.actor) {
        for (const actorName of detail.movie.actor) {
          const trimmed = actorName.trim();
          if (trimmed && !actorMap.has(trimmed)) {
            const actorSlug = slugify(trimmed);
            actorMap.set(trimmed, {
              id: actorSlug,
              name: trimmed,
              slug: actorSlug,
              thumb_url: movie.thumb_url,
            });
          }
        }
      }
    }

    const actors = Array.from(actorMap.values());
    return limit > 0 ? actors.slice(0, limit) : actors;
  } catch {
    return [];
  }
}

export async function getMovieDetail(slug: string) {
  try {
    const url = `${normalizeBaseUrl(NGUONC_BASE_URL)}/film/${slug}`;
    const res = await fetchWithRetry(url, {
      ...FETCH_CONFIG,
      next: { revalidate: MOVIE_DETAIL_REVALIDATE },
    });

    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch movie detail: ${res.status}`);

    const data = (await res.json()) as NguoncDetailResponse;
    if (!isSuccess(data.status) || !data.movie) return null;

    const movie = normalizeMovieDetail(data.movie);
    if (!movie) return null;

    return {
      movie,
      episodes: movie.episodes,
    };
  } catch (error) {
    console.error(`phim.nguonc.com getMovieDetail error for slug "${slug}":`, error);
    return null;
  }
}
