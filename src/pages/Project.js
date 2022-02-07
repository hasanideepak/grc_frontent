import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { Link, useNavigate, useOutletContext, useParams } from "react-router-dom";
import Header from "../components/partials/Header";
import { useEffect, useState } from "react";
import crypto from 'crypto'
import AIR_MSG from "../helpers/AirMsgs";

const Project = (props) => {
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
    if(!data.account || data.account == '' || !data.project_name || data.project_name == ''){
      return false
    };
    
    let payloadUrl = "auth/changePassword"
    let method = "POST";
    let formData = { current_password: data.oldPass, new_password: data.newPass }
    let res = await ApiService.fetchData(payloadUrl, method, formData);
    if (res && res.message == "Success") {
      formRes = { status: true, err_status: false, type: "addProject", error: {}, msg: "" }
      setFormRes(formRes)
    } else {
      formRes['err_status'] = true
      formRes['error']['type'] = "addProject"
      formRes['error']['msg'] = ""
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
      <div id="accordion" className="profileSec pl-lg-3 pr-lg-3 accordianSec  mt-3">
        <div className="card">
          <form onSubmit={handleSubmit(updatePassword)}>
            <div className="card-header justify-content-between py-4">
              <a className="card-title">Change Password</a>
              <button className="btn btn-primary" type="submit">Update</button>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <div className="formInline m-0">
                    <label htmlFor="">Select Account:</label>
                    <input type="text" className="form-control bg-transparent" {...register("account",{required:true})} name="account" autoComplete="off" defaultValue="" />
                  </div>
                  {errors.account?.type === 'required' && <div className="field_err text-danger">{AIR_MSG.account_required}</div>} 
                </div>
                <div className="col-md-6">
                  <div className="formInline m-0">
                    <label htmlFor="">Project Name:</label>
                    <input type="text" className="form-control bg-transparent"{...register("project_name",{required:true})} name="project_name" autoComplete="off" defaultValue="" />
                  </div>
                  {errors.project_name?.type === 'required' && <div className="field_err text-danger">{AIR_MSG.project_name_required}</div>} 
                </div>
              </div>
              <div className="row">
                {
                  !formRes.status && formRes.err_status && formRes.error?.type == "addProject"
                    ? <div className="form_err text-danger"><div>{AIR_MSG.form_success('Project','add')}</div> </div>
                    : ''
                }
                {
                  formRes.status && formRes?.type == "addProject"
                    ? <div className="form_success text-success"><div>{AIR_MSG.form_err('Project')}</div> </div>
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

export default Project