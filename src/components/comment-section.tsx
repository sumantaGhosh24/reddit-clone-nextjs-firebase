import {formatDistanceStrict} from "date-fns";

interface CommentSectionProps {
  comments: any[];
}

export default function CommentSection({comments}: CommentSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Comments</h2>
      <div className="space-y-6">
        {comments.map((comment) => (
          <div className="space-y-4" key={comment.id}>
            <div className="flex gap-4">
              <div className="flex-1 space-y-1">
                <div className="text-sm">
                  <span className="font-medium">user/{comment.username}</span>
                  {" · "}
                  <span className="text-muted-foreground">
                    {formatDistanceStrict(
                      comment.timestamp.toDate(),
                      new Date()
                    )}
                  </span>
                </div>
                <p className="text-sm">{comment.message}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
