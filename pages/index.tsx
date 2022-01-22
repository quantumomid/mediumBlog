import Head from 'next/head'
import React from 'react';
import Posts from '../components/Posts';
import { sanityClient } from "../sanity";
import { Post } from '../typings';

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
      <Head>
        <title>Medium 2.0</title>
        {/* <link rel="icon" href="/favicon.ico" /> */}
      </Head>

        <section className="flex justify-between items-center bg-yellow-400 border-y border-black py-10 lg:py-0">
          <div className="px-10 space-y-5">
            <h1 className="text-6xl max-w-xl font-serif">
              <span className="underline decoration-black decoration-4">Medium</span> is a place to write, read and connect
            </h1>
            <h2>It's easy and free to post your thinking on any topic and connect with millions of readers.</h2>
          </div>
          <img className="hidden md:inline-flex h-32 lg:h-full" src="/images/mediumLetterLogo.png" alt="Medium logo with a capital bold letter M" />
        </section>
        {/* Posts */}
        <Posts posts={posts} />
    </main>
  )
}
export default Home;