import React, {Fragment, useState, useEffect} from "react";
import '../styles/dashboard.css';

const Dashboard = ({setAuth}) => {
    
    const [name, setName] = useState("")

    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: {token: localStorage.token}
            });

            const parseRes = await response.json()
            
            setName(parseRes.user_name)
        } catch (err) {
            console.error(err.message)
        }
    }

    const logout = (e) => {
        e.preventDefault()
        localStorage.removeItem("token")
        setAuth(false)
    }

    useEffect(() => {
        getName()
    }, [])

    return (        
        <Fragment>
            <h2>Welcome {name}</h2>
            
        </Fragment>
    );
    };

export default Dashboard;