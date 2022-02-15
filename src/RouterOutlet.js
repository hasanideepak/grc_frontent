import React, { Suspense, lazy, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation } from 'react-router-dom'
import { LayoutContext } from './ContextProviders/LayoutContext';
import { IsAuthenticated } from './helpers/Auth';
import { GetCookie } from './helpers/Helper';

const RouterOutlet = ({ layout: Layout, ...rest }) => {
    let { isPublic = false, roles = 'admin' } = rest
    let getAuthUser = IsAuthenticated(true)
    let isAuth = (isPublic || (!isPublic && getAuthUser.isLoggedIn)) ? true : false;
    let otpVerified = (isPublic || (!isPublic && getAuthUser.otpVerified)) ? true : false;
    const [showLoader, setShowLoader] = useState(false)
    const [projectId, setProjectId] = useState(null)
    const location = useLocation()
    // console.log(getAuthUser)
    let lContextObj = { showLoader, setShowLoader, projectId, setProjectId }
    let is_onboard = getAuthUser.isLoggedIn && getAuthUser?.currentUser?.is_onboard == "N" ? false : true;

    console.log(otpVerified)
    const checkAuth = () => {
        if (!isAuth) {
            return (
                <Navigate to="/login" replace />
            )
        }else {
            if(!otpVerified){
            // if(!true){
                return (
                    <Navigate to="/otp-verification" replace />
                )
            }else{

                if (!is_onboard && location.pathname != "/onboarding") {
                    return (
                        <Navigate to="/onboarding" replace />
                    )
                } else {
                    return (
                        <LayoutContext.Provider value={lContextObj}>
                            <Layout showLoader>
                                <Outlet context={{ user: getAuthUser }} />
                            </Layout>
                        </LayoutContext.Provider>
                    )
                }
            }
                
        }

        // if (!is_onboard && location.pathname != "/onboarding") {
        //     return (
        //         <Navigate to="/onboarding" replace />
        //     )
        // } else {
        //     return (
        //         <LayoutContext.Provider value={lContextObj}>
        //             <Layout showLoader>
        //                 <Outlet context={{ user: getAuthUser }} />
        //             </Layout>
        //         </LayoutContext.Provider>
        //     )
        // }
    }

    return checkAuth();


    // if (isAuth) {

    //     return !is_onboard && location.pathname != "/onboarding" ? (
    //         <Navigate to="/onboarding" replace />
    //     ) : (
    //         <LayoutContext.Provider value={lContextObj}>
    //             <Layout showLoader>
    //                 <Outlet context={{ user: getAuthUser }} />
    //             </Layout>
    //         </LayoutContext.Provider>
    //     );
    // } else {
    //     return (
    //         <Navigate to="/login" replace />
    //     )
    // }
}

export default RouterOutlet