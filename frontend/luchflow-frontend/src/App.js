import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// components
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import MenuCreator from './components/MenuCreator';
import History from './components/History';
import DeleteUsers from './components/DeleteUsers';
import ResponsesReport from './components/ResponsesReport';
//style
import './App.css';

// toastify
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//urls
import URLS from './config';

function App() {
  

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(true);
  const [isLoading, setIsLoading] = useState(true); // New state for loading indicator

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const setAdmin = boolean => {
    setIsAdmin(boolean);
  };

  async function isAuth() {
    try {
      const response = await fetch(URLS.SERVER+"/auth/is-verified", {
        method: "GET",
        headers: { token: localStorage.token }
      });
      
      const parseRes = await response.json();
      setIsAuthenticated(parseRes === true);

    } catch (err) {
      console.error(err.message);
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }

  
  async function isAdministrator() {
    try{ //check if user is admin
      const admin = await fetch(URLS.SERVER+"/auth/admin", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "token": localStorage.token
        },
        body: JSON.stringify({ email: localStorage.email }),
      });

      const result = await admin.json();
      console.log("result.message " + result.message);
      // Check if the response contains a message indicating the user is not an admin
      if (result.message === "You are not an admin") {
        setAdmin(false);
      } else {
        setAdmin(true);
      }
    } catch (err) { 
      console.error(err.message);
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  }


  useEffect(() => {
    isAuth();
  }, []);

  useEffect(() => {
   isAdministrator();
  }
  , []);
  

  if (isLoading) {
    // Render a loading indicator while waiting for authentication status
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <ToastContainer />
      <Router>
        <div className="Appcontainer">
          {isAuthenticated && <Navbar setAuth={setAuth} isAdmin={isAdmin} />}

          <Routes>
            <Route path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/history" element={isAuthenticated ? (<History setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} setAdmin={setAdmin} />) : (<Navigate to="/dashboard" />)} />
            <Route path="/menu-creator" element={isAdmin && isAuthenticated ? (<MenuCreator />) : <Navigate to="/dashboard" />} />
            <Route path="/delete-users" element={isAdmin && isAuthenticated ? (<DeleteUsers />) : <Navigate to="/dashboard" />} />
            <Route path="/" element={!isAuthenticated ? (<Login setAuth={setAuth} setAdmin={setAdmin} />) : (<Navigate to="/dashboard" />)} />
            <Route path="/responses" element={isAdmin && isAuthenticated ? (<ResponsesReport />) : <Navigate to="/dashboard" />} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
