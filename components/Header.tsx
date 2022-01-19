import Link from "next/link";

const Header = () => {
    return (
        <header>
            <div className="flex items-center space-x-5">
                <Link href="/">
                    <img className="w-44 object-contain cursor-pointer" src="/images/mediumlogo.png" alt="Logo for Medium" />
                </Link>
                <nav className="hidden md:inline-flex">
                    <ul className="inline-flex items-center space-x-5">
                        <li>About</li>
                        <li>Contact</li>
                        <li className="text-white bg-green-600 px-4 py-1 rounded-full">Follow</li>
                    </ul>
                </nav>
            </div>
        </header>
    )
}

export default Header;