import React, {Fragment, useState} from "react";
import { Link } from "react-router-dom";

//toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = ({ setAuth }) => {

    const [inputs, setInputs] = useState ({
        email: "",
        password: "",
        name: ""
    })

    const { email, password, name } = inputs;

    const onChange = (e) =>{
        setInputs({...inputs, [e.target.name] : e.target.value})
    }

    const onSubmitForm = async (e) =>{
        e.preventDefault()
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
        <h1 className="text-center my-5">Register</h1>
        <form onSubmit={onSubmitForm}>
            <input type="email" name="email" placeholder="Coupa's email" className="form-control my-3" value={email} onChange={e => onChange(e)}/>
            <input type="password" name="password" placeholder="password" className="form-control my-3" value={password} onChange={e => onChange(e)}/>
            <input type="text" name="name" placeholder="Full name" className="form-control my-3" value={name} onChange={e => onChange(e)}/>

            <div className="d-grid gap-2">
                <button className="btn btn-success btn-primary">Submit</button>
            </div>
        
        </form>
        <Link to="/login">Login</Link>
        </Fragment>
    );
    };

export default Register;