import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
const Configuration = (props) => {
  const [accountsList, setAccountsList] = useState([])
  const [frameWorks, setFrameWorks] = useState([])
  const [tpServices, setTpServices] = useState([])
  const [memberRoles, setMemberRoles] = useState([])
  const [members, setMembers] = useState([])
  const [servicePartners, setServicePartners] = useState([])
  const [taskOwners, setTaskOwners] = useState([])
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();


  useEffect(() => {
    if (frameWorks.length == 0) {
      fetchInfo("frameworks")
    }
    if (frameWorks.length == 0) {
      fetchInfo("member_roles")
    }
    if (tpServices.length == 0) {
      getThirdPartySefvice()
    }
  }, [])

  const getThirdPartySefvice = () => {
    let tpsArr = [{ id: 0, name: "AWS" }]
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
      payloadUrl = 'reference/getRoles'
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

  const addAccount = () => {
    let accName = document.getElementById("accName").value
    let accProject = document.getElementById("accProject").value
    if (!accName || !accProject) {
      return false;
    }
    let accListArr = [{ name: accName, project: accProject }]
    setAccountsList(oldVal => {
      return [...accListArr]
    })
  }
  const addMember = () => {
    let memEmailInput = document.getElementById("memberEmail")
    let memRoleInput = document.getElementById("memberRole")
    let memEmail = memEmailInput.value
    let memRole = memRoleInput.value
    if (!memEmail || !memRole) {
      return false;
    }
    let memListArr = Object.assign([], members);
    memListArr.push({ email: memEmail, role: memRole })
    setMembers(oldVal => {
      return [...memListArr]
    })
    memEmailInput.value = ""
    memRoleInput.value = ""

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

  const addPartner = () => {
    let partnerFnInput = document.getElementById("partnerFullname")
    let partnerEmailInput = document.getElementById("partnerEmail")
    let partnerFn = partnerFnInput.value
    let partnerEmail = partnerEmailInput.value
    if (!partnerFn || !partnerEmail) {
      return false;
    }
    let listArr = Object.assign([], servicePartners);
    listArr.push({ fullname: partnerFn, email: partnerEmail })
    setServicePartners(oldVal => {
      return [...listArr]
    })
    partnerFnInput.value = ""
    partnerEmailInput.value = ""

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

  const addTaskOwner = () => {
    let toFnInput = document.getElementById("toFirstname")
    let toLnInput = document.getElementById("toLastname")
    let toEmailInput = document.getElementById("toEmail")
    let toFn = toFnInput.value
    let toLn = toLnInput.value
    let toEmail = toEmailInput.value
    if (!toFn || !toLn || !toEmail) {
      return false;
    }
    let listArr = Object.assign([], taskOwners);
    listArr.push({ firstname: toFn, lastname: toLn, email: toEmail })
    setTaskOwners(oldVal => {
      return [...listArr]
    })
    toFnInput.value = ""
    toLnInput.value = ""
    toEmailInput.value = ""

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

  console.log(accountsList)

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div id="accordion" className="accordion pl-lg-3 pr-lg-3 accordianSec">
        <div className="card ">
          <div className="card-header" data-toggle="collapse" data-parent="#accordion" href="#cp0">
            <a className="card-title">
              Account Setup
            </a>
            <div className="ml-auto action_item position-absolute">
              {/* <a href="#" className="btn btn-outline-primary btn-sm">Update</a> */}
              <a onClick={() => addAccount()} className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp0" className="card-body p-0 collapse show bg-pink" data-parent="#accordion">

            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input id="accName" type="text" className="form-control" placeholder="Enter Account name" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="accProject" type="text" className="form-control" placeholder="Enter Project" /></div>
                {/* <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div> */}
              </div>
            </div>
            <div className="search_result bg-white ">
              {accountsList && accountsList.length > 0 && accountsList.map((account, index) => {
                return (
                  <>
                    <div className=" px-3">
                      <div className="flex-grow-1 ml-lg-3 ml-md-0 ">{account.name}</div>
                      <div>{account.project} </div>
                      {/* <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div> */}
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp1">
            <a className="card-title">
              Framework Setup
            </a>
            <div className="ml-auto action_item position-absolute">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp1" className="card-body p-0 collapse bg-pink" data-parent="#accordion">

            {/* <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-start  flex-lg-row  ">
              <div className="mr-2 add_member">SELECT FRAMEWORK</div>
                <div className="multiselect w-25 mr-2">
                  <div className="selectBox">
                    <select className="form-control">
                      <option>Select an option</option>
                    </select>
                    <div className={`overSelect`}></div>
                  </div>
                  <div id="checkboxes">
                    <label htmlFor="one">
                      <input type="checkbox" id="one" />
                      <img src="assets/img/m1.svg" alt="" height="20" width="20" />
                      <span>PCI</span>
                    </label>
                    <label htmlFor="two">
                      <input type="checkbox" id="two" />
                      <img src="assets/img/m2.svg" alt="" height="20" width="20" />
                      <span>HIPAA</span>
                    </label>
                    <label htmlFor="three">
                      <input type="checkbox" id="three" />
                      <img src="assets/img/m3.svg" alt="" height="20" width="20" />
                      <span>ISO</span>
                    </label>
                    <label htmlFor="four">
                      <input type="checkbox" id="four" />
                      <img src="assets/img/m4.svg" alt="" height="20" width="20" />
                      <span>CCPA</span>
                    </label>
                    <label htmlFor="five">
                      <input type="checkbox" id="five" />
                      <img src="assets/img/m5.svg" alt="" height="20" width="20" />
                      <span>DSS</span>
                    </label>
                    <label htmlFor="six">
                      <input type="checkbox" id="six" />
                      <img src="assets/img/m6.svg" alt="" height="20" width="20" />
                      <span>GDPR</span>
                    </label>
                  </div>
                </div>
                <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div> */}
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  {frameWorks && frameWorks.length > 0 && frameWorks.map((frameWork, index) => {
                    return (
                      <>
                        <label htmlFor={`f${index + 1}`}>
                          <input type="checkbox" id={`f${index + 1}`} />
                          <img className="mx-1" src="assets/img/m1.svg" alt="" height="20" width="20" />
                          <span>{frameWork.name}</span>
                        </label>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card ">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp2" aria-expanded="true">
            <a className="card-title">
              Key Members
            </a>
            <div className="ml-auto action_item position-absolute">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>

            </div>
          </div>
          <div id="cp2" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD MEMBER</div>
                <div className="flex-grow-1 mr-2 w-75"><input id="memberEmail" type="text" className="form-control" placeholder="Email Address" /></div>
                <div className="w-25 mr-2">
                  <select name="" id="memberRole" className="form-control">
                    <option value="">Select Role</option>
                    {memberRoles && memberRoles.length > 0 && memberRoles.map((role, index) => {
                      return (
                        <>
                          <option value={role.id}>{role.name}</option>
                        </>
                      )
                    })}
                  </select>
                </div>
                <div><a onClick={() => addMember()} className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {members && members.length > 0 && members.map((member, index) => {
                return (
                  <>
                    <div className="px-3">
                      <div className="flex-grow-1 ml-lg-3">{member.email}</div>
                      <div>{member.role} </div>
                      <div className="mr-lg-3"><a onClick={() => delMember(index)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp3">
            <a className="card-title">
              Invite Service Partners
            </a>
            <div className="ml-auto action_item position-absolute">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp3" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD PARTNER</div>
                <div className="mr-2 w-75"><input id="partnerFullname" type="text" className="form-control" placeholder="Fullname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="partnerEmail" type="text" className="form-control" placeholder="Email Address" /></div>
                <div><a onClick={() => addPartner()} className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {servicePartners && servicePartners.length > 0 && servicePartners.map((partner, index) => {
                return (
                  <>
                    <div className=" px-3">
                      <div className="flex-grow-1 ">{partner.fullname} </div>
                      <div className="ml-lg-3 ml-md-0 ">{partner.email}</div>
                      <div className="mr-lg-3"><a onClick={() => delPartner(index)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp4">
            <a className="card-title">
              Invite Task Owners
            </a>
            <div className="ml-auto action_item position-absolute">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp4" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input id="toFirstname" type="text" className="form-control" placeholder="Enter Firstname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="toLastname" type="text" className="form-control" placeholder="Enter Lastname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input id="toEmail" type="text" className="form-control" placeholder="Enter Email Address" /></div>
                <div><a onClick={() => addTaskOwner()} className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              {taskOwners && taskOwners.length > 0 && taskOwners.map((owner, index) => {
                return (
                  <>
                    <div className=" px-3">
                      <div className="flex-grow-1 ml-lg-3 ml-md-0 ">{owner.firstname} {owner.lastname}</div>
                      <div>{owner.email} </div>
                      <div className="mr-lg-3"><a onClick={() => delTaskOwner(index)}> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
                    </div>
                  </>
                )
              })}
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp5">
            <a className="card-title">
              Third Party Services
            </a>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp5" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  {tpServices && tpServices.length > 0 && tpServices.map((tpService, index) => {
                    return (
                      <>
                        <label htmlFor={`f${index + 1}`}>
                          <input type="checkbox" id={`f${index + 1}`} />
                          <img className="mx-1" src="assets/img/aws.jpeg" alt="" height="20" width="20" />
                          <span>{tpService.name}</span>
                        </label>
                      </>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp6">
            <a className="card-title">
              Access Token
            </a>
          </div>
          <div id="cp6" className="collapse" data-parent="#accordion">
            <div className="card-body"> <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
              aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
              craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Configuration