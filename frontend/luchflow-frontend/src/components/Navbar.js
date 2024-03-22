import React from "react";
import '../styles/navbar.css';

const Navbar = ({setAuth, isAdmin }) => {

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        localStorage.removeItem("email")
        localStorage.removeItem("isAdmin")
        setAuth(false)
    }

    

    return (
        <div className="navbar">
            <a href="/" className="logo">LunchFlow</a>
            <a href="/history">Order History</a>
            {isAdmin ? <a id="menu-creator" href="/menu-creator">Menu Creator</a> : null}
            <button onClick={(e) => logout(e)}>Logout</button>
        </div>
    );
}

export default Navbar;