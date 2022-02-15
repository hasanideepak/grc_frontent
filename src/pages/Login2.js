import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { Link, useNavigate } from "react-router-dom";
import crypto from 'crypto'
import { useEffect, useState } from "react";
import { IsAuthenticated } from "../helpers/Auth";
const Login2 = (props) => {
  const navigate = useNavigate()
  const [userInfo, setUserInfo] = useState(null)
  const [errMsg, setErrMsg] = useState('')
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  useEffect(() => {
    if (userInfo == null) {
      let userData = GetCookie('currentUser') ? JSON.parse(GetCookie('currentUser')) : null
      console.log(userData)
      if (!userData || userData == null) {
        navigate("/login")
      }else if(userData.otpVerified){
        if (userData.user.is_onboard == 'N') {
          navigate('/onboarding', { replace: true })
        } else {
          navigate('/dashboard', { replace: true })
        }
      }
      setUserInfo(oldVal => {
        return { ...userData }
      })
    }
  })

  const onSubmit = async (data) => {
    setErrMsg('')
    if (
      !data.otpInp1 || data.otpInp1 == '',
      !data.otpInp2 || data.otpInp2 == '',
      !data.otpInp3 || data.otpInp3 == '',
      !data.otpInp4 || data.otpInp4 == '',
      !data.otpInp5 || data.otpInp5 == '',
      !data.otpInp6 || data.otpInp6 == ''
    ) {
      return false
    };
    let otp = Object.values(data).join('')
    if (!otp || otp == '') {
      return false
    }
    let payloadUrl = `auth/validateOTP`
    let method = "POST"
    let formData = { otp }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      let userData = userInfo
      console.log(userInfo)
      userData.otpVerified = true
      let setcookie = SetCookie('currentUser', JSON.stringify(userData))
      if (userData.user.is_onboard == 'N') {
        navigate('/onboarding', { replace: true })
      } else {
        navigate('/dashboard', { replace: true })
      }

    }else{
      setErrMsg(res.message)
    }
  }

  const checkOtpValidation = (event, index) => {
    let inptVal = event.key
    let pattern = new RegExp(/^[0-9]$/);
    if(event.keyCode == 8){
      if(event.target.value.length == 0){
        let ele = document.getElementById(`authOtp${index+1}`)
        if(ele.previousElementSibling){
          ele.previousElementSibling.focus()
        }
      }else{
        event.target.value = ''
      }
      
    }
    if (inptVal.length == 0 || !pattern.test(inptVal)) {
      event.preventDefault();
      return false
    }
    if (inptVal.length > 0) {
      let ele = document.getElementById(`authOtp${index+1}`)
      // Focus on the next sibling
      if(ele.nextElementSibling){
        setTimeout(() => {
          ele.nextElementSibling.focus()
        }, 50);
      }
    }
    // if(this.authOtp.te)
  }

  const resendOTP = async () =>{
    let payloadUrl = `auth/resendOTP`
    let method = "GET"
    let formData = { }
    let res = await ApiService.fetchData(payloadUrl, method);
    if (res && res.message == "Success") {
      window.location.reload()
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <div className=" container-fluid">
        <div className="I_header">
          <div className="logo">
            <img src="/assets/img/logo.svg" alt="logo" className="img-fluid" />
          </div>
          {/* <div className="userProfile">
            <h6>Welcome Back!</h6>
            <img src="/assets/img/userProfile.png" alt="profile" className="img-fluid" />
          </div> */}
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
                <div className="col-md-12 col-12 col-xl-7 col-md-6 col-sm-12 d-flex justify-content-center align-items-center pl-md-0">

                  <form className="w-100 mx-lg-5 mx-md-5 mx-xl-5 my-md-4 mx-2 my-2 form_block" name="form1" autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <h6 className="f-12 fw-600">Otp Authentication</h6>
                    <p className="p-0">Please enter the One Time Password (OTP) sent to your registered email. </p>
                    <div className="form-group mt-3 otp_box">
                      <input type="text" className="otp_input_field" {...register("otpInp1")} id="authOtp1" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 0)}  />
                      <input type="text" className="otp_input_field" {...register("otpInp2")} id="authOtp2" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 1)} />
                      <input type="text" className="otp_input_field" {...register("otpInp3")} id="authOtp3" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 2)} />
                      <input type="text" className="otp_input_field" {...register("otpInp4")} id="authOtp4" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 3)} />
                      <input type="text" className="otp_input_field" {...register("otpInp5")} id="authOtp5" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 4)} />
                      <input type="text" className="otp_input_field" {...register("otpInp6")} id="authOtp6" maxLength="1" onKeyDownCapture={(e) => checkOtpValidation(e, 5)} />
                    </div>
                    {
                      errMsg && errMsg != ''
                      ? <span className="form_err text-danger d-block mb-3">{errMsg}</span>
                      : ''
                    }
                    <div className="d-flex justify-content-end form-group">
                      <span className="link link_url" onClick={() => resendOTP()} >Resend OTP</span>
                    </div>
                    <div className="form_submit_btn mt-3">
                      <button type="submit" className="btn btn-primary btn-block mb-lg-4 mb-md-4 mb-2 mw-100" >Verify</button>
                    </div>
                  </form>
                </div>
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

export default Login2