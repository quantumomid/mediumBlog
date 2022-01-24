import React from "react";
import { Comment } from "../typings";

interface CommentsProps {
    comments: Comment[]
}

const Comments:React.FC<CommentsProps> = ({ comments }) => (
    <aside className="flex flex-col p-4 sm:p-10 my-10 max-w-2xl mx-auto shadow-yellow-500 shadow space-y-2">
        <h3 className="text-4xl">Comments</h3>
        <hr className="pb-2" />
        {
            comments.map((comment) => (
                <article key={comment._id}>
                    <p>
                        <span className="text-yellow-500">{comment.name}</span>: {comment.comment}
                    </p>
                </article>
            ))
        }
    </aside>
);

export default Comments;