import React, { useState, useEffect } from "react";
import "../styles/food.css";

const Food = ({ selectedWeek, onWeekChange, onReturn }) => {
  const [dates, setDates] = useState([]);
  const [currentMealDay, setCurrentMealDay] = useState(null);
  const [mealInput, setMealInput] = useState("");
  const [mealType, setMealType] = useState("breakfast");
  const [mealToEdit, setMealToEdit] = useState(null);

  // Initialize meals from localStorage or empty object
  const [meals, setMeals] = useState(() => {
    const savedMeals = localStorage.getItem('meals');
    return savedMeals ? JSON.parse(savedMeals) : {};
  });

  // Save meals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('meals', JSON.stringify(meals));
  }, [meals]);

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast' },
    { id: 'lunch', name: 'Lunch' },
    { id: 'dinner', name: 'Dinner' },
    { id: 'snacks', name: 'Snacks' }
  ];

  const getWeekDates = (date) => {
    const startDate = new Date(date);
    const dayOfWeek = startDate.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1;
    startDate.setDate(startDate.getDate() - dayOfWeek + diff);

    const weekDates = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      weekDates.push(currentDate);
    }
    return weekDates;
  };

  useEffect(() => {
    setDates(getWeekDates(selectedWeek));
  }, [selectedWeek]);

  const handleMealInput = (day, type) => {
    setCurrentMealDay(day);
    setMealType(type);
    setMealInput("");
    setMealToEdit(null);
  };

  const handleMealSubmit = () => {
    if (!mealInput.trim()) return;
    
    const dayKey = currentMealDay.toLocaleDateString();
    
    setMeals(prevMeals => {
      const newMeals = { ...prevMeals };
      
      if (!newMeals[dayKey]) {
        newMeals[dayKey] = {};
      }
      
      if (!newMeals[dayKey][mealType]) {
        newMeals[dayKey][mealType] = [];
      }

      if (mealToEdit) {
        // Edit existing meal
        newMeals[dayKey][mealType][mealToEdit.index] = { text: mealInput.trim() };
      } else {
        // Add new meal
        newMeals[dayKey][mealType].push({ text: mealInput.trim() });
      }

      return newMeals;
    });

    setMealInput("");
    setCurrentMealDay(null);
    setMealToEdit(null);
  };

  const handleMealDelete = (day, type, index) => {
    const dayKey = day.toLocaleDateString();
    
    setMeals(prevMeals => {
      const newMeals = { ...prevMeals };
      
      if (newMeals[dayKey]?.[type]) {
        // Remove the meal at the specified index
        newMeals[dayKey][type] = newMeals[dayKey][type].filter((_, i) => i !== index);
        
        // Clean up empty arrays and objects
        if (newMeals[dayKey][type].length === 0) {
          delete newMeals[dayKey][type];
        }
        
        if (Object.keys(newMeals[dayKey]).length === 0) {
          delete newMeals[dayKey];
        }
      }
      
      return newMeals;
    });
  };

  const handleMealEdit = (day, type, index) => {
    const dayKey = day.toLocaleDateString();
    const mealToEdit = meals[dayKey][type][index];
    setMealInput(mealToEdit.text);
    setMealType(type);
    setCurrentMealDay(day);
    setMealToEdit({ day, type, index });
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    return `${day}/${month}`;
  };
  
  const formatDayName = (date) => {
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  return (
    <div className="food-planner">
      <div className="food-header">
        <button onClick={() => onWeekChange("prev")}>Previous Week</button>
        <button onClick={() => onWeekChange("next")}>Next Week</button>
        <button onClick={onReturn}>Return to Menu</button>
      </div>

      <div className="food-grid">
        {dates.map((date, index) => (
          <div key={index} className="day-column">
            <div className="date-header">
              <div className="day-name-text">{formatDayName(date)}</div>
              <div className="date-number">{formatDate(date)}</div>
            </div>
            
            <div className="meals-wrapper">
              {mealTypes.map(type => (
                <div key={type.id} className="meal-block">
                  <div className="meal-block-header">
                    <h3>{type.name}</h3>
                    <button 
                      className="add-meal-button"
                      onClick={() => handleMealInput(date, type.id)}
                    >
                      +
                    </button>
                  </div>
                  <div className="meal-content">
                    <ul className="meal-list">
                      {meals[date.toLocaleDateString()]?.[type.id]?.map((meal, i) => (
                        <li key={i} className="meal-item">
                          <span>{meal.text}</span>
                        </li>
                      ))}
                    </ul>
                    {meals[date.toLocaleDateString()]?.[type.id]?.length > 0 && (
                      <div className="meal-block-footer">
                        <button
                          onClick={() => handleMealEdit(date, type.id, 0)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleMealDelete(date, type.id, 0)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentMealDay && (
        <div className="meal-input-container">
          <h3>{mealToEdit ? 'Edit' : 'Add'} {mealTypes.find(t => t.id === mealType).name}</h3>
          <input
            type="text"
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Enter meal..."
            autoFocus
          />
          <div className="modal-buttons">
            <button onClick={handleMealSubmit}>
              {mealToEdit ? 'Save' : 'Add'} Meal
            </button>
            <button onClick={() => {
              setCurrentMealDay(null);
              setMealToEdit(null);
              setMealInput("");
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Food;
