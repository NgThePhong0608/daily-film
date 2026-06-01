import { MetadataRoute } from 'next'
import { getLatestMovies } from '@/lib/ophim'
import { MOVIE_CATEGORY_SLUGS, COUNTRY_SLUGS } from '@/lib/constants'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL

  // Fetch recent movies for sitemap
  const { items: latestMovies } = await getLatestMovies(1)

  // Static routes
  const routes = [
    '',
    '/kham-pha',
    '/tim-kiem',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 1,
  }))

  // Category routes
  const categoryRoutes = MOVIE_CATEGORY_SLUGS.map((slug) => ({
    url: `${baseUrl}/the-loai/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Country routes
  const countryRoutes = COUNTRY_SLUGS.map((slug) => ({
    url: `${baseUrl}/quoc-gia/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  // Movie routes (from latest page)
  const movieRoutes = latestMovies.map((movie) => ({
    url: `${baseUrl}/phim/${movie.slug}`,
    lastModified: new Date(), // Ideally real modified date from API if available
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }))

  return [
    ...routes,
    ...categoryRoutes,
    ...countryRoutes,
    ...movieRoutes,
  ]
}
