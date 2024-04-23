import React, { useState, useEffect, useRef } from "react";
import { DownloadTableExcel } from 'react-export-table-to-excel';
import URLS from "../config";

import { ToastContainer, toast } from 'react-toastify';
import '../styles/history.css';


const ResponsesReport = ({ setAuth }) => {

    const [responses, setResponses] = useState([]);
    const tableRef = useRef(null);


    useEffect(() => {

        async function getResponses() {
            try {
                const response = await fetch(URLS.SERVER+"/responses-report", {
                    method: "GET",
                    
                    headers: { 
                        "Content-Type": "application/json",
                        token: localStorage.token 
                    }
                });

                const parseRes = await response.json();
                
                setResponses(parseRes);

            } catch (err) {
                console.error(err.message);
                toast.error("Server error");

            }
        }
        getResponses();
    }, []);

    //date format 
    const formatDate = (dateString) => {const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    const utcOffset = -5 * 60;
    date.setMinutes(date.getMinutes() - utcOffset);
      return date.toLocaleDateString('es-ES', options).toUpperCase();
  
    };


    return (
        <div className="tableContainer">
            <h1>Responses Report</h1>
            
            <table ref={tableRef}>
                <thead>
                    <tr>
                        <th>Menu Date</th>
                        <th>Menu ID</th>                        
                        <th>Menu Title</th>
                        <th>User Name</th>
                        <th>Email</th>
                        <th>Response Date</th>
                        <th>Option</th>
                        <th>Notes</th>
                        <th>Allergies</th>
                    </tr>
                </thead>
                <tbody>
                    {responses.map(response => (
                        <tr key={response.response_id}>
                            
                            <td>{formatDate(response.menu_date)}</td>  
                            <td>{response.menu_id}</td>
                            <td>{response.menu_title}</td>
                            <td>{response.user_name}</td>
                            <td>{response.user_email}</td>
                            <td>{formatDate(response.creation_date)}</td>                          
                            <td>{response.menu_option}</td>
                            <td>{response.menu_note}</td>
                            <td>{response.menu_allergy}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <DownloadTableExcel
                    filename="responses"
                    sheet="responses"
                    currentTableRef={tableRef.current}
                >

                   <button id="exportExcel"> Export to excel </button>
                    
            </DownloadTableExcel>
            <ToastContainer />
        </div>
    );
}

export default ResponsesReport;