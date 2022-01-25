import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie, encryptData } from "../helpers/Helper";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
const Configuration = (props) => {
  const orgId = props?.user?.currentUser?.org_id || 0;
  const [getAllConfigs, setAllConfigs] = useState({})
  const [accountsList, setAccountsList] = useState(null)
  const [addFrameWorksList, setAddFrameWorksList] = useState([])

  const [frameWorks, setFrameWorks] = useState([])
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
    if(Object.keys(getAllConfigs).length == 0){
      fetchInfo("all")
    }
    if (memberRoles.length == 0) {
      fetchInfo("member_roles")
    }
    if (ownerRoles.length == 0) {
      fetchInfo("owner_roles")
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

    if(type == 'all'){
      // https://zp5ffmsibc.us-east-1.awsapprunner.com/configuration/getConfiguration/15/2/2
      payloadUrl = `configuration/getConfiguration/${orgId}`
      method = "GET";
    }
    // else if (type == 'frameworks') {
    //   payloadUrl = 'reference/getFrameworks'
    //   method = "GET";
    // }
    else if (type == 'member_roles') {
      payloadUrl = 'reference/getAuthorities/Y'
      method = "GET";
    }else if (type == 'owner_roles') {
      payloadUrl = 'reference/getAuthorities/N'
      method = "GET";
    }
    // else if (type == 'get_tps') {
    //   payloadUrl = 'reference/getThirdPartyConnectors'
    //   method = "GET";
    // }

    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      if(type == 'all'){
        let obj = {
          accounts_and_projects:res.accounts_and_projects,
          frameWorks:res.frameworks,
          keymembers:res.keymembers,
          service_partners:res.service_partners,
          task_owners:res.task_owners,
          third_party_connectors:res.third_party_connectors,
        }
        //set accounts if added

        setAccountsList(obj.accounts_and_projects)
        // add key members
        obj.keymembers && obj.keymembers.length > 0 && setMembers(obj.keymembers)
        // add service partners
        obj.service_partners && obj.service_partners.length > 0 && setServicePartners(obj.service_partners)
        // add stask owners
        obj.task_owners && obj.task_owners.length > 0 && setTaskOwners(obj.task_owners)

        //set third party connectors
        setTpServices(oldVal => {
          return [...obj.third_party_connectors]
        })
        let tmpSelectedTPS = [];
        obj.third_party_connectors && obj.third_party_connectors.filter(tps =>{
          if(tps.is_selected == "Y"){
            tmpSelectedTPS.push(tps.id)
          }
        })
        setSelTPS(tmpSelectedTPS)
          /* add to framework list if selected */
          let tmpFrmwrkList = [];
          obj.frameWorks && obj.frameWorks.map(frmwrk =>{
            if(frmwrk.is_selected == "Y"){
              tmpFrmwrkList.push(frmwrk.id)
            }
          })
          setAddFrameWorksList(tmpFrmwrkList)

        setTimeout(() => {
          setAllConfigs(oldVal => {
            return {...obj}
          })
        }, 100);

        
        console.log(obj)
      }
      // else if(type == "frameworks") {
      //   setFrameWorks(oldVal => {
      //     return [...res.results]
      //   })
      // }
      else if(type == "member_roles") {
        setMemberRoles(oldVal => {
          return [...res.results]
        })
      }else if (type == "owner_roles") {
        setOwnerRoles(oldVal => {
          return [...res.results]
        })
      }
      // else if (type == "get_tps") {
      //   setTpServices(oldVal => {
      //     return [...res.results]
      //   })
      // }
    }
  }
  const onSubmit = async (...data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    if (data.password) {
      let md5Pass = crypto.createHash('md5').update(data.password).digest('hex');
      data.password = md5Pass
    }
    let payload = data
    payload.type = "login"
    payload.url = "auth/login"
    let res = await ApiService.post(payload.type, payload, Configuration);
    if (res && res.message == "Success") {
      SetCookie('currentUser', JSON.stringify(res.results))
      navigate('/home')
    }
  }

  const addAccount = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    let accInput = document.getElementById("accName");
    let accProjectInput = document.getElementById("accProject");
    let accName = accInput.value
    let accProject = accProjectInput.value
    if (!accName || !accProject) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if(!accName){
        formRes['error']['account_name'] = {required:true,msg:"Account name is required!"}
      }
      if(!accProject){
        formRes['error']['project_name'] = {required:true,msg:"Project name is required!"}
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/setupAccount"
    let method = "POST";
    let formData = { account_name: accName, project_name: accProject, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if(res && res.message == "Success") {
      let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      setAccountsList(oldVal => {
        return [...accListArr]
      })
      accInput.value = ""
      accProjectInput.value = ""
      formRes = {status:true,err_status:false,type:"account",error:{},msg:"Account added successfully"}
      setFormRes(formRes)
    }else{
      formRes['err_status'] = true
      formRes['error']['type'] = "account"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
      setFormRes(formRes)
    }, 3000);

  }

  const addToFrameWorkList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllConfigs.frameWorks[index]) {
      return
    }

    let id = getAllConfigs.frameWorks[index].id
    let tempArr = addFrameWorksList;
    tempArr.push(id)
    setAddFrameWorksList(oldVal => {
      return [...tempArr]
    })
    console.log(addFrameWorksList)

  }
  const removeFromFrameworkList = (ev = null, index = null) => {
    if (ev == null || index == null || !getAllConfigs.frameWorks[index]) {
      return
    }

    let id = getAllConfigs.frameWorks[index].id
    let tempArr = addFrameWorksList;
    let tempArrIndex = tempArr.indexOf(id)
    tempArr.splice(tempArrIndex, 1)
    setAddFrameWorksList(oldVal => {
      return [...tempArr]
    })
  }

  const addProjectFramework = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    // if (addFrameWorksList.length == 0) {
    //   return false;
    // }
    let payloadUrl = "configuration/addProjectFrameworks"
    let method = "POST";
    // let frmwrkIds = addFrameWorksList.map(({ id }) => id)
    let formData = { project_id: accountsList[0].project_id, framework_ids: addFrameWorksList }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let obj = getAllConfigs;
      obj.frameWorks && obj.frameWorks.map(frameWork =>{
          frameWork.is_selected = addFrameWorksList.includes(frameWork.id) ? "Y" : "N"
      })
      setAllConfigs(obj)
      formRes = {status:true,err_status:false,error:{},type:"framework",msg:"Framework added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "framework"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
      setFormRes(formRes)
    }, 3000);

  }
  const addMember = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    let memEmailInput = document.getElementById("memberEmail")
    let memRoleInput = document.getElementById("memberRole")
    let memEmail = memEmailInput.value
    let memRole = memberRoles[memRoleInput.value]
    console.log(memberRoles,memRoleInput.value)
    console.log(memEmail,memRole)
    if (!memEmail || !memRole) {
      formRes['err_status'] = true
      if(!memEmail){
        formRes['error']['memberEmail'] = {required:true,msg:"Email is required!"}
      }
      if(!memRole){
        formRes['error']['memberRole'] = {required:true,msg:"Role is required!"}
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addKeyMember"
    let method = "POST";
    let formData = { email: memEmail, department_name: memRole.name, authority_id: memRole.id, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let memListArr = Object.assign([], members);
      let memObj ={emp_id:res.emp_id,email:formData.email,department_name:formData.department_name}
      memListArr.push(memObj)
      setMembers(oldVal => {
        return [...memListArr]
      })
      memEmailInput.value = ""
      memRoleInput.value = ""
      formRes = {status:true,err_status:false,error:{},type:"member",msg:"Member added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "member"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
      setFormRes(formRes)
    }, 3000);
  }
  const delMember = async (index = null) => {
    if (index == null) {
      return false;
    }
    let delMem = members[index]
    console.log(delMem)
    let payloadUrl = "configuration/deleteKeyMember"
    let method = "DELETE";
    let formData = { emp_id: delMem.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = members;
      tempArr.splice(index,1)
      setMembers(oldVal => {
        return [...tempArr]
      })
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }

  const addPartner = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    let partnerFnInput = document.getElementById("partnerFullname")
    let partnerEmailInput = document.getElementById("partnerEmail")
    let partnerFn = partnerFnInput.value
    let partnerEmail = partnerEmailInput.value
    if (!partnerFn || !partnerEmail) {
      formRes['err_status'] = true
      if(!partnerEmail){
        formRes['error']['partnerEmail'] = {required:true,msg:"Email is required!"}
      }
      if(!partnerFn){
        formRes['error']['partnerFullname'] = {required:true,msg:"Fullname is required!"}
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addServicePartner"
    let method = "POST";
    let formData = { full_name: partnerFn, email: partnerEmail, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], servicePartners);
      let partnerObj = {emp_id:res.emp_id,partner_id:res.partner_id,email:formData.email,full_name:formData.full_name}
      listArr.push(partnerObj)
      setServicePartners(oldVal => {
        return [...listArr]
      })
      partnerFnInput.value = ""
      partnerEmailInput.value = ""
      formRes = {status:true,err_status:false,error:{},type:"partner",msg:"Member added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "partner"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
      setFormRes(formRes)
    }, 3000);

  }
  const delPartner = async (index = null) => {
    if (index == null) {
      return false;
    }

    let delPartner = servicePartners[index]
    console.log(delPartner)
    let payloadUrl = "configuration/deleteServicePartner"
    let method = "DELETE";
    let formData = { emp_id: delPartner.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = servicePartners;
      tempArr.splice(index,1)
      setServicePartners(oldVal => {
        return [...tempArr]
      })
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }

  const addTaskOwner = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    let toFnInput = document.getElementById("toFirstname")
    let toLnInput = document.getElementById("toLastname")
    let toEmailInput = document.getElementById("toEmail")
    let oRoleInput = document.getElementById("ownerRole")
    let toFn = toFnInput.value
    let toLn = toLnInput.value
    let toEmail = toEmailInput.value
    let oRole = ownerRoles[oRoleInput.value]
    if (!toFn || !toLn || !toEmail || !oRole) {
      formRes['err_status'] = true
      if(!toFn){
        formRes['error']['ownerFirstName'] = {required:true,msg:"Firstname is required!"}
      }
      if(!toLn){
        formRes['error']['ownerLastName'] = {required:true,msg:"Lastname is required!"}
      }
      if(!toEmail){
        formRes['error']['ownerEmail'] = {required:true,msg:"Email is required!"}
      }
      if(!oRole){
        formRes['error']['ownerRole'] = {required:true,msg:"Role is required!"}
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addTaskOwner"
    let method = "POST";
    let formData = { first_name: toFn, last_name: toLn, email: toEmail,department_name:oRole.name,authority_id:oRole.id, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], taskOwners);
      let toObj = { first_name:formData.first_name,last_name:formData.last_name,email:formData.email,department_name:formData.department_name,emp_id:res.emp_id}
      listArr.push(toObj)
      setTaskOwners(oldVal => {
        return [...listArr]
      })
      toFnInput.value = ""
      toLnInput.value = ""
      toEmailInput.value = ""
      formRes = {status:true,err_status:false,error:{},type:"owner",msg:"Task owner added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "owner"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
      setFormRes(formRes)
    }, 3000);

  }
  const delTaskOwner = async (index = null) => {
    if (index == null) {
      return false;
    }

    let delOwner = taskOwners[index]
    console.log(delOwner)
    let payloadUrl = "configuration/deleteTaskOwner"
    let method = "DELETE";
    let formData = { emp_id: delOwner.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = taskOwners;
      tempArr.splice(index,1)
      setTaskOwners(oldVal => {
        return [...tempArr]
      })
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }
  const onSelectTPS = async (event = null, index = null) => {
    if (index == null) {
      return false;
    }
    let tpsCheckInput = event.target
    let tpsCheck = tpsCheckInput.checked
    let tempArr = selectedTPS;
    // let tempArrIds = tempArr.map(tps => tps.id)
    if (tpsCheck) {
      if (!tempArr.includes(tpServices[index].id)) {
        tempArr.push(tpServices[index].id)
      }
    } else {
      let arrIndex = tempArr.indexOf(tpServices[index].id)
      if (arrIndex != -1) {
        tempArr.splice(arrIndex, 1)
      }
    }
    setSelTPS(oldVal => {
      return [...tempArr]
    })
    console.log(tempArr)


  }

  const addProjectTPS = async () => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    console.log(selectedTPS)
    // if (selectedTPS.length == 0) {
    //   return false;
    // }
    let apiType = selectedTPS.length == 0 ? 'add' : 'update'
    let payloadUrl = "configuration/addThirdPartyConnector"
    let method = "POST";
    let formData = { project_id: accountsList[0].project_id, connector_ids: selectedTPS }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let obj = tpServices || []
      obj.map(service =>{
        service.is_selected = selectedTPS.includes(service.id) ? "Y" : "N"
      })
      console.log(obj)
      setTpServices(obj)
      formRes = {status:true,err_status:false,error:{},msg:"Framework added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }

  const addAccessToken = async() => {
    setFormSbmt(true)
    let formRes = {status:false,err_status:false,error:{}}
    setFormRes(formRes)
    setErrorMsg(false)
    let tokenInput = document.getElementById("tpsAccessToken")
    let tpsSelectInput = document.getElementById("tpsSelectInput")
    let token = tokenInput.value
    let selTPS = tpServices[tpsSelectInput.value]
    if (!token || !selTPS) {
      formRes['err_status'] = true
      if(!token){
        formRes['error']['aTokenValue'] = {required:true,msg:"Access token is required!"}
      }
      if(!selTPS){
        formRes['error']['aTokenService'] = {required:true,msg:"Please select third party service"}
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addThirdPartyConnectorToken"
    let method = "POST";
    let formData = {project_id: accountsList[0].project_id,connector_id:selTPS.id, token: token }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], tpServices);
      listArr[tpsSelectInput.value].is_token_added = "Y"
      listArr[tpsSelectInput.value].token = formData.token;
      setTpServices(listArr)
      tokenInput.value = ""
      tpsSelectInput.value = ""
      formRes = {status:true,err_status:false,error:{},type:"atoken",msg:"Access token added successfully"}
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "atoken"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = {status:false,err_status:false,error:{}}
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
      <div id="accordion" className="accordion pl-lg-3 pr-lg-3 accordianSec">
        <div className="card ">
          <div className="d-flex align-items-center">
            <div className="card-header flex-grow-1" data-toggle="collapse" href="#cp0" aria-expanded="true">
              <a className="card-title">
                Account Setup
                { accountsList && accountsList.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            <div className="ml-auto action_item">
              <a onClick={() => addAccount()} className={`btn btn-primary btn-sm ml-2 ${accountsList && accountsList.length > 0 ? 'd-none' : ''}`} >Save</a>
            </div>
          </div>
          <div id="cp0" className="card-body p-0 collapse show" data-parent="#accordion">

            <div className={`p-lg-3 m-lg-3 p-2 m-2 bg-white rounded ${accountsList && accountsList.length > 0 ? 'd-none' : ''}`}>
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="accName" type="text" className="form-control" placeholder="Enter Account name" disabled={accountsList && accountsList.length > 0} />
                  {
                    formRes.err_status && formRes.error?.account_name?.required
                    ? <div className="text-danger"><div>{formRes.error?.account_name?.msg}</div> </div>
                    : ''
                  }
                  
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="accProject" type="text" className="form-control" placeholder="Enter Project" disabled={accountsList && accountsList.length > 0} />
                  {
                    formRes.err_status && formRes.error?.project_name?.required
                    ? <div className="text-danger"><div>{formRes.error?.account_name?.msg}</div> </div>
                    : ''
                  }
                </div>
                {/* <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div> */}
              </div>
              {
                !formRes.status && formRes.err_status && formRes.error?.type =="account" && formRes.error?.msg
                ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                : ''
              }
              {
                formRes.status && formRes?.type == "account" && formRes.msg
                ? <div className="text-success"><div>{formRes.msg}</div> </div>
                : ''
              }
            </div>
            <div className="search_result bg-white ">
              <div className="px-3 h_labels">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">Account Name</div>
                <div>Project Name </div>
                {/* <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div> */}
              </div>
              {accountsList && accountsList.length > 0 && accountsList.map((account, accIndex) => {
                return (
                  <div key={accIndex} className=" px-3">
                    <div className="flex-grow-1 ml-lg-3 ml-md-0 ">{account.account_name}</div>
                    <div>{account.project_name} </div>
                    {/* <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div> */}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp1" aria-expanded="true">
              <a className="card-title">
                Framework Setup
                { getAllConfigs && getAllConfigs?.frameWorks && getAllConfigs?.frameWorks.filter(frameWork => frameWork.is_selected == "Y").length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            <div className="ml-auto action_item">
              <a onClick={() => addProjectFramework()} className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp1" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  {getAllConfigs && getAllConfigs?.frameWorks && getAllConfigs?.frameWorks.length > 0 && getAllConfigs?.frameWorks.map((frameWork, fwIndex) => {
                    return (
                      <label key={fwIndex} htmlFor={`f${fwIndex + 1}`}>
                        <input type="checkbox" id={`f${fwIndex + 1}`} defaultChecked={frameWork.is_selected == 'Y'} onClick={(e) => e.target.checked ? addToFrameWorkList(e, fwIndex) : removeFromFrameworkList(e, fwIndex)} />
                        <img className="mx-1" src="assets/img/m1.svg" alt="" height="20" width="20" />
                        <span>{frameWork.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card ">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp2" aria-expanded="true">
              <a className="card-title">
                Key Members
                { members && members.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            {/* <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div> */}
          </div>
          <div id="cp2" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-start justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD MEMBER</div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="memberEmail" type="text" className="form-control" placeholder="Email Address" />
                  {
                    formRes.err_status && formRes.error?.memberEmail?.required
                    ? <div className="text-danger"><div>{formRes.error?.memberEmail?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="w-25 mr-2">
                  <select name="" id="memberRole" className="form-control">
                    <option value="">Select Role</option>
                    {memberRoles && memberRoles.length > 0 && memberRoles.map((role, mrIndex) => {
                      return (
                        <option key={mrIndex} value={mrIndex}>{role.name}</option>
                      )
                    })}
                  </select>
                  {
                    formRes.err_status && formRes.error?.memberRole?.required
                    ? <div className="text-danger"><div>{formRes.error?.memberRole?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div><a onClick={() => addMember()} className="info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
              {
                !formRes.status && formRes.err_status && formRes.error?.type =="member" && formRes.error?.msg
                ? <div className="text-danger mt-2"><div>{formRes.error?.msg}</div> </div>
                : ''
              }
              {
                formRes.status && formRes?.type == "member" && formRes.msg
                ? <div className="text-success mt-2"><div>{formRes.msg}</div> </div>
                : ''
              }
            </div>
            <div className="search_result bg-white ">
              <div className="px-3 h_labels">
                <div className="flex-grow-1 ml-lg-3">Email</div>
                <div>Authority </div>
                <div className="mr-lg-3" style={{width:'20px'}}></div>
              </div>
              {members && members.length > 0 && members.map((member, mIndex) => {
                return (
                  <div key={mIndex} className="px-3">
                    <div className="flex-grow-1 ml-lg-3">{member.email}</div>
                    <div>{member.department_name} </div>
                    <div className="mr-lg-3"><a onClick={() => delMember(mIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp3" aria-expanded="true">
              <a className="card-title">
                Invite Service Partners
                { servicePartners && servicePartners.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            {/* <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div> */}
          </div>
          <div id="cp3" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-start justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD PARTNER</div>
                <div className="mr-2 w-75">
                  <input id="partnerFullname" type="text" className="form-control" placeholder="Name" />
                  {
                    formRes.err_status && formRes.error?.partnerFullname?.required
                    ? <div className="text-danger"><div>{formRes.error?.partnerFullname?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="partnerEmail" type="text" className="form-control" placeholder="Email Address" />
                  {
                    formRes.err_status && formRes.error?.partnerEmail?.required
                    ? <div className="text-danger"><div>{formRes.error?.partnerEmail?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div><a onClick={() => addPartner()} className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
              {
                !formRes.status && formRes.err_status && formRes.error?.type =="partner" && formRes.error?.msg
                ? <div className="text-danger mt-2"><div>{formRes.error?.msg}</div> </div>
                : ''
              }
              {
                formRes.status && formRes?.type == "partner" && formRes.msg
                ? <div className="text-success mt-2"><div>{formRes.msg}</div> </div>
                : ''
              }
            </div>
            <div className="search_result bg-white ">
              <div className="px-3 h_labels">
                <div className="flex-grow-1">Name</div>
                <div className="ml-lg-3 ml-md-0">Email </div>
                <div className="mr-lg-3" style={{width:'20px'}}></div>
              </div>
              {servicePartners && servicePartners.length > 0 && servicePartners.map((partner, spIndex) => {
                return (
                  <div key={spIndex} className=" px-3">
                    <div className="flex-grow-1 ">{partner.full_name} </div>
                    <div className="ml-lg-3 ml-md-0 ">{partner.email}</div>
                    <div className="mr-lg-3"><a onClick={() => delPartner(spIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp4" aria-expanded="true">
              <a className="card-title">
                Invite Task Owners
                { taskOwners && taskOwners.length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            {/* <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div> */}
          </div>
          <div id="cp4" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-start justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="toFirstname" type="text" className="form-control" placeholder="Enter Firstname" />
                  {
                    formRes.err_status && formRes.error?.ownerFirstName?.required
                    ? <div className="text-danger"><div>{formRes.error?.ownerFirstName?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="toLastname" type="text" className="form-control" placeholder="Enter Lastname" />
                  {
                    formRes.err_status && formRes.error?.ownerLastName?.required
                    ? <div className="text-danger"><div>{formRes.error?.ownerLastName?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="toEmail" type="text" className="form-control" placeholder="Enter Email Address" />
                  {
                    formRes.err_status && formRes.error?.ownerEmail?.required
                    ? <div className="text-danger"><div>{formRes.error?.ownerEmail?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <select name="" id="ownerRole" className="form-control">
                    <option value="">Select Owner Role</option>
                    {ownerRoles && ownerRoles.length > 0 && ownerRoles.map((role, orIndex) => {
                      return (
                        <option key={orIndex} value={orIndex}>{role.name}</option>
                      )
                    })}
                  </select>
                  {
                    formRes.err_status && formRes.error?.ownerRole?.required
                    ? <div className="text-danger"><div>{formRes.error?.ownerRole?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div><a onClick={() => addTaskOwner()} className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
              {
                !formRes.status && formRes.err_status && formRes.error?.type =="owner" && formRes.error?.msg
                ? <div className="text-danger mt-2"><div>{formRes.error?.msg}</div> </div>
                : ''
              }
              {
                formRes.status && formRes?.type == "owner" && formRes.msg
                ? <div className="text-success mt-2"><div>{formRes.msg}</div> </div>
                : ''
              }
            </div>
            <div className="search_result bg-white ">
              <div className="px-3 h_labels">
                <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0">Firstname</div>
                <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text_color_2 mr-0">Lastname</div>
                <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text-right">Authority</div>
                <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text-right text_color_3 mr-2">Email</div>
                {/* <div className="">Role </div> */}
                <div className="mr-lg-3 w20"></div>
              </div>
              {taskOwners && taskOwners.length > 0 && taskOwners.map((owner, toIndex) => {
                return (
                  <div key={toIndex} className=" px-3">
                    <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 ">{owner.first_name}</div>
                    <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text_color_2 mr-0">{owner.last_name}</div>
                    <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text-right">{owner.department_name}</div>
                    <div className="w-20 flex-grow-1 ml-lg-3 ml-md-0 text-right text_color_3 mr-2">{owner.email}</div>
                    <div className="mr-lg-3 w20"><a onClick={() => delTaskOwner(toIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp5" aria-expanded="true">
              <a className="card-title">
                Third Party Services
                { tpServices && tpServices.filter(tpService => tpService.is_selected == "Y").length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
            <div className="ml-auto action_item">
              <a onClick={()=> addProjectTPS()} className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp5" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  {tpServices && tpServices.length > 0 && tpServices.map((tpService, tpIndex) => {
                    return (
                      <label key={tpIndex} htmlFor={`f${tpIndex + 1}`}>
                        <input type="checkbox" id={`f${tpIndex + 1}`} onClick={(e) => onSelectTPS(e, tpIndex)} defaultChecked={tpService.is_selected == "Y"} />
                        <img className="mx-1" src="assets/img/aws.jpeg" alt="" height="20" width="20" />
                        <span>{tpService.name}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="d-flex align-items-center">
            <div className={`card-header flex-grow-1 collapsed`} data-toggle={ accountsList && accountsList.length > 0 ? "collapse" : ""} href="#cp6" aria-expanded="true">
              <a className="card-title">
                Access Token
                { tpServices && tpServices.filter(tpService => tpService.is_token_added == "Y").length > 0
                  ? <span className="success_icon d-inline-block ml-2"><i className="fa fa-check-circle"></i></span>
                  : ''
                }
              </a>
            </div>
          </div>
          <div id="cp6" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-start justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">Select Third Party Service</div>
                <div className="w-25 mr-2">
                  <select id="tpsSelectInput" name="" className="form-control" onChange={(e) => clearData("access_token")}>
                    <option value="">Select Service</option>
                    {tpServices && tpServices.length > 0 && tpServices.map((tpsService, sTpsIndex) => {
                      if(tpsService.is_selected == "Y"){
                        return (
                          <option key={sTpsIndex} value={sTpsIndex}>{tpsService.name}</option>
                        )
                      }
                    })}
                  </select>
                  {
                    formRes.err_status && formRes.error?.aTokenService?.required
                    ? <div className="text-danger"><div>{formRes.error?.aTokenService?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div className="flex-grow-1 mr-2 w-75">
                  <input id="tpsAccessToken" type="text" className="form-control" placeholder="Access Token" />
                  {
                    formRes.err_status && formRes.error?.aTokenValue?.required
                    ? <div className="text-danger"><div>{formRes.error?.aTokenValue?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div><a onClick={() => addAccessToken()} className={`info `}> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
              {
                !formRes.status && formRes.err_status && formRes.error?.type =="atoken" && formRes.error?.msg
                ? <div className="text-danger mt-2"><div>{formRes.error?.msg}</div> </div>
                : ''
              }
              {
                formRes.status && formRes?.type == "atoken" && formRes.msg
                ? <div className="text-success mt-2"><div>{formRes.msg}</div> </div>
                : ''
              }
            </div>
            <div className="search_result bg-white ">
              <div className="px-3 h_labels">
                <div className="flex-grow-1 ml-lg-3">Third party service</div>
                <div>Token </div>
                <div className="mr-lg-3" style={{width:"20px"}}></div>
              </div>
              {tpServices && tpServices.length > 0 && tpServices.map((tpsService, atIndex) => {
                if(tpsService.is_selected == "Y" && tpsService.is_token_added == 'Y'){
                  
                  return (
                    <div key={atIndex} className="px-3">
                      <div className="flex-grow-1 ml-lg-3">{tpsService.name}</div>
                      <div>***************{tpsService.token.substr(tpsService.token.length - 3, 3)} </div>
                      <div className="mr-lg-3"><a onClick={() => delToken(atIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                    </div>
                  )
                }
              })}
            </div>
          </div>
        </div>

        <div className="d-flex justify-content-end yrscpe">
          {
            accountsList && accountsList.length > 0
            ? <Link to={`/onboarding_scope/${accountsList[0].project_id}`} className="btn btn-primary submitBtn btn-lg">Define Your Scope</Link>
            : ''
          }
          
        </div>
      </div>
    </>
  )
}

export default Configuration