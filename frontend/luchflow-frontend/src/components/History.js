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
        return date.toLocaleDateString('es-ES', options);
    };


    return (
        <div >
            <h1>Order History</h1>
            
                {order.length === 0 && <p>No orders found</p>}
                <div className="orderHistoryCard">
                   
                        {order.map(order => (
                        <div className="orderHistoryCardIndividual">
                            <ul>
                            <div className="upperContainer">
                            <li id="menuDateTd"><strong>Menu Date:</strong> {formatDate(order.menu_date)}</li>
                            <li id="responseDateTd"><strong>Response Date: </strong>{formatDate(order.creation_date)}</li>
                            <li id="optionSelectedTd"><strong>Option: </strong>{order.menu_option}</li>
                            </div>

                            <div className="lowerContainer">
                            <li id="menuTitleTd">{order.menu_title}</li>
                            <li id="menuDescriptionTd">{order.menu_description}</li>
                            <li id="menuDrinkTd">{order.menu_drink}</li>
                            <li id="additionalNotesTd"><strong>Notes: </strong>{order.menu_note}</li>
                            <li id="allergiesTd"><strong>Allergies: </strong>{order.menu_allergy}</li>
                            </div>
                            </ul>
                        </div>
                        ))}
                    </div>
                </div>
                
                
              
    );
}

export default History;