import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import "../styles/MenuCreator.css";
import URLS from "../config";

const PopupComment = ({ message }) => {
  return <div className="popup-comment">{message}</div>;
};

const MenuCreator = () => {
  const [menuTitle, setMenuTitle] = useState("");
  const [menuDescription, setMenuDescription] = useState("");
  const [menuDate, setMenuDate] = useState("");
  const [menuDrink, setMenuDrink] = useState("");
  const [menuDays, setMenuDays] = useState([]);
  const [quantity, setQuantity] = useState(0);
  const [options, setOptions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);

  const handleDateChange = (e) => {
    const { value } = e.target;
    setMenuDate(value);
  };

  const handleMenuTitleChange = (e) => {
    const { value } = e.target;
    setMenuTitle(value);
  };

  const handleDescriptionChange = (e) => {
    const { value } = e.target;
    setMenuDescription(value);
  };

  const handleDrinkChange = (e) => {
    const { value } = e.target;
    setMenuDrink(value);
  };

  const handleQuantityChange = (e) => {
    const { value } = e.target;
    setQuantity(value);
    // Generating additional input fields based on quantity
    const newOptions = [];
    for (let i = 0; i < value; i++) {
      newOptions.push("");
    }
    setOptions(newOptions);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const repeatOptions = () => {
    const previousMenuDay = menuDays[menuDays.length - 1];
    if (previousMenuDay) {
      setOptions(previousMenuDay.options.slice(0, quantity));
    }
  };

  const addMenuDay = () => {
    // Check if any of the required fields are empty
    if (!menuDate || !menuTitle || !menuDescription) {
      setShowPopup(true);
      return;
    }

    const newMenuDay = {
      date: menuDate,
      title: menuTitle,
      description: menuDescription,
      drink: menuDrink,
      options: options.slice(0, quantity) // Include only selected quantity of options
    };
    setMenuDays([...menuDays, newMenuDay]);
    // Clear input fields after adding a menu day
    setMenuDate("");
    setMenuTitle("");
    setMenuDescription("");
    setMenuDrink("");
    setOptions([]);
    setShowPopup(false);
  };
  //date format
  const formatDate = (dateString) => {const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  const utcOffset = -5 * 60;
  date.setMinutes(date.getMinutes() - utcOffset);
    return date.toLocaleDateString('es-ES', options).toUpperCase();

  };
  //delete menu day
  const deleteMenuDay = (index) => {
    return () => {
      const newMenuDays = [...menuDays];
      newMenuDays.splice(index, 1);
      setMenuDays(newMenuDays);
    }
  };

  //Clear all menu days
  const clearMenuDays = () => {
    setMenuDays([]);
  };
  
// send the menu to the backend
const saveMenu = async (e) => {
  e.preventDefault();

  try {
    // Iterate through each menuDay and send its data to the backend
    for (let i = 0; i < menuDays.length; i++) {
      const requestData = {
        menu_date: menuDays[i].date,
        menu_title: menuDays[i].title,
        menu_description: menuDays[i].description,
        menu_drink: menuDays[i].drink,
        user_email: localStorage.email
      };

      // Ensure options are populated and include only selected quantity
      const optionsForMenuDay = menuDays[i].options.slice(0, quantity);

      // Add options dynamically to the requestData object
      for (let j = 0; j < optionsForMenuDay.length; j++) {
        requestData[`option${j + 1}`] = optionsForMenuDay[j];
      }

      const response = await fetch(URLS.SERVER+"/menu-creator/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
        body: JSON.stringify(requestData), // Send the requestData object in the body
      });

      const menu = await response.json();
      console.log(menu);
      toast.success("Menu created successfully");
      clearMenuDays();
    }
  } catch (err) {
    console.error(err.message);
  }

};


useEffect(() => {
  async function getMenuHistory() {
    try {
      const response = await fetch(URLS.SERVER+"/menu-history/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
          
        },
      });
      const parseRes = await response.json();
      setOrderHistory(parseRes);
      
    } catch (err) {
      console.error(err.message);
    }
  }
  getMenuHistory();
}, []);

