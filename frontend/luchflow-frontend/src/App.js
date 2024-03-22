import React, { Fragment, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
// components
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import Navbar from './components/Navbar';
import MenuCreator from './components/MenuCreator';

//style
import './App.css';

// toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const debounce = (callback, delay) => {
    let timeoutId;
    return function (...args) {
      const context = this;
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => callback.apply(context, args), delay);
    };
  };
  
  const ResizeObserver = (callback) => {
    useEffect(() => {
      const debouncedCallback = debounce(callback, 20);
      const observer = new window.ResizeObserver(debouncedCallback);
      return () => {
        observer.disconnect();
      };
    }, [callback]);
  
    return null; // This component doesn't render anything
  };
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state for loading indicator

  const setAuth = boolean => {
    setIsAuthenticated(boolean);
  };

  const setAdmin = value => {
    setIsAdmin(value);
  };

  async function isAuth() {
    try {
      const response = await fetch("http://localhost:5000/auth/is-verified", {
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
      const admin = await fetch("http://localhost:5000/auth/admin", {
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
        localStorage.setItem("isAdmin", true);
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
        <div className="container">
          {isAuthenticated && <Navbar setAuth={setAuth} isAdmin={isAdmin} />}
          
          <Routes>
            <Route path="/dashboard" element={isAuthenticated ? (<Dashboard setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/register" element={!isAuthenticated ? (<Register setAuth={setAuth} />) : (<Navigate to="/login" />)} />
            <Route path="/login" element={!isAuthenticated ? (<Login setAuth={setAuth} setAdmin={setAdmin} />) : (<Navigate to="/dashboard" />)} />
            <Route path="/menu-creator" element={isAdmin && isAuthenticated ? (<MenuCreator />) : <Navigate to="/dashboard" />} />
            <Route path="/" element={!isAuthenticated ? (<Login setAuth={setAuth} setAdmin={setAdmin} />) : (<Navigate to="/dashboard" />)} />
          </Routes>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
