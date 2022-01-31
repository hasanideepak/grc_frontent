import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
import DateRangePicker from 'react-bootstrap-daterangepicker';
import 'bootstrap-daterangepicker/daterangepicker.css';
import moment from "moment";

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Calendar } from 'react-date-range';
import { Accordion, Button, Card, useAccordionButton } from "react-bootstrap";
const TaskDetails = (props) => {
  const {user = {}} = useOutletContext()
  const orgId = user?.currentUser?.org_id || 0;
  const { taskId = 0 } = useParams()
  const accessRole = user?.currentUser?.access_role || '';
  const [taskDetails, setTaskDetails] = useState({})

  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (Object.keys(taskDetails).length == 0 && taskId != 0) {
      getTaskDetails()
    }
  });



  const getTaskDetails = async () => {
    let payloadUrl = `tasks/getTaskDetails/${taskId}`
    let method = "GET";
    let formData = {};
    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      let { task, evidence_needed, applicable_assets } = res
      setTaskDetails(oldVal => {
        let obj = { task: task, evidence_needed: evidence_needed, applicable_assets: applicable_assets }
        return { ...obj }
      })
      // fetchInfo("all_tasks",res.accounts_and_projects[0].project_id)
    }

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


  // console.log(watch("email")); // watch input value by passing the name of it
  console.log(taskDetails)
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
                  {taskDetails && taskDetails?.task && taskDetails?.task[0]?.description}
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
                            {(() => {
                              if (taskDetails && taskDetails?.applicable_assets && taskDetails?.applicable_assets?.peoples.length > 0) {
                                return (
                                  <>
                                    <div className="assets_box pt-3">
                                      <div className="header">People</div>
                                      <ul className="m-0 pl-2">
                                        <li className="d-flex justify-content-between">
                                          <span>Employees:</span>
                                          <span>{taskDetails?.applicable_assets?.peoples[0]?.employees ? taskDetails?.applicable_assets?.peoples[0]?.employees : 0}</span>
                                        </li>
                                        <li className="d-flex justify-content-between">
                                          <span>Consultants:</span>
                                          <span>{taskDetails?.applicable_assets?.peoples[0]?.consultants ? taskDetails?.applicable_assets?.peoples[0]?.consultants : 0}</span>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )
                              }
                            })()}
                            {(() => {
                              if (taskDetails && taskDetails?.applicable_assets && taskDetails?.applicable_assets?.technology_assets.length > 0) {
                                return (
                                  <>
                                    <div className="assets_box pt-3">
                                      <div className="header">Technology Assets</div>
                                      <ul className="m-0 pl-2">
                                        <li className="d-flex justify-content-between">
                                          <span>Endpoints:</span>
                                          <span>{taskDetails?.applicable_assets?.technology_assets[0]?.endpoints ? taskDetails?.applicable_assets?.technology_assets[0]?.endpoints : 0}</span>
                                        </li>
                                        <li className="d-flex justify-content-between">
                                          <span>Mobile Devices:</span>
                                          <span>{taskDetails?.applicable_assets?.technology_assets[0]?.mobile_devices ? taskDetails?.applicable_assets?.technology_assets[0]?.mobile_devices : 0}</span>
                                        </li>
                                        <li className="d-flex justify-content-between">
                                          <span>Servers:</span>
                                          <span>{taskDetails?.applicable_assets?.technology_assets[0]?.servers ? taskDetails?.applicable_assets?.technology_assets[0]?.servers : 0}</span>
                                        </li>
                                      </ul>
                                    </div>
                                  </>
                                )
                              }
                            })()}
                            {(() => {
                              if (taskDetails && taskDetails?.applicable_assets && taskDetails?.applicable_assets?.vendors.length > 0) {
                                return (
                                  <>
                                    <div className="assets_box pt-3">
                                      <div className="header">Vendors/Service Providers</div>
                                      <ul className="m-0 pl-2">
                                        {taskDetails?.applicable_assets?.vendors && taskDetails?.applicable_assets?.vendors.map((vendor, vIndex) => {
                                          return (
                                            <li key={vIndex} className="d-flex justify-content-between">
                                              <span>{vendor.vendor}</span>
                                              <span></span>
                                            </li>
                                          )
                                        })}
                                      </ul>
                                    </div>

                                  </>
                                )
                              }
                            })()}
                            {(() => {
                              if (taskDetails && taskDetails?.applicable_assets && taskDetails?.applicable_assets?.third_party_utilities.length > 0 && taskDetails?.applicable_assets?.third_party_utilities.filter(ut => ut.is_selected == "Y").length > 0) {
                                return (
                                  <>
                                    <div className="assets_box pt-3">
                                      <div className="header">Saas/Third Party Utility</div>
                                      <ul className="m-0 pl-2">
                                        {taskDetails?.applicable_assets?.third_party_utilities && taskDetails?.applicable_assets?.third_party_utilities.map((utility, uIndex) => {
                                          if (utility.is_selected == 'Y') {
                                            return (
                                              <li key={uIndex} className="d-flex justify-content-between">
                                                <span>{utility.name}</span>
                                                <span></span>
                                              </li>
                                            )
                                          }
                                        })}
                                      </ul>
                                    </div>
                                  </>
                                )
                              }
                            })()}
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
                    {taskDetails && taskDetails?.evidence_needed && taskDetails?.evidence_needed.map((evidence, eIndex) => {
                      return (
                        <div key={eIndex} className="card_box px-0">
                          <span> <i class="fa fa-file" aria-hidden="true"></i> {evidence.evidence_name}</span>
                          <span>Uploded</span>
                        </div>
                      )
                    })}
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
                      <span>{taskDetails && taskDetails?.task && taskDetails?.task[0]?.task_id}</span>
                    </div>
                    <div className="stat_box">
                      <span>AUC ID</span>
                      <span>{taskDetails && taskDetails?.task && taskDetails?.task[0]?.auc_id}</span>
                    </div>
                    <div className="stat_box">
                      <span>Completion</span>
                      <span className="text_color_4">{taskDetails && taskDetails?.task && taskDetails?.task[0]?.completion_pct}%</span>
                    </div>
                    <div className="stat_box">
                      <span>Status</span>
                      {
                        taskDetails && taskDetails?.task && taskDetails?.task[0]?.task_status
                        ? <span className={`text-${taskDetails?.task[0]?.task_status == "pending" ? 'danger' : (taskDetails?.task[0]?.task_status == 'in_progress' ? 'wraning' : (taskDetails?.task[0]?.task_status == 'review' ? 'secondary' : 'success'))}`}>{taskDetails?.task[0]?.task_status}</span>
                        : ''
                      }
                      
                    </div>
                    <div className="stat_box">
                      <span>Due Date</span>
                      <span>{taskDetails && taskDetails?.task && taskDetails?.task[0]?.due_date}</span>
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
                <div className="task_card_block task_control_block">
                  <div className="card_block control_block py-3 pb-5">
                    <Accordion defaultActiveKey="0">
                      <Accordion.Item eventKey="0">
                        <Accordion.Header>Controls & Mapping</Accordion.Header>
                        <Accordion.Body>
                          <div className="card_box control_box">
                            <span>SOC2</span>
                            <span>AIR</span>
                          </div>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>

                  </div>
                </div>

                {/* <div className="task_control_block">
                  <div className="control_block py-3 pb-5">
                    <div className="header my-2">
                      <h3 className="m-0 pl-2">Controls & Mapping</h3>
                    </div>
                    <div className="control_box">
                      <span>SOC2</span>
                      <span>AIR</span>
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

                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskDetails