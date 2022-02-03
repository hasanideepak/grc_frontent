import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
import crypto from 'crypto'

const ChangePassword = (props) => {
  const { user = {} } = useOutletContext()
  // console.log(token)
  const orgId = user?.currentUser?.org_id || 0;
  // const projectId = 1;
  const [getAllScopes, setAllScopes] = useState({})
  const navigate = useNavigate()

  // const { register, handleSubmit, watch, formState: { errors } } = useForm(); // initialize the hook
  const [formSubmitted, setFormSbmt] = useState(false)
  const [formRes, setFormRes] = useState({ status: false, err_status: false, error: {} })
  const [errorMsg, setErrorMsg] = useState(false);
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const passRegex = new RegExp(/((?=.*\d)(?=.*[A-Z])(?=.*\W).{9,32})/)
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();

  console.log(errors)

  const updatePassword = async (data) => {
    let formRes =  {status: false, err_status: false, error: {} }
    setFormRes(formRes)
    if(!data.oldPass || data.oldPass == '' || !data.newPass || data.newPass == '' || !data.confPass || data.confPass == ''){
      return false
    };
    if(data.newPass != data.confPass){
      formRes = {status:false,err_status:true,error:{pass_not_match:{required:true,msg:"*Password and Confirm password should be same"}}}
      setFormRes(formRes)
      return
    }

    if(data.oldPass){
      let md5Pass = crypto.createHash('md5').update(data.oldPass).digest('hex');
      data.oldPass = md5Pass
    }
    if(data.newPass){
      let md5Pass = crypto.createHash('md5').update(data.newPass).digest('hex');
      data.newPass = md5Pass
    }
    let payloadUrl = "auth/changePassword"
    let method = "POST";
    let formData = { current_password: data.oldPass, new_password: data.newPass }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      formRes = { status: true, err_status: false, type: "updatePass", error: {}, msg: "Password chnaged successfully" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "updatePass"
      formRes['error']['msg'] = "Something Went Wrong!"
      setFormRes(formRes)
    }
    setTimeout(() => {
      formRes = { status: false, err_status: false, error: {} }
      setFormRes(formRes)
    }, 3000);

  }


  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div id="accordion" class="profileSec pl-lg-3 pr-lg-3 accordianSec  mt-3">
        <div class="card">
          <form onSubmit={handleSubmit(updatePassword)}>
            <div class="card-header justify-content-between py-4">
              <a class="card-title">Change Password</a>
              <button class="btn btn-primary" type="submit">Update</button>
            </div>
            <div class="card-body">
              <div class="row mb-4">
                <div class="col-md-6">
                  <div className="formInline m-0">
                    <label htmlFor="">Current Password:</label>
                    <input type="password" className="form-control" {...register("oldPass",{required:true})} name="oldPass" autoComplete="off" defaultValue="" />
                  </div>
                  {errors.oldPass?.type === 'required' && <div className="error_block text-danger">*Old assword is required</div>} 
                </div>
              </div>
              <div class="row">
                <div class="col-md-6">
                  <div className="formInline m-0">
                    <label htmlFor="">New Password:</label>
                    <input type="password" className="form-control bg-transparent" {...register("newPass",{required:true,pattern:passRegex})} name="newPass" autoComplete="off" defaultValue="" />
                  </div>
                  {errors.newPass?.type === 'required' && <div className="error_block text-danger">*Password is required</div>} 
                  {errors.newPass?.type === 'pattern' && <div className="error_block text-danger">*Password should be alphanumeric, must contain atleast 1 uppercase and 1 special character and should have atleast 10 characters </div>}
                  {
                    formRes.err_status && formRes.error?.pass_not_match?.required
                    ? <div className="text-danger"><div>{formRes.error?.pass_not_match?.msg}</div> </div>
                    : ''
                  }
                </div>
                <div class="col-md-6">
                  <div className="formInline m-0">
                    <label htmlFor="">Confirm Password:</label>
                    <input type="password" className="form-control bg-transparent"{...register("confPass",{required:true})} name="confPass" autoComplete="off" defaultValue="" />
                  </div>
                  {errors.confPass?.type === 'required' && <div className="error_block text-danger">*Confirm password is required</div>} 
                </div>
              </div>
              <div className="row">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "updatePass" && formRes.error?.msg
                    ? <div className="text-danger"><div>{formRes.error?.msg}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "updatePass" && formRes.msg
                    ? <div className="text-success"><div>{formRes.msg}</div> </div>
                    : ''
                }
              </div>

            </div>
          </form>

        </div>
      </div>
    </>
  )
}

export default ChangePassword