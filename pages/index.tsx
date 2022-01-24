import React from "react";
import Posts from "../components/posts/Posts";
import { sanityClient } from "../sanity";
import { Post } from "../typings";
import Image from "next/image";

export const getServerSideProps = async () => {
  const query = `
    *[_type=="post"]{
      _id,
      title,
      slug,
      description,
      mainImage,
      author -> {
      name, 
      image
    }
  }
  `;

  const posts = await sanityClient.fetch(query);

  return {
    props: {
      posts
    }
  }
}

interface HomeProps {
  posts: Post[]
}

const Home:React.FC<HomeProps> = ({ posts }) => {
  console.log({posts});
  return (
    <main className="max-w-7xl mx-auto">
        <section className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
          <div className="px-5 sm:px-10 space-y-5">
            <h1 className="max-w-xl font-serif text-4xl sm:text-6xl">
              <span className="underline decoration-black decoration-4">Medium</span> is a place to write, read and connect
            </h1>
            <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
          </div>
          <div className="hidden self-start md:block h-32 w-4/12 lg:h-full">
            <Image 
              src="/images/MediumLetterLogo.png" 
              alt="Medium logo with a capital bold letter M" 
              height={100}
              width={100}
              layout="responsive"
            />
          </div>
        </section>
        <Posts posts={posts} />
    </main>
  )
}
export default Home;