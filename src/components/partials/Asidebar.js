import { Navigate, useNavigate } from "react-router-dom";
import { IsAuthenticated } from "../../helpers/Auth"
import { DelCookie } from "../../helpers/Helper";


const Asidebar = (props) => {
    let navigate = useNavigate()
    let logOut = () => {
        let loggedInUser = IsAuthenticated(true);
        if(loggedInUser.isLoggedIn){
           let del =  DelCookie('currentUser')
           if(del){
            navigate("login")
           }
        }
    }
    return (
        <>
            <div className="sideWidth">
                <aside className="sidebar">
                    <div className="tooglebar">
                        <a href="#">
                            <img src="/assets/img/gbl.svg" alt="" className="tglIcon" height="0" width="0" />
                        </a>
                    </div>
                    <div className="flex-grow-1">
                        <div className="logoDash">
                            <a href="index.html"><img src="/assets/img/Vlogo.svg" /></a>
                        </div>
                        <div className="sidebarNav">
                            <ul className="navbar-nav">
                                <li className="navHeader">MAIN MENU</li>
                                <li><a href="#"><img src="/assets/img/gbl.svg" alt="wiki" className="img-fluid" /><span>Wiki</span></a></li>
                                <li><a href="#"><img src="/assets/img/gbl.svg" alt="about" className="img-fluid" /><span>About us</span></a></li>
                                <li className="navHeader">SETTINGS</li>
                                {/* <li><a href="#"><img src="/assets/img/gbl.svg" alt="myProfile" className="img-fluid" /><span>My Profile</span></a></li> */}
                                <li><a href="#"><img src="/assets/img/gbl.svg" alt="newAccount" className="img-fluid" /><span>New Project</span></a></li>
                                <li><a onClick={() => logOut()}><img src="/assets/img/gbl.svg" alt="logout" className="img-fluid" /><span>Logout</span></a></li>
                            </ul>
                        </div>
                    </div>


                    <div className="chatbot"><a href="#"><img src="/assets/img/gbl.svg" alt="" className="img-fluid mr-2" /> <span className="hideText">Chat</span> <span className="badge badge-dark">4</span></a></div>
                </aside>
            </div>
        </>
    )
}

export default Asidebar