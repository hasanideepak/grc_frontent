import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
const Configuration = (props) => {
  const [accountsList, setAccountsList] = useState([])
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
  const [formRes, setFormRes] = useState({ staus: false, err: false, data: {} })
  const [errorMsg, setErrorMsg] = useState(false);
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  useEffect(() => {
    if (frameWorks.length == 0) {
      fetchInfo("frameworks")
    }
    if (memberRoles.length == 0) {
      fetchInfo("member_roles")
    }
    if (ownerRoles.length == 0) {
      fetchInfo("owner_roles")
    }
    if (tpServices.length == 0) {
      fetchInfo("get_tps")
    }
    // if(accountsList.length == 0){
    //   let accListArr = [{project_id: 1}]
    //   setAccountsList(oldVal => {
    //     return [...accListArr]
    //   })
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
    let formData = {}

    if (type == 'frameworks') {
      payloadUrl = 'reference/getFrameworks'
      method = "GET";
    }
    if (type == 'member_roles') {
      payloadUrl = 'reference/getDepartments/Y'
      method = "GET";
    }
    if (type == 'owner_roles') {
      payloadUrl = 'reference/getDepartments/N'
      method = "GET";
    }
    if (type == 'get_tps') {
      payloadUrl = 'reference/getThirdPartyConnectors'
      method = "GET";
    }

    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      if (type == "frameworks") {
        setFrameWorks(oldVal => {
          return [...res.results]
        })
      }
      if (type == "member_roles") {
        setMemberRoles(oldVal => {
          return [...res.results]
        })
      }
      if (type == "owner_roles") {
        setOwnerRoles(oldVal => {
          return [...res.results]
        })
      }
      if (type == "get_tps") {
        setTpServices(oldVal => {
          return [...res.results]
        })
      }
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
    setFormRes({ staus: false, err: false, data: {} })
    setErrorMsg(false)
    let accInput = document.getElementById("accName");
    let accProjectInput = document.getElementById("accProject");
    let accName = accInput.value
    let accProject = accProjectInput.value
    if (!accName || !accProject) {
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
    } else {

    }

  }

  const addToFrameWorkList = (ev = null, index = null) => {
    if (ev == null || index == null || !frameWorks[index]) {
      return
    }

    let obj = frameWorks[index]
    let tempArr = addFrameWorksList;
    tempArr.push(obj)
    setAddFrameWorksList(oldVal => {
      return [...tempArr]
    })
    console.log(addFrameWorksList)

  }
  const removeFromFrameworkList = (ev = null, index = null) => {
    if (ev == null || index == null || !frameWorks[index]) {
      return
    }

    let obj = frameWorks[index]
    let tempArr = addFrameWorksList;
    let tempArrIndex = tempArr.indexOf(obj)
    tempArr.splice(tempArrIndex, 1)
    setAddFrameWorksList(oldVal => {
      return [...tempArr]
    })
  }

  const addProjectFramework = async () => {
    setFormSbmt(true)
    setFormRes({ staus: false, err: false, data: {} })
    setErrorMsg(false)
    if (addFrameWorksList.length == 0) {
      return false;
    }
    let payloadUrl = "configuration/addProjectFrameworks"
    let method = "POST";
    let frmwrkIds = addFrameWorksList.map(({ id }) => id)
    let formData = { project_id: accountsList[0].project_id, framework_ids: frmwrkIds }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {

    } else {

    }

  }
  const addMember = async () => {
    setFormSbmt(true)
    setFormRes({ staus: false, err: false, data: {} })
    setErrorMsg(false)
    let memEmailInput = document.getElementById("memberEmail")
    let memRoleInput = document.getElementById("memberRole")
    let memEmail = memEmailInput.value
    let memRole = memberRoles[memRoleInput.value]
    console.log(memberRoles,memRoleInput.value)
    console.log(memEmail,memRole)
    if (!memEmail || !memRole) {
      return false;
    }

    let payloadUrl = "configuration/addKeyMember"
    let method = "POST";
    let formData = { email: memEmail, role: memRole.name, department_id: memRole.id, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let memListArr = Object.assign([], members);
      memListArr.push(formData)
      setMembers(oldVal => {
        return [...memListArr]
      })
      memEmailInput.value = ""
      memRoleInput.value = ""
    } else {

    }
  }
  const delMember = (index = null) => {
    if (index == null) {
      return false;
    }
    let tempArr = [];
    for (let memIndex in members) {
      if (index == memIndex) {
        continue
      }
      tempArr.push(members[memIndex])
    }
    setMembers(oldVal => {
      return [...tempArr]
    })
  }

  const addPartner = async () => {
    setFormSbmt(true)
    setFormRes({ staus: false, err: false, data: {} })
    setErrorMsg(false)
    let partnerFnInput = document.getElementById("partnerFullname")
    let partnerEmailInput = document.getElementById("partnerEmail")
    let partnerFn = partnerFnInput.value
    let partnerEmail = partnerEmailInput.value
    if (!partnerFn || !partnerEmail) {
      return false;
    }

    let payloadUrl = "configuration/addServicePartner"
    let method = "POST";
    let formData = { full_name: partnerFn, email: partnerEmail, project_id: accountsList[0].project_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], servicePartners);
      listArr.push(formData)
      setServicePartners(oldVal => {
        return [...listArr]
      })
      partnerFnInput.value = ""
      partnerEmailInput.value = ""
    } else {

    }

  }
  const delPartner = (index = null) => {
    if (index == null) {
      return false;
    }
    let tempArr = [];
    for (let pIndex in servicePartners) {
      if (index == pIndex) {
        continue
      }
      tempArr.push(servicePartners[pIndex])
    }
    setServicePartners(oldVal => {
      return [...tempArr]
    })
  }

  const addTaskOwner = async () => {
    setFormSbmt(true)
    setFormRes({ staus: false, err: false, data: {} })
    setErrorMsg(false)
    let toFnInput = document.getElementById("toFirstname")
    let toLnInput = document.getElementById("toLastname")
    let toEmailInput = document.getElementById("toEmail")
    let toFn = toFnInput.value
    let toLn = toLnInput.value
    let toEmail = toEmailInput.value
    if (!toFn || !toLn || !toEmail) {
      return false;
    }

    let payloadUrl = "configuration/addTaskOwner"
    let method = "POST";
    let formData = { first_name: toFn, last_name: toLn, email: toEmail, project_id: accountsList[0].project_id, org_id: props?.user?.currentUser?.org_id }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let listArr = Object.assign([], taskOwners);
      listArr.push(formData)
      setTaskOwners(oldVal => {
        return [...listArr]
      })
      toFnInput.value = ""
      toLnInput.value = ""
      toEmailInput.value = ""
    } else {

    }

  }
  const delTaskOwner = (index = null) => {
    if (index == null) {
      return false;
    }
    let tempArr = [];
    for (let tIndex in taskOwners) {
      if (index == tIndex) {
        continue
      }
      tempArr.push(taskOwners[tIndex])
    }
    setTaskOwners(oldVal => {
      return [...tempArr]
    })
  }
  const onSelectTPS = async (event = null, index = null) => {
    if (index == null) {
      return false;
    }
    let tpsCheckInput = event.target
    let tpsCheck = tpsCheckInput.checked
    let tempArr = selectedTPS;
    let apiType = selectedTPS.length == 0 ? 'add' : 'update'
    let tempArrIds = tempArr.map(tps => tps.id)
    if (tpsCheck) {
      if (!tempArrIds.includes(tpServices[index].id)) {
        tempArr.push(tpServices[index])
      }
    } else {
      let arrIndex = tempArrIds.indexOf(tpServices[index].id)
      if (arrIndex != -1) {
        tempArr.splice(arrIndex, 1)
      }
    }
    if (apiType == 'add') {
      let payloadUrl = "configuration/addTaskOwner"
      let method = "POST";
      let formData = { project_id: accountsList[0].project_id, connector_id: tempArr[0] }
      let res = await ApiService.fetchData(payloadUrl, method, formData);
      if (res && res.message == "Success") {
        setSelTPS(oldVal => {
          return [...tempArr]
        })
      } else {

      }

    }


  }

  const addAccessToken = () => {
    let tokenInput = document.getElementById("tpsAccessToken")
    let tpsSelectInput = document.getElementById("tpsSelectInput")
    let token = tokenInput.value
    let selTPS = selectedTPS.find(tps => tps.id == tpsSelectInput.value)
    if (!token || !selTPS) {
      return false;
    }

    let accessTokensArr = Object.assign([], tpsAccessTokens);
    accessTokensArr.push(Object.assign(selTPS, { accessToken: token }))
    setAccessToken(oldVal => {
      return [...accessTokensArr]
    })
    tokenInput.value = ""
    tpsSelectInput.value = ""

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
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1" data-toggle="collapse" href="#cp0" aria-expanded="true">
              <a className="card-title">
                Account Setup
              </a>
            </div>
            <div className="ml-auto action_item">
              <a onClick={() => addAccount()} className={`btn btn-primary btn-sm ml-2 ${accountsList.length > 0 ? 'd-none' : ''}`} >Save</a>
            </div>
          </div>
          <div id="cp0" className="card-body p-0 collapse show" data-parent="#accordion">

            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input id="accName" type="text" className="form-control" placeholder="Enter Account name" disabled={accountsList.length > 0} /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="accProject" type="text" className="form-control" placeholder="Enter Project" disabled={accountsList.length > 0} /></div>
                {/* <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div> */}
              </div>
            </div>
            <div className="search_result bg-white ">
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
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp1" aria-expanded="true">
              <a className="card-title">
                Framework Setup
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
                  {frameWorks && frameWorks.length > 0 && frameWorks.map((frameWork, fwIndex) => {
                    return (
                      <label key={fwIndex} htmlFor={`f${fwIndex + 1}`}>
                        <input type="checkbox" id={`f${fwIndex + 1}`} onClick={(e) => e.target.checked ? addToFrameWorkList(e, fwIndex) : removeFromFrameworkList(e, fwIndex)} />
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
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp2" aria-expanded="true">
              <a className="card-title">
                Key Members
              </a>
            </div>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp2" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD MEMBER</div>
                <div className="flex-grow-1 mr-2 w-75"><input id="memberEmail" type="text" className="form-control" placeholder="Email Address" /></div>
                <div className="w-25 mr-2">
                  <select name="" id="memberRole" className="form-control">
                    <option value="">Select Role</option>
                    {memberRoles && memberRoles.length > 0 && memberRoles.map((role, mrIndex) => {
                      return (
                        <option key={mrIndex} value={mrIndex}>{role.name}</option>
                      )
                    })}
                  </select>
                </div>
                <div><a onClick={() => addMember()} className="info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {members && members.length > 0 && members.map((member, mIndex) => {
                return (
                  <div key={mIndex} className="px-3">
                    <div className="flex-grow-1 ml-lg-3">{member.email}</div>
                    <div>{member.role} </div>
                    <div className="mr-lg-3"><a onClick={() => delMember(mIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp3" aria-expanded="true">
              <a className="card-title">
                Invite Service Partners
              </a>
            </div>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp3" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD PARTNER</div>
                <div className="mr-2 w-75"><input id="partnerFullname" type="text" className="form-control" placeholder="Fullname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="partnerEmail" type="text" className="form-control" placeholder="Email Address" /></div>
                <div><a onClick={() => addPartner()} className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
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
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp4" aria-expanded="true">
              <a className="card-title">
                Invite Task Owners
              </a>
            </div>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp4" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input id="toFirstname" type="text" className="form-control" placeholder="Enter Firstname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="toLastname" type="text" className="form-control" placeholder="Enter Lastname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="toEmail" type="text" className="form-control" placeholder="Enter Email Address" /></div>
                <div className="flex-grow-1 mr-2 w-75">
                  <select name="" id="ownerRole" className="form-control">
                    <option value="">Select Owner Role</option>
                    {ownerRoles && ownerRoles.length > 0 && ownerRoles.map((role, orIndex) => {
                      return (
                        <option key={orIndex} value={role.id}>{role.name}</option>
                      )
                    })}
                  </select>
                </div>
                <div><a onClick={() => addTaskOwner()} className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {taskOwners && taskOwners.length > 0 && taskOwners.map((owner, toIndex) => {
                return (
                  <div key={toIndex} className=" px-3">
                    <div className="flex-grow-1 ml-lg-3 ml-md-0 ">{owner.first_name} {owner.last_name}</div>
                    <div>{owner.email} </div>
                    <div className="mr-lg-3"><a onClick={() => delTaskOwner(toIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp5" aria-expanded="true">
              <a className="card-title">
                Third Party Services
              </a>
            </div>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp5" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  {tpServices && tpServices.length > 0 && tpServices.map((tpService, tpIndex) => {
                    return (
                      <label key={tpIndex} htmlFor={`f${tpIndex + 1}`}>
                        <input type="checkbox" id={`f${tpIndex + 1}`} onClick={(e) => onSelectTPS(e, tpIndex)} />
                        <img className="mx-1" src="assets/img/aws.jpeg" alt="" height="20" width="20" />
                        <span>{tpService.value}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div class="d-flex align-items-center">
            <div class="card-header flex-grow-1 collapsed" data-toggle="collapse" href="#cp5" aria-expanded="true">
              <a className="card-title">
                Access Token
              </a>
            </div>
          </div>
          <div id="cp6" className="card-body p-0 collapse" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">Select Third Party Service</div>
                <div className="w-25 mr-2">
                  <select id="tpsSelectInput" name="" className="form-control" onChange={(e) => clearData("access_token")}>
                    <option value="">Select Service</option>
                    {selectedTPS && selectedTPS.length > 0 && selectedTPS.map((selTPS, sTpsIndex) => {
                      return (
                        <option key={sTpsIndex} value={selTPS.id}>{selTPS.name}</option>
                      )
                    })}
                  </select>
                </div>
                <div className="flex-grow-1 mr-2 w-75"><input id="tpsAccessToken" type="text" className="form-control" placeholder="Access Token" /></div>
                <div><a onClick={() => addAccessToken()} className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {tpsAccessTokens && tpsAccessTokens.length > 0 && tpsAccessTokens.map((accToken, atIndex) => {
                return (
                  <div key={atIndex} className="px-3">
                    <div className="flex-grow-1 ml-lg-3">{accToken.name}</div>
                    <div>***************{accToken.accessToken.substr(accToken.accessToken.length - 3, 3)} </div>
                    <div className="mr-lg-3"><a onClick={() => delToken(atIndex)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Configuration