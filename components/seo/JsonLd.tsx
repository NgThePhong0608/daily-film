import { MovieDetail } from "@/types/movie";
import { resolveOphimImageUrl } from "@/lib/ophim";

interface JsonLdProps {
  movie: MovieDetail;
}

export default function JsonLd({ movie }: JsonLdProps) {
  const posterUrl = resolveOphimImageUrl(movie.poster_url);

  const schema = {
    "@context": "https://schema.org",
    "@type": movie.type === 'series' || movie.type === 'tvshows' || movie.type === 'hoathinh' ? "TVSeries" : "Movie",
    "name": movie.name,
    "alternateName": movie.origin_name,
    "description": movie.content.replace(/<[^>]*>?/gm, '').slice(0, 300) + '...', // Strip HTML tags
    "image": posterUrl,
    "datePublished": movie.year.toString(),
    "actor": movie.actor?.map(actor => ({
      "@type": "Person",
      "name": actor
    })) || [],
    "director": movie.director?.map(director => ({
      "@type": "Person",
      "name": director
    })) || [],
    "genre": movie.category?.map(c => c.name) || [],
    "countryOfOrigin": movie.country?.map(c => ({
      "@type": "Country",
      "name": c.name
    })) || [],
    "inLanguage": movie.lang,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
