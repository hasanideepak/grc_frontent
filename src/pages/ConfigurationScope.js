import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie, decryptData } from "../helpers/Helper";
import { Link, useNavigate, useParams } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
const ConfigurationScope = (props) => {
  const { token = '' } = useParams()
  // console.log(token)
  const orgId = props?.user?.currentUser?.org_id || 0;
  const projectId = Number(token);
  // const projectId = 1;
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
          peoples: res.peoples,
          technology_assets: res.technology_assets,
          third_party_utilities: res.third_party_utilities,
          vendors: res.vendors,
        }
        //set accounts if added

        /* add to framework list if selected */
        let tmpUtilityList = [];
        obj.third_party_utilities && obj.third_party_utilities.map(utility => {
          if (utility.is_selected == "Y") {
            tmpUtilityList.push(utility.id)
          }
        })
        setUtilitiesList(tmpUtilityList)

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
    let empInput = document.getElementById("empInput");
    let consultantInput = document.getElementById("consultantInput");
    let employees = empInput.value
    let consultants = consultantInput.value
    if (!employees || !consultants) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!employees) {
        formRes['error']['employees'] = { required: true, msg: "Employee is required!" }
      }
      if (!consultants) {
        formRes['error']['consultants'] = { required: true, msg: "Consultant is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addPeople"
    let method = "POST";
    let formData = { employees: employees, consultants: consultants, project_id: projectId }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })

      // empInput.value = ""
      // consultantInput.value = ""
      formRes = { status: true, err_status: false, type: "people", error: {}, msg: "People added successfully" }
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
    let endPointInput = document.getElementById("epInput");
    let serversInput = document.getElementById("serverInput");
    let mobDevicesInput = document.getElementById("mdInput");
    let endpoints = endPointInput.value
    let servers = serversInput.value
    let mobileDevices = mobDevicesInput.value
    if (!endpoints || !servers || !mobileDevices) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!endpoints) {
        formRes['error']['endPoints'] = { required: true, msg: "End point is required!" }
      }
      if (!servers) {
        formRes['error']['servers'] = { required: true, msg: "Server is required!" }
      }
      if (!mobileDevices) {
        formRes['error']['mobileDevices'] = { required: true, msg: "Mobile Device is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addTechnologyAssets"
    let method = "POST";
    let formData = { endpoints: endpoints, servers: servers, mobile_devices: mobileDevices, project_id: projectId }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      // endPointInput.value = ""
      // serversInput.value = ""
      formRes = { status: true, err_status: false, type: "techAssets", error: {}, msg: "Asset added successfully" }
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
    let vendorInput = document.getElementById("vendorInput");
    let vendor = vendorInput.value
    if (!vendor) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!vendor) {
        formRes['error']['vendor'] = { required: true, msg: "Vandor name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/addVendor"
    let method = "POST";
    let formData = { vendor: vendor, project_id: projectId}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      fetchInfo("all")
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

  const delVendor = async (index = null) => {
    if (index == null) {
      return false;
    }
    let delVendor = getAllScopes.vendors[index]
    console.log(delVendor)
    let payloadUrl = `configuration/deleteVendorById/${delVendor.id}`
    let method = "DELETE";
    let formData = {}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      fetchInfo("all")
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }

  const createThirdPartyUtility = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let utilityInput = document.getElementById("utilityInput");
    let utility = utilityInput.value
    if (!utility) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!utility) {
        formRes['error']['utility'] = { required: true, msg: "utility name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/createThirdPartyUtility"
    let method = "POST";
    let formData = { utility_name: utility, project_id: projectId}
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      // let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      // setAccountsList(oldVal => {
      //   return [...accListArr]
      // })
      fetchInfo("tpUtilites")
      utilityInput.value = ""
      formRes = { status: true, err_status: false, type: "utility", error: {}, msg: "Utility added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "utility"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }

  const addToUtilityList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllScopes.third_party_utilities[index]) {
      return
    }

    let id = getAllScopes.third_party_utilities[index].id
    let tempArr = addUtilitiesList;
    tempArr.push(id)
    setUtilitiesList(oldVal => {
      return [...tempArr]
    })
    console.log(addUtilitiesList)

  }
  const removeFromUtilityList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllScopes.third_party_utilities[index]) {
      return
    }

    let id = getAllScopes.third_party_utilities[index].id
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
    // if (addUtilitiesList.length == 0) {
    //   return false;
    // }
    let payloadUrl = "configuration/addThirdPartyUtilities"
    let method = "POST";
    let formData = { project_id: projectId, utility_ids: addUtilitiesList }
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
                <OverlayTrigger
                  key={"right"}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      Tooltip for <strong>People</strong>.
                    </Tooltip>
                  }
                >
                  <span className="info_icon d-inline-block ml-1"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                </OverlayTrigger>
                {getAllScopes && getAllScopes.peoples && getAllScopes.peoples.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>

            </div>
            <div className="ml-auto action_item">
              <a onClick={() => addPeople()} className="btn btn-primary btn-sm">Save</a>
            </div>
          </div>
          <div id="cp1" className="collapse show" data-parent="#accordion" >
            <div className="card-body">
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Employees:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Employees" id="empInput" defaultValue={ getAllScopes.peoples && getAllScopes?.peoples[0]?.employees ? getAllScopes?.peoples[0]?.employees : '' } />
                  {
                    formRes.err_status && formRes.error?.employees?.required
                      ? <div className="text-danger"><div>{formRes.error?.employees?.msg}</div> </div>
                      : ''
                  }
                </div>
                <div className="form-group col-md-6 formInline" >
                  <label htmlFor="" className="pl-xl-5">Consultant:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Consultant" id="consultantInput" defaultValue={ getAllScopes.peoples &&  getAllScopes?.peoples[0]?.consultants ? getAllScopes?.peoples[0]?.consultants : '' }/>
                  {
                    formRes.err_status && formRes.error?.consultants?.required
                      ? <div className="text-danger"><div>{formRes.error?.consultants?.msg}</div> </div>
                      : ''
                  }
                </div>
              </div>
              <div className="row">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "people" && formRes.error?.msg
                    ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "people" && formRes.msg
                    ? <div className="text-success"><div>{formRes.msg}</div> </div>
                    : ''
                }
              </div>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="d-flex align-items-center">
            <div className="card-header collapsed flex-grow-1" data-toggle="collapse" data-parent="#accordion" href="#cp2">
              <a className="card-title">
                Technology Assets
                <OverlayTrigger
                  key={"right"}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      Tooltip for <strong>Technology Assets</strong>.
                    </Tooltip>
                  }
                >
                  <span className="info_icon d-inline-block ml-1"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                </OverlayTrigger>
                {getAllScopes && getAllScopes.technology_assets && getAllScopes.technology_assets.length > 0 && (getAllScopes.technology_assets[0].endpoints)
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            <div className="ml-auto action_item">
              <a onClick={() => addTechnologyAssets()} className="btn btn-primary btn-sm">Save</a>
            </div>
          </div>
          <div id="cp2" className="collapse" data-parent="#accordion" >
            <div className=" p-3">
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Endpoints:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Endpoints" id="epInput" defaultValue={ getAllScopes.technology_assets && getAllScopes?.technology_assets[0].endpoints ? getAllScopes?.technology_assets[0]?.endpoints : '' } />
                  {
                    formRes.err_status && formRes.error?.endPoints?.required
                      ? <div className="text-danger"><div>{formRes.error?.endPoints?.msg}</div> </div>
                      : ''
                  }
                </div>
                <div className="form-group col-md-6 formInline" >
                  <label htmlFor="" className="pl-xl-5">Servers:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Servers" id="serverInput" defaultValue={ getAllScopes.technology_assets && getAllScopes?.technology_assets[0].servers ? getAllScopes?.technology_assets[0]?.servers : '' } />
                  {
                    formRes.err_status && formRes.error?.servers?.required
                      ? <div className="text-danger"><div>{formRes.error?.servers?.msg}</div> </div>
                      : ''
                  }
                </div>
              </div>
              <div className="row">
                <div className="form-group col-md-6 formInline">
                  <label htmlFor="">Mobile Devices:</label>
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Mobile Devices" id="mdInput" defaultValue={ getAllScopes.technology_assets && getAllScopes?.technology_assets[0].mobile_devices ? getAllScopes?.technology_assets[0]?.mobile_devices : '' } />
                  {
                    formRes.err_status && formRes.error?.mobileDevices?.required
                      ? <div className="text-danger"><div>{formRes.error?.mobileDevices?.msg}</div> </div>
                      : ''
                  }
                </div>
              </div>
              <div className="row">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "techAssets" && formRes.error?.msg
                    ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "techAssets" && formRes.msg
                    ? <div className="text-success"><div>{formRes.msg}</div> </div>
                    : ''
                }
              </div>
            </div>

          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp3">
            <a className="card-title">
              Vendors/Service providers
              <OverlayTrigger
                  key={"right"}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      Tooltip for <strong>Vendors/Service providers</strong>.
                    </Tooltip>
                  }
                >
                  <span className="info_icon d-inline-block ml-1"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                </OverlayTrigger>
                {getAllScopes && getAllScopes.vendors && getAllScopes.vendors.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
            </a>
          </div>
          <div id="cp3" className="collapse bg-pink" data-parent="#accordion" >
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className=" mr-2 w-50">
                  <input type="text" className="form-control pl-0" placeholder="Enter Name" id="vendorInput" />
                  {
                    formRes.err_status && formRes.error?.vendor?.required
                      ? <div className="text-danger"><div>{formRes.error?.vendor?.msg}</div> </div>
                      : ''
                  }
                </div>
                <div ><a onClick={() => addVendor()} className=" info"> <img src="/assets/img/gbl.svg" alt="" className="plus" /> </a></div>
              </div>
              <div className="row m-0">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "vendor" && formRes.error?.msg
                    ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "vendor" && formRes.msg
                    ? <div className="text-success"><div>{formRes.msg}</div> </div>
                    : ''
                }
              </div>
            </div>
            <div className="search_result bg-white ">
              {getAllScopes && getAllScopes?.vendors && getAllScopes?.vendors.length > 0 && getAllScopes?.vendors.map((vendor, vIndex) => {
                return (
                  <div ey={vIndex} className=" px-3">
                    <div className="flex-grow-1 ml-lg-3 ml-md-0 ">{vendor.vendor}</div>
                    <div className="mr-lg-3 mr-0"><a onClick={() => delVendor(vIndex)}> <img src="/assets/img/gbl.svg" alt="" className="cls" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp4">
            <a className="card-title">
              SaaS/Third Party Utility
              <OverlayTrigger
                  key={"right"}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      Tooltip for <strong>SaaS/Third Party Utility</strong>.
                    </Tooltip>
                  }
                >
                  <span className="info_icon d-inline-block ml-1"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                </OverlayTrigger>
                {getAllScopes && getAllScopes.third_party_utilities && getAllScopes?.third_party_utilities.filter(util => util.is_selected == "Y").length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
            </a>
          </div>
          <div className="ml-auto action_item mt-2">
              <a onClick={() => addThirdPartyUtilities()} className="btn btn-primary btn-sm">Save</a>
            </div>
          <div id="cp4" className="collapse bg-pink" data-parent="#accordion" >
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className=" mr-2 w-50">
                  <input type="text" className="form-control" placeholder="Enter Name"  id="utilityInput" />
                  {
                    formRes.err_status && formRes.error?.utility?.required
                      ? <div className="text-danger"><div>{formRes.error?.utility?.msg}</div> </div>
                      : ''
                  }
                </div>
                <div ><a onClick={() => createThirdPartyUtility()} className=" info"> <img src="/assets/img/gbl.svg" alt="" className="plus" /> </a></div>
              </div>
              <div className="row m-0">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "utility" && formRes.error?.msg
                    ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "utility" && formRes.msg
                    ? <div className="text-success"><div>{formRes.msg}</div> </div>
                    : ''
                }
              </div>
            </div>
            <div className="search_result bg-white ">
              <ul className="list-unstyled">

                {tpUtilities && tpUtilities.length > 0 && tpUtilities.map((utility, uIndex) => {
                  return (
                    <li key={uIndex}>
                      <div className=" ml-lg-3 ml-md-0 ">
                        <input type="checkbox" id={`f${uIndex + 1}`} defaultChecked={utility.is_selected == 'Y'} onClick={(e) => e.target.checked ? addToUtilityList(e, uIndex) : removeFromUtilityList(e, uIndex)} />
                      </div>
                      <img src="/assets/img/utility.svg" alt="" className="p-1" />
                      <label className="mb-0 f-12" htmlFor={`f${uIndex + 1}`}>{utility.name}</label>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp5">
            <a className="card-title">
              Asset Register
              <OverlayTrigger
                  key={"right"}
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-right`}>
                      Tooltip for <strong>Assets</strong>.
                    </Tooltip>
                  }
                >
                  <span className="info_icon d-inline-block ml-1"><i className="fa fa-info-circle" aria-hidden="true"></i></span>
                </OverlayTrigger>
                {getAllScopes && getAllScopes.peoples && getAllScopes.peoples.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
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