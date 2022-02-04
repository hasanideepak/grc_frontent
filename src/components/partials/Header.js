import { useState, useEffect } from "react"
import { NavLink, useLocation, useNavigate, useOutletContext } from "react-router-dom"
import { GetCookie, SetCookie } from "../../helpers/Helper"
import ApiService from "../../services/ApiServices"


const Header = (props) => {
    const { user = {} } = useOutletContext()
    const AccountId = user?.currentUser?.account_id || 0;
    const AccountName = user?.currentUser?.account_name
    const { defHeaderTitle = '' } = props
    const [headerTitle, setHeaderTitle] = useState('')
    const [projects, setProjects] = useState([])
    const [selectedProject, setSelectedProject] = useState({})
    const navigate = useNavigate();
    const location = useLocation()
    useEffect(() => {
        setPageHeader()
        if (projects.length == 0) {
            getProjects()
        }
    }, [])
    const goToUrl = (url = '') => {
        if (url == '') {
            return false
        }
        navigate(url)
    }
    const setPageHeader = () => {
        switch (true) {
            case location.pathname == "/home":
                setHeaderTitle("Home")
                break;
            case location.pathname == "/dashboard":
                setHeaderTitle("Dashboard")
                break;
            case location.pathname == "/task-manager":
                setHeaderTitle("Task Manager")
                break;
            case location.pathname.indexOf("/task-details") != -1:
                setHeaderTitle(defHeaderTitle || "")
                break;
            case location.pathname == "/evidence-manager":
                setHeaderTitle("Evidence Manager")
                break;
            case location.pathname == "/onboarding":
                setHeaderTitle("On Boarding")
                break;
            case location.pathname == "/configuration":
                setHeaderTitle("Configuration")
                break;
            case location.pathname.indexOf("/onboarding_scope") != -1:
                setHeaderTitle("On Boarding Scope")
                break;
            case location.pathname.indexOf("/onboarding_scope") != -1:
                setHeaderTitle("Configuration Scope")
                break;
            default:
                break;
        }
    }
    console.log(user)
    const getProjects = async () => {
        let payloadUrl = `configuration/getProjectsByAccountId/${AccountId}`
        let method = "GET";
        let formData = {}
        let res = await ApiService.fetchData(payloadUrl, method, formData);
        if (res && res.message == "Success") {
            // console.log(res)
            let projects = res.results
            setProjects(res.results)
            projects && projects.length > 0 && projects.map((project) => {
                if (project.status == "A") {
                    if(!GetCookie('selectedProject')){
                        let setcookie = SetCookie('selectedProject', JSON.stringify(project))
                        setSelectedProject(project)
                    }else{
                        let project = GetCookie('selectedProject') ? JSON.parse(GetCookie('selectedProject')) : null;
                        if(project){
                            setSelectedProject(project)
                        } 
                    }
                    
                }
            })

        }
    }

    const changeProject = (project = null) => {
        if (project == null) {
            return false
        }

        let setcookie = SetCookie('selectedProject', JSON.stringify(project))
        console.log(project)
        setSelectedProject(project)
        window.location.reload()
    }

    const showProjectDropDown = () => {
        let result = false
        let showDrpArr = ['/dashboard', "/task-manager", "/configuration"]
        if (showDrpArr.indexOf(location.pathname) != -1) {
            result = true
        }
        return result
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
                                <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
                                {/* <a onClick={() => goToUrl('/dashboard')} className="nav-link">Dashboard</a> */}
                            </li>
                            <li className="nav-item ">
                                <NavLink to="/task-manager" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Task Manager</NavLink>
                                {/* <a onClick={() => goToUrl('/task-manager')} className="nav-link">Task Manager</a> */}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/evidence-manager" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Evidence Manager</NavLink>
                                {/* <a onClick={() => goToUrl('/evidence-manager')} className="nav-link">Evidence Manager</a> */}
                            </li>
                            <li className="nav-item">
                                <NavLink to="/control-manager" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Control Manager</NavLink>
                                {/* <a onClick={() => goToUrl('')} className="nav-link">Control Manager</a> */}
                            </li>
                            <li className="nav-item ">
                                <NavLink to="/configuration" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Configuration</NavLink>
                                {/* <a onClick={() => goToUrl('/configuration')} className="nav-link ">Configuration</a> */}
                            </li>
                            {/* <li className="nav-item ">
                                <a onClick={() => goToUrl('/onboarding')} className="nav-link ">Onboarding</a>
                            </li> */}
                        </ul>
                    </div>
                </nav>
                <div className="userProfile pr-2 ml-sm-auto">
                    {(() => {
                        if (showProjectDropDown()) {
                            return (
                                <div className="btn-group">
                                    <div className="dropdown">
                                        <button type="button" className="btn btn-primary dropdown-toggle sdrp" data-toggle="dropdown">
                                            {selectedProject && selectedProject?.project_id ? selectedProject?.project_name : 'Select Project'}
                                        </button>
                                        <div className="dropdown-menu mt-1">
                                            {projects && projects.length > 0 && projects.map((project) => {
                                                return (
                                                    <a className="dropdown-item" onClick={() => changeProject(project)}>{project.project_name}</a>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    })()}

                    <div className="mdw bg-transparent p-0 shadow-none">
                        <div className="dropdown">
                            <a className="dropdown-toggle profileSet" data-toggle="dropdown">
                                <img src="/assets/img/userProfile.png" alt="profile" className="img-fluid" />
                            </a>
                            <div className="dropdown-menu">
                                <a className="dropdown-item" onClick={() => { }}>Company Profile</a>
                                <a className="dropdown-item" onClick={() => navigate(`/change-password`)}>Change Password</a>
                            </div>
                        </div>
                    </div>
                    <div className="mdw"><a href="#"><img src="/assets/img/gbl.svg" alt="notification" className="img-fluid" /></a></div>
                </div>
            </div>
            <div className="align-items-center d-flex justify-content-between aDm_navigation pl-lg-3 border-0 mb-3">
                <div className="userProfile">
                    {headerTitle ? <h6 className="mr-0 pt-3">{headerTitle}</h6> : ''}
                </div>
                <div>
                    <ul className="breadcrumb mb-0 bg-transparent invisible d-none">
                        <li className="breadcrumb-item"><a href="#">Configuration</a></li>
                        <li className="breadcrumb-item"><a href="#">Home</a></li>

                    </ul>
                </div>
            </div>
        </header>
    )
}

export default Header