const deleteOldMenu = (index) => {
  return async () => {
    try {
      const response = await fetch(URLS.SERVER+`/menu-history/${orderHistory[index].menu_id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.token,
        },
      });
      const parseRes = await response.json();
      console.log(parseRes);
      toast.success("Menu deleted successfully");
      const newOrderHistory = [...orderHistory];
      newOrderHistory.splice(index, 1);
      setOrderHistory(newOrderHistory);
    } catch (err) {
      console.error(err.message);
    }
  };
}

  return (
    <div className="outsidecontainer">
      <h1>Menu Creator</h1>
      <div className="maincontainer">
        <div className="menucontainer">
          <input
            id="menuDateInput"
            type="date"
            value={menuDate}
            onChange={handleDateChange}
            required
          />

          <input
            id="menuTitleInput"
            name="menuTitleInput"
            placeholder="Enter The Menu Title"
            value={menuTitle}
            onChange={handleMenuTitleChange}
            required
            type="text"
          />

          <textarea
            id="menuDescriptionInput"
            placeholder="Add description of the menu"
            value={menuDescription}
            onChange={handleDescriptionChange}
            required
          />

          <input
            placeholder="Add drink of the menu"
            value={menuDrink}
            onChange={handleDrinkChange}
          />

          {/* Number selector to insert # of inputs/options */}
          <label htmlFor="quantity">Number of options:</label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            min="1"
            max="10"
            onChange={handleQuantityChange}
          />
          <br />

          {/* Additional input fields based on quantity */}
          {options.map((option, index) => (
            <div key={index} className="additionalinputs">
              <input
                id="optionInput"
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                required
              />
              <br />
            </div>
          ))}
          <div className="menucontainerbuttons">
          <button onClick={addMenuDay}>Add Menu</button>
          <button onClick={repeatOptions}>Repeat previos options for this day</button>
            
          </div>
          {showPopup && <PopupComment message="Please fill in all required fields." />}
           
        </div>
        <form className="menuresults" onSubmit={saveMenu}>
          <h3>Your responses:</h3>
          {menuDays.map((menuDay, index) => (
            <div key={index} className="menuresultseach">
              <p id="pdate">Date: {menuDay.date} {formatDate(menuDay.date)}</p>
              <p id="ptitle">Title: {menuDay.title}</p>
              <p><strong>Description:</strong> {menuDay.description}</p>
              <p><strong>Drink:</strong> {menuDay.drink}</p>
              <p><strong>Options:</strong></p>
              <ul id="optionsList">
                {menuDay.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
               <button onClick={deleteMenuDay(index)} type="button" id="deleteMenuButton">Delete</button>
            </div>
            ))}
            
            <div>
              {menuDays.length > 0 && (
                <div className="savemenucontainer">
                  <button id='savemenu' type='submit' >Save Menu</button>
                </div>
              )}
            </div>
        </form>

        <div className="previousMenus">
          <table>
                    <tr>
                      <th id="dateColumn">Date</th>
                      <th id="titleColumn">Title</th>
                      <th>Description</th>
                      <th>Drink</th>
                      <th>Options</th>
                      <th id="deleteColumn"></th>
                    </tr>
          {orderHistory.map((order, index) => (
                  
                  
                  <tr key={order.menu_id}>
                    <td>{formatDate(order.menu_date)}</td>
                    <td>{order.menu_title}</td>
                    <td id="orderHistoryDescription">{order.menu_description}</td>
                    <td>{order.menu_drink}</td>
                    <td>
                      <ul>
                        {Object.keys(order).map((key) => {
                          if (key.includes("option")) {
                            return <li key={key}>{order[key]}</li>;
                          }
                          return null;
                        })}
                      </ul>
                    </td>
                    <td>
                      <button id='deleteOldMenuButton' type="button" onClick={deleteOldMenu(index)}>Delete</button>
                    </td>
                  </tr>
                ))}
            </table>
        </div>                
      </div>
    </div>
  );
};

export default MenuCreator;
