import { GetStaticProps } from "next";
import React, { useState } from "react";
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import Comments from "../../components/Comments";
import Article from "../../components/Article";
import CustomHead from "../../components/CustomHead";
import AddCommentForm from "../../components/add-comment-form/AddCommentForm";
import Image from "next/image";

export const getStaticPaths = async () => {
    const query = `
        *[_type=="post"]{
            _id,
            slug {
                current
            },
        }
    `;
    const posts = await sanityClient.fetch(query);
    const paths = posts.map((post: Post) => ({ params: { slug: post.slug.current } }));
    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const postSlug = params?.slug;
    const query = `
        *[_type=="post" && slug.current == $slug][0]{
            _id,
            _createdAt,
            title, 
            author -> {
                name, 
                image
            },
            "comments": *[
                _type == "comment" && post._ref == ^._id && approved == true
            ],
            description,
            mainImage,
            slug,
            body
        }
    `;

    const post = await sanityClient.fetch(query, {
        slug: postSlug
    });

    if(!post) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            post
        },
        revalidate: 60, //update old cache after 60s
    }
}

interface PostProps {
    post: Post;
}

export interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

const Post: React.FC<PostProps> = ({ post }) => {
    const [ hasCommentSubmitted, setHasCommentSubmitted ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data),
        }).then(() => {
            console.log({data});
            setHasCommentSubmitted(true);
        }).catch((error) => {
            console.log({error});
            setHasCommentSubmitted(false);
        })
    };

    return (
        <main>
            <CustomHead title={post.title} descriptionMetaContent={post.description} />
            <div className="inline-grid w-full h-40 overflow-hidden">
                <Image 
                    src={urlFor(post.mainImage).url()!} 
                    alt={post.title}
                    height={40}
                    width={100}
                    layout="responsive"
                    objectFit="cover"
                />
            </div>
            <Article post={post} />
            <hr className="max-w-lg my-5 mx-auto border-yellow-500" />

            {
                hasCommentSubmitted ? (
                    <div className="flex flex-col p-10 m-10 bg-yellow-500 text-white max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold">Thank you for submitting the comment</h3>
                        <p>The comment will appear below following approval.</p>
                    </div>
                    )
                    :
                    <AddCommentForm post={post} onSubmit={onSubmit} handleSubmit={handleSubmit} errors={errors} register={register} />
            }
            <Comments comments={post.comments} />
        </main>
    );
}

export default Post;