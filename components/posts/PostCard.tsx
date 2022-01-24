import React from "react";
import { Post } from "../../typings";
import Link from 'next/link';
import { urlFor } from "../../sanity";
import Image from "next/image";

interface PostCardProps {
    post: Post;
}

const PostCard:React.FC<PostCardProps> = ({ post }) => (
    <Link href={`/post/${post.slug.current}`}>
        <article className="group cursor-pointer border rounded-lg overflow-hidden">
            <div className="h-40 sm:h-60 w-full overflow-hidden object-cover group-hover:scale-105 transition-transform duration-200 ease-in-out">
                <Image 
                    src={urlFor(post.mainImage).url()!} 
                    alt={post.title}
                    width={100}
                    height={60}
                    layout="responsive"
                    objectFit="cover"
                />
            </div>
            <section className="flex justify-between p-5 bg-white">
                <div>
                    <h1 className="text-lg font-bold">{post.title}</h1>
                    <p className="text-xs">{post.description} by {post.author.name}</p>
                </div>
                <div className="grid h-12 w-12 rounded-full overflow-hidden mx-1">
                    <Image 
                        src={urlFor(post.author.image).url()!} 
                        alt={post.author.name}
                        width={48}
                        height={48}
                        layout="responsive"
                        objectFit="cover"
                    />
                </div>
            </ section>
        </article>
    </Link>
);

export default PostCard;