import React, {Suspense, lazy, useState, createContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate, useLocation} from 'react-router-dom'
import './App.css';
import Loader from './components/partials/Loader';
import { LayoutContext } from './ContextProviders/LayoutContext';
import { IsAuthenticated } from './helpers/Auth';
import Project from './pages/Project';
import TestPage from './pages/TestPage';
// import Login from './pages/Login';

const Layout = lazy(()=> import("./components/layouts/MainLayout"))
const PublicLayout = lazy(()=> import("./components/layouts/PublicLayout"))
const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/Login"))
const Configuration = lazy(()=> import("./pages/Configuration"))
const ConfigurationScope = lazy(()=> import("./pages/ConfigurationScope"))
const Dashboard = lazy(()=> import("./pages/Dashboard"))
const EvidenceManager = lazy(()=> import("./pages/EvidenceManager"))
const Onboarding = lazy(()=> import("./pages/Onboarding"))
const TaskManager = lazy(()=> import("./pages/TaskManager"))
const TaskDetails = lazy(()=> import("./pages/TaskDetails"))
const ForgotPassword = lazy(()=> import("./pages/ForgotPassword"))
const ResetPassword = lazy(()=> import("./pages/ResetPassword"))
const Page404 = lazy(()=> import("./pages/Page404"))
const ChangePassword = lazy(()=> import("./pages/ChangePassword"))
// const {LayoutContext} = lazy(()=> import("./ContextProviders/LayoutContext"))
function App() {
  const  RouterOutlet = ({layout:Layout,...rest}) =>{
    let {isPublic = false,roles = 'admin'} = rest
    let  getAuthUser = IsAuthenticated(true)
    let isAuth = (isPublic || (!isPublic && getAuthUser.isLoggedIn)) ? true : false;
    const [showLoader, setShowLoader] = useState(false)
    const [projectId, setProjectId] = useState(null)
    const location = useLocation()
    // console.log(getAuthUser)
    let lContextObj = {showLoader,setShowLoader,projectId,setProjectId}
    
    if( isAuth){
      let is_onboard = getAuthUser.isLoggedIn && getAuthUser?.currentUser?.is_onboard == "N" ? false : true
      return !is_onboard && location.pathname != "/onboarding" ? (
        <Navigate to="/onboarding" replace />
      ) : (
        <LayoutContext.Provider value={lContextObj}>
          <Layout showLoader>
            <Outlet context={{user:getAuthUser}} />
          </Layout>
        </LayoutContext.Provider>
      );  
    }else{
      return (
        <Navigate to="/login" replace />
      )
    }
  }
  return (
    
      <Router>
        <Suspense fallback={<Loader showLoader={true} pos={'absolute'} />}>
        {/* <Suspense fallback={<div>Loading....</div>}> */}
          <Routes>

                  {/* <Route exact path="/" element={<Home />}></Route> */}
                  <Route path="/" element={<RouterOutlet layout={Layout} />}>
                    <Route exact path="/home" element={<Home />}></Route>
                    <Route exact path="/change-password" element={<ChangePassword />}></Route>
                    <Route exact path="/add-project" element={<Project />}></Route>
                    <Route  path="/dashboard" element={<Dashboard />}></Route>
                    <Route  path="/onboarding" element={<Configuration />}></Route>
                    <Route  path="/task-manager" element={<TaskManager /> }></Route>
                    <Route  path="/task-details/:taskId" element={<TaskDetails /> }></Route>
                    <Route  path="/evidence-manager" element={<EvidenceManager /> }></Route>
                    <Route  path="/configuration" element={<Configuration  /> }></Route>
                    <Route  path="/onboarding_scope/:token" element={<ConfigurationScope /> }></Route>
                    <Route  path="/configuration_scope/:token" element={<ConfigurationScope /> }></Route>
                  </Route>


                  <Route path="/" element={<RouterOutlet layout={PublicLayout} isPublic="true" />} >
                    <Route exact path="/login" element={<Login />}></Route>
                    <Route exact path="/forgotpassword" element={<ForgotPassword />}></Route>
                    <Route exact path="/resetpassword/:token" element={<ResetPassword />}></Route>
                    <Route exact path="/setpassword/:token" element={<ResetPassword />}></Route>
                    <Route exact path="/test" element={<TestPage />}></Route>
                  </Route>
                  <Route path="*" element={<PublicLayout><Page404 /> </PublicLayout>}></Route>
          </Routes>
        </Suspense>
      </Router>
  );
}



export default App;
