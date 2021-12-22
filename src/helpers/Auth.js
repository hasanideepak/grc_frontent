import Router from "next/router";
import {getCookie} from "./Helper"

export const isAuthenticated = (fetchUser = false) => {
    //fetch Data
    let userData = getCookie('currentUserValue')
    userData  = userData ? JSON.parse(userData) : false;
    let result = {isLoggedIn : false,currentUser: null,token: ''}
    if(userData){
        result.isLoggedIn = true;
        result.currentUser = fetchUser ? userData.user : null;
        result.token = fetchUser ? userData.token : '';
    }
    
    return result
}

export const authenticationCheck = (firstLogin = false) => {
    let userData = isAuthenticated(true)
    let user = userData.currentUser ? userData.currentUser : {}
    if (Object.keys(user).length > 0) {
        if (user.role === 'ROLE_PROFESSIONAL') {
            let job = getCookie('clickCurrentApplyJob')
            job = job ? JSON.parse(job) : undefined
            if (job) {
                Router.push(`/profile/heliohire-application/referenceNumber/${job.referenceNumber}`)
            }else if (firstLogin) {
                Router.push(`/profile/${user.slug}?event=true`)
            } else {
                Router.push(`/jobs-home`)
            }
        }
        else if (user.role === 'ROLE_ORGANIZATIONAL') {
            if (firstLogin) {
                window.location.href = (`${process.env.serverurl}inst/institute-home-dashboard?event=true`);
            }else{
                window.location.href = (`${process.env.serverurl}inst/institute-home-dashboard`);
            }
          
        }
    }else{
    }
  }