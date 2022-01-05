

const Asidebar = (props) => {
    return (
        <>
            <div className="sideWidth">
                <aside className="sidebar">
                    <div className="tooglebar">
                        <a href="#">
                            <img src="assets/img/gbl.gif" alt="" className="tglIcon" height="0" width="0" />
                        </a>
                    </div>
                    <div className="flex-grow-1">
                        <div className="logoDash">
                            <a href="index.html"><img src="assets/img/Vlogo.svg" /></a>
                        </div>
                        <div className="sidebarNav">
                            <ul className="navbar-nav">
                                <li className="navHeader">MAIN MENU</li>
                                <li><a href="#"><img src="assets/img/gbl.gif" alt="wiki" className="img-fluid" /><span>Wiki</span></a></li>
                                <li><a href="#"><img src="assets/img/gbl.gif" alt="about" className="img-fluid" /><span>About us</span></a></li>
                                <li className="navHeader">SETTINGS</li>
                                <li><a href="#"><img src="assets/img/gbl.gif" alt="myProfile" className="img-fluid" /><span>My Profile</span></a></li>
                                <li><a href="#"><img src="assets/img/gbl.gif" alt="newAccount" className="img-fluid" /><span>New Account / Project</span></a></li>
                                <li><a href="#"><img src="assets/img/gbl.gif" alt="logout" className="img-fluid" /><span>Logout</span></a></li>
                            </ul>
                        </div>
                    </div>


                    <div className="chatbot"><a href="#"><img src="assets/img/gbl.gif" alt="" className="img-fluid mr-2" /> <span className="hideText">Chat</span> <span className="badge badge-dark">4</span></a></div>
                </aside>
            </div>
        </>
    )
}

export default Asidebar