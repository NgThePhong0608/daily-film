import { Suspense } from "react";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";
import { Loader2 } from "lucide-react";

interface CommentSectionProps {
  movieSlug: string;
}

export default function CommentSection({ movieSlug }: CommentSectionProps) {
  return (
    <div className="space-y-8 mt-12 bg-card/30 rounded-xl p-6 border shadow-sm">
      <div>
        <h2 className="text-2xl font-bold mb-6">Thảo luận</h2>
        <CommentForm movieSlug={movieSlug} />
      </div>

      <div className="pt-4 border-t">
        <Suspense fallback={
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        }>
          <CommentList movieSlug={movieSlug} />
        </Suspense>
      </div>
    </div>
  );
}
