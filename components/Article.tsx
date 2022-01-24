import Image from "next/image";
import React from "react";
import PortableText from "react-portable-text";
import { urlFor } from "../sanity";
import { Post } from "../typings";

interface ArticleProps {
    post: Post;
}

const Article:React.FC<ArticleProps> = ({ post }) => {

    const PortableTextProps = {
        className: "",
        dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
        projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
        content: post.body,
        serializers: {
            
                h1: (props: any) => (
                    <h1 className="text-2xl font-bold my-5" {...props} />
                ),
                h2: (props: any) => (
                    <h2 className="text-xl font-bold my-5" {...props} />
                ),
                li: ({children}: any) => (
                    <li className="ml-4 list-disc">{children}</li>
                ),
                link: ({ href, children }: any) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                        {children}
                    </a>
                )
            
        },
    }

    return (
        <article className="max-w-3xl mx-auto p-5">
            <h1 className="text-3xl mb-3 mt-1 sm:mt-10">{post.title}</h1>
            <h2 className="text-xl font-light text-gray-600 mb-2">{post.description}</h2>
            <div className="flex items-center space-x-2">
                <div className="grid h-10 w-10 rounded-full overflow-hidden">
                    <Image 
                        src={urlFor(post.author.image).url()!} 
                        alt={post.author.name}
                        height={10}
                        width={10}
                        layout="responsive" 
                        objectFit="cover"
                    />
                </div>
                <p className="font-extralight text-gray-700 mb-0 sm:mb-2">
                    Blog post by <span className="text-green-700 font-bold">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString("uk")}
                </p>
            </div>
            <div className="mt-5 sm:mt-10">
                <PortableText
                    {...PortableTextProps}
                />
            </div>
        </article>
    )
}

export default Article;