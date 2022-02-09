import { useForm } from "react-hook-form";
import ApiService from "../services/ApiServices";
import { SetCookie, GetCookie } from "../helpers/Helper";
import { useNavigate } from "react-router-dom";
import Header from "../components/partials/Header";
const EvidenceManager = (props) => {
  const navigate = useNavigate()
  // const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const onSubmit = async (data) => {
    console.log(data);
    if (!data.email || data.email == '' || !data.password || data.password == '') {
      return false
    };
    console.log(!data.email || data.email == '' || !data.password || data.password == '');
    let payload = data
    let res = await ApiService.post(payload.type, payload, EvidenceManager);
    if (res && res.status == true) {
      SetCookie('currentUser', JSON.stringify(res.data))
      navigate('/home')
    }
  }

  // console.log(watch("email")); // watch input value by passing the name of it

  return (
    <>
      <Header />
      <div className="container-fluid">
        <div className="row mb-3">
          <div className="col-md-12 col-12 pl-0 pr-0 pl-lg-3 pr-lg-3 pl-xl-3 pr-xl-3">
            <div className="mainSearchbar">
              <div className="flex-grow-1 position-static">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <span className="input-group-text bg-transparent border-0 srchInput"><img src="assets/img/gbl.gif" alt="" /></span>
                  </div>
                  <input type="text" name="" placeholder="Search task name, project name, Task ID, username…" className="form-control border-0 pl-0" />
                </div>
              </div>
              <div className="invisible">
                <input type="text" className="form-control border-0" name="date" placeholder="Select Date" />
                  <i className="fa fa-calendar"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <div className="col-md-3">
            <div className="card card_shadow border-0">

              <div className="card-body p-0">
                <ul className="list-unstyled list-group">
                  <li className="list-group-item active"><a href="#" className="list-gro">Authantication</a></li>
                  <li className="list-group-item"><a href="#">Authourization</a></li>
                  <li className="list-group-item"><a href="#">End Point</a></li>
                  <li className="list-group-item"><a href="#">Access Control</a></li>

                </ul>
              </div>

            </div>
          </div> */}
          <div className="col-md-12">
            <div className="card card_shadow border-0">
              <div className="card-header bg-pink border-0">
                <h4 className="mb-0">Authantication</h4>
              </div>
              <div className="card-body ">
                <div className="table-responsive">
                  <table className="table table-borderless">
                    <tbody><tr>
                      <th>Task ID</th>
                      <th>Evidence Type.</th>
                      <th>File Name</th>
                      <th>Uploaded On</th>
                      <th>Action</th>
                    </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      <tr className="odd">
                        <td>101</td>
                        <td>type</td>
                        <td>Ppn_cloud Security.pdf</td>
                        <td>Jan 22, 2022</td>
                        <td>
                          <span className="link_url"><i className="fa fa-eye"></i></span>
                          <span className="ml-2 link_url"><i className="fa fa-download"></i></span>
                        </td>
                      </tr>
                      
                    </tbody></table>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default EvidenceManager