import { GetStaticProps } from "next";
import React from "react";
import Header from "../../components/Header"
import { sanityClient, urlFor } from "../../sanity"
import { Post } from "../../typings";
import PortableText from "react-portable-text";
import { useForm, SubmitHandler } from "react-hook-form";

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
    const { register, handleSubmit, formState: { errors } } = useForm<IFormInput>();
    const onSubmit: SubmitHandler<IFormInput> = async (data) => {
        // console.log({data});
        fetch("/api/createComment", {
            method: "POST",
            body: JSON.stringify(data),
        }).then(() => {
            console.log({data});
        }).catch((error) => {
            console.log({error});
        })
        
    };

    return (
        <main>
            <Header />
            <img 
                className="w-full h-40 object-cover" 
                src={urlFor(post.mainImage).url()!} 
                alt={post.title}
            />
            <article className="max-w-3xl mx-auto p-5">
                <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
                <h2 className="text-xl font-light text-gray-600 mb-2">{post.description}</h2>
                <div className="flex items-center space-x-2">
                    <img 
                        className="h-10 w-10 rounded-full"
                        src={urlFor(post.author.image).url()!} 
                        alt={post.author.name} 
                    />
                    <p className="font-extralight text-gray-700 mb-2">
                        Blog post by <span className="text-green-700 font-bold">{post.author.name}</span> - Published at {new Date(post._createdAt).toLocaleString("uk")}
                    </p>
                </div>
                <div className="mt-10">
                    <PortableText
                        dataset={process.env.NEXT_PUBLIC_SANITY_DATASET!}
                        projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!}
                        content={post.body}
                        serializers={
                            {
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
                            }
                        }
                    />
                </div>
            </article>
            <hr className="max-w-lg my-5 mx-auto border-yellow-500" />
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
        </main>
    );
}

export default Post;