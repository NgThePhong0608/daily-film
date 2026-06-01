export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Country {
  id: string;
  name: string;
  slug: string;
}

export interface ServerData {
  name: string;
  slug: string;
  filename: string;
  link_embed: string;
  link_m3u8: string;
}

export interface Episode {
  server_name: string;
  server_data: ServerData[];
}

export interface Movie {
  _id: string;
  name: string;
  slug: string;
  origin_name: string;
  thumb_url: string;
  poster_url: string;
  year: number;
}

export interface MovieDetail extends Movie {
  content: string;
  type: 'series' | 'single' | 'hoathinh' | 'tvshows';
  status: string;
  time: string;
  episode_current: string;
  episode_total: string;
  quality: string;
  lang: string;
  actor: string[];
  director: string[];
  category: Category[];
  country: Country[];
  episodes: Episode[];
  is_copyright?: boolean;
  sub_docquyen?: boolean;
  chieurap?: boolean;
  trailer_url?: string;
  view?: number;
}

export interface Pagination {
  totalItems: number;
  totalItemsPerPage: number;
  currentPage: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  status: boolean;
  items?: T[];
  data?: {
    items: T[];
    params: {
        pagination: {
            totalItems: number;
            totalItemsPerPage: number;
            currentPage: number;
            pageRanges: number;
        };
    };
    breadCrumb?: {
        name: string;
        slug: string;
        isCurrent: boolean;
        position: number;
    }[];
    titlePage?: string;
    seoOnPage?: {
        og_type: string;
        titleHead: string;
        descriptionHead: string;
        og_image: string[];
        og_url: string;
    };
  };
  movie?: T;
  pagination?: Pagination;
}
