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
  "phieu-luu",
  "khoa-hoc",
  "kinh-di",
  "am-nhac",
  "than-thoai",
  "tai-lieu",
  "gia-dinh",
  "chinh-kich",
  "bi-an",
  "hoc-duong",
  "kinh-dien",
  "phim-18",
  "short-drama",
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
  "phieu-luu": "Phiêu Lưu",
  "khoa-hoc": "Khoa Học",
  "kinh-di": "Kinh Dị",
  "am-nhac": "Âm Nhạc",
  "than-thoai": "Thần Thoại",
  "tai-lieu": "Tài Liệu",
  "gia-dinh": "Gia Đình",
  "chinh-kich": "Chính kịch",
  "bi-an": "Bí ẩn",
  "hoc-duong": "Học Đường",
  "kinh-dien": "Kinh Điển",
  "phim-18": "Phim 18+",
  "short-drama": "Short Drama",
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
  "quoc-gia-khac",
  "duc",
  "tay-ban-nha",
  "tho-nhi-ky",
  "ha-lan",
  "indonesia",
  "nga",
  "mexico",
  "ba-lan",
  "uc",
  "thuy-dien",
  "malaysia",
  "brazil",
  "philippines",
  "bo-dao-nha",
  "y",
  "dan-mach",
  "uae",
  "na-uy",
  "thuy-si",
  "chau-phi",
  "nam-phi",
  "ukraina",
  "a-rap-xe-ut",
  "bi",
  "ireland",
  "colombia",
  "phan-lan",
  "viet-nam",
  "chile",
  "hy-lap",
  "nigeria",
  "argentina",
  "singapore",
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
  "quoc-gia-khac": "Quốc Gia Khác",
  duc: "Đức",
  "tay-ban-nha": "Tây Ban Nha",
  "tho-nhi-ky": "Thổ Nhĩ Kỳ",
  "ha-lan": "Hà Lan",
  indonesia: "Indonesia",
  nga: "Nga",
  mexico: "Mexico",
  "ba-lan": "Ba lan",
  uc: "Úc",
  "thuy-dien": "Thụy Điển",
  malaysia: "Malaysia",
  brazil: "Brazil",
  philippines: "Philippines",
  "bo-dao-nha": "Bồ Đào Nha",
  y: "Ý",
  "dan-mach": "Đan Mạch",
  uae: "UAE",
  "na-uy": "Na Uy",
  "thuy-si": "Thụy Sĩ",
  "chau-phi": "Châu Phi",
  "nam-phi": "Nam Phi",
  ukraina: "Ukraina",
  "a-rap-xe-ut": "Ả Rập Xê Út",
  bi: "Bỉ",
  ireland: "Ireland",
  colombia: "Colombia",
  "phan-lan": "Phần Lan",
  "viet-nam": "Việt Nam",
  chile: "Chile",
  "hy-lap": "Hy Lạp",
  nigeria: "Nigeria",
  argentina: "Argentina",
  singapore: "Singapore",
};

export const LISTING_SORT_OPTIONS = [
  { value: "latest", label: "Mới cập nhật" },
  { value: "year-desc", label: "Năm mới nhất" },
  { value: "year-asc", label: "Năm cũ nhất" },
  { value: "az", label: "A-Z" },
  { value: "za", label: "Z-A" },
] as const;

export type ListingSortValue = (typeof LISTING_SORT_OPTIONS)[number]["value"];

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
    value: "phim-chieu-rap",
    label: "Phim Chiếu Rạp",
  },
  {
    value: "tv-shows",
    label: "Shows",
  },
  {
    value: "hoat-hinh",
    label: "Hoạt Hình",
  },
  {
    value: "phim-vietsub",
    label: "Phim Vietsub",
  },
  {
    value: "phim-thuyet-minh",
    label: "Phim Thuyết Minh",
  },
  {
    value: "phim-long-tien",
    label: "Phim Lồng Tiếng",
  },
  {
    value: "phim-bo-dang-chieu",
    label: "Phim Bộ Đang Chiếu",
  },
  {
    value: "phim-bo-hoan-thanh",
    label: "Phim Bộ Hoàn Thành",
  },
  {
    value: "phim-sap-chieu",
    label: "Phim Sắp Chiếu",
  }
] as const;

export type ListMoviesTypeValue = (typeof LIST_MOVIES_TYPE)[number];

export function isValidListingSortValue(
  value: string,
): value is ListingSortValue {
  return LISTING_SORT_OPTIONS.some((option) => option.value === value);
}
