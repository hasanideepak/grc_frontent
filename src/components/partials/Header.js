import {useState, useEffect} from "react"
import { useLocation, useNavigate } from "react-router-dom"


const Header = (props) => {
    const [headerTitle, setHeaderTitle] = useState('')
    const navigate = useNavigate();
    const location = useLocation()
    useEffect(() => {
        setPageHeader()
    },[])
    const goToUrl = (url = '') => {
        if (url == '') {
            return false
        }
        navigate(url)
    }
    const setPageHeader = () =>{
        switch (location.pathname) {
            case "/home":
                setHeaderTitle("Home")
            break;
            case "/dashboard":
                setHeaderTitle("Dashboard")
            break;
            case "/task-manager":
                setHeaderTitle("Task Manager")
            break;
            case "/evidence-manager":
                setHeaderTitle("Evidence Manager")
            break;
            case "/onboarding":
                setHeaderTitle("Onboarding")
            break;
            case "/configuration":
                setHeaderTitle("Configuration")
            break;
            case "/onboarding":
                setHeaderTitle("Onboarding")
            break;
            default:
            break;
        }
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
                            <li className="nav-item">
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
                            {/* <li className="nav-item ">
                                <a onClick={() => goToUrl('/onboarding')} className="nav-link ">Onboarding</a>
                            </li> */}
                        </ul>
                    </div>
                </nav>
                <div className="userProfile pr-2">
                    <div className="mdw bg-transparent p-0 shadow-none"><img src="/assets/img/userProfile.png" alt="profile" className="img-fluid" /></div>
                    <div className="mdw"><a href="#"><img src="/assets/img/gbl.svg" alt="notification" className="img-fluid" /></a></div>
                </div>
            </div>
            <div className="align-items-center d-flex justify-content-between aDm_navigation pl-lg-3 border-0">
                <div className="userProfile">
                    <h6 className="mr-0">{headerTitle}</h6>
                </div>
                <div>
                    <ul className="breadcrumb mb-0 bg-transparent invisible">
                        <li className="breadcrumb-item"><a href="#">Configuration</a></li>
                        <li className="breadcrumb-item"><a href="#">Home</a></li>

                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header