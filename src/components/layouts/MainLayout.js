import { Fragment } from "react";
import Footer from "../partials/Footer";
import Header from "../partials/Header";
import "../../assets/css/style.css"

const Layout = (props) => {
    let location = window.location.pathname
    let noLayoutPath = ['/login','/signup']
    return (
        <Fragment>
            {(()=>{
                if(!noLayoutPath.includes(location)){
                    return (
                        <>
                            <Header></Header>
                                <main>{props.children}</main>
                            <Footer></Footer>
                        </>
                    )       
                }else{
                    return <main>{props.children}</main>
                }
            })()}
        </Fragment>
    )
}

export default Layout