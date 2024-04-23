import React, { Fragment, useState, useEffect } from "react";
import '../styles/history.css';
import { toast } from "react-toastify";
import URLS from "../config";

const History = ({ setAuth }) => {

    const [order, setOrder] = useState([]);


    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await 
                fetch(URLS.SERVER+"/order-history/", {
                    method: "GET",

                    headers: {"Content-Type": "application/json",
                    "token": localStorage.token,
                    "email": localStorage.email}
                    
                });
                const parseRes = await response.json();
                setOrder(parseRes);
    
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        const utcOffset = -5 * 60;
        date.setMinutes(date.getMinutes() - utcOffset);
        return date.toLocaleDateString('es-ES', options).toUpperCase();
    };


    return (
        <div >
            <h1>Order History</h1>
            
                {order.length === 0 && <p>No orders found</p>}
                <div className="tableContainer">
                   <table className="ordersTable">
                    <thead>
                        <tr>
                            <th >Menu Date</th>
                            <th>Response Date</th>
                            <th>Menu Title</th>
                            <th>Menu Description</th>
                            <th>Menu Drink</th>
                            <th>Option Selected</th>
                            <th>Additional Notes</th>
                            <th>Allergies</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.map(order => (
                        <tr >
                            <td>{formatDate(order.menu_date)}</td>
                            <td>{formatDate(order.creation_date)}</td>
                            <td>{order.menu_title}</td>
                            <td>{order.menu_description}</td>
                            <td>{order.menu_drink}</td>
                            <td>{order.menu_option}</td>
                            <td>{order.menu_note}</td>
                            <td>{order.menu_allergy}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                
                
                
        </div>
    );
}

export default History;