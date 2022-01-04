import { useNavigate } from "react-router-dom"


const Header = (props) => {
    const navigate = useNavigate
    const goToUrl = (url = '') =>{
        if(url == ''){
            return false
        }
        navigate(url)
    }
    return (
        <header>
            <div class="align-items-center d-flex justify-content-between aDm_navigation">
                <nav class="navbar navbar-expand-md bg-light navbar-light pl-0 p-0">
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul class="navbar nav pl-lg-0 pl-0">
                            <li class="nav-item active">
                                <a onClick={() => goToUrl('/dashboard')} class="nav-link">Dashboard</a>
                            </li>
                            <li class="nav-item ">
                                <a onClick={() => goToUrl('/task-manager')} class="nav-link">Task Manager</a>
                            </li>
                            <li class="nav-item">
                                <a onClick={() => goToUrl('/evidence-manager')} class="nav-link">Evidence Manager</a>
                            </li>
                            <li class="nav-item">
                                <a onClick={() => goToUrl('')} class="nav-link">Control Manager</a>
                            </li>
                            <li class="nav-item ">
                                <a onClick={() => goToUrl('/configuration')} class="nav-link ">Configuration</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="userProfile">
                    <div class="btn-group">
                        <div class="dropdown fdrp">
                            <button type="button" class="btn btn-primary dropdown-toggle " data-toggle="dropdown">
                                CISCO
                            </button>
                            <div class="dropdown-menu mt-1">
                                <a class="dropdown-item" href="#">Link 1</a>
                                <a class="dropdown-item" href="#">Link 2</a>
                                <a class="dropdown-item" href="#">Link 3</a>
                            </div>
                        </div>
                        <div class="dropdown">
                            <button type="button" class="btn btn-primary dropdown-toggle sdrp" data-toggle="dropdown">
                            HIPAA Secur...
                            </button>
                            <div class="dropdown-menu mt-1">
                            <a class="dropdown-item" href="#">Link 1</a>
                            <a class="dropdown-item" href="#">Link 2</a>
                            <a class="dropdown-item" href="#">Link 3</a>
                            </div>
                        </div>
                    </div>
                    <div class="mdw bg-transparent p-0 shadow-none">
                        <img src="assets/img/userProfile.png" alt="profile" class="img-fluid" />
                    </div>
                    <div class="mdw">
                        <a href="#"><img src="assets/img/notification.svg" alt="" class="img-fluid" /></a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header