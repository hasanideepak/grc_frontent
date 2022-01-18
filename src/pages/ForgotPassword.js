import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
// import { SetCookie, GetCookie } from "../helpers/Helper";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
const ForgotPassword = (props) => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [viewType, setViewType] = useState("mail_sent")
  const [lastPayload, setLastPayload] = useState({})
  const onSubmit = async (data) => {
    if(!data.email || data.email == ''){
      return false
    };
    let payload = data
    setLastPayload(payload)
    payload.type = "forgot_pwd"
    payload.url = "auth/forgotpassword"
    let res = await ApiService.post(payload.type,payload,ForgotPassword);
    if(res && res.message == "Success"){
      changeView("mail_sent");
    }
  }

  const resendLink = async () =>{
    let payload = lastPayload
    payload.type = "forgot_pwd"
    payload.url = "auth/forgotpassword"
    let res = await ApiService.post(payload.type,payload,ForgotPassword);
    if(res && res.message == "Success"){
      changeView("mail_sent");
    }
  }

  const changeView = (view = null) => {
    if (view == null) {
      return false
    }
    setViewType(view)
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <div className=" container-fluid">
        <div className="I_header">
          <div className="logo">
            <img src="/assets/img/logo.svg" alt="logo" className="img-fluid" />
          </div>
        </div>
        <div className="align-items-center d-flex row hv-100">
          <div className="col-md-8 col-lg-8 col-12 offset-md-2 col-xl-8 offset-xl-2 offset-lg-3 loginForm">
            <h4 className="text-center mb-4 f-18">Protect the Future of Your Business</h4>
            <div className="login_box">
              <div className="row">
                <div className="col-md-12 col-12 col-xl-5 col-md-6 col-sm-12 d-none d-lg-block d-xl-block d-md-block">
                  <div className="lbanner">
                    <img src="/assets/img/l_banner2.png" className="img-fluid" />
                    <div className="captText">
                      <h4>Cloud Security</h4>
                      <p>AirPlatform is a team of experts that helps companies of all sizes navigate today’s complex technology landscape.</p>
                    </div>
                  </div>
                </div>
                {(()=>{
                  if(viewType == "login"){
                    return(
                      <>
                        <div className="col-md-12 col-12 col-xl-7 col-md-6 col-sm-12 d-flex justify-content-center align-items-center pl-md-0">
                          <form className="w-100 mx-lg-5 mx-md-5 mx-xl-5 my-md-4 mx-2 my-2" name="form1" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <h6 className="f-12 fw-600">Forgot Password</h6>
                            <p>Enter your registered email below to receive password reset instruction</p>
                            <div className="form-group">
                              <label htmlFor="email">Email address</label>
                              <input type="email" className="form-control" {...register("email")} name="email" autoComplete="off" defaultValue="" />
                            </div>
                            <div className="d-flex justify-content-end form-group">
                              <span>Remember password? &nbsp;</span>
                              <Link to="/login" className="link" >Login</Link>
                            </div>
                            <button className="btn btn-primary btn-block mb-lg-4 mb-md-4 mb-2" type="submit"> Send</button>
                          </form>
                        </div>
                      </>
                    )
                  }else{
                    return(
                      <>
                        <div className="col-md-12 col-12 col-xl-7 col-md-6 col-sm-12 d-flex justify-content-center align-items-center pl-md-0">
                          <form className="w-100 mx-lg-5 mx-md-5 mx-xl-5 my-md-4 mx-2 my-2" name="form1" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                            <h6 className="f-12 fw-600">Mail has been sent!</h6>
                            <p>Please check your inbox and click in the received link to reset the password</p>
                            {/* <button className="btn btn-primary btn-block mb-lg-4 mb-md-4 mb-2" type="button"> Login</button> */}
                            <Link to="/login" className="btn btn-primary btn-block mb-lg-4 mb-md-4 mb-2" >Login</Link>
                            <div className="d-flex justify-content-end form-group">
                              <span>Didn't receive the link? &nbsp;</span>
                              <a onClick={() => resendLink()} className="link">Resend Link</a>
                              {/* <Link to="/login" className="link" >Resend Link </Link> */}
                            </div>
                          </form>
                        </div>
                      </>
                    )
                  }
                })()}
                
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="I_header I_footer container-fluid">
        <div className="copy">
          <p className="mb-0">© 2021 AirPlatform - All Rights Reserved</p>
        </div>
        <div className="logo d-none d-lg-block d-xl-block d-md-block">
          <img src="/assets/img/logo.svg" alt="logo" className="img-fluid" />
        </div>
      </div> 
    </> 
  )
}

export default ForgotPassword