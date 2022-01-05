import { Fragment } from "react";
import Asidebar from "../partials/Asidebar";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
// import "../../assets/css/style.css"

const Layout = (props) => {
    return (
        <Fragment>
            <>
                <div className="container-fluid">
                    <div className="row flex-nowrap">
                        {/* Aside bar */}
                        <Asidebar />
                        <div className="mainContent">
                            {/* <Header {...props} /> */}
                            <main>{props.children}</main>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </>
        </Fragment>
    )
}

export default Layout