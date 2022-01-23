import React from "react";
import { Post } from "../../typings";
import Link from 'next/link';
import { urlFor } from "../../sanity";
import Image from "next/image";

interface PostCardProps {
    post: Post;
}

const PostCard:React.FC<PostCardProps> = ({ post }) => {
    return (
        <Link href={`/post/${post.slug.current}`}>
            <div className="group cursor-pointer border rounded-lg overflow-hidden">
            <div className="h-60 w-full overflow-hidden object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out">
                <Image 
                    src={urlFor(post.mainImage).url()!} 
                    alt={post.title}
                    width={100}
                    height={60}
                    layout="responsive"
                    objectFit="cover"
                />
            </div>
            <div className="flex justify-between p-5 bg-white">
                <div >
                    <p className="text-lg font-bold">{post.title}</p>
                    <p className="text-xs">{post.description} by {post.author.name}</p>
                    </div>
                <div className="grid h-12 w-12 rounded-full overflow-hidden">
                    <Image 
                        src={urlFor(post.author.image).url()!} 
                        alt={post.author.name}
                        width={48}
                        height={48}
                        layout="responsive"
                        objectFit="cover"
                    />
                </div>
            </div>
            </div>
        </Link>
    )
}

export default PostCard;