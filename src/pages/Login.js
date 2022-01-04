import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { setCookie, getCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import crypto from 'crypto'
import l_banner2 from "../assets/img/l_banner2.png"
const Login = (props) => {
  const navigate = useNavigate()
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if(!data.email || data.email == '' || !data.password || data.password == '' ){
      return false
    };
    if(data.password){
      let md5Pass = crypto.createHash('md5').update(data.password).digest('hex');
      data.password = md5Pass
    }
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    payload.type = "login"
    let res = await ApiService.post(payload.type,payload,Login);
    if(res && res.message == "Success"){
        setCookie('currentUser',JSON.stringify(res.results))
        navigate('/home')
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <div class=" container-fluid">
        <div class="I_header">
          <div class="logo">
            <img src="/assets/img/logo.svg" alt="logo" class="img-fluid" />
          </div>
          <div class="userProfile">
            <h6>Welcome Back!</h6>
            <img src="/assets/img/userProfile.png" alt="profile" class="img-fluid" />
          </div>
        </div>
        <div class="align-items-center d-flex row hv-100">
          <div class="col-md-8 col-lg-8 col-12 offset-md-2 col-xl-8 offset-xl-2 offset-lg-3 loginForm">
            <h4 class="text-center mb-4 f-18">Protect the Future of Your Business</h4>
            <div class="login_box">
              <div class="row">
                <div class="col-md-12 col-12 col-xl-5 col-md-6 col-sm-12 d-none d-lg-block d-xl-block d-md-block">
                  <div class="lbanner">
                    <img src="/assets/img/l_banner2.png" class="img-fluid" />
                    <div class="captText">
                      <h4>Cloud Security</h4>
                      <p>AirPlatform is a team of experts that helps companies of all sizes navigate today’s complex technology landscape.</p>
                    </div>
                  </div>
                </div>
                <div class="col-md-12 col-12 col-xl-7 col-md-6 col-sm-12 d-flex justify-content-center align-items-center pl-md-0">
                  <form class="w-100 mx-lg-5 mx-md-5 mx-xl-5 my-md-4 mx-2 my-2" name="form1" autocomplete="off" onSubmit={handleSubmit(onSubmit)}>
                    <h6 class="f-12 fw-600">Login to Account</h6>
                    <p>Please enter your email and Password to continue…</p>
                    <div class="form-group">
                      <label for="email">email address</label>
                      <input type="email" class="form-control" {...register("email")} name="email" autocomplete="off" defaultValue="rajiv@audiencelogy.com" />
                    </div>
                    <div class="form-group">
                      <label for="password">Password</label>
                      <input type="password" class="form-control" {...register("password")} name="password" autocomplete="off" defaultValue="e10adc3949ba59abbe56e057f20f883e" />
                    </div>
                    <div class="d-flex justify-content-between form-group">
                      <label for="" class="checkbox">
                        <input type="checkbox" /> Remember me
                      </label>
                      <a href="#" class="link">forget password?</a>
                    </div>
                    <button class="btn btn-primary btn-block mb-lg-4 mb-md-4 mb-2" type="submit"> sign in</button>
                    <p class="text-center fw-600">Don’t have an account? <a href="" class="link">Signup</a></p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="I_header I_footer container-fluid">
        <div class="copy">
          <p class="mb-0">© 2021 AirPlatform - All Rights Reserved</p>
        </div>
        <div class="logo d-none d-lg-block d-xl-block d-md-block">
          <img src="/assets/img/logo.svg" alt="logo" class="img-fluid" />
        </div>
      </div> 
    </> 
  )
}

export default Login