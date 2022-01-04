import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { setCookie, getCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
const TaskManager = (props) => {
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if(!data.email || data.email == '' || !data.password || data.password == '' ){
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type,payload,TaskManager);
    if(res && res.status == true){
        setCookie('currentUser',JSON.stringify(res.data))
        navigate('/home')
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <div className="container-fluid">
        <div className="row flex-nowrap">
          <div className="sideWidth">
              <aside className="sidebar">
                <div className="tooglebar">
                          <a href="#"><img src="/assets/img/toggle.svg" alt="" /></a>
                </div>
                <div className="flex-grow-1">
                  <div className="logoDash">
                              <a href="index.html"><img src="/assets/img/Vlogo.svg" /></a>
                  </div>
                  <div className="sidebarNav">
                    <ul className="navbar-nav">
                      <li className="navHeader">MAIN MENU</li>
                      <li><a href="#"><img src="/assets/img/home.svg" alt="" className="img-fluid" /><span>Wiki</span></a></li>
                    <li><a href="#"><img src="/assets/img/campaign.svg" alt="" className="img-fluid" /><span>About us</span></a></li>

                      <li className="navHeader">SETTINGS</li>
                      <li><a href="#"><img src="/assets/img/profile.svg" alt="" className="img-fluid" /><span>My Account</span></a></li>
                    <li><a href="#"><img src="/assets/img/logout.svg" alt="" className="img-fluid" /><span>Logout</span></a></li>
                    </ul>
                  </div>
                </div>
                  
                        
                          <div className="chatbot"><a href="#"><img src="/assets/img/wChat.svg" alt="" className="img-fluid mr-2" /> <span className="hideText" style={{"display": "inline"}}>Chat</span> <span className="badge badge-dark">4</span></a></div>
              </aside>
          </div>
          <div className="mainContent">
            <header>
                <div className="align-items-center d-flex justify-content-between aDm_navigation">
                  <nav className="navbar navbar-expand-md bg-light navbar-light pl-0 p-0">
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                      <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="collapsibleNavbar">
                      <ul className="navbar nav pl-lg-0 pl-0">
                        <li className="nav-item">
                          <a href="" className="nav-link">Dashboard</a>
                        </li>
                        <li className="nav-item ">
                          <a href="task_manager.html" className="nav-link">Task Manager</a>
                        </li>
                        <li className="nav-item">
                          <a href="" className="nav-link">Evidence Manager</a>
                        </li>
                        <li className="nav-item">
                          <a href="" className="nav-link">Control Manager</a>
                        </li>
                        <li className="nav-item">
                          <a href="configuration.html" className="nav-link ">Configuration</a>
                        </li>
                      </ul>
                    </div>
                  </nav>
                  <div className="userProfile">
                    <div className="mdw bg-transparent p-0 shadow-none"><img src="/assets/img/userProfile.png" alt="profile" className="img-fluid" /></div>
                    <div className="mdw"><a href="#"><img src="/assets/img/notification.svg" alt="" className="img-fluid" /></a></div>
                  </div>
                </div>
                <div className="align-items-center d-flex justify-content-between aDm_navigation pl-lg-3 border-0">
                  <div className="userProfile">
                    <h6 className="mr-0">On Boarding</h6>
                  </div>
                  <div>
                    <ul className="breadcrumb mb-0 bg-transparent invisible">
                      <li className="breadcrumb-item"><a href="#">Configuration</a></li>
                      <li className="breadcrumb-item"><a href="#">Home</a></li>
                    </ul>
                  </div>
                </div>
            </header>
            <div id="accordion" className="accordion pl-lg-3 pr-lg-3 accordianSec">
                <div className="card">
                  <div className="card-header collapsed" data-toggle="collapse" href="#cp1">
                    <a className="card-title">Framework Setup</a>
                  </div>
                  <div id="cp1" className="card-body collapse " data-parent="#accordion">
                      <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                          aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                          craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                      </p>
                  </div>
                </div>
                <div className="card ">
                  <div className="card-header bg-pink" data-toggle="collapse" data-parent="#accordion" href="#cp2">
                    <a className="card-title">Key Member </a>
                    <div className="ml-auto">
                      <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
                      <a href="#" className="btn btn-primary btn-sm">Save</a>
                    </div>
                  </div>
                  <div id="cp2" className="card-body p-0 collapse show bg-pink" data-parent="#accordion">
                    <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
                      <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                        <div className="mr-2 add_member">ADD MEMBER</div>
                      <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Add Email Address" /></div>
                        <div className="w-25 mr-2">
                          <select name="" id="" className="form-control">
                            <option value="">Select Role</option>
                          </select>
                        </div>
                        <div><a href="" className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
                      </div>
                    </div>
                    <div className="search_result bg-white ">
                      <div className=" px-3">
                        <div className="flex-grow-1 ml-lg-3 ml-md-0 ">martin_guptill598@icloud.com</div>
                        <div>CISO </div>
                        <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                      </div>
                      <div className="px-3">
                        <div className="flex-grow-1 ml-lg-3">pete_davidson_vagas@gmail.com</div>
                        <div>Security Manager </div>
                        <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                      </div>
                      <div className=" px-3">
                        <div className="flex-grow-1 ml-lg-3">sohan.parker@yahoo.com</div>
                        <div>Security Analyst </div>
                        <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp3">
                      <a className="card-title">Invite Service Partner</a>
                  </div>
                  <div id="cp3" className="collapse" data-parent="#accordion">
                      <div className="card-body"> 
                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </p>
                      </div>
                  </div>
                </div>
                <div className="card">
                    <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp4">
                      <a className="card-title">Invite Task</a>
                  </div>
                  <div id="cp4" className="collapse" data-parent="#accordion">
                      <div className="card-body"> 
                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </p>
                      </div>
                  </div>
                </div>
                <div className="card">
                    <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp5">
                      <a className="card-title">Third Party Services</a>
                    </div>
                    <div id="cp5" className="collapse" data-parent="#accordion">
                        <div className="card-body"> 
                          <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                              aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                              craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                          </p>
                        </div>
                    </div>
                </div>
                <div className="card">
                  <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp6">
                    <a className="card-title">Access Token</a>
                  </div>
                  <div id="cp6" className="collapse" data-parent="#accordion">
                      <div className="card-body"> 
                        <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
                            aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
                            craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
                        </p>
                      </div>
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <div className="I_header I_footer container-fluid">
        <div className="copy">
          <p className="mb-0">© 2021 AirPlatform - All Rights Reserved</p>
        </div>
        <div className="logo d-none d-lg-block d-xl-block d-md-block">
          <img src="/assets/img/logo.svg" alt="logo" className="img-fluid" />
        </div>
      </div> 
    </> 
  )
}

export default TaskManager