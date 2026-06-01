import { getMovieRating } from "@/app/actions/ratings";
import InteractiveRating from "./InteractiveRating";

interface MovieRatingProps {
  movieSlug: string;
}

export default async function MovieRating({ movieSlug }: MovieRatingProps) {
  // Fetch aggregator stats
  const stats = await getMovieRating(movieSlug);

  return (
    <div className="bg-card/30 border rounded-lg p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm text-muted-foreground uppercase font-semibold tracking-wider">
            Đánh giá
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-yellow-500">
              {stats.average > 0 ? stats.average.toFixed(1) : "N/A"}
            </span>
            <span className="text-sm text-muted-foreground">
              / 5 ({stats.total} lượt)
            </span>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50">
        <UserRatingWrapper movieSlug={movieSlug} />
      </div>
    </div>
  );
}

// Separate client-fetching wrapper to read localStorage -> pass to client component
// Wait, we can't read localStorage in Server Component.
// Solution: The `StarRating` client component handles logic. 
// BUT we need the `initialUserRating`.
// We can't fetch `initialUserRating` for a user if we don't know the username on server.
// The user is anonymous (localStorage).
// So `StarRating` must fetch its own rating on mount using the username from localStorage.
// Or we render "empty" state and let client hydrate.

// Updated Approach:
// `StarRating` will fetch the user's specific rating inside a `useEffect` on the client side.
// The Server Component only passes the stats.

// Let's adjust `StarRating` logic in the next update if needed, but wait:
// The `StarRating` component I wrote takes `initialUserRating`. This won't work for anonymous users on initial render.
// I will create a focused `InteractiveRating` that fetches its own state.



function UserRatingWrapper({ movieSlug }: { movieSlug: string }) {
  return <InteractiveRating movieSlug={movieSlug} />;
}
