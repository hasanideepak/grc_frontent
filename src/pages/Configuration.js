import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
const Configuration = (props) => {
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type, payload, Configuration);
    if (res && res.status == true) {
      SetCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

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
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>

            </div>
          </div>
          <div id="cp0" className="card-body p-0 collapse show bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Enter Account" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Enter Project" /></div>
                <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">Account 1</div>
                <div>Project 1 </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className="px-3">
                <div className="flex-grow-1 ml-lg-3">Account 2</div>
                <div>Project 2 </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3">Account 3</div>
                <div>Project 3 </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card ">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp1">
            <a className="card-title">
              Framework Setup
            </a>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>

            </div>
          </div>
          <div id="cp1" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-start  flex-lg-row  ">
              <div className="mr-2 add_member">SELECT FRAMEWORK</div>
                <div className="multiselect w-25 mr-2">
                  <div className="selectBox">
                    <select className="form-control">
                      <option>Select an option</option>
                    </select>
                    <div className="overSelect"></div>
                  </div>
                  <div id="checkboxes">
                    <label htmlFor="one">
                      <input type="checkbox" id="one" />
                      <img src="assets/img/m1.svg" alt="" height="20" width="20" />
                      <span>PCI</span>
                    </label>
                    <label htmlhtmlFor="two">
                      <input type="checkbox" id="two" />
                      <img src="assets/img/m2.svg" alt="" height="20" width="20" />
                      <span>HIPAA</span>
                    </label>
                    <label htmlhtmlFor="three">
                      <input type="checkbox" id="three" />
                      <img src="assets/img/m3.svg" alt="" height="20" width="20" />
                      <span>ISO</span>
                    </label>
                    <label htmlhtmlFor="four">
                      <input type="checkbox" id="four" />
                      <img src="assets/img/m4.svg" alt="" height="20" width="20" />
                      <span>CCPA</span>
                    </label>
                    <label htmlhtmlFor="five">
                      <input type="checkbox" id="five" />
                      <img src="assets/img/m5.svg" alt="" height="20" width="20" />
                      <span>DSS</span>
                    </label>
                    <label htmlhtmlFor="six">
                      <input type="checkbox" id="six" />
                      <img src="assets/img/m6.svg" alt="" height="20" width="20" />
                      <span>GDPR</span>
                    </label>
                  </div>
                </div>
                <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div>
                  <label htmlhtmlFor="f1">
                    <input type="checkbox" id="f1" />
                    <img className="mx-1" src="assets/img/m1.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlhtmlFor="f2">
                    <input type="checkbox" id="f2" />
                    <img className="mx-1" src="assets/img/m2.svg" alt="" height="20" width="20" />
                    <span>HIPAA</span>
                  </label>
                  <label htmlFor="f3">
                    <input type="checkbox" id="f3" />
                    <img className="mx-1" src="assets/img/m3.svg" alt="" height="20" width="20" />
                    <span>CCPA</span>
                  </label>
                  <label htmlFor="f4">
                    <input type="checkbox" id="f4" />
                    <img className="mx-1" src="assets/img/m4.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlFor="f5">
                    <input type="checkbox" id="f5" />
                    <img className="mx-1" src="assets/img/m5.svg" alt="" height="20" width="20" />
                    <span>GDPR</span>
                  </label>
                </div>
              </div>
              <div className="px-3">
                <div>
                  <label htmlFor="f6">
                    <input type="checkbox" id="f6" />
                    <img className="mx-1" src="assets/img/m1.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlFor="f7">
                    <input type="checkbox" id="f7" />
                    <img className="mx-1" src="assets/img/m2.svg" alt="" height="20" width="20" />
                    <span>HIPAA</span>
                  </label>
                  <label htmlFor="f8">
                    <input type="checkbox" id="f8" />
                    <img className="mx-1" src="assets/img/m3.svg" alt="" height="20" width="20" />
                    <span>ISO</span>
                  </label>
                  <label htmlFor="f9">
                    <input type="checkbox" id="f9" />
                    <img className="mx-1" src="assets/img/m4.svg" alt="" height="20" width="20" />
                    <span>CCPA</span>
                  </label>
                  <label htmlFor="f10">
                    <input type="checkbox" id="f10" />
                    <img className="mx-1" src="assets/img/m5.svg" alt="" height="20" width="20" />
                    <span>GDPR</span>
                  </label>
                </div>
              </div>
              <div className=" px-3">
                <div>
                  <label htmlFor="f11">
                    <input type="checkbox" id="f11" />
                    <img className="mx-1" src="assets/img/m1.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlFor="f12">
                    <input type="checkbox" id="f12" />
                    <img className="mx-1" src="assets/img/m2.svg" alt="" height="20" width="20" />
                    <span>HIPAA</span>
                  </label>
                  <label htmlFor="f13">
                    <input type="checkbox" id="f13" />
                    <img className="mx-1" src="assets/img/m3.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlFor="f14">
                    <input type="checkbox" id="f14" />
                    <img className="mx-1" src="assets/img/m4.svg" alt="" height="20" width="20" />
                    <span>PCI</span>
                  </label>
                  <label htmlFor="f15">
                    <input type="checkbox" id="f15" />
                    <img className="mx-1" src="assets/img/m5.svg" alt="" height="20" width="20" />
                    <span>GDPR</span>
                  </label>
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
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>

            </div>
          </div>
          <div id="cp2" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD MEMBER</div>
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Add Email Address" /></div>
                <div className="w-25 mr-2">
                  <select name="" id="" className="form-control">
                    <option value="">Select Role</option>
                  </select>
                </div>
                <div><a href="" className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">martin_guptill598@icloud.com</div>
                <div>CISO </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className="px-3">
                <div className="flex-grow-1 ml-lg-3">pete_davidson_vagas@gmail.com</div>
                <div>Security Manager </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3">sohan.parker@yahoo.com</div>
                <div>Security Analyst </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp3">
            <a className="card-title">
              Invite Service Partners
            </a>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp3" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="mr-2 add_member">ADD PARTNER</div>
                <div className="mr-2 w-75"><input type="text" className="form-control" placeholder="Add Fullname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Add Email Address" /></div>
                <div><a href="" className=" info"> <img src="/assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div className="flex-grow-1 ">CISO </div>
                <div className="ml-lg-3 ml-md-0 ">martin_guptill598@icloud.com</div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className="px-3">
                <div className="flex-grow-1">Security Manager </div>
                <div className="ml-lg-3">pete_davidson_vagas@gmail.com</div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className=" px-3">
                <div className="flex-grow-1">Security Analyst </div>
                <div className="ml-lg-3">sohan.parker@yahoo.com</div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="card-header collapsed" data-toggle="collapse" data-parent="#accordion" href="#cp4">
            <a className="card-title">
              Invite Task
            </a>
            <div className="ml-auto action_item">
              <a href="#" className="btn btn-outline-primary btn-sm">Update</a>
              <a href="#" className="btn btn-primary btn-sm ml-2">Save</a>
            </div>
          </div>
          <div id="cp4" className="card-body p-0 collapse bg-pink" data-parent="#accordion">
            <div className="p-lg-3 m-lg-3 p-2 m-2 bg-white rounded">
              <div className="d-flex  align-items-center justify-content-between  flex-lg-row  ">
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Enter Firstname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Enter Lastname" /></div>
                <div className="flex-grow-1 mr-2 w-75"><input type="text" className="form-control" placeholder="Enter Email Address" /></div>
                <div><a href="" className=" info"> <img src="assets/img/plus.svg" alt="" className="plus" /> </a></div>
              </div>
            </div>
            <div className="search_result bg-white ">
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">Firstname Lastname</div>
                <div>Email Address </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className="px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">Firstname Lastname</div>
                <div>Email Address </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
              <div className=" px-3">
                <div className="flex-grow-1 ml-lg-3 ml-md-0 ">Firstname Lastname</div>
                <div>Email Address </div>
                <div className="mr-lg-3"><a href="#"> <img src="/assets/img/times.svg" alt="" className="plus" />  </a></div>
              </div>
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
          <div id="cp5" className="collapse" data-parent="#accordion">
            <div className="card-body"> <p>Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt
              aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat
              craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
            </p>
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