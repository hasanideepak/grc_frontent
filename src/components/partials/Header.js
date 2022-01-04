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
            <div className="align-items-center d-flex justify-content-between aDm_navigation">
                <nav className="navbar navbar-expand-md bg-light navbar-light pl-0 p-0">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                        <ul className="navbar nav pl-lg-0 pl-0">
                            <li className="nav-item active">
                                <a onClick={() => goToUrl('/dashboard')} className="nav-link">Dashboard</a>
                            </li>
                            <li className="nav-item ">
                                <a onClick={() => goToUrl('/task-manager')} className="nav-link">Task Manager</a>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => goToUrl('/evidence-manager')} className="nav-link">Evidence Manager</a>
                            </li>
                            <li className="nav-item">
                                <a onClick={() => goToUrl('')} className="nav-link">Control Manager</a>
                            </li>
                            <li className="nav-item ">
                                <a onClick={() => goToUrl('/configuration')} className="nav-link ">Configuration</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="userProfile">
                    <div className="btn-group">
                        <div className="dropdown fdrp">
                            <button type="button" className="btn btn-primary dropdown-toggle " data-toggle="dropdown">
                                CISCO
                            </button>
                            <div className="dropdown-menu mt-1">
                                <a className="dropdown-item" href="#">Link 1</a>
                                <a className="dropdown-item" href="#">Link 2</a>
                                <a className="dropdown-item" href="#">Link 3</a>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button type="button" className="btn btn-primary dropdown-toggle sdrp" data-toggle="dropdown">
                            HIPAA Secur...
                            </button>
                            <div className="dropdown-menu mt-1">
                            <a className="dropdown-item" href="#">Link 1</a>
                            <a className="dropdown-item" href="#">Link 2</a>
                            <a className="dropdown-item" href="#">Link 3</a>
                            </div>
                        </div>
                    </div>
                    <div className="mdw bg-transparent p-0 shadow-none">
                        <img src="assets/img/userProfile.png" alt="profile" className="img-fluid" />
                    </div>
                    <div className="mdw">
                        <a href="#"><img src="assets/img/notification.svg" alt="" className="img-fluid" /></a>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header