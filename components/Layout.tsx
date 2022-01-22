import { Fragment } from "react";
import Header from "./Header";

const Layout:React.FC = ({ children }) => {
    return (
        <Fragment>
            <Header />
            {children}
        </Fragment>
    )
}

export default Layout;