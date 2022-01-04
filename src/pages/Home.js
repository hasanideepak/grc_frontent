import { useState,useEffect, React } from 'react';
import { getCookie } from "../helpers/Helper";

const Home = (props) =>{
  const [user, setUser] = useState({})
    useEffect(() => {
      let loggedInUser = getCookie("currentUser")
      loggedInUser = loggedInUser ? JSON.parse(loggedInUser) : false
      if(loggedInUser){
        setUser(loggedInUser.user) 
      }
    })
  return (
    <>
      <div class="container">
        <div class="row">
          <div class="col-md-7 ">

            <div class="panel panel-default">
              <div class="panel-heading">
                <h4>User Profile</h4>
              </div>
              <div class="panel-body">

                <div class="box box-info">

                  <div class="box-body">
                    <div class="col-sm-6">
                      <div align="center">
                        <img alt="User Pic" src="/assets/img/userProfile.png" id="profile-image1" class="img-circle img-responsive" />
                      </div>

                      <br />
                    </div>


                    <div class="col-sm-5 col-xs-6 tital ">First Name:</div><div class="col-sm-7 col-xs-6 ">{user.name}</div>
                    <div class="clearfix"></div>
                    <div class="bot-border"></div>
                    <div class="col-sm-5 col-xs-6 tital ">Last Name:</div><div class="col-sm-7"></div>
                    <div class="clearfix"></div>
                    <div class="bot-border"></div>

                    <div class="col-sm-5 col-xs-6 tital ">Email:</div><div class="col-sm-7">{user.email}</div>

                    <div class="clearfix"></div>
                    <div class="bot-border"></div>

                    <div class="col-sm-5 col-xs-6 tital ">Contact:</div><div class="col-sm-7">{user.phone}</div>

                    <div class="clearfix"></div>
                    <div class="bot-border"></div>

                    <div class="col-sm-5 col-xs-6 tital ">Organization:</div><div class="col-sm-7">{user.org_name}</div>

                  </div>
                </div>


              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home