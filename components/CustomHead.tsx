import Head from "next/head";
import React from "react";

interface CustomHeadProps {
    title?: string;
    descriptionMetaContent?: string;
}

const CustomHead:React.FC<CustomHeadProps> = ({ title, descriptionMetaContent, children }) => (
    <Head>
        <title>{ title }</title>
        <meta name="description" content={descriptionMetaContent} />
        {/* <link rel="icon" href="/favicon.ico" /> */}
        { children }
    </Head>
)

CustomHead.defaultProps = {
    title: "Medium 2.0 | Clone",
    descriptionMetaContent: "A clone of the popular blog site Medium."
}

export default CustomHead;