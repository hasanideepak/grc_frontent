import { useNavigate } from "react-router-dom";
import {GetCookie} from "./Helper"

export const IsAuthenticated = (fetchUser = false) => {
    //fetch Data
    let userData = GetCookie('currentUser')
    userData  = userData ? JSON.parse(userData) : false;
    let result = {isLoggedIn : false,currentUser: null,token: ''}
    console.log(userData)
    if(userData){
        result.isLoggedIn = true;
        result.currentUser = fetchUser ? userData.user : null;
        result.token = fetchUser ? userData.accessToken : '';
    }
    
    return result
}

// export const AuthenticationCheck = (firstLogin = false) => {
//     let navigate = useNavigate()
//     let userData = IsAuthenticated(true)
//     let user = userData.currentUser ? userData.currentUser : {}
//     if (Object.keys(user).length > 0) {
//         if (user.role === 'ROLE_PROFESSIONAL') {
//             let job = GetCookie('clickCurrentApplyJob')
//             job = job ? JSON.parse(job) : undefined
//             if (job) {
//                 navigate(`/profile/heliohire-application/referenceNumber/${job.referenceNumber}`)
//             }else if (firstLogin) {
//                 navigate(`/profile/${user.slug}?event=true`)
//             } else {
//                 navigate(`/jobs-home`)
//             }
//         }
//         else if (user.role === 'ROLE_ORGANIZATIONAL') {
//             if (firstLogin) {
//                 window.location.href = (`${process.env.serverurl}inst/institute-home-dashboard?event=true`);
//             }else{
//                 window.location.href = (`${process.env.serverurl}inst/institute-home-dashboard`);
//             }
          
//         }
//     }else{
//     }
//   }