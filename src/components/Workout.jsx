// src/components/Workout.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaArrowLeft, 
    FaPlus, 
    FaRunning, 
    FaDumbbell,
    FaFire
} from 'react-icons/fa';
import "../styles/workout.css";

const Workout = ({ onReturn }) => {
    const [workouts, setWorkouts] = useState(() => {
        const savedWorkouts = localStorage.getItem('workouts');
        return savedWorkouts ? JSON.parse(savedWorkouts) : [];
    });

    const [subscriptions, setSubscriptions] = useState(() => {
        const savedSubs = localStorage.getItem('workout-subscriptions');
        return savedSubs ? JSON.parse(savedSubs) : {
            cardio: 12,
            weights: 12
        };
    });

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        date: new Date().toISOString().split('T')[0],
        calories: '',
        type: 'cardio'
    });

    useEffect(() => {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }, [workouts]);

    useEffect(() => {
        localStorage.setItem('workout-subscriptions', JSON.stringify(subscriptions));
    }, [subscriptions]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (subscriptions[formData.type] <= 0) {
            alert(`No ${formData.type} sessions left!`);
            return;
        }

        const newWorkout = {
            ...formData,
            id: Date.now(),
            dateAdded: new Date().toISOString()
        };

        setWorkouts([...workouts, newWorkout]);
        setSubscriptions(prev => ({
            ...prev,
            [formData.type]: prev[formData.type] - 1
        }));

        setFormData({
            description: '',
            date: new Date().toISOString().split('T')[0],
            calories: '',
            type: 'cardio'
        });
        setShowModal(false);
    };

    const handleDelete = (id, type) => {
        if (window.confirm('Delete this workout?')) {
            setWorkouts(workouts.filter(workout => workout.id !== id));
            setSubscriptions(prev => ({
                ...prev,
                [type]: prev[type] + 1
            }));
        }
    };

    return (
        <div className="workout-container">
            <header className="workout-header">
                <button className="back-button" onClick={onReturn}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Workout Tracker</h1>
                <button className="add-button" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Workout
                </button>
            </header>

            <div className="subscription-status">
                <div className="subscription-card">
                    <FaRunning />
                    <div className="subscription-info">
                        <span className="sessions-left">{subscriptions.cardio}</span>
                        <span className="label">Cardio Sessions</span>
                    </div>
                </div>
                <div className="subscription-card">
                    <FaDumbbell />
                    <div className="subscription-info">
                        <span className="sessions-left">{subscriptions.weights}</span>
                        <span className="label">Weight Sessions</span>
                    </div>
                </div>
            </div>

            <div className="workouts-list">
                {workouts.map(workout => (
                    <div key={workout.id} className="workout-item">
                        <div className="workout-icon">
                            {workout.type === 'cardio' ? <FaRunning /> : <FaDumbbell />}
                        </div>
                        <div className="workout-info">
                            <p className="workout-description">{workout.description}</p>
                            <div className="workout-details">
                                <span>{workout.date}</span>
                                <span><FaFire /> {workout.calories} kcal</span>
                            </div>
                        </div>
                        <button 
                            className="delete-button"
                            onClick={() => handleDelete(workout.id, workout.type)}
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Add New Workout</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Workout Description"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        placeholder="Calories Burned"
                                        value={formData.calories}
                                        onChange={e => setFormData({...formData, calories: e.target.value})}
                                        required
                                        min="0"
                                    />
                                </div>
                                <div className="type-switch">
                                    <button
                                        type="button"
                                        className={`switch-option ${formData.type === 'cardio' ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, type: 'cardio'})}
                                    >
                                        <FaRunning /> Cardio
                                    </button>
                                    <button
                                        type="button"
                                        className={`switch-option ${formData.type === 'weights' ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, type: 'weights'})}
                                    >
                                        <FaDumbbell /> Weights
                                    </button>
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="primary-button">
                                        Save
                                    </button>
                                    <button 
                                        type="button" 
                                        className="secondary-button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Workout;
