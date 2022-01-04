

const Asidebar = (props) => {
    return (
        <>
            <div className="sideWidth">
                <aside className="sidebar">
                    <div className="tooglebar">
                        <a href="#">
                            <img src="/assets/img/toggle.svg" alt="" />
                        </a>
                    </div>
                    <div className="flex-grow-1">
                        <div className="logoDash">
                            <a href="index.html">
                                <img src="/assets/img/Vlogo.svg" />
                            </a>
                        </div>
                        <div className="sidebarNav">
                            <ul className="navbar-nav">
                                <li className="navHeader">MAIN MENU</li>
                                <li><a href="#"><img src="assets/img/home.svg" alt="" className="img-fluid" /><span>Wiki</span></a></li>
                                <li><a href="#"><img src="assets/img/campaign.svg" alt="" className="img-fluid" /><span>About us</span></a></li>
                                <li className="navHeader"><a href="#"><span>SETTINGS</span></a> </li>
                                <li><a href="#"><img src="assets/img/profile.svg" alt="" className="img-fluid" /><span>My Profile</span></a></li>
                                <li><a href="#"><img src="assets/img/newAccount.svg" alt="" className="img-fluid" /><span>New Account / Project</span></a></li>
                                <li><a href="#"><img src="assets/img/logout.svg" alt="" className="img-fluid" /><span>Logout</span></a></li>
                            </ul>
                        </div>
                    </div>


                    <div className="chatbot">
                        <a href="#">
                            <img src="assets/img/wChat.svg" alt="" className="img-fluid mr-2" />
                            <span className="hideText">Chat</span> 
                            <span className="badge badge-dark">4</span>
                        </a>
                    </div>
                </aside>
            </div>
        </>
    )
}

export default Asidebar