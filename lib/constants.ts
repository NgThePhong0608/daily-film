/**
 * Movie category slugs used for filtering and navigation
 */

export const MOVIE_CATEGORY_SLUGS = [
  "hanh-dong",
  "tinh-cam",
  "hai-huoc",
  "co-trang",
  "tam-ly",
  "hinh-su",
  "chien-tranh",
  "the-thao",
  "vo-thuat",
  "vien-tuong",
  "kinh-di",
  "tai-lieu",
  "bi-an",
  "hoc-duong",
  "gia-dinh",
  "am-nhac",
] as const;

/**
 * Type for movie category slug
 */
export type MovieCategorySlug = (typeof MOVIE_CATEGORY_SLUGS)[number];

/**
 * Movie category labels (Vietnamese)
 */
export const MOVIE_CATEGORY_LABELS: Record<MovieCategorySlug, string> = {
  "hanh-dong": "Hành Động",
  "tinh-cam": "Tình Cảm",
  "hai-huoc": "Hài Hước",
  "co-trang": "Cổ Trang",
  "tam-ly": "Tâm Lý",
  "hinh-su": "Hình Sự",
  "chien-tranh": "Chiến Tranh",
  "the-thao": "Thể Thao",
  "vo-thuat": "Võ Thuật",
  "vien-tuong": "Viễn Tưởng",
  "kinh-di": "Kinh Dị",
  "tai-lieu": "Tài Liệu",
  "bi-an": "Bí Ẩn",
  "hoc-duong": "Học Đường",
  "gia-dinh": "Gia Đình",
  "am-nhac": "Âm Nhạc",
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
  "han-quoc",
  "trung-quoc",
  "nhat-ban",
  "thai-lan",
  "au-my",
  "viet-nam",
] as const;

export type PopularCountrySlug = (typeof POPULAR_COUNTRY_SLUGS)[number];

/**
 * All country slugs from API
 */
export const COUNTRY_SLUGS = [
  "trung-quoc",
  "han-quoc",
  "nhat-ban",
  "thai-lan",
  "au-my",
  "dai-loan",
  "hong-kong",
  "an-do",
  "anh",
  "phap",
  "canada",
  "duc",
  "tay-ban-nha",
  "tho-nhi-ky",
  "indonesia",
  "nga",
  "uc",
  "malaysia",
  "philippines",
  "viet-nam",
  "singapore",
  "quoc-gia-khac",
] as const;

export type CountrySlug = (typeof COUNTRY_SLUGS)[number];

/**
 * Country labels (Vietnamese)
 */
export const COUNTRY_LABELS: Record<CountrySlug, string> = {
  "trung-quoc": "Trung Quốc",
  "han-quoc": "Hàn Quốc",
  "nhat-ban": "Nhật Bản",
  "thai-lan": "Thái Lan",
  "au-my": "Âu Mỹ",
  "dai-loan": "Đài Loan",
  "hong-kong": "Hồng Kông",
  "an-do": "Ấn Độ",
  anh: "Anh",
  phap: "Pháp",
  canada: "Canada",
  duc: "Đức",
  "tay-ban-nha": "Tây Ban Nha",
  "tho-nhi-ky": "Thổ Nhĩ Kỳ",
  indonesia: "Indonesia",
  nga: "Nga",
  uc: "Úc",
  malaysia: "Malaysia",
  philippines: "Philippines",
  "viet-nam": "Việt Nam",
  singapore: "Singapore",
  "quoc-gia-khac": "Quốc Gia Khác",
};

export const LISTING_SORT_OPTIONS = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "year-desc", label: "Năm mới nhất" },
  { value: "year-asc", label: "Năm cũ nhất" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

export type ListingSortValue = (typeof LISTING_SORT_OPTIONS)[number]["value"];

export function isValidListingSortValue(
  value: string,
): value is ListingSortValue {
  return LISTING_SORT_OPTIONS.some((option) => option.value === value);
}
