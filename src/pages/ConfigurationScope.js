import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
const ConfigurationScope = (props) => {
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
    if (Object.keys(getAllConfigs).length == 0) {
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

    if (type == 'all') {
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
    } else if (type == 'owner_roles') {
      payloadUrl = 'reference/getAuthorities/N'
      method = "GET";
    }
    // else if (type == 'get_tps') {
    //   payloadUrl = 'reference/getThirdPartyConnectors'
    //   method = "GET";
    // }

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
        obj.third_party_connectors && obj.third_party_connectors.filter(tps => {
          if (tps.is_selected == "Y") {
            tmpSelectedTPS.push(tps.id)
          }
        })
        setSelTPS(tmpSelectedTPS)
        /* add to framework list if selected */
        let tmpFrmwrkList = [];
        obj.frameWorks && obj.frameWorks.map(frmwrk => {
          if (frmwrk.is_selected == "Y") {
            tmpFrmwrkList.push(frmwrk.id)
          }
        })
        setAddFrameWorksList(tmpFrmwrkList)

        setTimeout(() => {
          setAllConfigs(oldVal => {
            return { ...obj }
          })
        }, 100);


        console.log(obj)
      }
      // else if(type == "frameworks") {
      //   setFrameWorks(oldVal => {
      //     return [...res.results]
      //   })
      // }
      else if (type == "member_roles") {
        setMemberRoles(oldVal => {
          return [...res.results]
        })
      } else if (type == "owner_roles") {
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
    let res = await ApiService.post(payload.type, payload, ConfigurationScope);
    if (res && res.message == "Success") {
      SetCookie('currentUser', JSON.stringify(res.results))
      navigate('/home')
    }
  }

  const addAccount = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let accInput = document.getElementById("accName");
    let accProjectInput = document.getElementById("accProject");
    let accName = accInput.value
    let accProject = accProjectInput.value
    if (!accName || !accProject) {
      // let formRes = {status:false,err_status:true,error:{}}
      formRes['err_status'] = true
      if (!accName) {
        formRes['error']['account_name'] = { required: true, msg: "Account name is required!" }
      }
      if (!accProject) {
        formRes['error']['project_name'] = { required: true, msg: "Project name is required!" }
      }
      setFormRes(formRes)
      return false;
    }
    let payloadUrl = "configuration/setupAccount"
    let method = "POST";
    let formData = { account_name: accName, project_name: accProject, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let accListArr = [Object.assign(formData, { project_id: res.project_id })]
      setAccountsList(oldVal => {
        return [...accListArr]
      })
      accInput.value = ""
      accProjectInput.value = ""
      formRes = { status: true, err_status: false, type: "account", error: {}, msg: "Account added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "account"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
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
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    if (addFrameWorksList.length == 0) {
      return false;
    }
    let payloadUrl = "configuration/addProjectFrameworks"
    let method = "POST";
    // let frmwrkIds = addFrameWorksList.map(({ id }) => id)
    let formData = { project_id: accountsList[0].project_id, framework_ids: addFrameWorksList }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      formRes = { status: true, err_status: false, error: {}, type: "framework", msg: "Framework added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "framework"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }
  const addMember = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let memEmailInput = document.getElementById("memberEmail")
    let memRoleInput = document.getElementById("memberRole")
    let memEmail = memEmailInput.value
    let memRole = memberRoles[memRoleInput.value]
    console.log(memberRoles, memRoleInput.value)
    console.log(memEmail, memRole)
    if (!memEmail || !memRole) {
      formRes['err_status'] = true
      if (!memEmail) {
        formRes['error']['memberEmail'] = { required: true, msg: "Email is required!" }
      }
      if (!memRole) {
        formRes['error']['memberRole'] = { required: true, msg: "Role is required!" }
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addKeyMember"
    let method = "POST";
    let formData = { email: memEmail, department_name: memRole.name, authortiy_id: memRole.id, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let memListArr = Object.assign([], members);
      let memObj = { emp_id: res.emp_id, email: formData.email, department_name: formData.department_name }
      memListArr.push(memObj)
      setMembers(oldVal => {
        return [...memListArr]
      })
      memEmailInput.value = ""
      memRoleInput.value = ""
      formRes = { status: true, err_status: false, error: {}, type: "member", msg: "Member added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "member"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
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
    let method = "POST";
    let formData = { emp_id: delMem.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = members;
      tempArr.splice(index, 1)
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
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let partnerFnInput = document.getElementById("partnerFullname")
    let partnerEmailInput = document.getElementById("partnerEmail")
    let partnerFn = partnerFnInput.value
    let partnerEmail = partnerEmailInput.value
    if (!partnerFn || !partnerEmail) {
      formRes['err_status'] = true
      if (!partnerEmail) {
        formRes['error']['partnerEmail'] = { required: true, msg: "Email is required!" }
      }
      if (!partnerFn) {
        formRes['error']['partnerFullname'] = { required: true, msg: "Fullname is required!" }
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
      let partnerObj = { emp_id: res.emp_id, partner_id: res.partner_id, email: formData.email, full_name: formData.full_name }
      listArr.push(partnerObj)
      setServicePartners(oldVal => {
        return [...listArr]
      })
      partnerFnInput.value = ""
      partnerEmailInput.value = ""
      formRes = { status: true, err_status: false, error: {}, type: "partner", msg: "Member added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "partner"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
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
    let method = "POST";
    let formData = { emp_id: delPartner.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = servicePartners;
      tempArr.splice(index, 1)
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
    let formRes = { status: false, err_status: false, error: {} }
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
      if (!toFn) {
        formRes['error']['ownerFirstName'] = { required: true, msg: "Firstname is required!" }
      }
      if (!toLn) {
        formRes['error']['ownerLastName'] = { required: true, msg: "Lastname is required!" }
      }
      if (!toEmail) {
        formRes['error']['ownerEmail'] = { required: true, msg: "Email is required!" }
      }
      if (!oRole) {
        formRes['error']['ownerRole'] = { required: true, msg: "Role is required!" }
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addTaskOwner"
    let method = "POST";
    let formData = { first_name: toFn, last_name: toLn, email: toEmail, department_name: oRole.name, authortiy_id: oRole.id, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], taskOwners);
      let toObj = { first_name: formData.first_name, last_name: formData.last_name, email: formData.email, department_name: formData.department_name, emp_id: res.emp_id }
      listArr.push(toObj)
      setTaskOwners(oldVal => {
        return [...listArr]
      })
      toFnInput.value = ""
      toLnInput.value = ""
      toEmailInput.value = ""
      formRes = { status: true, err_status: false, error: {}, type: "owner", msg: "Task owner added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "owner"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
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
    let method = "POST";
    let formData = { emp_id: delOwner.emp_id, org_id: orgId, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let tempArr = taskOwners;
      tempArr.splice(index, 1)
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
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    console.log(selectedTPS)
    if (selectedTPS.length == 0) {
      return false;
    }
    let apiType = selectedTPS.length == 0 ? 'add' : 'update'
    let payloadUrl = "configuration/addThirdPartyConnector"
    let method = "POST";
    let formData = { project_id: accountsList[0].project_id, connector_ids: selectedTPS }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      formRes = { status: true, err_status: false, error: {}, msg: "Framework added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
  }

  const addAccessToken = async () => {
    setFormSbmt(true)
    let formRes = { status: false, err_status: false, error: {} }
    setFormRes(formRes)
    setErrorMsg(false)
    let tokenInput = document.getElementById("tpsAccessToken")
    let tpsSelectInput = document.getElementById("tpsSelectInput")
    let token = tokenInput.value
    let selTPS = tpServices[tpsSelectInput.value]
    if (!token || !selTPS) {
      formRes['err_status'] = true
      if (!token) {
        formRes['error']['aTokenValue'] = { required: true, msg: "Access token is required!" }
      }
      if (!selTPS) {
        formRes['error']['aTokenService'] = { required: true, msg: "Please select third party service" }
      }
      setFormRes(formRes)
      return false;
    }

    let payloadUrl = "configuration/addThirdPartyConnectorToken"
    let method = "POST";
    let formData = { project_id: accountsList[0].project_id, connector_id: selTPS.id, token: token }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], tpServices);
      listArr[tpsSelectInput.value].is_token_added = "Y"
      listArr[tpsSelectInput.value].token = formData.token;
      setTpServices(listArr)
      tokenInput.value = ""
      tpsSelectInput.value = ""
      formRes = { status: true, err_status: false, error: {}, type: "atoken", msg: "Access token added successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "atoken"
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
      <div id="accordion" className="accordion pl-lg-3 pr-lg-3 accordianSec">
        <div className="card">
          <div className="d-flex align-items-center">
            <div className="card-header collapsed flex-grow-1" data-toggle="collapse" href="#cp1">
              <a className="card-title">
                People
              </a>

            </div>
            <div className="ml-auto action_item">
              <a href="javascript:void(0)" className="btn btn-primary btn-sm">Save</a>

            </div>
          </div>
          <div id="cp1" className="collapse" data-parent="#accordion" >
            <div className="card-body">
              <div className="row">
                <div className="form-group col-md-6">
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Employees" />
                </div>

                <div className="form-group col-md-6" >
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Consultant" />
                </div>
              </div>
            </div>

          </div>
        </div>
        <div className="card ">
          <div className="d-flex align-items-center">
            <div className="card-header flex-grow-1" data-toggle="collapse" data-parent="#accordion" href="#cp2">
              <a className="card-title">
                Technology Assets
              </a>

            </div>
            <div className="ml-auto action_item">
              <a href="javascript:void(0)" className="btn btn-primary btn-sm">Save</a>

            </div>
          </div>

          <div id="cp2" className="collapse show" data-parent="#accordion" >
            <div className=" p-3">
              <div className="row">
                <div className="form-group col-md-6">
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Endpoints" />
                </div>

                <div className="form-group col-md-6" >
                  <input type="text" className="form-control bg-transparent" placeholder="No. of Servers" />
                </div>
              </div>

              <div className="row">
                <div className="form-group col-md-6">
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
                    <input type="checkbox" id="j1" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" for="j1">Jira 1 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j2" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" for="j2">Jira 2 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j3" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" for="j3">Jira 3 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j4" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" for="j4">Jira 4 </label>
                </li>
                <li>
                  <div className=" ml-lg-3 ml-md-0 "><input type="checkbox" id="j5" /></div>
                  <img src="assets/img/utility.svg" alt="" className="p-1" />
                  <label className="mb-0 f-12" for="j5">Jira 5 </label>
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
                <label className="btn btn-outline-primary btn-sm" for="uploadOption">Upload</label>
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