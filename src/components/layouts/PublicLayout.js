import { Fragment } from "react";
// import "../../assets/css/style.css"

const PublicLayout = (props) => {
    return (
        <Fragment>
            <main>{props.children}</main>
        </Fragment>
    )
}

export default PublicLayout