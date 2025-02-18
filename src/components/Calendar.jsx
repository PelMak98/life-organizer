import React, { useState, useEffect } from "react";
import "../styles/calendar.css";

const Calendar = ({ selectedWeek, onWeekChange, onReturn }) => {
  const [dates, setDates] = useState([]);
  // Initialize tasks from localStorage
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('calendar-tasks');
    return savedTasks ? JSON.parse(savedTasks) : {};
  });
  const [currentTaskDay, setCurrentTaskDay] = useState(null);
  const [taskInput, setTaskInput] = useState("");
  const [taskTime, setTaskTime] = useState("09:00");
  const [taskToEdit, setTaskToEdit] = useState(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('calendar-tasks', JSON.stringify(tasks));
  }, [tasks]);

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

  const handleTaskInput = (day) => {
    setCurrentTaskDay(day);
    setTaskInput("");
    setTaskTime("09:00");
  };

  const handleTaskSubmit = () => {
    if (!taskInput) return;

    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [currentTaskDay.toLocaleDateString()]: [
          ...(prevTasks[currentTaskDay.toLocaleDateString()] || []),
          { text: taskInput, time: taskTime },
        ],
      };
      // Sort tasks by time
      updatedTasks[currentTaskDay.toLocaleDateString()].sort((a, b) => 
        a.time.localeCompare(b.time)
      );
      return updatedTasks;
    });
    
    setTaskInput("");
    setTaskTime("09:00");
    setCurrentTaskDay(null);
  };

  const handleTaskDelete = (day, index) => {
    setTasks((prevTasks) => {
      const updatedTasks = {
        ...prevTasks,
        [day.toLocaleDateString()]: prevTasks[day.toLocaleDateString()].filter(
          (_, i) => i !== index
        ),
      };
      // Remove empty arrays
      if (updatedTasks[day.toLocaleDateString()].length === 0) {
        delete updatedTasks[day.toLocaleDateString()];
      }
      return updatedTasks;
    });
    setTaskToEdit(null);
  };

  const handleTaskEdit = (day, index) => {
    const taskToEdit = tasks[day.toLocaleDateString()][index];
    setTaskInput(taskToEdit.text);
    setTaskTime(taskToEdit.time);
    setTaskToEdit({ day, index });
    setCurrentTaskDay(day);
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatDayName = (date) => {
    const options = { weekday: "long" };
    return new Intl.DateTimeFormat("en-GB", options).format(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="calendar">
      <div className="calendar-header">
        <button onClick={() => onWeekChange("prev")}>Prev Week</button>
        <button onClick={() => onWeekChange("next")}>Next Week</button>
        <button onClick={onReturn}>Return to Menu</button>
      </div>

      <div className="calendar-body">
        <div className="calendar-row">
          {dates.map((date, index) => (
            <div
              key={index}
              className={`day-column ${isToday(date) ? 'today' : ''}`}
              onClick={() => handleTaskInput(date)}
            >
              <div className="day-name">
                <div className="date-label">
                  <div className="day-name-text">{formatDayName(date)}</div>
                  <div className="date-number">{formatDate(date)}</div>
                </div>
              </div>
              <ul>
                {(tasks[date.toLocaleDateString()] || []).map((task, i) => (
                  <li
                    key={i}
                    className="task-item"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTaskEdit(date, i);
                    }}
                  >
                    {task.text} at {task.time}
                    <div className="task-actions">
                      <button
                        className="edit-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskEdit(date, i);
                        }}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleTaskDelete(date, i);
                        }}
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

      {currentTaskDay && (
        <div className="task-input-container">
          <input
            type="text"
            value={taskInput}
            onChange={(e) => setTaskInput(e.target.value)}
            placeholder="Enter task..."
            autoFocus
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
          />
          <button onClick={handleTaskSubmit}>
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </button>
          <button onClick={() => {
            setCurrentTaskDay(null);
            setTaskToEdit(null);
            setTaskInput("");
            setTaskTime("09:00");
          }}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Calendar;
