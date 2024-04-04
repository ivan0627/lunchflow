import React, {Fragment, useState} from "react";
import { Link } from "react-router-dom";
import "../styles/register.css"

//toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState ({
        email: "",
        password: "",
        name: "",
        repeatPassword: "",
    })

    const { email, password, name, repeatPassword } = inputs;

    const onChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value})
    }

    const onSubmitForm = async (e) =>{
        e.preventDefault()

        //function to check if passwords match
        if (password !== repeatPassword) {
            toast.error("Passwords do not match");
            return;
        }
      

        try{
            const body = {email, password, name}
            const response = await fetch ("http://localhost:5000/auth/register", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body : JSON.stringify(body)
        })
        const parseRes = await response.json()
    if (parseRes.token) {
        localStorage.setItem('token', parseRes.token)
        setAuth(true)
        toast.success("Registered Successfully!")
    }
    else {
        setAuth(false)
        toast.error(parseRes)
        toast.error(parseRes.message)
    }

    }
        catch (err) {
            console.log(err.message)
        }
    }

    return (

        <Fragment>
        <ToastContainer />
        <div className="registerContainer">
        <h1 className="text-center my-5">Register</h1>
        <form onSubmit={onSubmitForm} className="registerForm">
            <input type="email" name="email" placeholder="Coupa's email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
            <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
            <input type="password" name="repeatPassword" value={repeatPassword}  placeholder="repeat the password" className="form-control my-3" onChange={e => onChange(e)}/>
            <input type="text" name="name" placeholder="Full name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>

            <div className="d-grid gap-2">
                <button className="" >Submit</button>
            </div>

        
        </form>
        
        <div className="loginButton">
                <p>Already have an account? </p>
                <br></br>
            <Link to="/login" id="loginButton">Login</Link>
            </div>
        </div>
      
        </Fragment>
    );
    };

export default Register;