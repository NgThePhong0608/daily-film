import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Daily Film',
    short_name: 'DailyFilm',
    description: 'Xem phim online chất lượng cao miễn phí',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b', // zinc-950 (dark theme bg)
    theme_color: '#09090b',
    icons: [
      {
        src: '/icon.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      // Check if we have specific Apple touch icon or just reuse
      {
        src: '/icon.png',
        sizes: '180x180',
        type: 'image/png',
      }
    ],
  }
}
