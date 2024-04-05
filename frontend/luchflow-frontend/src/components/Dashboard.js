import React, { Fragment, useState, useEffect } from "react";
import '../styles/dashboard.css';

const Dashboard = ({ setAuth }) => {
        
    const [name, setName] = useState("");
    const [menuNote, setMenuNote] = useState({});
    const [optionSelected, setOptionSelected] = useState([]);

    async function getName() {
        try {
            const response = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();

            setName(parseRes.user_name);
        } catch (err) {
            console.error(err.message);
        }
    }

    useEffect(() => {
        getName();
    }, []);

    const [menus, setMenus] = useState([]);

    const getMenus = async () => {
        try {
            const response = await fetch("http://localhost:5000/auth/menus/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            setMenus(parseRes);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        getMenus();
    }, []);
    
    const handleOptionChange = (e) => {
        const selectedOption = e.target.value;
        const menuId = e.target.name; // We will keep the "menu_" prefix here
        const note = menuNote[menuId];
        
        const existingOptionIndex = optionSelected.findIndex(item => item.menuId === menuId);
        
        if (existingOptionIndex !== -1) {
            const updatedOptionSelected = [...optionSelected];
            updatedOptionSelected[existingOptionIndex] = { menuId, option: selectedOption, note };
            setOptionSelected(updatedOptionSelected);
        } else {
            setOptionSelected(prevOptions => [...prevOptions, { menuId, option: selectedOption, note }]);
        }
    };

    const handleMenuNoteChange = (menuId, note) => {
        setMenuNote(prevMenuNote => ({
            ...prevMenuNote,
            [menuId]: note
        }));
    }

    const submitResponse = async (e) => {
        e.preventDefault();
    
        for (let i = 0; i < optionSelected.length; i++) {
            const menuId = optionSelected[i].menuId;
            const menu = menus.find(menu => menu.menu_id === menuId.substring(5)); // Remove the "menu_" prefix here
            
            if (menu) {
                const requestData = {
                    user_email: localStorage.email,
                    menu_date: menu.menu_date,
                    menu_title: menu.menu_title,
                    menu_description: menu.menu_description,
                    menu_drink: menu.menu_drink,
                    menu_id: menuId,
                    menu_option: optionSelected[i].option,
                    menu_note: optionSelected[i].note,
                };
    
                try {
                    await fetch("http://localhost:5000/auth/responses/", {
                        method: "POST",
                        body: JSON.stringify(requestData),
                        headers: {
                            "Content-Type": "application/json",
                            "token": localStorage.token,
                        }
                    });
                } catch (err) {
                    console.error(err.message);
                }
            } else {
                console.error(`Menu with ID ${menuId} not found`);
            }
        }

        // Clear selected options and notes after submission
        setOptionSelected([]);
        setMenuNote({});
    };
    

    return (
        <Fragment>
            <h1>Welcome {name}</h1>
            <h2>Here are next week's options for lunch: </h2>
            <div className="menuSelectorContainer">
                {menus.map(menu => (
                    <div className="menuSelector" key={menu.menu_id}>
                        <h2>{menu.menu_title}</h2>
                        <p>{menu.menu_date}</p>
                        <p>{menu.menu_description}</p>
                        <p>{menu.menu_drink}</p>
                        {Array.from({ length: 10 }, (_, index) => index + 1).map(optionIndex => {
                            const optionKey = `option_${optionIndex}`;
                            if (menu[optionKey] !== null) {
                                return (
                                    <div key={menu.menu_id + optionIndex} id="optionBox">
                                        <p>{menu[optionKey]}</p>
                                        <input type="radio" name={`menu_${menu.menu_id}`} value={menu[optionKey]} onChange={handleOptionChange} />
                                    </div>
                                );
                            } else {
                                return null;
                            }

                        })}

                        <input 
                            type="text" 
                            placeholder="Other - Additional notes" 
                            value={menuNote[`menu_${menu.menu_id}`] || ''} 
                            onChange={(e) => handleMenuNoteChange(`menu_${menu.menu_id}`, e.target.value)} 
                        />

                    </div>
                ))}

                {menus.length > 0 && <button id='dashboardSubmit' onClick={submitResponse}>Submit</button>}
            </div>
        </Fragment>
    );
};

export default Dashboard;
