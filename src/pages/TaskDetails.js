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
import { Accordion, Button, Card,useAccordionButton } from "react-bootstrap";
const TaskDetails = (props) => {
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
    if (projectId == 0) {
      getProjectInfo()
    }
    if (Object.keys(dates).length == 0) {
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
      // fetchInfo("all_tasks",res.accounts_and_projects[0].project_id)
    }
  }


  const fetchInfo = async (type = '', project_id = 0) => {
    if (type == '') {
      return false
    };

    let payloadUrl = ""
    let method = "POST";
    let formData = {};
    let now = new Date()
    let numDays = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    let startDate = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    startDate = `${startDate.getFullYear()}-${('00' + startDate.getMonth()).slice(-2)}-${('00' + startDate.getDate()).slice(-2)}`
    let endDate = new Date(now.getFullYear(), now.getMonth() + 1, numDays)
    endDate = `${endDate.getFullYear()}-${('00' + endDate.getMonth()).slice(-2)}-${('00' + endDate.getDate()).slice(-2)}`
    if (type == 'all_tasks') {
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/tasks/listTasks
      payloadUrl = `tasks/listTasks`
      method = "POST";
      formData = { project_id: projectId || project_id, authority: accessRole, start_date: startDate, end_date: endDate, task_status: "all" }
    } else {
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/tasks/listTasks
      payloadUrl = `tasks/listTasks/`
      method = "POST";
      formData = { project_id: projectId || project_id, authority: accessRole, start_date: startDate, end_date: endDate, task_status: type }
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
    let res = await ApiService.post(payload.type, payload, TaskDetails);
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

  const CustomToggle = useAccordionButton("1");

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div id="taskDetails_sec" className="row">
          <div className="col-md-9 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div class="card">
              <div class="card-body">
                <h5 class="card-title">Description</h5>
                <p class="card-text">
                  It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content her… Read more
                </p>

              </div>
            </div>
            <div class="card mt-4">
              <div class="card-body p-0">
                <div className="task_card_block assets_block">
                  <div className="card_block p-3">
                    <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0">
                      <Accordion.Header>Applicable Assets</Accordion.Header>
                      <Accordion.Body>
                        <div className="assets_list pl-2">
                          <div className="assets_box pt-3">
                            <div className="header">People</div>
                            <ul className="m-0 pl-2">
                              <li className="d-flex justify-content-between">
                                <span>Employees:</span>
                                <span>07</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Consultants:</span>
                                <span>10</span>
                              </li>
                            </ul>
                          </div>
                          <div className="assets_box pt-3">
                            <div className="header">Technology Assets</div>
                            <ul className="m-0 pl-2">
                              <li className="d-flex justify-content-between">
                                <span>Endpoints:</span>
                                <span>06</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Mobile Devices:</span>
                                <span>03</span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Servers:</span>
                                <span>02</span>
                              </li>
                            </ul>
                          </div>
                          <div className="assets_box pt-3">
                            <div className="header">Vendors/Service Providers</div>
                            <ul className="m-0 pl-2">
                              <li className="d-flex justify-content-between">
                                <span>icloud.com</span>
                                <span></span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>gmail.com</span>
                                <span></span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>yahoo.com</span>
                                <span></span>
                              </li>
                            </ul>
                          </div>
                          <div className="assets_box pt-3">
                            <div className="header">Saas/Third Party Utility</div>
                            <ul className="m-0 pl-2">
                              <li className="d-flex justify-content-between">
                                <span>Jeera 1</span>
                                <span></span>
                              </li>
                              <li className="d-flex justify-content-between">
                                <span>Asana</span>
                                <span></span>
                              </li>
                            </ul>
                          </div>
                          
                        </div>
                      </Accordion.Body>
                    </Accordion.Item>
                      
                      {/* <Card>
                        <Card.Header>
                          <span onClick={useAccordionButton("1", () =>console.log('totally custom!'))}>Applicable Assets</span>
                        </Card.Header>
                        <Accordion.Collapse eventKey="1">
                          <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse>
                      </Card> */}
                    </Accordion>

                  </div>
                </div>
              </div>
            </div>
            <div class="card mt-4">
              <div class="card-body p-0">
                <div className="task_card_block evidence_block">
                  <div className="card_block p-3">
                    <div className="header my-2">
                      <h3 className="m-0">Evidence Needed</h3>
                    </div>
                    <div className="card_box px-0">
                      <span> <i class="fa fa-file" aria-hidden="true"></i> Security Awareness Training Screenshots</span>
                      <span>Uploded</span>
                    </div>
                    <div className="card_box px-0">
                      <span><i class="fa fa-file" aria-hidden="true"></i> Phishing test Results</span>
                      <span>Uploded</span>
                    </div>
                    <div className="card_box px-0">
                      <span><i class="fa fa-file" aria-hidden="true"></i> New Employees of the quarter added</span>
                      <span className="">Uploded</span>
                    </div>
                    <div className="card_box px-0">
                      <span><i class="fa fa-file" aria-hidden="true"></i> Policy</span>
                      <span className="">Uploded</span>
                    </div>
                    <div className="card_box px-0">
                      <span><i class="fa fa-file" aria-hidden="true"></i> Procedure</span>
                      <span className="">Uploded</span>
                    </div>
                  </div>
                  <div className="w-100 px-3 pb-2">
                    <div className="control_button_block">
                      <Button className="btn_2" variant="outline-dark">Sample Evidence library</Button>
                    </div>
                  </div>
                  <div className="w-100 px-3 d-flex py-4 pb-5">
                    <div className="card_button_block ">
                      <Button className="btn_1 btn_wide " variant="outline-dark">Re-Assign</Button>
                    </div>
                    <div className="card_button_block pl-3">
                      <Button className="btn_1 btn_wide" variant="outline-dark">Save</Button>
                    </div>
                    <div className="card_button_block pl-3">
                      <Button className="btn_1 btn_wide" variant="outline-dark">Mark Completed</Button>
                    </div>
                    <div className="card_button_block pl-3">
                      <Button className="btn_1" variant="outline-dark">Reduce Frequency</Button>
                    </div>
                    <div className="card_button_block pl-3">
                      <Button className="btn_3 btn_wide" variant="outline-dark">Approved</Button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div class="card">
              <div class="card-body p-0">
                <div className="task_status_block">
                  <div className="stat_block p-3">

                    <div className="stat_box">
                      <span>Task ID</span>
                      <span>A54</span>
                    </div>
                    <div className="stat_box">
                      <span>AUC ID</span>
                      <span>25</span>
                    </div>
                    <div className="stat_box">
                      <span>Completion</span>
                      <span className="text_color_4">25%</span>
                    </div>
                    <div className="stat_box">
                      <span>Status</span>
                      <span className="text-success">Completed</span>
                    </div>
                    <div className="stat_box">
                      <span>Due Date</span>
                      <span>Dec 23, 2021</span>
                    </div>
                  </div>
                  <div className="stat_chips_block p-3">
                    <div className="header mb-3">
                      <h3 className="m-0">Tags</h3>
                    </div>

                    <div className="d-flex justify-content-between">
                      <div className="stat_chips_box">
                        <span>Data Flow ..</span>
                      </div>
                      <div className="stat_chips_box">
                        <span>Solution ...</span>
                      </div>
                      <div className="stat_chips_box">
                        <span>Audit Syst...</span>
                      </div>
                      <div className="stat_chips_box">
                        <span>Monitor Au..</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="card mt-4">
              <div class="card-body p-0">
                <div className="task_control_block">
                  <div className="control_block py-3 pb-5">
                    <div className="header my-2">
                      <h3 className="m-0 pl-2">Controls & Mapping</h3>
                    </div>
                    <div className="control_box">
                      <span>ISO 2 to 1</span>
                      <span>Request 11.4</span>
                    </div>
                    <div className="control_box show_bg">
                      <span>ISO 1</span>
                      <span>Request 1.2</span>
                    </div>
                    <div className="control_box">
                      <span>ISO 2</span>
                      <span className="">Request 1.2</span>
                    </div>
                    <div className="control_box show_bg">
                      <span>ISO 2 to 5</span>
                      <span className="">Request 11.4</span>
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

export default TaskDetails