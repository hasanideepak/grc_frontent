import React, {Suspense, lazy} from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet} from 'react-router-dom'
import './App.css';
import Layout from './components/layouts/MainLayout';
import PublicLayout from './components/layouts/PublicLayout';
// import Login from './pages/Login';

const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/Login"))
const Configuration = lazy(()=> import("./pages/Configuration"))
const Dashboard = lazy(()=> import("./pages/Dashboard"))
const EvidenceManager = lazy(()=> import("./pages/EvidenceManager"))
const Onboarding = lazy(()=> import("./pages/Onboarding"))
const TaskManager = lazy(()=> import("./pages/TaskManager"))

function App() {
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

                  <Route path="/" element={<RouterOutlet layout={Layout} />}>
                    <Route exact path="/home" element={<Home />}></Route>
                    <Route  path="/dashboard" element={<Dashboard />}></Route>
                    <Route  path="/onboarding" element={<Onboarding />}></Route>
                    <Route  path="/task-manager" element={<TaskManager /> }></Route>
                    <Route  path="/evidence-manager" element={<EvidenceManager /> }></Route>
                    <Route  path="/configuration" element={<Configuration /> }></Route>
                  </Route>


                  <Route path="/" element={<RouterOutlet layout={PublicLayout} />} >
                    <Route exact path="/login" element={<Login />}></Route>
                    <Route exact path="/" element={<Home />}></Route>
                  </Route>
                  
          </Routes>
        </Suspense>
      </Router>
  );
}

function RouterOutlet({layout:Layout,...rest}){
  let location = window.location.pathname
  console.log(location)
  return (
      <Layout location={location}>
        <Outlet />
      </Layout>
    
  )
}

export default App;
