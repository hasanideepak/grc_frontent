import React, {Suspense, lazy, useState, createContext} from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate} from 'react-router-dom'
import './App.css';
import { LayoutContext } from './ContextProviders/LayoutContext';
// import Layout from './components/layouts/MainLayout';
// import PublicLayout from './components/layouts/PublicLayout';
import { IsAuthenticated } from './helpers/Auth';
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
// const {LayoutContext} = lazy(()=> import("./ContextProviders/LayoutContext"))
function App() {
  const  RouterOutlet = ({layout:Layout,...rest}) =>{
    let {isPublic = false,roles = 'admin'} = rest
    let  getAuthUser = IsAuthenticated(true)
    let isAuth = (isPublic || (!isPublic && getAuthUser.isLoggedIn)) ? true : false;
    const [showLoader, setShowLoader] = useState(false)
    // console.log(getAuthUser)
    let lContextObj = {showLoader,setShowLoader}
    return isAuth ? (
        <LayoutContext.Provider value={lContextObj}>
          <Layout showLoader>
            <Outlet context={{user:getAuthUser}} />
          </Layout>
        </LayoutContext.Provider>
      ) : (
          <Navigate to="/login" replace />
      );
  }
  return (
    
      <Router>
        <Suspense fallback={<div>Loading....</div>}>
          <Routes>
            {/* public layout routes start */}
            {/* <Route>
                <PublicLayout>
                  <Route exact path="/" element={<Home />}></Route>
                  <Route exact path="/home" element={<Home />}></Route>
                  <Route exact path="/login" element={<Login />}></Route>
                </PublicLayout>
            </Route> */}
            {/* public layout routes end */}

            {/* after login layout routes start */}
            {/* <Route>
                <Layout>
                  <Route exact path="/dashboard" element={<Dashboard />}></Route>
                  <Route exact path="/onboarding" element={<Onboarding />}></Route>
                  <Route exact path="/task-manager" element={<TaskManager /> }></Route>
                  <Route exact path="/evidence-manager" element={<EvidenceManager /> }></Route>
                  <Route exact path="/configuration" element={<Configuration /> }></Route>
                </Layout>
            </Route> */}
            {/* after login layout routes end */}

                  {/* <Route exact path="/" element={<Home />}></Route> */}
                  <Route path="/" element={<RouterOutlet layout={Layout} />}>
                    <Route exact path="/home" element={<Home />}></Route>
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
                  </Route>

                  <Route path="/test" element={<PublicLayout><TestPage /> </PublicLayout>}></Route>
                  <Route path="*" element={<PublicLayout><Page404 /> </PublicLayout>}></Route>

                  
                  
          </Routes>
        </Suspense>
      </Router>
  );
}



export default App;
