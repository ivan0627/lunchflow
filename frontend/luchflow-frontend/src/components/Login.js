import React, {Fragment, useState, useEffect} from "react";
import { Link } from "react-router-dom";
import logo from '../logo.png'
import URLS from "../config";

// toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

//style
import "../styles/login.css"

const Login = ({setAuth, setAdmin}) => {

    const [inputs, setInputs] = useState ({
        email: "",
        password: ""
    })
    //const [isAdmin, setAdmin] = useState(false);

    const { email, password } = inputs;

    const onChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value})
    }
    
    const onSubmitForm = async (e) =>{
        e.preventDefault()
        
        try{
            const body = {email, password}
            console.log(JSON.stringify(inputs))
            const response = await fetch (URLS.SERVER+"/auth/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body : JSON.stringify(body)
            })
            const parseRes = await response.json()
            
            if(parseRes.token){
                localStorage.setItem('token', parseRes.token)
                setAuth(true)
                toast.success("Logged in Successfully!")
                localStorage.setItem('email', email)
            }else{
                setAuth(false)
                toast.error(parseRes.message)
                toast.error(parseRes)
            }

            
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
                
                        
        }
        catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Fragment className='fragment'>
         <ToastContainer />
         
        <div className="loginContainer">
            
         <h1>Welcome - Login</h1>
        <div className="logoLoginContainer">
            <div className="logoLogin">
                    <img src={logo} alt="logo" />
            </div>
        </div>    
            
            <form onSubmit={onSubmitForm} className="loginForm" >
                
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Your Coupa's email" 
                    className="form-control my-3" 
                    value={email} 
                    onChange={e => onChange(e)}>

                </input>
                
                <input 
                type="password" 
                name="password" 
                placeholder="password" 
                className="form-control my-3" 
                value={password} 
                onChange={e => onChange(e)} >
                </input>

                <div className="d-grid gap-2">
                    <button className="btn btn-success btn-primary">Submit</button>
                </div>         
            </form>
             <div className="registerButton">
                <p>Don't have an account? </p>
                <br></br>
                <Link to="/register" id="registerButton">Register here</Link>
                </div>
        </div>
        </Fragment>
    );
    };

export default Login;