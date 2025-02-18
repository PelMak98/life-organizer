// App.jsx
import React, { useState } from "react";
import Goal from "./components/Goal";
import Calendar from "./components/Calendar";
import Food from "./components/Food";
import Wardrobe from "./components/Wardrobe";
import Learning from "./components/Learning";
import Workout from "./components/Workout";
import Financial from "./components/Financial";
import Watchlist from "./components/Watchlist";

import { 
  FaCalendarAlt, 
  FaBullseye, 
  FaUtensils, 
  FaDumbbell, 
  FaTshirt, 
  FaBook, 
  FaEuroSign, 
  FaFilm,
  FaCube 
} from "react-icons/fa"; 
import "./styles/global.css";

const App = () => {
  const [view, setView] = useState("menu");
  const [selectedWeek, setSelectedWeek] = useState(new Date());

  const handleViewChange = (viewName) => {
    setView(viewName);
  };

  const handleWeekChange = (direction) => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + (direction === "next" ? 7 : -7));
    setSelectedWeek(newDate);
  };

  const handleReturnToMenu = () => {
    setView("menu");
  };

  const renderView = () => {
    switch (view) {
      case "menu":
        return (
          <>
            <div className="app-header">
              <div className="logo">
                <FaCube className="logo-icon" />
                <h1 className="app-title">Life Organizer</h1>
              </div>
              <p className="app-subtitle">Let's organize everything...</p>
            </div>
            <div className="menu">
              <div 
                className="slot" 
                onClick={() => handleViewChange("calendar")} 
                style={{ backgroundColor: "#a50021", color: "#dadada" }}
              >
                <FaCalendarAlt size={55} />
                <span>Schedule</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("goals")} 
                style={{ backgroundColor: "#36454F", color: "#FFFF00" }}
              >
                <FaBullseye size={55} />
                <span>Goals</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("food")} 
                style={{ backgroundColor: "#98FF98", color: "#003366" }}
              >
                <FaUtensils size={55} />
                <span>Food</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("wardrobe")} 
                style={{ backgroundColor: "#e7e7e7", color: "#2e1a47" }}
              >
                <FaTshirt size={55} />
                <span>Wardrobe</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("learning")} 
                style={{ backgroundColor: "#DADADA", color: "#A50021" }}
              >
                <FaBook size={55} />
                <span>Learning</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("workout")} 
                style={{ backgroundColor: "#FFFF00", color: "#36454F" }}
              >
                <FaDumbbell size={55} />
                <span>Workout</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("financial")} 
                style={{ backgroundColor: "#003366", color: "#98ff98" }}
              >
                <FaEuroSign size={55} />
                <span>Financial Tracker</span>
              </div>
              <div 
                className="slot" 
                onClick={() => handleViewChange("watchlist")} 
                style={{ backgroundColor: "#2E1A47", color: "#E7E7E7" }}
              >
                <FaFilm size={55} />
                <span>Watchlist</span>
              </div>
            </div>
          </>
        );

      case "calendar":
        return (
          <Calendar
            selectedWeek={selectedWeek}
            onWeekChange={handleWeekChange}
            onReturn={handleReturnToMenu}
          />
        );

      case "goals":
        return <Goal onReturn={handleReturnToMenu} />;

      case "food":
        return (
          <Food
            selectedWeek={selectedWeek}
            onWeekChange={handleWeekChange}
            onReturn={handleReturnToMenu}
          />
        );

      case "wardrobe":
        return <Wardrobe onReturn={handleReturnToMenu} />;

      case "learning":
        return <Learning onReturn={handleReturnToMenu} />;

      case "workout":
        return <Workout onReturn={handleReturnToMenu} />;

      case "financial":
        return <Financial onReturn={handleReturnToMenu} />;

      case "watchlist":
        return <Watchlist onReturn={handleReturnToMenu} />;

      default:
        return null;
    }
  };

  return (
    <div className="container">
      {renderView()}
    </div>
  );
};

export default App;
