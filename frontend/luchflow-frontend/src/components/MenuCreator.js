import React, { useState } from "react";
import moment from 'moment';
import "../styles/MenuCreator.css";

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

  console.log(menuDate)
  const formatDate = (dateString) => {const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const date = new Date(dateString);
  const utcOffset = -5 * 60;
  date.setMinutes(date.getMinutes() - utcOffset);
    return date.toLocaleDateString('es-ES', options).toUpperCase();
  };

  return (
    <div>
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

          <button onClick={addMenuDay}>Add Menu</button>
          <button onClick={repeatOptions}>Repeat previos options for this day</button>
          {showPopup && <PopupComment message="Please fill in all required fields." />}
        </div>
        <div className="menuresults">
          <h2>Responses<h2/>
          {menuDays.map((menuDay, index) => (
            <div key={index} className="menuresultseach">
              <p id="pdate">Date: {menuDay.date} {formatDate(menuDay.date)}</p>
              <p id="ptitle">Title: {menuDay.title}</p>
              <p>Description: {menuDay.description}</p>
              <p>Drink: {menuDay.drink}</p>
              <p>Options:</p>
              <ul>
                {menuDay.options.map((option, optionIndex) => (
                  <li key={optionIndex}>{option}</li>
                ))}
              </ul>
            </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default MenuCreator;
