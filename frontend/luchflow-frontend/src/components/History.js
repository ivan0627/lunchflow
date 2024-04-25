import React, {  useState, useEffect } from "react";
import '../styles/history.css';

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
                            <th id="menuDateTh">Menu Date</th>
                            <th id="responseDateTh">Response Date</th>
                            <th id="menuTitleTh">Menu Title</th>
                            <th id="menuDescriptionTh">Menu Description</th>
                            <th id="menuDrinkTh">Menu Drink</th>
                            <th id="optionSelectedTh">Option Selected</th>
                            <th id="additionalNotesTh">Additional Notes</th>
                            <th id="allergiesTh">Allergies</th>
                        </tr>
                    </thead>

                    <tbody>
                        {order.map(order => (
                        <tr >
                            <td id="menuDateTd">{formatDate(order.menu_date)}</td>
                            <td id="responseDateTd">{formatDate(order.creation_date)}</td>
                            <td id="menuTitleTd">{order.menu_title}</td>
                            <td id="menuDescriptionTd">{order.menu_description}</td>
                            <td id="menuDrinkTd">{order.menu_drink}</td>
                            <td id="optionSelectedTd">{order.menu_option}</td>
                            <td id="additionalNotesTd">{order.menu_note}</td>
                            <td id="allergiesTd">{order.menu_allergy}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                
                
                
        </div>
    );
}

export default History;