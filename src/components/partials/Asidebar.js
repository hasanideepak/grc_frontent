

const Asidebar = (props) => {
    return (
        <>
            <div class="sideWidth">
                <aside class="sidebar">
                    <div class="tooglebar">
                        <a href="#">
                            <img src="/assets/img/toggle.svg" alt="" />
                        </a>
                    </div>
                    <div class="flex-grow-1">
                        <div class="logoDash">
                            <a href="index.html">
                                <img src="/assets/img/Vlogo.svg" />
                            </a>
                        </div>
                        <div class="sidebarNav">
                            <ul class="navbar-nav">
                                <li class="navHeader">MAIN MENU</li>
                                <li><a href="#"><img src="assets/img/home.svg" alt="" class="img-fluid" /><span>Wiki</span></a></li>
                                <li><a href="#"><img src="assets/img/campaign.svg" alt="" class="img-fluid" /><span>About us</span></a></li>
                                <li class="navHeader"><a href="#"><span>SETTINGS</span></a> </li>
                                <li><a href="#"><img src="assets/img/profile.svg" alt="" class="img-fluid" /><span>My Profile</span></a></li>
                                <li><a href="#"><img src="assets/img/newAccount.svg" alt="" class="img-fluid" /><span>New Account / Project</span></a></li>
                                <li><a href="#"><img src="assets/img/logout.svg" alt="" class="img-fluid" /><span>Logout</span></a></li>
                            </ul>
                        </div>
                    </div>


                    <div class="chatbot">
                        <a href="#">
                            <img src="assets/img/wChat.svg" alt="" class="img-fluid mr-2" />
                            <span class="hideText">Chat</span> 
                            <span class="badge badge-dark">4</span>
                        </a>
                    </div>
                </aside>
            </div>
        </>
    )
}

export default Asidebar