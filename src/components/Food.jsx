// Food.jsx
import React, { useState, useEffect } from "react";
import "../styles/food.css";

const Food = ({ selectedWeek, onWeekChange, onReturn }) => {
  const [dates, setDates] = useState([]);
  const [meals, setMeals] = useState({});
  const [currentMealDay, setCurrentMealDay] = useState(null);
  const [mealInput, setMealInput] = useState("");
  const [mealTime, setMealTime] = useState("09:00");
  const [mealType, setMealType] = useState("breakfast");
  const [mealToEdit, setMealToEdit] = useState(null);

  const mealTypes = [
    { id: 'breakfast', name: 'Breakfast', defaultTime: '08:00' },
    { id: 'lunch', name: 'Lunch', defaultTime: '13:00' },
    { id: 'dinner', name: 'Dinner', defaultTime: '20:00' },
    { id: 'snacks', name: 'Snacks', defaultTime: '16:00' }
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
    setMealTime(mealTypes.find(t => t.id === type).defaultTime);
  };

  const handleMealSubmit = () => {
    if (!mealInput) return;
    const dayKey = currentMealDay.toLocaleDateString();
    setMeals(prevMeals => ({
      ...prevMeals,
      [dayKey]: {
        ...prevMeals[dayKey],
        [mealType]: [
          ...((prevMeals[dayKey]?.[mealType] || [])),
          { text: mealInput, time: mealTime }
        ]
      }
    }));
    setMealInput("");
    setCurrentMealDay(null);
  };

  const handleMealDelete = (day, type, index) => {
    const dayKey = day.toLocaleDateString();
    setMeals(prevMeals => ({
      ...prevMeals,
      [dayKey]: {
        ...prevMeals[dayKey],
        [type]: prevMeals[dayKey][type].filter((_, i) => i !== index)
      }
    }));
    setMealToEdit(null);
  };

  const handleMealEdit = (day, type, index) => {
    const dayKey = day.toLocaleDateString();
    const mealToEdit = meals[dayKey][type][index];
    setMealInput(mealToEdit.text);
    setMealTime(mealToEdit.time);
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
    const options = { weekday: "short" };
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
                  <ul className="meal-list">
                    {meals[date.toLocaleDateString()]?.[type.id]?.map((meal, i) => (
                      <li key={i} className="meal-item">
                        <span>{meal.text} at {meal.time}</span>
                        <div className="meal-actions">
                          <button
                            onClick={() => handleMealEdit(date, type.id, i)}
                            className="edit-btn"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleMealDelete(date, type.id, i)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {currentMealDay && (
        <div className="meal-input-container">
          <h3>Add {mealTypes.find(t => t.id === mealType).name}</h3>
          <input
            type="text"
            value={mealInput}
            onChange={(e) => setMealInput(e.target.value)}
            placeholder="Enter meal..."
          />
          <input
            type="time"
            value={mealTime}
            onChange={(e) => setMealTime(e.target.value)}
          />
          <div className="modal-buttons">
            <button onClick={handleMealSubmit}>Add Meal</button>
            <button onClick={() => setCurrentMealDay(null)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Food;
