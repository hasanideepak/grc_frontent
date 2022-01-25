import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie, decryptData } from "../helpers/Helper";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
const ConfigurationScope = (props) => {
  const {token = ''} = useParams()
  // console.log(token)
  const orgId = props?.user?.currentUser?.org_id || 0;
  // const projectId = decryptData(token).project_id || 0;
  const projectId = 1;
  const [getAllScopes, setAllScopes] = useState({})
  const [accountsList, setAccountsList] = useState(null)
  const [addUtilitiesList, setUtilitiesList] = useState([])

  const [tpUtilities, setUtilities] = useState([])
  const [tpServices, setTpServices] = useState([])
  const [selectedTPS, setSelTPS] = useState([])
  const [memberRoles, setMemberRoles] = useState([])
  const [ownerRoles, setOwnerRoles] = useState([])
  const [members, setMembers] = useState([])
  const [servicePartners, setServicePartners] = useState([])
  const [taskOwners, setTaskOwners] = useState([])
  const [tpsAccessTokens, setAccessToken] = useState([])
  const navigate = useNavigate()

  // const { register, handleSubmit, watch, formState: { errors } } = useForm(); // initialize the hook
  const [formSubmitted, setFormSbmt] = useState(false)
  const [formRes, setFormRes] = useState({ status: false, err_status: false, error: {} })
  const [errorMsg, setErrorMsg] = useState(false);
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  useEffect(() => {
    // if (frameWorks.length == 0) {
    //   fetchInfo("frameworks")
    // }
    if (Object.keys(getAllScopes).length == 0) {
      fetchInfo("all")
    }
    if (tpUtilities.length == 0) {
      fetchInfo("tpUtilites")
    }
    // if (tpServices.length == 0) {
    //   fetchInfo("get_tps")
    // }


  }, [])

  const getThirdPartySefvice = () => {
    let tpsArr = [{ id: 1, name: "AWS" }]
    setTpServices(oldVal => {
      return [...tpsArr]
    })
  }

  const fetchInfo = async (type = '') => {
    if (type == '') {
      return false
    };

    let payloadUrl = ""
    let method = "POST";
    let formData = {};

    if (type == 'all') {
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/configuration/getConfiguration/15/2/2
      payloadUrl = `configuration/getScopeDetails/${projectId}`
      method = "GET";
    }
    else if (type == 'tpUtilites') {
      payloadUrl = `configuration/getThirdPartyUtilities/${projectId}`
      method = "GET";
    }

    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      if (type == 'all') {
        let obj = {
          accounts_and_projects: res.accounts_and_projects,
          frameWorks: res.frameworks,
          keymembers: res.keymembers,
          service_partners: res.service_partners,
          task_owners: res.task_owners,
          third_party_connectors: res.third_party_connectors,
        }
        //set accounts if added

        /* add to framework list if selected */
        let tmpFrmwrkList = [];
        obj.frameWorks && obj.frameWorks.map(frmwrk => {
          if (frmwrk.is_selected == "Y") {
            tmpFrmwrkList.push(frmwrk.id)
          }
        })
        setUtilitiesList(tmpFrmwrkList)

        setTimeout(() => {
          setAllScopes(oldVal => {
            return { ...obj }
          })
        }, 100);


        console.log(obj)
      }
      else if (type == "tpUtilites") {
        setUtilities(oldVal => {
          return [...res.results]
        })
      }
    }
  }
  
  const addPeople = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let empInput = document.getElementById("accName");
    let consultantInput = document.getElementById("accProject");
    let employees = empInput.value
    let consultants = consultantInput.value
    if (!employees || !consultants) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!employees) {
        formRes['error']['account_name'] = { required: true, msg: "Account name is required!" }
      }
      if (!consultants) {
        formRes['error']['project_name'] = { required: true, msg: "Project name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addPeople"
    let method = "POST";
    let formData = { employees: employees, consultants: consultants, project_id:1}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      empInput.value = ""
      consultantInput.value = ""
      formRes = { status: true, err_status: false, type: "people", error: {}, msg: "Account added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "people"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }
  const addTechnologyAssets = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let endPointInput = document.getElementById("accName");
    let serversInput = document.getElementById("accProject");
    let mobDevicesInput = document.getElementById("accProject");
    let endpoints = endPointInput.value
    let servers = serversInput.value
    let mobileDevices = mobDevicesInput.value
    if (!endpoints || !servers || !mobileDevices) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!endpoints) {
        formRes['error']['account_name'] = { required: true, msg: "Account name is required!" }
      }
      if (!servers) {
        formRes['error']['project_name'] = { required: true, msg: "Project name is required!" }
      }
      if (!mobileDevices) {
        formRes['error']['project_name'] = { required: true, msg: "Project name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addTechnologyAssets"
    let method = "POST";
    let formData = { endpoints: endpoints, servers: servers,mobile_devices:mobileDevices, project_id:1}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      endPointInput.value = ""
      serversInput.value = ""
      formRes = { status: true, err_status: false, type: "techAssets", error: {}, msg: "Account added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "techAssets"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }

  const addVendor = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let vendorInput = document.getElementById("accName");
    let vendor = vendorInput.value
    if (!vendor) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!vendor) {
        formRes['error']['account_name'] = { required: true, msg: "Account name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addVendor"
    let method = "POST";
    let formData = { vendor: vendor, project_id:1}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      vendorInput.value = ""
      formRes = { status: true, err_status: false, type: "vendor", error: {}, msg: "Vendor added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "vendor"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }

  const addToFrameWorkList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllScopes.frameWorks[index]) {
      return
    }

    let id = getAllScopes.frameWorks[index].id
    let tempArr = addUtilitiesList;
    tempArr.push(id)
    setUtilitiesList(oldVal => {
      return [...tempArr]
    })
    console.log(addUtilitiesList)

  }
  const removeFromFrameworkList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllScopes.frameWorks[index]) {
      return
    }

    let id = getAllScopes.frameWorks[index].id
    let tempArr = addUtilitiesList;
    let tempArrIndex = tempArr.indexOf(id)
    tempArr.splice(tempArrIndex, 1)
    setUtilitiesList(oldVal => {
      return [...tempArr]
    })
  }

  const addThirdPartyUtilities = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    if (addUtilitiesList.length == 0) {
      return false;
    }
    let payloadUrl = "configuration/addThirdPartyUtilities"
    let method = "POST";
    let formData = { project_id: projectId, framework_ids: addUtilitiesList }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      formRes = { status: true, err_status: false, error: {}, type: "util", msg: "Framework added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "util"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }
  
  const clearData = (type = null) => {
    if (type == null) {
      return false;
    }
    if (type == "access_token") {
      let tokenInput = document.getElementById("tpsAccessToken")
      tokenInput.value = ""
    }
  }

  const delToken = (index = null) => {
    if (index == null) {
      return false;
    }
    let tempArr = [];
    for (let atIndex in tpsAccessTokens) {
      if (index == atIndex) {
        continue
      }
      tempArr.push(tpsAccessTokens[atIndex])
    }
    setAccessToken(oldVal => {
      return [...tempArr]
    })
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div id="accordion" className="accordion pl-lg-3 pr-lg-3 accordianSec profileSec">
        <div className="card">
          <div className="d-flex align-items-center">
            <div className="card-header flex-grow-1" data-toggle="collapse" href="#cp1">
              <a className="card-title">
                People
              </a>

            </div>
            <div className="ml-auto action_item">
              <a href="javascript:void(0)" className="btn btn-primary btn-sm">Save</a>
            </div>
          </div>
          <div id="cp1" className="collapse show" data-parent="#accordion" >
            <div className="card-body">
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Employees:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Employees" />
                </div>
                <div className="form-group col-md-6 formInline" >
                  <label htmlFor="" className="pl-xl-5">Consultant:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Consultant" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="d-flex align-items-center">
            <div className="card-header collapsed flex-grow-1" data-toggle="collapse" data-parent="#accordion" href="#cp2">
              <a className="card-title">
                Technology Assets
              </a>
            </div>
            <div className="ml-auto action_item">
              <a href="javascript:void(0)" className="btn btn-primary btn-sm">Save</a>
            </div>
          </div>
          <div id="cp2" className="collapse" data-parent="#accordion" >
            <div className=" p-3">
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Endpoints:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Endpoints" />
                </div>
                <div className="form-group col-md-6 formInline" >
                  <label htmlFor="" className="pl-xl-5">Servers:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Servers" />
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Mobile Devices:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Mobile Devices" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp3">
            <a className="card-title">
              Vendors/Service providers
            </a>
          </div>
          <div id="cp3" className="collapse bg-pink" data-parent="#accordion" >
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className=" mr-2 w-50"><input type="text" className="form-control pl-0" placeholder="Enter Name" /></div>
                <div ><a href="javascript:void(0)" className=" info"> <img src="assets/img/gbl.gif" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">martin_guptill598@icloud.com</div>
                <div className="mr-lg-3 mr-0"><a href="#"> <img src="assets/img/gbl.gif" alt="" className="cls" />  </a></div>
              </div>
              <div className="px-3">
                <div className="flex-grow-1 ml-lg-3">pete_davidson_vagas@gmail.com</div>
                <div className="mr-lg-3 mr-0"><a href="#"> <img src="assets/img/gbl.gif" alt="" className="cls" />  </a></div>
              </div>
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3">sohan.parker@yahoo.com</div>
                <div className="mr-lg-3 mr-0"><a href="#"> <img src="assets/img/gbl.gif" alt="" className="cls" />  </a></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp4">
            <a className="card-title">
              SaaS/Third Party Utility
            </a>
          </div>
          <div id="cp4" className="collapse bg-pink" data-parent="#accordion" >
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className=" mr-2 w-50"><input type="text" className="form-control" placeholder="Enter Name" /></div>
                <div ><a href="javascript:void(0)" className=" info"> <img src="assets/img/gbl.gif" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <ul className="list-unstyled">
                <li >
                  <div className=" ml-lg-3 ml-md-0 ">
                    <input type="checkbox" id="j1" />
                  </div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" htmlFor="j1">Jira 1 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 ">
                    <input type="checkbox" id="j2" />
                  </div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" htmlFor="j2">Jira 2 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j3" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" htmlFor="j3">Jira 3 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j4" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" htmlFor="j4">Jira 4 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j5" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" htmlFor="j5">Jira 5 </label>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp5">
            <a className="card-title">
              Asset Register
            </a>
          </div>
          <div id="cp5" className="collapse" data-parent="#accordion" >
            <div className="p-3 d-flex justify-content-between">
              <div className="d-flex align-items-center">
                <p className="mb-0 gLbl">Download the sample file from here.</p>
                <a download="" href="https://docs.google.com/uc?export=download&id=1twQkxo-BIQ-Fv98rJVe_tqAXpLwHsvjP"><img src="assets/img/excel.svg" alt="" /></a>
              </div>
              <div className="d-flex justify-content-end yrscpe">
                <label className="btn btn-outline-primary btn-sm" htmlFor="uploadOption">Upload</label>
                <input type="file" id="uploadOption" className="d-none" />
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-end yrscpe">
          <a href="#" className="btn btn-primary submitBtn btn-lg">Submit</a>
        </div>
      </div>
    </>
  )
}

export default ConfigurationScope