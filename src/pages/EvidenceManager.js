import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { lazy, useContext, useEffect, useState } from "react";
import { LayoutContext } from "../ContextProviders/LayoutContext";
import AirModal from "../elements/AirModal";

// const LayoutContext = lazy(() => import("../ContextProviders/LayoutContext"))

const EvidenceManager = (props) => {
  const { projectId = null } = useContext(LayoutContext)
  // console.log(projectId)
  const navigate = useNavigate()
  const [evidences, setEvidences] = useState([])
  const [viewFileDetails, setViewFileDetails] = useState(null)
  const [modalType, setModalType] = useState(null)
  const [openModal, setShowModal] = useState(false);

  const [viewFile, setViewFile] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [taskDetails, setTaskDetails] = useState({})
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (evidences.length == 0 && projectId != null) {
      getEvidences()
    }
  }, [projectId])

  const getEvidences = async () => {
    let payloadUrl = `evidences/listEvidences/${projectId}`
    let method = "GET";
    let formData = {};

    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      setEvidences(oldVal => {
        return [...res.results]
      })
    }
  }
  const onSubmit = async (data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type, payload, EvidenceManager);
    if (res && res.status == true) {
      SetCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

  const getFileDetails = async (data = null) => {
    if (data != null) {

      let payloadUrl = `${data.evidence_url}`
      let method = "GET";
      let response = await ApiService.fetchFile(payloadUrl, method);
      let jsonResponse = response.clone()
      let res = await response.arrayBuffer();
      if (res) {
        let contentType = response && response.headers.get('content-type') ? response.headers.get('content-type') : 'application/pdf';
        console.log(contentType)
        if (contentType.indexOf('application/json') == -1) {
          var blob = new Blob([res], { type: contentType });
          let reader = new FileReader();
          let url = reader.readAsDataURL(blob);
          reader.onloadend = () => {
            let fileType = contentType ? contentType.substr(contentType.lastIndexOf('/') + 1) : null;
            setFileType(fileType)
            setViewFile(reader.result)
          };
          return { status: true, message: "Success" }
        } else {
          let jres = await jsonResponse.json();
          return { status: false, message: jres.message }
        }
      }
    }
  }

  const downloadFile = async (data = null) => {
    if (data != null) {

      let payloadUrl = `${data.evidence_url}`
      let method = "GET";
      let response = await ApiService.fetchFile(payloadUrl, method);
      let jsonResponse = response.clone()
      let res = await response.arrayBuffer();
      if (res) {
        let contentType = response && response.headers.get('content-type') ? response.headers.get('content-type') : 'application/pdf';
        // console.log(contentType)
        if (contentType.indexOf('application/json') == -1) {
          var blob = new Blob([res], { type: contentType });
          let url  = window.URL.createObjectURL(blob)
          // window.open(url,'_blank')

          if (
            window.navigator && 
            window.navigator.msSaveOrOpenBlob
          ) return window.navigator.msSaveOrOpenBlob(blob);
      
          // For other browsers:
          // Create a link pointing to the ObjectURL containing the blob.
          const link = document.createElement('a');
          link.href = url;
          link.download = data.file_name;
          // this is necessary as link.click() does not work on the latest firefox
          link.dispatchEvent(
            new MouseEvent('click', { 
              bubbles: true, 
              cancelable: true, 
              view: window 
            })
          );
      
          setTimeout(() => {
            // For Firefox it is necessary to delay revoking the ObjectURL
            window.URL.revokeObjectURL(data);
            link.remove();
          }, 100);
          
          // return {status:true,message:"Success"}
        } else {
          // let jres = await jsonResponse.json();
          // return {status:false,message:jres.message}
        }
      }
    }
  }

  const getTaskDetails = async (taskId = null) => {
    if(taskId == null){
      return false
    }
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
        showModal('view_task_details')
        // fetchInfo("all_tasks",res.accounts_and_projects[0].project_id)
    }
  }

  const showModal = async (modalName = null, data = null) => {
    if (modalName == null) {
      return false
    }

    switch (modalName) {
      case 'view_documents':
        if (data != null) {
          setViewFile(null);
          setFileType(null)
          let fileDetails = getFileDetails(data)

          setModalType(modalName)
          setShowModal(true)
        }
      break;
      case 'view_task_details':
        setModalType(modalName)
        setShowModal(true)
      break;

    }
  }

  const hideModal = () => {
    setModalType(null)
    setShowModal(false)
  }
  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-md-12 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div className="mainSearchbar">
              <div className="flex-grow-1 position-static">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-transparent border-0 srchInput"><img src="assets/img/gbl.gif" alt="" /></span>
                  </div>
                  <input type="text" name="" placeholder="Search task name, project name, Task ID, username…" className="form-control border-0 pl-0" />
                </div>
              </div>
              <div className="invisible">
                <input type="text" className="form-control border-0" name="date" placeholder="Select Date" />
                <i className="fa fa-calendar"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-md-3">
            <div className="card card_shadow border-0">

              <div className="card-body p-0">
                <ul className="list-unstyled list-group">
                  <li className="list-group-item active"><a href="#" className="list-gro">Authantication</a></li>
                  <li className="list-group-item"><a href="#">Authourization</a></li>
                  <li className="list-group-item"><a href="#">End Point</a></li>
                  <li className="list-group-item"><a href="#">Access Control</a></li>

                </ul>
              </div>

            </div>
          </div> */}
          <div className="col-md-12">
            <div className="card card_shadow border-0">
              {/* <div className="card-header bg-pink border-0">
                <h4 className="mb-0">Authantication</h4>
              </div> */}
              <div className="card-body ">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody><tr>
                      <th>Task ID</th>
                      <th>Evidence Type.</th>
                      <th>File Name</th>
                      <th>Uploaded By</th>
                      <th>Uploaded On</th>
                      <th>Action</th>
                    </tr>
                      {evidences && evidences.length > 0 && evidences.map((evidence, eIndex) => {
                        return (
                          <tr key={eIndex} className="odd">
                            <td><span className="link_url text_underline" onClick={() => getTaskDetails(evidence.project_task_id)}>{evidence.project_task_id}</span></td>
                            <td>{evidence.evidence_type}</td>
                            <td>{evidence.file_name}</td>
                            <td>{evidence.uploaded_by}</td>
                            <td>{evidence.uploaded_on}</td>
                            <td>
                              <span className="link_url" onClick={() => showModal('view_documents', evidence)}><i className="fa fa-eye"></i></span>
                              <span className="ml-2 link_url" onClick={() => downloadFile(evidence)}><i className="fa fa-download"></i></span>
                              {/* <span className="ml-2 link_url" onClick={() => {}}><i className="fa fa-download"></i></span> */}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody></table>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {(() => {
        if (modalType && modalType != '' && modalType != null) {
          if (modalType == 'view_documents') {
            return <AirModal
              show={openModal}
              modalType={modalType}
              hideModal={hideModal}
              modalData={{ viewFile: viewFile, fileType: fileType }}
              formSubmit={() => { }} />
          }
        }
        if (modalType && modalType != '' && modalType != null) {
          if (modalType == 'view_task_details') {
            return <AirModal
              show={openModal}
              modalType={modalType}
              hideModal={hideModal}
              modalData={{taskDetails}}
              formSubmit={() =>{}} />
          } 
        }
      })()}

      
    </>
  )
}

export default EvidenceManager