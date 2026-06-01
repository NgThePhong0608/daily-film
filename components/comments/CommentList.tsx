import { getMovieComments } from "@/app/actions/comments";
import CommentItem from "./CommentItem";

interface CommentListProps {
  movieSlug: string;
}

export default async function CommentList({ movieSlug }: CommentListProps) {
  const comments = await getMovieComments(movieSlug);

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold">Bình luận ({comments.length})</h3>

      {comments.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">
          Chưa có bình luận nào. Hãy là người đầu tiên!
        </div>
      ) : (
        <div className="space-y-0">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
}
