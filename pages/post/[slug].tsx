import { GetStaticProps } from "next";
import React, { useState } from "react";
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings";
import { useForm, SubmitHandler } from "react-hook-form";
import Comments from "../../components/Comments";
import Article from "../../components/Article";

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
    // console.log({posts});
    const paths = posts.map((post: Post) => ({ params: { slug: post.slug.current } }));
    // console.log({paths});
    return {
        paths,
        fallback: "blocking"
    }
}

export const getStaticProps: GetStaticProps = async ({params}) => {
    const postSlug = params?.slug;
    // console.log({postSlug});
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

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

const Post: React.FC<PostProps> = ({ post }) => {
    console.log({post});
    const [ hasCommentSubmitted, setHasCommentSubmitted ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        // console.log({data});
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
            <img 
                className="w-full h-40 object-cover" 
                src={urlFor(post.mainImage).url()!} 
                alt={post.title}
            />
            <Article post={post} />
            <hr className="max-w-lg my-5 mx-auto border-yellow-500" />

            {
                hasCommentSubmitted ? (
                    <div className="flex flex-col p-10 m-10 bg-yellow-500 text-white max-w-2xl mx-auto">
                        <h3 className="text-3xl font-bold">Thank you for submitting the comment</h3>
                        <p>The comment will appear below following approval.</p>
                    </div>
                    )
                    : (
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col p-5 max-w-2xl mx-auto mb-10">
                        <h3 className="text-sm text-yellow-500">Enjoyed this article?</h3>
                        <h4 className="text-3xl font-bold">Leave a comment below!</h4>
                        <hr className="py-3 mt-2" />
        
                        {/* Hidden dummy input to register/connect to react hooks form */}
                        <input 
                            {...register("_id")}
                            type="hidden"
                            name="_id"
                            value={post._id}
                        />
        
                        <label className="block mb-5" htmlFor="name">
                            <span className="text-gray-700">Name</span>
                            <input 
                                id="name" 
                                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring"                         
                                placeholder="Omid Wakili" 
                                type="text" 
                                {...register("name", { required: true })}
                            />
                        </label>
                        <label className="block mb-5" htmlFor="email">
                            <span className="text-gray-700">Email</span>
                            <input 
                                id="email" 
                                className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring" 
                                placeholder="omid@hotmail.com" 
                                type="text" 
                                {...register("email", { required: true })}
                            />
                        </label>
                        <label className="block mb-5" htmlFor="comment">
                            <span className="text-gray-700">Comment</span>
                            <textarea 
                                id="comment" 
                                className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none focus:ring" 
                                placeholder="Great points!" 
                                rows={8} 
                                {...register("comment", { required: true })}
                            />
                        </label>
        
                        {/* Displaying Errors */}
                        <div className="flex flex-col p-5">
                            { errors.name && (
                                    <span className="text-red-500">- The Name field is required</span>
                                ) 
                            }
                            { errors.email && (
                                    <span className="text-red-500">- The Email field is required</span>
                                ) 
                            }
                            { errors.comment && (
                                    <span className="text-red-500">- The Comment field is required</span>
                                ) 
                            }
                        </div>
                        <input 
                            type="submit" 
                            className="shadow bg-yellow-500 hover:bg-yellow-400 cursor-pointer focus:shadow-outline focus-outline-none text-white font-bold py-2 px-4 rounded" 
                        />
                    </form>
                    )
            }
            <Comments comments={post.comments} />
        </main>
    );
}

export default Post;