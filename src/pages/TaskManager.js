import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useState } from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
const TaskManager = (props) => {
  const [viewType, setViewType] = useState({ board: true })
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
      SetCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

  const selectionRange = {
    'Today': [moment(), moment()],
    'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
    'Last 7 Days': [moment().subtract(6, 'days'), moment()],
    'Last 30 Days': [moment().subtract(29, 'days'), moment()],
    'This Month': [moment().startOf('month'), moment().endOf('month')],
    'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
 }

  const handleSelect = (ranges) =>{
    console.log(ranges);
    // {
    //   selection: {
    //     startDate: [native Date Object],
    //     endDate: [native Date Object],
    //   }
    // }
  }

  const changeView = (view = "") => {
    if (view == "") {
      return false
    }
    let obj = {}
    obj["board"] = false;
    obj["card"] = false;
    obj["timeline"] = false;
    obj["calender"] = false;
    obj[view] = true;
    setViewType(oldVal => {
      return { ...obj }
    })
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
              <div className="Position-relative">
                <DateRangePicker
                    initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014',ranges:selectionRange }}
                  >
                  <input id="drpicker" type="text" className="form-control border-0" name="date" placeholder="Select Date" />
                </DateRangePicker>
                
                
                <i className="fa fa-calendar"></i>
              </div>
              <div>
                <div className="userProfile">
                  <div className="dropdown fdrp">
                    <button type="button" className="btn btn-primary dropdown-toggle viewMenu" data-toggle="dropdown">
                      {(() => {
                        if (viewType["board"]) {
                          return "Board View"
                        } else if (viewType["card"]) {
                          return "Card View"
                        } else if (viewType["timeline"]) {
                          return "Timeline View"
                        } else if (viewType["calender"]) {
                          return "Calender View"
                        }
                      })()}
                    </button>
                    <div className="dropdown-menu mt-1" x-placement="bottom-start" style={{ "position": "absolute", "transform": "translate3d(0px, 32px, 0px)", "top": "0px", "left": "0px", "willChange": "transform" }}>
                      <a className={`dropdown-item ${viewType == "board" ? "d-none" : ""}`} onClick={() => changeView("board")}>Board View</a>
                      <a className={`dropdown-item ${viewType == "card" ? "d-none" : ""}`} onClick={() => changeView("card")}>Card View</a>
                      <a className={`dropdown-item ${viewType == "timeline" ? "d-none" : ""}`} onClick={() => changeView("timeline")}>Timeline View</a>
                      <a className={`dropdown-item ${viewType == "calender" ? "d-none" : ""}`} onClick={() => changeView("calender")}>Calender View</a>
                    </div>
                  </div>
                </div>


              </div>
              <div className="dotMenu"><img src="assets/img/gbl.gif" alt="" /></div>


            </div>
            {(() => {
              if (viewType["board"]) {
                return (
                  <>
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
                  </>
                )

              } else if (viewType["card"]) {
                return (
                  <>
                    <div className="align-items-center d-flex justify-content-between my-3">
                      <div>
                        <ul className="pagination mb-0 filterview">
                          <li className="page-item active"><a href="#" className="page-link">All Task</a></li>
                          <li className="page-item"><a href="#" className="page-link">To Do</a></li>
                          <li className="page-item"><a href="#" className="page-link">In Progress</a></li>
                          <li className="page-item"><a href="#" className="page-link">Under Review</a></li>
                          <li className="page-item"><a href="#" className="page-link">Complete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="gridcontainer card_container">
                      <div className="grid_item">
                        <div className="card">
                          <div className="card-body">
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">todo</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">in Progress</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Under Review</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Complete</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">todo</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">in Progress</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Under Review</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Complete</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">todo</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">in Progress</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Under Review</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Complete</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">todo</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">in Progress</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Under Review</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Complete</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">todo</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox inProgress_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">in Progress</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox underReview_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Under Review</a>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p><img src="assets/img/gbl.gif" alt="date" /><span>Created Dec 23, 2021</span> </p>

                              </div>
                              <div className="gridboxfooter">
                                <p>TP45</p>
                                <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                              </div>
                            </div>
                            <div className="gridBox complete_Filter">
                              <div className="gridboxbody">
                                <h4>Data Flow of the system</h4>
                                <a href="#">Complete</a>
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



                    </div>
                  </>
                )

              } else if (viewType["timeline"]) {
                return (
                  <>
                    <div className="align-items-center d-flex justify-content-between my-3">
                      <div>
                        <ul className="pagination mb-0 filterview">
                          <li className="page-item active"><a href="#" className="page-link">All Task</a></li>
                          <li className="page-item"><a href="#" className="page-link">To Do</a></li>
                          <li className="page-item"><a href="#" className="page-link">In Progress</a></li>
                          <li className="page-item"><a href="#" className="page-link">Under Review</a></li>
                          <li className="page-item"><a href="#" className="page-link">Complete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="gridcontainer timecontainer">
                      <div className="grid_item">
                        <div className="card">
                          <div className="align-items-center card-header d-flex justify-content-between py-2">
                            <h4><img src="assets/img/gbl.gif" alt="" className="mr-2 timeIcon" height="1" width="1" /> Today</h4>
                          </div>
                          <div className="card-body">
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">Complete</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid_item">
                        <div className="card">
                          <div className="align-items-center card-header d-flex justify-content-between py-2">
                            <h4><img src="assets/img/gbl.gif" alt="" className="mr-2 timeIcon" /> Dec 20, 2021</h4>
                          </div>
                          <div className="card-body">
                            <div className="gridBox todo_Filter">
                              <div className="gridboxbody">
                                <div>
                                  <p>TP45</p>
                                  <h4>Data Flow of the system</h4>
                                </div>
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
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
                                <p><img src="assets/img/gbl.gif" alt="folder" /> <span>Task Name</span></p>
                                <p> <a href="" className="statusClr">Complete</a></p>
                                <p> <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a> </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )
              } else if (viewType["calender"]) {
                return (
                  <>
                    <div className="align-items-center d-flex justify-content-between my-3">
                      <div>
                        <ul className="pagination mb-0 filterview">
                          <li className="page-item active"><a href="#" className="page-link">All Task</a></li>
                          <li className="page-item"><a href="#" className="page-link">To Do</a></li>
                          <li className="page-item"><a href="#" className="page-link">In Progress</a></li>
                          <li className="page-item"><a href="#" className="page-link">Under Review</a></li>
                          <li className="page-item"><a href="#" className="page-link">Complete</a></li>
                        </ul>
                      </div>
                      {/* <div id="calendarTools">dfsadf</div> */}
                    </div>
                    <div id="calendar">
                      <Calendar
                        date={new Date()}
                        onChange={handleSelect}
                        className="customDateLayout w-100 position-relative"
                      />
                    </div>
                  </>
                )
              }
            })()}

          </div>
        </div>
      </div>
    </>
  )
}

export default TaskManager