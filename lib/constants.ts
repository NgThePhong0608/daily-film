/**
 * Movie category slugs used for filtering and navigation (from phim.nguonc.com)
 */

export const MOVIE_CATEGORY_SLUGS = [
  "hanh-dong",
  "phieu-luu",
  "hoat-hinh",
  "phim-hai",
  "hinh-su",
  "tai-lieu",
  "chinh-kich",
  "gia-dinh",
  "gia-tuong",
  "lich-su",
  "kinh-di",
  "phim-nhac",
  "bi-an",
  "lang-man",
  "khoa-hoc-vien-tuong",
  "gay-can",
  "chien-tranh",
  "tam-ly",
  "tinh-cam",
  "co-trang",
  "mien-tay",
  "phim-18",
] as const;

/**
 * Type for movie category slug
 */
export type MovieCategorySlug = (typeof MOVIE_CATEGORY_SLUGS)[number];

/**
 * Movie category labels (Vietnamese)
 */
export const MOVIE_CATEGORY_LABELS: Record<string, string> = {
  "hanh-dong": "Hành Động",
  "phieu-luu": "Phiêu Lưu",
  "hoat-hinh": "Hoạt Hình",
  "phim-hai": "Hài",
  "hai-huoc": "Hài Hước",
  "hinh-su": "Hình Sự",
  "tai-lieu": "Tài Liệu",
  "chinh-kich": "Chính Kịch",
  "gia-dinh": "Gia Đình",
  "gia-tuong": "Giả Tưởng",
  "lich-su": "Lịch Sử",
  "kinh-di": "Kinh Dị",
  "phim-nhac": "Nhạc",
  "am-nhac": "Âm Nhạc",
  "bi-an": "Bí Ẩn",
  "lang-man": "Lãng Mạn",
  "khoa-hoc-vien-tuong": "Khoa Học Viễn Tưởng",
  "khoa-hoc": "Khoa Học",
  "vien-tuong": "Viễn Tưởng",
  "gay-can": "Gây Cấn",
  "chien-tranh": "Chiến Tranh",
  "tam-ly": "Tâm Lý",
  "tinh-cam": "Tình Cảm",
  "co-trang": "Cổ Trang",
  "mien-tay": "Miền Tây",
  "phim-18": "Phim 18+",
};

/**
 * Check if a slug is a valid movie category
 */
export function isValidMovieCategorySlug(
  slug: string,
): slug is MovieCategorySlug {
  return MOVIE_CATEGORY_SLUGS.includes(slug as MovieCategorySlug);
}

/**
 * Popular country slugs - subset for navigation menu
 */
export const POPULAR_COUNTRY_SLUGS = [
  "au-my",
  "han-quoc",
  "trung-quoc",
  "nhat-ban",
  "thai-lan",
  "viet-nam",
  "hong-kong",
  "anh",
] as const;

export type PopularCountrySlug = (typeof POPULAR_COUNTRY_SLUGS)[number];

/**
 * All country slugs from phim.nguonc.com API
 */
export const COUNTRY_SLUGS = [
  "au-my",
  "anh",
  "trung-quoc",
  "indonesia",
  "viet-nam",
  "phap",
  "hong-kong",
  "han-quoc",
  "nhat-ban",
  "thai-lan",
  "dai-loan",
  "nga",
  "ha-lan",
  "philippines",
  "an-do",
  "quoc-gia-khac",
] as const;

export type CountrySlug = (typeof COUNTRY_SLUGS)[number];

/**
 * Country labels (Vietnamese)
 */
export const COUNTRY_LABELS: Record<string, string> = {
  "au-my": "Âu Mỹ",
  "anh": "Anh",
  "trung-quoc": "Trung Quốc",
  "indonesia": "Indonesia",
  "viet-nam": "Việt Nam",
  "phap": "Pháp",
  "hong-kong": "Hồng Kông",
  "han-quoc": "Hàn Quốc",
  "nhat-ban": "Nhật Bản",
  "thai-lan": "Thái Lan",
  "dai-loan": "Đài Loan",
  "nga": "Nga",
  "ha-lan": "Hà Lan",
  "philippines": "Philippines",
  "an-do": "Ấn Độ",
  "quoc-gia-khac": "Quốc gia khác",
};

export const LISTING_SORT_OPTIONS = [
  { value: "year-desc", label: "Năm mới nhất" },
  { value: "latest", label: "Mới cập nhật" },
  { value: "year-asc", label: "Năm cũ nhất" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

export type ListingSortValue = (typeof LISTING_SORT_OPTIONS)[number]["value"];

export const DEFAULT_LISTING_SORT: ListingSortValue = "year-desc";

export const LIST_MOVIES_TYPE = [
  {
    value: "phim-moi",
    label: "Phim Mới",
  },
  {
    value: "phim-le",
    label: "Phim Lẻ",
  },
  {
    value: "phim-bo",
    label: "Phim Bộ",
  },
  {
    value: "tv-shows",
    label: "TV Shows",
  },
  {
    value: "dang-chieu",
    label: "Đang Chiếu",
  },
  {
    value: "hoat-hinh",
    label: "Hoạt Hình",
  },
] as const;

export type ListMoviesTypeValue = (typeof LIST_MOVIES_TYPE)[number];

export function isValidListingSortValue(
  value: string,
): value is ListingSortValue {
  return LISTING_SORT_OPTIONS.some((option) => option.value === value);
}
