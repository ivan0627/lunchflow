import React, { Fragment, useState, useEffect } from "react";
import '../styles/dashboard.css';
import { toast } from "react-toastify";
import URLS from "../config";

const Dashboard = ({ setAuth }) => {
    const [name, setName] = useState("");
    const [menus, setMenus] = useState([]);
    const [menuSelections, setMenuSelections] = useState({}); // Para almacenar selecciones de menú y notas

    

    const formatDate = (dateString) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        const utcOffset = -5 * 60;
        date.setMinutes(date.getMinutes() - utcOffset);
        return date.toLocaleDateString('es-ES', options).toUpperCase();
    };

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await fetch(URLS.SERVER+"/dashboard/", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const parseRes = await response.json();
                setName(parseRes.user_name);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchUserData();
    }, []);

    useEffect(() => {
        async function fetchMenus() {
            try {
                const response = await fetch(URLS.SERVER+"/menus/", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
                const parseRes = await response.json();
                setMenus(parseRes);
                
                // Inicializar menuSelections con las opciones por defecto para cada menú
                const initialSelections = {};
                parseRes.forEach(menu => {
                    initialSelections[`menu_${menu.menu_id}`] = { option: null, note: "", allergy: ""};
                });
                setMenuSelections(initialSelections);
            } catch (err) {
                console.error(err.message);
            }
        }
        fetchMenus();
    }, []);

    const handleOptionChange = (menuId, selectedOption) => {
        setMenuSelections(prevSelections => ({
            ...prevSelections,
            [menuId]: {
                ...prevSelections[menuId],
                option: selectedOption
            }
        }));
    };

    const handleMenuNoteChange = (menuId, note) => {
        setMenuSelections(prevSelections => ({
            ...prevSelections,
            [menuId]: {
                ...prevSelections[menuId],
                note: note
            }
        }));
    };

    const handleMenuAllergyChange = (menuId, allergy) => {
        setMenuSelections(prevSelections => ({
            ...prevSelections,
            [menuId]: {
                ...prevSelections[menuId],
                allergy: allergy
            }
        }))
    };

    const submitResponse = async (e) => {
        e.preventDefault();
    
        for (const menuId in menuSelections) {
            const { option, note } = menuSelections[menuId];
            const matchingMenu = menus.find(menu => `menu_${menu.menu_id}` === menuId);
    
            if (matchingMenu && option !== null) { // Verificar que se haya seleccionado una opción
                let menuNoteToSend = note; // Mantener la nota original
    
                // Reemplazar note con cadena vacía si está vacía
                if (!menuNoteToSend) {
                    menuNoteToSend = "";
                }
                if (!menuSelections[menuId].allergy) {
                    menuSelections[menuId].allergy = "";
                }
    
                const requestData = {
                    user_email: localStorage.email,
                    menu_date: matchingMenu.menu_date,
                    menu_title: matchingMenu.menu_title,
                    menu_description: matchingMenu.menu_description,
                    menu_drink: matchingMenu.menu_drink,
                    menu_id: matchingMenu.menu_id,
                    menu_option: option,
                    menu_note: menuNoteToSend, // Enviar cadena vacía en lugar de null si la nota está vacía
                    menu_allergy: menuSelections[menuId].allergy
                };
    
                try {
                    const response = await fetch(URLS.SERVER+"/responses/", {
                        method: "POST",
                        body: JSON.stringify(requestData),
                        headers: {
                            "Content-Type": "application/json",
                            "token": localStorage.token,
                        }
                    });
                    const parseRes = await response.json();
                    if (parseRes === "Response already submitted") {
                        toast.error(parseRes)
                        toast.error(parseRes.message)
                    }else{
                        toast.success("Response submitted successfully");
                    }
                    
                    
                } catch (err) {
                    console.error(err.message);
                    
                }
            } else {
                console.error(`Menu with ID ${menuId} not found or no option selected`);
                
            }
        }
    
        // Limpiar selecciones después de enviar
        const initialSelections = {};
        menus.forEach(menu => {
            initialSelections[`menu_${menu.menu_id}`] = { option: null, note: "", allergy: ""};
        });
        setMenuSelections(initialSelections);
    };
    
    return (
        <Fragment>
            <h1>Welcome {name}</h1>
            <h2>Here are next week's options for lunch:</h2>
            <div className="menuSelectorContainer">
                {menus.map(menu => (
                    <div className="menuSelector" key={menu.menu_id}>
                        <h2>{menu.menu_title}</h2>
                        <p>Date: {formatDate(menu.menu_date)}</p>
                        <p>{menu.menu_description}</p>
                        <p>{menu.menu_drink}</p>
                        {Array.from({ length: 10 }, (_, index) => index + 1).map(optionIndex => {
                            const optionKey = `option_${optionIndex}`;
                            if (menu[optionKey] !== null) {
                                return (
                                    <div key={`${menu.menu_id}_${optionIndex}`} id="optionBox">
                                        <p>{menu[optionKey]}</p>
                                        <input
                                            type="radio"

                                            id="radio"
                                            name={`menu_${menu.menu_id}`}
                                            value={menu[optionKey]}
                                            onChange={(e) => handleOptionChange(`menu_${menu.menu_id}`, e.target.value)}
                                        />
                                    </div>
                                );
                            } else {
                                return null;
                            }
                        })}
                        
                        <input
                            
                            type="text"
                            placeholder="Other - Additional notes"
                            className="otherNotes"
                            value={menuSelections[`menu_${menu.menu_id}`].note}
                            onChange={(e) => handleMenuNoteChange(`menu_${menu.menu_id}`, e.target.value)}
                        />
                        <input 
                            type="text"
                            placeholder='Allergies to any food? Please specify here.'
                            className='otherNotes'
                            value={menuSelections[`menu_${menu.menu_id}`].allergy}
                            onChange={(e) => handleMenuAllergyChange(`menu_${menu.menu_id}`, e.target.value)}
                        
                        />
                    </div>
                ))}
                {menus.length > 0 && <button id='dashboardSubmit' onClick={submitResponse}>Submit</button>}
            </div>
        </Fragment>
    );
};

export default Dashboard;
