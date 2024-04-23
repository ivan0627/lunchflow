import React, { Fragment, useState, useEffect } from "react";
import '../styles/deleteUsers.css';
import { toast } from "react-toastify";
import URLS from "../config";

const DeleteUsers = ({ setAuth }) => {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        async function getUsers() {
            try {
                const response = await fetch(URLS.SERVER+"/delete-users", {
                    method: "GET",
                    
                    headers: { 
                        "Content-Type": "application/json",
                        token: localStorage.token 
                    }
                });

                const parseRes = await response.json();
                
                setUsers(parseRes);

            } catch (err) {
                console.error(err.message);
                toast.error("Server error");

            }
        }
        getUsers();
    }, []);

    const deleteUser = async (email) => {
        try {
            console.log(email)
            const response = await fetch(URLS.SERVER+`/delete-users/${email}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json",
                token: localStorage.token }
            });
            
            const parseRes = await response.json();
            if(parseRes === "User was deleted!") {
                toast.success("User was deleted!");
            setUsers(users.filter(user => user.user_email !== email));
        }
        } catch (err) {
            toast.error("Server error");

            console.error(err.message);
        }
    }

    const makeAdmin = async (email) => {
        try {
            const response = await fetch(URLS.SERVER+"/delete-users", {
                method: "PUT",
                headers: { "Content-Type": "application/json",
                token: localStorage.token },
                body: JSON.stringify({ email })
            });
            const parseRes = await response.json();
            if(parseRes === "User was updated!") {
                toast.success("User was updated!");
            }
        } catch (err) {
            toast.error("Server error");
            console.error(err.message);
        }
    }


    return (
        <Fragment>
            <h1>Delete Users</h1>
            <div className="mainContainer">
                <div className="tableContainerDeleteUsers">
                    <table>
                        <thead>
                            <tr>
                                <th id="emailColumn">Email</th>
                                <th>Name</th>
                                <th>Role</th>
                                <th id="deleteUserColumn">Action</th>
                                <th>Modify Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            
                                {
                                    users.map(user => (
                                        <tr key={user.user_email}>
                                            <td >{user.user_email}</td>
                                            <td>{user.user_name}</td>
                                            <td>{user.role}</td>
                                            <td>
                                                <button id="deleteUserButton"
                                                onClick={() => deleteUser(user.user_email)} >Delete</button>
                                            </td>
                                            <td>
                                                <button 
                                                id="modifyRoleButton"
                                                onClick={() => makeAdmin(user.user_email)}>Make admin</button>
                                            </td>
                                        </tr>
                                    ))
                                }
                            
                        </tbody>
                    </table>
                </div>
                



            </div>

        </Fragment>
    );
    

    
}

export default DeleteUsers;