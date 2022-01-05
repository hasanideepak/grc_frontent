import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { setCookie, getCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
const TaskManager = (props) => {
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type, payload, TaskManager);
    if (res && res.status == true) {
      setCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div className="mainSearchbar">
              <div className="flex-grow-1">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-transparent border-0 srchInput"><img src="assets/img/gbl.gif" alt="" /></span>
                  </div>
                  <input type="text" name="" placeholder="Search task name, project name, Task ID, username…" className="form-control border-0 pl-0" />
                </div>


              </div>
              <div>
                <input type="text" className="form-control border-0" name="date" placeholder="Select Date" />
                  <i className="fa fa-calendar"></i>
              </div>
              <div>

                <div className="userProfile">
                  <div className="dropdown fdrp">
                    <button type="button" className="btn btn-primary dropdown-toggle viewMenu" data-toggle="dropdown">
                      Board View
                    </button>
                    <div className="dropdown-menu mt-1">
                      <a className="dropdown-item" href="task_manager_cardview.html">Card View</a>
                      <a className="dropdown-item" href="task_manager_timeline.html">Timeline View</a>

                    </div>
                  </div>
                </div>


              </div>
              <div className="dotMenu"><img src="assets/img/gbl.gif" alt="" /></div>


            </div>
            <div className="gridcontainer">
              <div className="grid_item">
                <div className="card">
                  <div className="card-header">
                    <h4>To DO (7)</h4>
                  </div>
                  <div className="card-body">
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid_item">
                <div className="card">
                  <div className="card-header">
                    <h4>In Progress (3)</h4>
                  </div>
                  <div className="card-body">
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid_item">
                <div className="card">
                  <div className="card-header">
                    <h4>Under Review (1)</h4>
                  </div>
                  <div className="card-body">
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid_item">
                <div className="card">
                  <div className="card-header">
                    <h4>Completed (148)</h4>
                  </div>
                  <div className="card-body">
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox active">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                    <div className="gridBox">
                      <div className="gridboxbody">
                        <h4>Data Flow of the system</h4>
                        <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                        <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                      </div>
                      <div className="gridboxfooter">
                        <p>TP45</p>
                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskManager