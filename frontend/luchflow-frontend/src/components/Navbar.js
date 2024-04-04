import React from "react";
import { Navigate, Link } from "react-router-dom";
import logo from '../logo.png'
import '../styles/navbar.css';

const Navbar = ({setAuth, isAdmin }) => {

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        localStorage.removeItem("isAdmin")
        setAuth(false)
        
        {(<Navigate to="/login" />)}
    }

    

    return (
        <div className="navbar">
            <a className="logo"  href="/dashboard">
                <img src={logo} alt="logo" href="/dashboard"/>
                <Link to="/dashboard">Home </ Link>
            </a>
            <a href="/history">Order History</a>
            {isAdmin ? <a id="menu-creator" href="/menu-creator">Menu Creator</a> : null}
            <button onClick={(e) => logout(e)}>Logout</button>
        </div>
    );
}

export default Navbar;