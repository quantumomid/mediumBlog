import React from "react";
import { Post } from "../../typings";
import PostCard from "./PostCard";

interface PostsProps {
    posts: Post[]  
}

const Posts:React.FC<PostsProps> = ({ posts }) => {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 p-2 lg:p-6">
          { posts.map(post => <PostCard key={post._id} post={post} />) }
        </div>
    )
}

export default Posts;