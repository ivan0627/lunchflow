import React, { Fragment, useState, useEffect } from "react";
import '../styles/dashboard.css';

const Dashboard = ({ setAuth }) => {
        
    const [name, setName] = useState("");
    const [menuNote, setMenuNote] = useState({});

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

    useEffect(() => {
        const handleMenuNoteChange = (e) => {
            const note = e.target.value;
            const menuId = e.target.name.replace('menu_', ''); // Extract menuId
            setMenuNote(prevMenuNote => ({
                ...prevMenuNote,
                [menuId]: note
            }));
            console.log(menuNote); // Mantener el console.log para el campo de menuNote
        };

        const inputs = document.querySelectorAll('input[name^="menu_"]');
        inputs.forEach(input => {
            input.addEventListener('input', handleMenuNoteChange);
        });

        return () => {
            inputs.forEach(input => {
                input.removeEventListener('input', handleMenuNoteChange);
            });
        };
    }, [menus, menuNote]); // Agregar menuNote como dependencia

    const handleOptionChange = (e) => {
        const selectedOption = e.target.value;
        const menuId = e.target.name;
        const otherNotes = menuNote[e.target.name];
        // Aquí puedes manejar los cambios de opción si es necesario
    }

    const submitResponse = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/auth/responses/", {
                method: "POST",
            });

            const parseRes = await response.json();
            console.log(parseRes);
        } catch (err) {
            console.error(err.message);
        }
    }

    return (
        <Fragment>
            <h1>Welcome {name}</h1>
            <h2>Here are next week's options for lunch: </h2>
            <div className="menuSelectorContainer">
                {menus.map(menu => (
                    <div className="menuSelector" key={menu.menu_id}>
                        <h2>{menu.menu_title}</h2>
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

                        <input type="text" placeholder="Other - Additional notes" id={`otherNotes_${menu.menu_id}`} className="otherNotes" name={`menu_${menu.menu_id}`} />

                    </div>
                ))}

                {menus.length > 0 && <button id='dashboardSubmit' onClick={submitResponse}>Submit</button>}
            </div>
        </Fragment>
    );
};

export default Dashboard;
