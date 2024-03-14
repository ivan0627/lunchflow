import React, {Fragment, useState} from "react";
import { Link } from "react-router-dom";

// toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = ({ setAuth }) => {
    
    const [inputs, setInputs] = useState ({
        email: "",
        password: ""
    })
    
    const { email, password } = inputs;

    const onChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value})
    }
    
    const onSubmitForm = async (e) =>{
        e.preventDefault()
        try{
            const body = {email, password}
            const response = await fetch ("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {"Content-Type" : "application/json"},
            body : JSON.stringify(body)
            })
            const parseRes = await response.json()
            if(parseRes.token){
                localStorage.setItem('token', parseRes.token)
                setAuth(true)
                toast.success("Logged in Successfully!")
            }else{
                setAuth(false)
                toast.error(parseRes.message)
                toast.error(parseRes)
            }

        }
        catch (err) {
            console.log(err.message)
        }
    }

    return (
        <Fragment>
         <ToastContainer />

         <h1 className="text-center my-5" >Login</h1>
         <form onSubmit={onSubmitForm}>
            <input type="email" name="email" placeholder="Your Coupa's email" className="form-control my-3" value={email} onChange={e => onChange(e)}></input>
            <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)} ></input>
            <div className="d-grid gap-2">
                <button className="btn btn-success btn-primary">Submit</button>
            </div>         
         </form>
            <Link to="/register">Register</Link>
        </Fragment>
    );
    };

export default Login;