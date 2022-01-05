import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { setCookie, getCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Asidebar from "../components/partials/Asidebar";
import Footer from "../components/partials/Footer";
const Dashboard = (props) => {
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type, payload, Dashboard);
    if (res && res.status == true) {
      setCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-12 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div className="align-items-center d-flex justify-content-between my-3">
              <div>
                <ul className="pagination mb-0 filterview">
                  <li className="page-item active"><a onClick={()=> navigate("/onboarding")} className="page-link">Today</a></li>
                  <li className="page-item"><a href="#" className="page-link">Tommorow</a></li>
                  <li className="page-item"><a href="#" className="page-link p_px">
                    <input type="text" className="form-control border-0 bg-transparent" name="date" placeholder="Select Date" />
                      <i className="fa fa-calendar"></i>
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-9 col-md-12">
            <div className="row  mb-lg-3 mb-md-3 mb-sm-0">
              <div className="col-lg-4 mb-md-3 pl-md-0 mb-3 pl-lg-3">
                <div className="card card_shadow">
                  <div className="card-body p-0">
                    <figure className="highcharts-figure">
                    </figure>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-md-3 pl-md-0 mb-3 ">
                <div className="card card_shadow">
                  <div className="card-body p-0">
                    <figure className="highcharts-figure">
                    </figure>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 mb-md-3 pl-md-0 mb-3">
                <div className="card card_shadow">
                  <div className="card-body p-0">
                    <figure className="highcharts-figure"></figure>
                  </div></div>
              </div>
            </div>
            <div className="row  mb-lg-3 mb-md-3 mb-sm-0 mb-3">
              <div className="col-lg-12 pl-md-0 pl-lg-3">
                <div className="card card_shadow border-0">
                  <div className="card-body p-0">
                    <div className="gridcontainer timecontainer dashboard m-0 p-0">
                      <div className="grid_item">
                        <div className="card card_shadow bg-transparent">
                          <div className="card-header">
                            <h4>Pending Task</h4>
                          </div>
                          <div className="card-body">
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">to do</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">In Progress</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">Under Review</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>

                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">Complete</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-3 mb-3">
            <div className="row">
              <div className="col-lg-12 mb-md-3 pl-md-0">
                <div className="card card_shadow">
                  <div className="card-body p-0">
                    <figure className="highcharts-figure"></figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4 mb-md-3 pl-md-0 mb-3 pl-lg-3">
            <div className="card card_shadow">
              <div className="card-body p-0">
                <div className="row">
                  <div className="col-lg-6 pr-0">
                    <figure className="highcharts-figure"></figure>
                  </div>
                  <div className="col-lg-6 pl-0 mb-md-3">
                    <figure className="highcharts-figure"> </figure>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div className="col-lg-8 pl-md-0 pl-lg-3">
            <div className="row">
              <div className="col-lg-12">
                <div className="card card_shadow">
                  <div className="card-body p-0">
                    <figure className="highcharts-figure"></figure>
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

export default Dashboard