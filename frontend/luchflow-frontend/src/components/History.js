import React, { Fragment, useState, useEffect } from "react";
import '../styles/history.css';
import { toast } from "react-toastify";

const History = ({ setAuth }) => {

    const [order, setOrder] = useState([]);


    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await 
                fetch("http://localhost:5000/order-history/", {
                    method: "GET",

                    headers: {"Content-Type": "application/json",
                    "token": localStorage.token,
                    "email": localStorage.email}
                    
                });
                const parseRes = await response.json();
                setOrder(parseRes);
                console.log(parseRes);
    
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchUserData();
    }, []);


    return (
        <div>
            <h1>Order History</h1>
            
                {order.length === 0 && <p>No orders found</p>}
               
                   <table>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Order Time</th>
                            <th>Order Total</th>
                        </tr>
                        {order.map(order => (
                        <tr>
                            <td>{order.order_id}</td>
                            <td>{order.order_date}</td>
                            <td>{order.order_time}</td>
                            <td>{order.order_total}</td>
                        </tr>
                        ))}
                    </table>
                
                
                
        </div>
    );
}

export default History;