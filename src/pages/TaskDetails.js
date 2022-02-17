import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie, decryptData } from "../helpers/Helper";
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
import AirModal from "../elements/AirModal";
const TaskDetails = (props) => {
  const { user = {} } = useOutletContext()
  const orgId = user?.currentUser?.org_id || 0;
  const { taskId:encTaskId = 0 } = useParams()
  const accessRole = user?.currentUser?.access_role || '';
  const [taskId, setTaskId] = useState(null)
  const [taskDetails, setTaskDetails] = useState({})
  const [viewFile, setViewFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const navigate = useNavigate()
  const [modalType, setModalType] = useState(null)
  const [openModal, setShowModal] = useState(false);
  const [evidenceTypeId, setEvidenceTypeId] = useState(null);
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if(encTaskId != 0){
      let id =  decryptData(encTaskId)
      setTaskId(id)
    }
    if (Object.keys(taskDetails).length == 0 && taskId != null) {
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

  const getFileDetails = async (data = null) =>{
    if(data != null){
      
      let payloadUrl = `${data.evidence_url}`
      let method = "GET";
      let response = await ApiService.fetchFile(payloadUrl,method);
      let jsonResponse = response.clone()
      let res = await response.arrayBuffer();
      if(res){
        let contentType = response && response.headers.get('content-type') ? response.headers.get('content-type') : 'application/pdf' ;
        console.log(contentType)
        if(contentType.indexOf('application/json') == -1){
          var blob = new Blob([res], {type: contentType});
          let reader = new FileReader();
          let url = reader.readAsDataURL(blob);
          reader.onloadend = () => {
            let fileType = contentType ? contentType.substr(contentType.lastIndexOf('/')+1) : null;
            setFileType(fileType)
            setViewFile(reader.result)
          };
          return {status:true,message:"Success"}
        }else{
          let jres = await jsonResponse.json();
          return {status:false,message:jres.message}
        }
        
      }

      
    }
  }

  const showModal = async (modalName = null,data=null) => {
    if (modalName == null) {
      return false
    }
    setEvidenceTypeId(null)
    switch (modalName) {
      case 'view_upload_evidence':
        if(data.evidence_type_id){
          setEvidenceTypeId(data.evidence_type_id)
        }
        setModalType(modalName)
        setShowModal(true)
        break;
      case 'view_documents':
        if(data != null){
          setViewFile(null);
          setFileType(null)
          let fileDetails = getFileDetails(data)
          
          setModalType(modalName)
          setShowModal(true)
        }
      break;

    }
  }

  const hideModal = () => {
    if(modalType == 'view_upload_evidence'){
      getTaskDetails()
    }
    setModalType(null)
    setShowModal(false)
  }


  // console.log(watch("email")); // watch input value by passing the name of it
  // console.log(taskDetails)
  return (
    <>
      <Header />
      <div className="container-fluid">
        <div id="taskDetails_sec">
          <div className="task_overview_block">
            {/* <div className="card">
              <div className="card-body p-0">
                <div className="task_card_block">
                  <div className="card_block py-3"> */}
            <div className="row">
              <div className="col-md-9 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="task_card_block">
                      <div className="card_block py-3">
                        <div className="d-flex justify-content-between align-items-center px-3">
                          <div className="task_name_block">
                            <span className="task_name mr-2">{taskDetails && taskDetails?.task && taskDetails?.task[0]?.title}</span>
                            <label className={`m-0 badge badge-pill badge-${taskDetails && taskDetails?.task && taskDetails?.task[0] && taskDetails?.task[0]?.priority.toLowerCase() == 'low' ? 'success' : (taskDetails && taskDetails?.task && taskDetails?.task[0] && taskDetails?.task[0]?.priority.toLowerCase() == 'medium' ? 'warning' : 'danger')} ml-auto`}>{taskDetails && taskDetails?.task && taskDetails?.task[0] && taskDetails?.task[0]?.priority.toUpperCase()}</label>
                          </div>
                          <div className="widget_box d-flex flex-column text-right">
                            <span>Task Owner</span>
                            <span>{taskDetails && taskDetails?.task && taskDetails?.task[0]?.task_owner ? taskDetails?.task[0]?.task_owner : '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
                <div className="card">
                  <div className="card-body p-0">
                    <div className="task_card_block">
                      <div className="card_block py-3">
                        <div className="d-flex justify-content-between align-items-center px-3">
                          <div className="widget_box d-flex flex-column text-left">
                            <span>Due Date</span>
                            <span>{taskDetails && taskDetails?.task && taskDetails?.task[0]?.due_date}</span>
                          </div>
                          <div className="widget_box d-flex flex-column text-right">
                            <span>Status</span>
                            {
                              taskDetails && taskDetails?.task && taskDetails?.task[0]?.task_status
                                ? <span className={`text-${taskDetails?.task[0]?.task_status == "pending" ? 'danger' : (taskDetails?.task[0]?.task_status == 'in_progress' ? 'wraning' : (taskDetails?.task[0]?.task_status == 'review' ? 'secondary' : 'success'))}`}>{taskDetails?.task[0]?.task_status == "pending" ? 'Pending' : (taskDetails?.task[0]?.task_status == 'in_progress' ? 'In Progress' : (taskDetails?.task[0]?.task_status == 'review' ? 'Under Review' : 'Completed'))}</span>
                                : ''
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div>
                </div>
              </div>
            </div>  */}
          </div>
          <div className="row mt-3">
            <div className="col-md-9 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title">Description</h5>
                  <p className="card-text">
                    {taskDetails && taskDetails?.task && taskDetails?.task[0]?.description}
                  </p>

                </div>
              </div>
              <div className="card mt-4">
                <div className="card-body p-0">
                  <div className="task_card_block assets_block">
                    <div className="card_block p-3">
                      {/* <Accordion defaultActiveKey="0"> */}
                      <Accordion >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Applicable Assets</Accordion.Header>
                          <Accordion.Body>
                            <div className="assets_list pl-2">
                              {(() => {
                                if (taskDetails && taskDetails?.applicable_assets && taskDetails?.applicable_assets?.peoples.length > 0) {
                                  return (
                                    <>
                                      <div className="assets_box pt-3">
                                        <div className="header"><span className="box_bullet mr-2"></span>People</div>
                                        <ul className="m-0 pl-4">
                                          <li className="d-flex justify-content-between">
                                            <span>&#8627;	 Employees:</span>
                                            <span>{taskDetails?.applicable_assets?.peoples[0]?.employees ? taskDetails?.applicable_assets?.peoples[0]?.employees : 0}</span>
                                          </li>
                                          <li className="d-flex justify-content-between">
                                            <span>&#8627;	 Consultants:</span>
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
                                        <div className="header"><span className="box_bullet mr-2"></span>Technology Assets</div>
                                        <ul className="m-0 pl-4">
                                          <li className="d-flex justify-content-between">
                                            <span>&#8627;	Endpoints:</span>
                                            <span>{taskDetails?.applicable_assets?.technology_assets[0]?.endpoints ? taskDetails?.applicable_assets?.technology_assets[0]?.endpoints : 0}</span>
                                          </li>
                                          <li className="d-flex justify-content-between">
                                            <span>&#8627;	Mobile Devices:</span>
                                            <span>{taskDetails?.applicable_assets?.technology_assets[0]?.mobile_devices ? taskDetails?.applicable_assets?.technology_assets[0]?.mobile_devices : 0}</span>
                                          </li>
                                          <li className="d-flex justify-content-between">
                                            <span>&#8627;	Servers:</span>
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
                                        <div className="header"><span className="box_bullet mr-2"></span>Vendors/Service Providers</div>
                                        <ul className="m-0 pl-4">
                                          {taskDetails?.applicable_assets?.vendors && taskDetails?.applicable_assets?.vendors.map((vendor, vIndex) => {
                                            return (
                                              <li key={vIndex} className="d-flex justify-content-between">
                                                <span>&#8627;	{vendor.vendor}</span>
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
                                        <div className="header"><span className="box_bullet mr-2"></span>Saas/Third Party Utility</div>
                                        <ul className="m-0 pl-4">
                                          {taskDetails?.applicable_assets?.third_party_utilities && taskDetails?.applicable_assets?.third_party_utilities.map((utility, uIndex) => {
                                            if (utility.is_selected == 'Y') {
                                              return (
                                                <li key={uIndex} className="d-flex justify-content-between">
                                                  <span>&#8627;	{utility.name}</span>
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
              <div className="card mt-4">
                <div className="card-body p-0">
                  <div className="task_card_block evidence_block">
                    <div className="card_block p-3">
                      <div className="header my-2">
                        <h3 className="m-0">Evidence Needed</h3>
                      </div>
                      {taskDetails && taskDetails?.evidence_needed && taskDetails?.evidence_needed.map((evidence, eIndex) => {
                        return (
                          <div key={eIndex} className="px-0">
                            <div className="card_box px-0">
                              <span> <i className="fa fa-file" aria-hidden="true"></i> {evidence.evidence_name}</span>
                              {
                                !evidence.evidence_uploaded || evidence.evidence_uploaded.length == 0
                                  ? <div className="control_button_block pl-3"><Button className="btn_1 btn_small" variant="outline-dark" onClick={() => showModal('view_upload_evidence',evidence)}>Upload Documents</Button></div>
                                  : <div className="control_button_block pl-3"><Button className="btn_1 btn_small" variant="outline-dark" onClick={() => showModal('view_upload_evidence',evidence)}>Upload Documents</Button></div>
                              }
                            </div>
                            <div className="evidences_list px-4">
                              <ul className="m-0 p-0 px-2">
                                {evidence && evidence.evidence_uploaded && evidence.evidence_uploaded.length > 0 && evidence.evidence_uploaded.map((evDocs, evIndex) => {
                                  return (
                                    <li key={evIndex} className="d-flex justify-content-between my-2">
                                      <span>&#8627; {evDocs.file_name}</span>
                                      <span className="action">
                                        <span className="link_url" onClick={() => showModal('view_documents', evDocs)}><i className="fa fa-eye"></i></span>
                                      </span>
                                    </li>
                                  )
                                })}
                              </ul>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <div className="w-100 pb-3">
                      <div className="control_button_block pl-3">
                        <Button className="btn_2" variant="outline-dark">Sample Evidence library</Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-4 taskDetails_btn sticky">
                <div className="card-body p-0">
                  <div className="task_card_block">
                    <div className="taskDetails_btn_block px-3 d-flex py-4 flex-wrap justify-content-center align-items-center">
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
              <div className="card">
                <div className="card-body p-0">
                  <div className="task_card_block task_status_block">
                    <div className="card_block status_block py-3">
                      <Accordion >
                        <Accordion.Item eventKey="0">
                          <Accordion.Header>Task Info</Accordion.Header>
                          <Accordion.Body>
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
                              {/* <div className="stat_box">
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
                                </div> */}
                            </div>
                            <div className="stat_chips_block p-3">
                              <div className="header mb-3">
                                <h3 className="m-0">Tags</h3>
                              </div>

                              <div className="d-flex justify-content-between">
                                <div className="stat_chips_box">
                                  <span>Data Flow ..</span>
                                </div>
                                <div className="stat_chips_box ml-1">
                                  <span>Solution ...</span>
                                </div>
                                <div className="stat_chips_box ml-1">
                                  <span>Audit Syst...</span>
                                </div>
                                <div className="stat_chips_box ml-1">
                                  <span>Monitor Au..</span>
                                </div>
                              </div>
                            </div>
                          </Accordion.Body>
                        </Accordion.Item>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card mt-4">
                <div className="card-body p-0">
                  <div className="task_card_block task_control_block">
                    <div className="card_block control_block py-3">
                      {/* <Accordion defaultActiveKey="0"> */}
                      <Accordion>
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
      </div>

      {(() => {
        if (modalType && modalType != '' && modalType != null) {
          if (modalType == 'view_upload_evidence') {
            return <AirModal
              show={openModal}
              modalType={modalType}
              hideModal={hideModal}
              modalData={{ taskDetails,taskId:taskDetails.task[0].task_id,evidenceTypeId:evidenceTypeId }}
              formSubmit={() => { }} />
          }
          if (modalType == 'view_documents') {
            return <AirModal
              show={openModal}
              modalType={modalType}
              hideModal={hideModal}
              modalData={{viewFile:viewFile,fileType:fileType}}
              formSubmit={() =>{}} />
          }
        }
      })()}
    </>
  )
}

export default TaskDetails