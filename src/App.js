import React, {Suspense, lazy} from 'react';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css';
import Layout from './components/layouts/MainLayout';
import Dashboard from './pages/Dashboard';
// import Login from './pages/Login';

const Home = lazy(()=> import("./pages/Home"))
const Login = lazy(()=> import("./pages/Login"))

function App() {
  return (
    <Layout>
      <Router>
        <Suspense fallback={<div>Loading....</div>}>
          <Routes>
            <Route exact path="/" element={<Home />}></Route>
            <Route exact path="/home" element={<Home />}></Route>
            <Route exact path="/login" element={<Login />}></Route>
            <Route exact path="/dashboard" element={<Dashboard />}></Route>
          </Routes>
        </Suspense>
      </Router>
    </Layout>
  );
}

export default App;
