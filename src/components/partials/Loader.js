import { useForm } from "react-hook-form";
import ApiService from "../../services/ApiServices";
import { SetCookie, GetCookie } from "../../helpers/Helper";
import { Link, useNavigate } from "react-router-dom";
import crypto from 'crypto'
const Loader = (props) => {
  const {showLoader = false} = props
  return (
    <>
      {(()=>{
        if(showLoader){
          return(
            <div className="container-fluid vh-100">
                <section class="loader_sec h-100 d-flex align-items-center justify-content-center">
                  <div class="loader_block">
                    <img alt="loader" src="/assets/img/loader.svg" class="img-fluid page404_img" />
                  </div>
                </section>
            </div>
          )
        }
      })()}
    </> 
  )
}

export default Loader