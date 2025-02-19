// Goal.jsx
import React, { useState, useEffect } from "react";
import { FaArrowLeft } from 'react-icons/fa';
import "./goal.css";

const Goal = ({ onReturn }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [category, setCategory] = useState("Health");
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [progress, setProgress] = useState("");

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      id: Date.now(),
      title,
      description,
      deadline,
      category,
      progress: "Not Started",
      createdAt: new Date().toISOString()
    };
    setGoals([...goals, newGoal]);
    setTitle("");
    setDescription("");
    setDeadline("");
  };

  const handleDelete = (goalId) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      setGoals(goals.filter(goal => goal.id !== goalId));
    }
  };

  const handleEdit = (goal) => {
    setSelectedGoal(goal);
    setProgress(goal.progress);
  };

  const handleUpdateProgress = () => {
    setGoals(goals.map(g => 
      g.id === selectedGoal.id ? { 
        ...g, 
        progress,
        lastUpdated: new Date().toISOString() 
      } : g
    ));
    setSelectedGoal(null);
  };

  return (
    <div className="goal-container">
      <button className="return-btn" onClick={onReturn}>
        <FaArrowLeft /> Back to Menu
      </button>
      
      <div className="goal-form-section">
        <h1 className="goal-title">Goal Creator</h1>
        <form onSubmit={handleSubmit} className="goal-form">
          <div>
            <label>Goal Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter goal title"
              required
            />
          </div>

          <div>
            <label>Goal Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your goal"
              required
            ></textarea>
          </div>

          <div>
            <label>Goal Deadline</label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              required
            />
          </div>

          <div>
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
          </div>

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
              <p><strong>Deadline:</strong> {new Date(goal.deadline).toLocaleDateString()}</p>
              <p><strong>Progress:</strong> {goal.progress}</p>
              <div className="goal-actions">
                <button className="edit-btn" onClick={() => handleEdit(goal)}>
                  Edit Progress
                </button>
                <button className="delete-btn" onClick={() => handleDelete(goal.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}

        {selectedGoal && (
          <div className="goal-edit-section">
            <h3>Update Progress for "{selectedGoal.title}"</h3>
            <select
              value={progress}
              onChange={(e) => setProgress(e.target.value)}
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            <div className="edit-actions">
              <button className="goal-submit-btn" onClick={handleUpdateProgress}>
                Update
              </button>
              <button className="cancel-btn" onClick={() => setSelectedGoal(null)}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Goal;
