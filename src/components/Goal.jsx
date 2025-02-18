// Goal.jsx
import React, { useState } from "react";
import "./goal.css";

const Goal = ({ onReturn }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Health");
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [progress, setProgress] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      title,
      description,
      deadline,
      category,
      progress: "Not Started"
    };
    setGoals([...goals, newGoal]);
    setTitle("");
    setDescription("");
    setDeadline("");
    alert("Goal Created Successfully!");
  };

  const handleDelete = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setProgress(goal.progress);
  };

  const handleUpdateProgress = () => {
    setGoals(goals.map(g => 
      g.id === selectedGoal.id ? { ...g, progress } : g
    ));
    setSelectedGoal(null);
  };

  return (
    <div className="goal-container">
      <button className="return-btn" onClick={onReturn}>← Back to Menu</button>
      
      <div className="goal-form-section">
        <h1 className="goal-title">Goal Creator</h1>
        <form onSubmit={handleSubmit} className="goal-form">
          <label>Goal Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter goal title"
            required
          />

          <label>Goal Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your goal"
            required
          ></textarea>

          <label>Goal Deadline</label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />

          <label>Goal Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Health">Health</option>
            <option value="Financial">Financial</option>
            <option value="Educational">Educational</option>
            <option value="Others">Others</option>
          </select>

          <button type="submit" className="goal-submit-btn">
            Create Goal
          </button>
        </form>
      </div>

      <div className="goal-list-section">
        <h2>Goal List</h2>
        {goals.length === 0 ? (
          <p>No goals created yet.</p>
        ) : (
          goals.map((goal) => (
            <div key={goal.id} className="goal-item">
              <h3>{goal.title}</h3>
              <p><strong>Category:</strong> {goal.category}</p>
              <p><strong>Deadline:</strong> {goal.deadline}</p>
              <p><strong>Progress:</strong> {goal.progress}</p>
              <button className="edit-btn" onClick={() => handleEdit(goal)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(goal.id)}>
                Delete
              </button>
            </div>
          ))
        )}

        {selectedGoal && (
          <div className="goal-edit-section">
            <h3>Update Progress</h3>
            <select
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <button className="goal-submit-btn" onClick={handleUpdateProgress}>
              Update
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goal;
