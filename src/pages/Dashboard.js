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
      <div class="container-fluid">
        <div class="row">
          <div class="col-lg-12 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div class="align-items-center d-flex justify-content-between my-3">
              <div>
                <ul class="pagination mb-0 filterview">
                  <li class="page-item active"><a href="#" class="page-link">Today</a></li>
                  <li class="page-item"><a href="#" class="page-link">Tommorow</a></li>
                  <li class="page-item"><a href="#" class="page-link p_px">
                    <input type="text" class="form-control border-0 bg-transparent" name="date" placeholder="Select Date" />
                      <i class="fa fa-calendar"></i>
                  </a></li>
                </ul>
              </div>
            </div>
          </div>
          <div class="col-lg-9 col-md-12">
            <div class="row  mb-lg-3 mb-md-3 mb-sm-0">
              <div class="col-lg-4 mb-md-3 pl-md-0 mb-3 pl-lg-3">
                <div class="card card_shadow">
                  <div class="card-body p-0">
                    <figure class="highcharts-figure">
                    </figure>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 mb-md-3 pl-md-0 mb-3 ">
                <div class="card card_shadow">
                  <div class="card-body p-0">
                    <figure class="highcharts-figure">
                    </figure>
                  </div>
                </div>
              </div>
              <div class="col-lg-4 mb-md-3 pl-md-0 mb-3">
                <div class="card card_shadow">
                  <div class="card-body p-0">
                    <figure class="highcharts-figure"></figure>
                  </div></div>
              </div>
            </div>
            <div class="row  mb-lg-3 mb-md-3 mb-sm-0 mb-3">
              <div class="col-lg-12 pl-md-0 pl-lg-3">
                <div class="card card_shadow border-0">
                  <div class="card-body p-0">
                    <div class="gridcontainer timecontainer dashboard m-0 p-0">
                      <div class="grid_item">
                        <div class="card card_shadow bg-transparent">
                          <div class="card-header">
                            <h4>Pending Task</h4>
                          </div>
                          <div class="card-body">
                            <div class="gridBox todo_Filter">
                              <div class="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" class="statusClr">to do</a></p>
                                <p> <a href="#" class="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                            <div class="gridBox inProgress_Filter">
                              <div class="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" class="statusClr">In Progress</a></p>
                                <p> <a href="#" class="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                            <div class="gridBox underReview_Filter">
                              <div class="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" class="statusClr">Under Review</a></p>
                                <p> <a href="#" class="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>

                            </div>
                            <div class="gridBox complete_Filter">
                              <div class="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/folder.svg" alt="" /> <span>Task Name</span></p>
                                <p> <a href="" class="statusClr">Complete</a></p>
                                <p> <a href="#" class="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
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
          <div class="col-lg-3 mb-3">
            <div class="row">
              <div class="col-lg-12 mb-md-3 pl-md-0">
                <div class="card card_shadow">
                  <div class="card-body p-0">
                    <figure class="highcharts-figure"></figure>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-4 mb-md-3 pl-md-0 mb-3 pl-lg-3">
            <div class="card card_shadow">
              <div class="card-body p-0">
                <div class="row">
                  <div class="col-lg-6 pr-0">
                    <figure class="highcharts-figure"></figure>
                  </div>
                  <div class="col-lg-6 pl-0 mb-md-3">
                    <figure class="highcharts-figure"> </figure>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="col-lg-8 pl-md-0 pl-lg-3">
            <div class="row">
              <div class="col-lg-12">
                <div class="card card_shadow">
                  <div class="card-body p-0">
                    <figure class="highcharts-figure"></figure>
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