import { Comment } from "@/app/actions/comments";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { User } from "lucide-react";

interface CommentItemProps {
  comment: Comment;
}

export default function CommentItem({ comment }: CommentItemProps) {
  return (
    <div className="flex gap-3 py-4 border-b border-border/50 last:border-0">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{comment.username}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(comment.createdAt, {
              addSuffix: true,
              locale: vi,
            })}
          </span>
        </div>
        <p className="text-sm text-foreground/90 break-words whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
}
