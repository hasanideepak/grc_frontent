import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
const TaskManager = (props) => {
  const orgId = props?.user?.currentUser?.org_id || 0;
  const [projectId, setProjectId] = useState(0)
  const accessRole = props?.user?.currentUser?.access_role || '';
  const [viewType, setViewType] = useState({ board: true })
  const [cardView, setCardViewe] = useState('all')
  const [tasks, setTasks] = useState([]);
  const [tasksByDates, setTasksByDates] = useState([]);
  const [pendingTasks, setPendingTasks] = useState([]);
  const [inProgresstasks, setInProgressTasks] = useState([]);
  const [underReviewtasks, setUnderReviewTasks] = useState([]);
  const [completedtasks, setCompletedTasks] = useState([]);
  const [timelineDates, settimelineDates] = useState([]);
  const [dates, setDates] = useState({});
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if(projectId == 0){
      getProjectInfo()
    }
    if(Object.keys(dates).length == 0){
      // initDates()
    }
    // if (tasks.length == 0) {
    //   fetchInfo("all_tasks")
    // }
  }, []);



  const getProjectInfo = async () => {
    

    let payloadUrl = `configuration/getConfiguration/${orgId}`
    let method = "GET";
    let formData = {};

    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
        let obj = {
          accounts_and_projects: res.accounts_and_projects,
          frameWorks: res.frameworks,
          keymembers: res.keymembers,
          service_partners: res.service_partners,
          task_owners: res.task_owners,
          third_party_connectors: res.third_party_connectors,
        }
        setProjectId(res.accounts_and_projects[0].project_id)
        console.log(res.accounts_and_projects[0].project_id)
        fetchInfo("all_tasks",res.accounts_and_projects[0].project_id)
    }
  }


  const fetchInfo = async (type = '',project_id = 0) => {
    if (type == '') {
      return false
    };

    let payloadUrl = ""
    let method = "POST";
    let formData = {};
    let now = new Date()
    let numDays = new Date(now.getFullYear(),now.getMonth()+1,0).getDate()
    let startDate = new Date(now.getFullYear(),now.getMonth()+1,1)
    startDate  = `${startDate.getFullYear()}-${('00'+startDate.getMonth()).slice(-2)}-${('00'+startDate.getDate()).slice(-2)}`
    let endDate = new Date(now.getFullYear(),now.getMonth()+1,numDays)
    endDate  = `${endDate.getFullYear()}-${('00'+endDate.getMonth()).slice(-2)}-${('00'+endDate.getDate()).slice(-2)}`
    if (type == 'all_tasks') {
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/tasks/listTasks
      payloadUrl = `tasks/listTasks`
      method = "POST";
      formData = { project_id: projectId || project_id, authority: accessRole, start_date:startDate, end_date:endDate, task_status: "all" }
    } else {
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/tasks/listTasks
      payloadUrl = `tasks/listTasks/`
      method = "POST";
      formData = { project_id: projectId || project_id, authority: accessRole, start_date:startDate, end_date:endDate, task_status: type }
    }

    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // if (type == 'all_tasks') {
      let allTasks = res.results;
      setTasks(oldVal => {
        return { ...allTasks }
      })
      let tmpPendingArr = [],
        tmpInProgressArr = [],
        tmpUnderReviewArr = [],
        tmpCompletedArr = [],
        tmpTimelineDates = [],
        tmpTasksByDates = [];

      allTasks && allTasks.map(task => {
        if (task.task_status == "pending") {
          tmpPendingArr.push(task)
        } else if (task.task_status == "in_progress") {
          tmpInProgressArr.push(task)
        } else if (task.task_status == "review") {
          tmpUnderReviewArr.push(task)
        } else if (task.task_status == "completed") {
          tmpCompletedArr.push(task)
        }
        if (!tmpTimelineDates.includes(task.created_at)) {
          tmpTimelineDates.push(task.created_at)
        }

        if (!Object.keys(tmpTasksByDates).includes(task.created_at)) {
          tmpTasksByDates[task.created_at] = []
        }
        tmpTasksByDates[task.created_at].push(task)
      })
      setPendingTasks(tmpPendingArr)
      setInProgressTasks(tmpInProgressArr)
      setUnderReviewTasks(tmpUnderReviewArr)
      setCompletedTasks(tmpCompletedArr)
      settimelineDates(tmpTimelineDates)
      setTasksByDates(tmpTasksByDates)
    }
    // }
  }

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

  const handleSelect = (ranges) => {
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
  const changeCardView = (view = "") => {
    if (view == "") {
      return false
    }
    if (view == "all") {
      fetchInfo('all_tasks')
    } else if (view == 'pending') {
      fetchInfo('pending')
    } else if (view == 'inProgress') {
      fetchInfo('in_progress')
    } else if (view == 'review') {
      fetchInfo('review')
    } else if (view == 'completed') {
      fetchInfo('completed')
    }
    setCardViewe(view)
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
                  initialSettings={{ startDate: '1/1/2014', endDate: '3/1/2014', ranges: selectionRange }}
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
                    <div className="dropdown-menu mt-1">
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
                            <h4>To DO ({pendingTasks && pendingTasks.length > 0 ? pendingTasks.length : 0})</h4>
                          </div>
                          <div className="card-body">
                            {pendingTasks && pendingTasks.length > 0 && pendingTasks.map((p_task, pIndex) => {
                              return (
                                <div key={pIndex} className="gridBox link_url" onClick={()=>navigate(`/task-details/${p_task.project_task_id}`)}>
                                  <div className="gridboxbody">
                                    <h4>{p_task.description}</h4>
                                    <p><img src="assets/img/gbl.gif" alt="folder" /> <span>{p_task.title}</span></p>
                                    <p><img src="assets/img/gbl.gif" alt="date" /><span>Created {p_task.created_at}</span> </p>

                                  </div>
                                  <div className="gridboxfooter">
                                    <p>{p_task.project_task_id}</p>
                                    <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="grid_item">
                        <div className="card">
                          <div className="card-header">
                            <h4>In Progress ({inProgresstasks && inProgresstasks.length > 0 ? inProgresstasks.length : 0})</h4>
                          </div>
                          <div className="card-body">
                            {inProgresstasks && inProgresstasks.length > 0 && inProgresstasks.map((ip_task, pIndex) => {
                              return (
                                <div key={pIndex} className="gridBox link_url" onClick={()=>navigate(`/task-details/${ip_task.project_task_id}`)}>
                                  <div className="gridboxbody">
                                    <h4>{ip_task.description}</h4>
                                    <p><img src="assets/img/gbl.gif" alt="folder" /> <span>{ip_task.title}</span></p>
                                    <p><img src="assets/img/gbl.gif" alt="date" /><span>Created {ip_task.created_at}</span> </p>

                                  </div>
                                  <div className="gridboxfooter">
                                    <p>{ip_task.project_task_id}</p>
                                    <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="grid_item">
                        <div className="card">
                          <div className="card-header">
                            <h4>Under Review ({underReviewtasks && underReviewtasks.length > 0 ? underReviewtasks.length : 0})</h4>
                          </div>
                          <div className="card-body">
                            {underReviewtasks && underReviewtasks.length > 0 && underReviewtasks.map((ur_task, pIndex) => {
                              return (
                                <div key={pIndex} className="gridBox link_url" onClick={()=>navigate(`/task-details/${ur_task.project_task_id}`)}>
                                  <div className="gridboxbody">
                                    <h4>{ur_task.description}</h4>
                                    <p><img src="assets/img/gbl.gif" alt="folder" /> <span>{ur_task.title}</span></p>
                                    <p><img src="assets/img/gbl.gif" alt="date" /><span>Created {ur_task.created_at}</span> </p>

                                  </div>
                                  <div className="gridboxfooter">
                                    <p>{ur_task.project_task_id}</p>
                                    <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="grid_item">
                        <div className="card">
                          <div className="card-header">
                            <h4>Completed ({completedtasks && completedtasks.length > 0 ? completedtasks.length : 0})</h4>
                          </div>
                          <div className="card-body">
                            {completedtasks && completedtasks.length > 0 && completedtasks.map((c_task, pIndex) => {
                              return (
                                <div key={pIndex} className="gridBox link_url" onClick={()=>navigate(`/task-details/${c_task.project_task_id}`)}>
                                  <div className="gridboxbody">
                                    <h4>{c_task.description}</h4>
                                    <p><img src="assets/img/gbl.gif" alt="folder" /> <span>{c_task.title}</span></p>
                                    <p><img src="assets/img/gbl.gif" alt="date" /><span>Created {c_task.created_at}</span> </p>

                                  </div>
                                  <div className="gridboxfooter">
                                    <p>{c_task.project_task_id}</p>
                                    <a href="#" className="active"><img src="assets/img/boxuser.svg" alt="" /></a>
                                  </div>
                                </div>
                              )
                            })}
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
                          <li className={`page-item ${cardView == 'all' ? 'active' : '' }`}><a onClick={() => changeCardView('all')} className="page-link">All Task</a></li>
                          <li className={`page-item ${cardView == 'pending' ? 'active' : '' }`}><a onClick={() => changeCardView('pending')} className="page-link">To Do</a></li>
                          <li className={`page-item ${cardView == 'inProgress' ? 'active' : '' }`}><a onClick={() => changeCardView('inProgress')} className="page-link">In Progress</a></li>
                          <li className={`page-item ${cardView == 'review' ? 'active' : '' }`}><a onClick={() => changeCardView('review')} className="page-link">Under Review</a></li>
                          <li className={`page-item ${cardView == 'completed' ? 'active' : '' }`}><a onClick={() => changeCardView('completed')} className="page-link">Complete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="gridcontainer card_container">
                      <div className="grid_item">
                        <div className="card">
                          <div className="card-body d-flex w-100">
                            <div className="flex-fill w-25">
                              {pendingTasks && pendingTasks.length > 0 && pendingTasks.map((task, tIndex) => {
                                return (
                                  
                                    <div key={tIndex} onClick={()=>navigate(`/task-details/${task.project_task_id}`)} className={`link_url gridBox ${task.task_status == "pending" ? 'todo_Filter' : (task.task_status == "in_progress" ? 'inProgress_Filter' : (task.task_status == "review" ? 'underReview_Filter' : (task.task_status == "completed" ? 'complete_Filter' : '')))}`}>
                                      <div className="gridboxbody">
                                        <h4>{task.description}</h4>
                                        <a className="my-2" href="#">{task.task_status == "pending" ? 'To Do' : (task.task_status == "in_progress" ? 'In Progress' : (task.task_status == "review" ? 'Under Review' : (task.task_status == "completed" ? 'Completed' : '')))}</a>
                                        <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> &nbsp;<span>{task.title}</span></p>
                                        <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" />&nbsp; <span>Created {task.created_at}</span> </p>

                                      </div>
                                      <div className="gridboxfooter">
                                        <p className="m-0">{task.project_task_id}</p>
                                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                                      </div>
                                    </div>
                                )
                              })}
                            </div>
                            <div className="flex-fill w-25">
                              {inProgresstasks && inProgresstasks.length > 0 && inProgresstasks.map((task, tIndex) => {
                                return (
                                  
                                    <div key={tIndex} onClick={()=>navigate(`/task-details/${task.project_task_id}`)} className={`link_url gridBox ${task.task_status == "pending" ? 'todo_Filter' : (task.task_status == "in_progress" ? 'inProgress_Filter' : (task.task_status == "review" ? 'underReview_Filter' : (task.task_status == "completed" ? 'complete_Filter' : '')))}`}>
                                      <div className="gridboxbody">
                                        <h4>{task.description}</h4>
                                        <a className="my-2" href="#">{task.task_status == "pending" ? 'To Do' : (task.task_status == "in_progress" ? 'In Progress' : (task.task_status == "review" ? 'Under Review' : (task.task_status == "completed" ? 'Completed' : '')))}</a>
                                        <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>{task.title}</span></p>
                                        <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" /><span>Created {task.created_at}</span> </p>

                                      </div>
                                      <div className="gridboxfooter">
                                        <p className="m-0">{task.project_task_id}</p>
                                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                                      </div>
                                    </div>
                                )
                              })}
                            </div>
                            <div className="flex-fill w-25">
                              {underReviewtasks && underReviewtasks.length > 0 && underReviewtasks.map((task, tIndex) => {
                                return (
                                  
                                    <div key={tIndex} onClick={()=>navigate(`/task-details/${task.project_task_id}`)} className={`link_url gridBox ${task.task_status == "pending" ? 'todo_Filter' : (task.task_status == "in_progress" ? 'inProgress_Filter' : (task.task_status == "review" ? 'underReview_Filter' : (task.task_status == "completed" ? 'complete_Filter' : '')))}`}>
                                      <div className="gridboxbody">
                                        <h4>{task.description}</h4>
                                        <a className="my-2" href="#">{task.task_status == "pending" ? 'To Do' : (task.task_status == "in_progress" ? 'In Progress' : (task.task_status == "review" ? 'Under Review' : (task.task_status == "completed" ? 'Completed' : '')))}</a>
                                        <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>{task.title}</span></p>
                                        <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" /><span>Created {task.created_at}</span> </p>

                                      </div>
                                      <div className="gridboxfooter">
                                        <p className="m-0">{task.project_task_id}</p>
                                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                                      </div>
                                    </div>
                                )
                              })}
                            </div>
                            <div className="flex-fill w-25">
                              {completedtasks && completedtasks.length > 0 && completedtasks.map((task, tIndex) => {
                                return (
                                  
                                    <div key={tIndex} onClick={()=>navigate(`/task-details/${task.project_task_id}`)} className={`link_url gridBox ${task.task_status == "pending" ? 'todo_Filter' : (task.task_status == "in_progress" ? 'inProgress_Filter' : (task.task_status == "review" ? 'underReview_Filter' : (task.task_status == "completed" ? 'complete_Filter' : '')))}`}>
                                      <div className="gridboxbody">
                                        <h4>{task.description}</h4>
                                        <a className="my-2" href="#">{task.task_status == "pending" ? 'To Do' : (task.task_status == "in_progress" ? 'In Progress' : (task.task_status == "review" ? 'Under Review' : (task.task_status == "completed" ? 'Completed' : '')))}</a>
                                        <p><img src="assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>{task.title}</span></p>
                                        <p><img src="assets/img/gbl.gif" alt="date" height="1" width="1" /><span>Created {task.created_at}</span> </p>

                                      </div>
                                      <div className="gridboxfooter">
                                        <p className="m-0">{task.project_task_id}</p>
                                        <a href="#"><img src="assets/img/boxuser.svg" alt="" /></a>
                                      </div>
                                    </div>
                                )
                              })}
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
                        <li className={`page-item ${cardView == 'all' ? 'active' : '' }`}><a onClick={() => changeCardView('all')} className="page-link">All Task</a></li>
                          <li className={`page-item ${cardView == 'pending' ? 'active' : '' }`}><a onClick={() => changeCardView('pending')} className="page-link">To Do</a></li>
                          <li className={`page-item ${cardView == 'inProgress' ? 'active' : '' }`}><a onClick={() => changeCardView('inProgress')} className="page-link">In Progress</a></li>
                          <li className={`page-item ${cardView == 'review' ? 'active' : '' }`}><a onClick={() => changeCardView('review')} className="page-link">Under Review</a></li>
                          <li className={`page-item ${cardView == 'completed' ? 'active' : '' }`}><a onClick={() => changeCardView('completed')} className="page-link">Complete</a></li>
                        </ul>
                      </div>
                    </div>
                    <div className="gridcontainer timecontainer">
                      {timelineDates && timelineDates.length > 0 && timelineDates.map((date, dIndex) => {
                        return (
                          <div key={dIndex} className="grid_item">
                            <div className="card">
                              <div className="align-items-center card-header d-flex justify-content-between py-2">
                                <h4><img src="/assets/img/gbl.gif" alt="" className="mr-2 timeIcon" height="1" width="1" /> {date}</h4>
                              </div>
                              <div className="card-body">
                                {tasksByDates && tasksByDates[date] && tasksByDates[date].length > 0 && tasksByDates[date].map((task, tIndex) => {
                                  return (
                                    <div key={tIndex} onClick={()=>navigate(`/task-details/${task.project_task_id}`)} className={`link_url gridBox ${task.task_status == "pending" ? 'todo_Filter' : (task.task_status == "in_progress" ? 'inProgress_Filter' : (task.task_status == "review" ? 'underReview_Filter' : (task.task_status == "completed" ? 'complete_Filter' : '')))}`}>
                                      <div className="gridboxbody">
                                        <div>
                                          <p>{task.project_task_id}</p>
                                          <h4>{task.description}</h4>
                                        </div>
                                        <p><img src="/assets/img/gbl.gif" alt="folder" height="1" width="1" /> <span>{task.title}</span></p>
                                        <p> <a href="" className="statusClr">{task.task_status == "pending" ? 'To Do' : (task.task_status == "in_progress" ? 'In Progress' : (task.task_status == "review" ? 'Under Review' : (task.task_status == "completed" ? 'Completed' : '')))}</a></p>
                                        <p> <a href="#" className="active"><img src="/assets/img/boxuser.svg" alt="" /></a> </p>
                                      </div>
                                    </div>
                                  )

                                })}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </>
                )
              } else if (viewType["calender"]) {
                return (
                  <>
                    <div className="align-items-center d-flex justify-content-between my-3">
                      <div>
                        <ul className="pagination mb-0 filterview">
                          <li className="page-item active"><a onClick={() => changeCardView('all')} className="page-link">All Task</a></li>
                          <li className="page-item"><a onClick={() => changeCardView('pending')} className="page-link">To Do</a></li>
                          <li className="page-item"><a onClick={() => changeCardView('inProgress')} className="page-link">In Progress</a></li>
                          <li className="page-item"><a onClick={() => changeCardView('review')} className="page-link">Under Review</a></li>
                          <li className="page-item"><a onClick={() => changeCardView('completed')} className="page-link">Complete</a></li>
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