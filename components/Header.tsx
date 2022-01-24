import Link from "next/link";
import Image from "next/image";

const Header = () => {
    return (
        <header className="max-w-7xl mx-auto p-1 sm:p-5">
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <div className="w-44 cursor-pointer">
                        <Image 
                            src="/images/mediumlogo.png" 
                            alt="Logo for Medium"
                            height={20}
                            width={44}
                            layout="responsive"
                            objectFit="contain"
                        />
                    </div>
                </Link>
                <nav className="w-full flex justify-end md:justify-between">
                    <ul className="hidden md:inline-flex items-center space-x-5">
                        <li>About</li>
                        <li>Contact</li>
                        <li className="text-white bg-green-600 px-4 py-1 rounded-full">Follow</li>
                    </ul>
                    <ul className="flex items-center space-x-5 text-green-600">
                        <li>
                            Sign In
                        </li>
                        <li className="border px-4 py-1 rounded-full border-green-600">
                            Get Started
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;