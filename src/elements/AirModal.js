import { useEffect, useState } from "react";
import { Accordion, Button, Modal, ProgressBar } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Loader from "../components/partials/Loader";
import { encryptData } from "../helpers/Helper";
import ApiService from "../services/ApiServices";


const AirModal = (intialData) => {
    const { modalType, formSubmit, show, hideModal, modalData } = intialData
    const navigate = useNavigate();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [formRes, setFormRes] = useState({ staus: false, err: false, data: {} })
    const [formSubmitted, setFormSbmt] = useState(false)
    const [modalFormData, setModalFormData] = useState({})
    const [showLoader, setShowLoader] = useState(false)
    const [taskDetails, setTaskDetails] = useState({})

    const [msgError, setMsgErr] = useState('')
    const [uploadfiles, setUploadFiles] = useState(null)
    const [uploadErr, setUploadErr] = useState('')

    useEffect(() => {
        if (modalType == 'view_task_details') {
            if (Object.keys(taskDetails).length == 0) {
                let obj = modalData?.taskDetails ? modalData?.taskDetails : {};
                setTaskDetails(obj)
            }
        }
        if(modalType == 'view_upload_evidence'){
            setMsgErr('')
            setUploadErr('')
            setShowLoader(false)
            setUploadFiles(null)
        }
    }, []);


    const handleModalClose = () => {
        // setShowModal(false)
        hideModal()
    };
    // const handleModalShow = () => setShowModal(true);

    const onSubmit = async (data) => {
        let stat = { status: false, err: false, data: {} }
        setFormRes(stat)
        if (modalType == 'add_update_title') {
            if (data.title && data.title != '') {
                setFormSbmt(true)
                let res = await formSubmit(data)
                if (res && res.message == 'Success') {
                    setFormSbmt(false)
                    handleModalClose()
                }
            }
        }
        return false
    }

    const _ = (el) => {
        return document.getElementById(el);
    }

    const progressHandler = (event) => {
        _("loaded_n_total").innerHTML = "Uploaded " + event.loaded + " bytes of " + event.total;
        var percent = (event.loaded / event.total) * 100;
        _("progressBar").value = Math.round(percent);
        _("status").innerHTML = Math.round(percent) + "% uploaded... please wait";
    }

    const completeHandler = (event) => {
        _("status").innerHTML = event.target.responseText;
        _("progressBar").value = 0; //wil clear progress bar after successful upload
    }

    const errorHandler = (event) => {
        _("status").innerHTML = "Upload Failed";
    }

    const abortHandler = (event) => {
        _("status").innerHTML = "Upload Aborted";
    }

    const onFileChange = (event = null) => {
        setMsgErr('')
        setUploadErr('')
        if (event == null) {
            return false
        }
        let files = event.target.files
        setUploadFiles(Array.from(files))
        // console.log(Array.from(files))
    }

    const uploadFile = async () => {
        setMsgErr('')
        setUploadErr('')
        setShowLoader(true)
        
        if (uploadfiles == '' || uploadfiles == null || uploadfiles == undefined) {
            console.log('Please select a file')
            setMsgErr('Please select a file');
            return false
        }
        console.log('sending form')
        let formData = new FormData();
        console.log(uploadfiles)
        let files = []
        if(uploadfiles && uploadfiles.length > 0){
            for (var i = 0; i < uploadfiles.length; i++) {
                console.log(uploadfiles[i])
                // files[i] = uploadfiles[i]
                formData.append(`file[${i}]`, uploadfiles[i])
            }
        }
        // formData.append(`file`, uploadfiles)
        let payloadUrl = `evidences/uploadEvidence/${modalData.evidenceTypeId}/${modalData.taskId}`;
        let method = "POST"
        let res = await ApiService.fetchData(payloadUrl, method, formData,'form');
        if (res && res.message == "Success") {
            setShowLoader(false)
            setFormSbmt(false)
            hideModal();
            // setUploadErr('We are not able to create your profile at this moment. Please continue by filling in fields manually')
        } else {
            setFormSbmt(false)
            setShowLoader(false)
            // setUploadErr(res.message)
        }
    }

    const removeUploadFile = async (fileIndex = null) =>{
        if(fileIndex == null){
            return false
        }
        let files = uploadfiles;
        files.splice(fileIndex,1)
        setUploadFiles(oldVal =>{
            return [...files]
        })
    }

    const resetFile = () => {
        setUploadFiles(null);
        setMsgErr('')
        setUploadErr('')
    }




    if (modalType == 'view_task_details') {
        return (
            <>

                <Modal
                    show={show}
                    onHide={handleModalClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    className="custom-modal task_details_modal"
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Task Details <a className="taskDetailPage_link position-absolute ml-3" onClick={() => navigate(`/task-details/${encryptData(taskDetails?.task[0]?.task_id)}`)}><i className="fa fa-external-link"></i></a></Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <div id="taskDetails_sec">
                                <div className="task_overview_block">
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
                                                                        <span>Uploded</span>
                                                                    </div>
                                                                    <div className="evidences_list px-4">
                                                                        <ul className="m-0 p-0 px-2">
                                                                            {evidence && evidence.evidence_uploaded && evidence.evidence_uploaded.length > 0 && evidence.evidence_uploaded.map((evDocs, evIndex) => {
                                                                                return (
                                                                                    <li key={evIndex} className="d-flex justify-content-between my-2">
                                                                                        <span>&#8627; {evDocs.file_name}</span>
                                                                                        <span className="action">
                                                                                            {/* <span className="link_url" onClick={() => {}}><i className="fa fa-eye"></i></span> */}
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
                                        {/* <div className="card mt-4 taskDetails_btn">
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
                                        </div> */}
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
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <div className="taskDetails_btn w-100">
                            <div className="taskDetails_btn_block px-3 d-flex flex-wrap justify-content-center align-items-center">
                                <div className="card_button_block mt-3">
                                    <Button className="btn_1 btn_wide " variant="outline-dark">Re-Assign</Button>
                                </div>
                                <div className="card_button_block mt-3 pl-3">
                                    <Button className="btn_1 btn_wide" variant="outline-dark">Save</Button>
                                </div>
                                <div className="card_button_block mt-3 pl-3">
                                    <Button className="btn_1 btn_wide" variant="outline-dark">Mark Completed</Button>
                                </div>
                                <div className="card_button_block mt-3 pl-3">
                                    <Button className="btn_1" variant="outline-dark">Reduce Frequency</Button>
                                </div>
                                <div className="card_button_block mt-3 pl-3">
                                    <Button className="btn_3 btn_wide" variant="outline-dark">Approved</Button>
                                </div>
                            </div>
                        </div>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    if (modalType == 'view_upload_evidence') {
        return (
            <>

                <Modal
                    show={show}
                    onHide={handleModalClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    className="custom-modal task_details_modal"
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Upload Documents</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <div id="form_file_upload_modal">
                                {(() => {
                                    if (uploadfiles == null || uploadfiles.length < 1) {
                                        return (
                                            <div class="form-control file_upload_block position-relative d-flex justify-content-center align-items-center flex-column">
                                                <input class="fileUploadInp" type="file" name="file" onChange={(e) => onFileChange(e)} id="file" data-multiple-caption="{count} files selected" multiple />
                                                <i class="fa fa-download" aria-hidden="true"></i>
                                                <label for="file"><strong>Choose a file</strong><span class="fileDropBox"> or drag it here</span>.</label>
                                            </div>
                                        )

                                    } else {
                                        return (
                                            <div class="form-control file_upload_block position-relative d-flex justify-content-center align-items-center flex-column">
                                               <div className="uploadsList my-2">
                                                   {uploadfiles && uploadfiles.length > 0 && uploadfiles.map((file,fIndex)=>{
                                                       return (
                                                            <div key={fIndex} className="file_card position-relative">
                                                                <span className=""><img src={URL.createObjectURL(file)} className="img-fluid" /></span>
                                                                <span className="close_btn link_url position-absolute" onClick={()=> removeUploadFile(fIndex)}><i className="fa fa-times"></i></span>
                                                            </div>
                                                       )
                                                   })}
                                               </div>
                                                <div className="taskDetails_btn_block px-3">
                                                    <div className="card_button_block ">
                                                        <Button className="btn_1 btn_wide " variant="outline-dark" type="submit" onClick={() => uploadFile()}>Upload</Button>
                                                    </div>
                                                    {/* <ProgressBar animated now={45} label={'45'} /> */}
                                                </div>
                                                <Loader showLoader={showLoader}></Loader>
                                            </div>
                                        )

                                    }
                                })()}



                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
    if (modalType == 'view_documents') {
        console.log(modalData)
        return (
            <>

                <Modal
                    show={show}
                    onHide={handleModalClose}
                    backdrop="static"
                    keyboard={false}
                    size="xl"
                    className="custom-modal task_details_modal"
                    scrollable={true}
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Document Viewer</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="container-fluid">
                            <section className="view_document_section my-sm-5 my-lg-0">
                                <div className="container">
                                    <div className="row py-5 justify-content-center">
                                        <div className="col-12 col-md-12">
                                            <div className={`view_doc_container h-100`}>
                                                {(() => {
                                                    if (modalData.viewFile && modalData.viewFile != '') {
                                                        if (modalData.fileType && modalData.fileType != '') {
                                                            if (modalData.fileType == 'pdf') {
                                                                return <object data={modalData.viewFile} className="w-100 img-fluid h-100"></object>
                                                            } else if (modalData.fileType == 'jpeg' || modalData.fileType == 'jpg' || modalData.fileType == 'png' || modalData.fileType == 'webp' || modalData.fileType == 'svg' || modalData.fileType == 'gif') {
                                                                return <img src={modalData.viewFile} className="w-100 img-fluid" />
                                                            }

                                                        }
                                                    } else {
                                                        return <Loader showLoader={true} pos={'absolute'} />
                                                    }
                                                })()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </>
        )
    }
}

export default AirModal