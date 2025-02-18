// src/components/Learning.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaArrowLeft, 
    FaPlus, 
    FaClock, 
    FaUniversity, 
    FaGraduationCap,
    FaTrash, 
    FaEdit,
    FaCheck,
    FaSearch,
    FaTimes
} from 'react-icons/fa';
import "../styles/learning.css";

const platforms = {
    'coursera': {
        name: 'Coursera',
        logo: '/logos/coursera.png',
        color: '#0056D2'
    },
    'udemy': {
        name: 'Udemy',
        logo: '/logos/udemy.png',
        color: '#A435F0'
    },
    'edx': {
        name: 'edX',
        logo: '/logos/edx.png',
        color: '#02262B'
    },
    'linkedin': {
        name: 'LinkedIn Learning',
        logo: '/logos/linkedin.png',
        color: '#0A66C2'
    },
    'pluralsight': {
        name: 'Pluralsight',
        logo: '/logos/pluralsight.png',
        color: '#F15B2A'
    },
    'domestika': {
        name: 'Domestika',
        logo: '/logos/domestika.png',
        color: '#F02D00'
    }
};

const Learning = ({ onReturn }) => {
    const [courses, setCourses] = useState(() => {
        const savedCourses = localStorage.getItem('courses');
        return savedCourses ? JSON.parse(savedCourses) : [];
    });
    const [showForm, setShowForm] = useState(false);
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        university: '',
        platform: '',
        duration: 0,
        progress: 0,
        completedHours: 0
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [courseToDelete, setCourseToDelete] = useState(null);

    useEffect(() => {
        localStorage.setItem('courses', JSON.stringify(courses));
    }, [courses]);

    const calculateProgress = (completedHours, totalHours) => {
        return Math.round((completedHours / totalHours) * 100);
    };

    const handleHoursChange = (completedHours) => {
        const hours = Math.min(completedHours, formData.duration);
        const progress = calculateProgress(hours, formData.duration);
        setFormData({
            ...formData,
            completedHours: hours,
            progress: progress
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (!formData.platform) {
                throw new Error('Please select a platform');
            }

            const newCourse = {
                ...formData,
                id: editingCourse ? editingCourse.id : Date.now(),
                dateAdded: editingCourse ? editingCourse.dateAdded : new Date().toISOString(),
                lastUpdated: new Date().toISOString()
            };

            if (editingCourse) {
                setCourses(courses.map(course => 
                    course.id === editingCourse.id ? newCourse : course
                ));
            } else {
                setCourses([...courses, newCourse]);
            }

            setFormData({
                title: '',
                university: '',
                platform: '',
                duration: 0,
                progress: 0,
                completedHours: 0
            });
            setShowForm(false);
            setEditingCourse(null);
        } catch (err) {
            setError(err.message || 'Failed to save course');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData({
            title: course.title,
            university: course.university,
            platform: course.platform,
            duration: course.duration,
            progress: course.progress,
            completedHours: course.completedHours
        });
        setShowForm(true);
    };

    const handleDelete = (course) => {
        setCourseToDelete(course);
        setShowConfirmDialog(true);
    };

    const confirmDelete = () => {
        setCourses(courses.filter(course => course.id !== courseToDelete.id));
        setShowConfirmDialog(false);
        setCourseToDelete(null);
    };

    const updateProgress = (id, completedHours) => {
        setCourses(courses.map(course => {
            if (course.id === id) {
                const progress = calculateProgress(completedHours, course.duration);
                return {
                    ...course,
                    completedHours,
                    progress,
                    lastUpdated: new Date().toISOString()
                };
            }
            return course;
        }));
    };

    const filteredCourses = courses
        .filter(course => {
            if (!searchQuery) return true;
            return (
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
                platforms[course.platform]?.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        });

    return (
        <div className="learning-container">
            <header className="learning-header">
                <button className="back-button" onClick={onReturn}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Learning Tracker</h1>
                <div className="header-actions">
                    <button 
                        className="add-button"
                        onClick={() => setShowForm(true)}
                    >
                        <FaPlus /> Add Course
                    </button>
                </div>
            </header>

            <div className="controls">
                <div className="search-bar">
                    <FaSearch />
                    <input
                        type="text"
                        placeholder="Search courses..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            <div className="courses-grid">
                {filteredCourses.map(course => (
                    <div key={course.id} className="course-card">
                        <div className="course-content">
                            <div className="course-main-info">
                                <h3>{course.title}</h3>
                                <div className="course-meta">
                                    <span><FaUniversity /> {course.university}</span>
                                    <span><FaClock /> {course.duration}h</span>
                                </div>
                                {course.platform && (
                                    <div 
                                        className="platform-badge"
                                        style={{
                                            backgroundColor: platforms[course.platform]?.color
                                        }}
                                    >
                                        <img 
                                            src={platforms[course.platform].logo} 
                                            alt={platforms[course.platform].name} 
                                        />
                                        {platforms[course.platform].name}
                                    </div>
                                )}
                            </div>
                            
                            <div className="progress-section">
                                <div className="circular-progress">
                                    <div 
                                        className="progress-circle"
                                        style={{
                                            background: `conic-gradient(
                                                #A50021 ${course.progress * 3.6}deg,
                                                #DADADA ${course.progress * 3.6}deg
                                            )`
                                        }}
                                    >
                                        <div className="progress-inner">
                                            <span className="progress-value">{course.progress}%</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="progress-details">
                                    <div className="hours-counter">
                                        <span className="completed">{course.completedHours}h</span>
                                        <span className="separator">/</span>
                                        <span className="total">{course.duration}h</span>
                                    </div>
                                    <input
                                        type="range"
                                        value={course.completedHours}
                                        onChange={(e) => updateProgress(course.id, parseInt(e.target.value))}
                                        min="0"
                                        max={course.duration}
                                        className="hours-slider"
                                    />
                                </div>
                            </div>
                        </div>
                        
                        <div className="course-actions">
                            <button 
                                className="edit-button"
                                onClick={() => handleEdit(course)}
                            >
                                <FaEdit />
                            </button>
                            <button 
                                className="delete-button"
                                onClick={() => handleDelete(course)}
                            >
                                <FaTrash />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h2>{editingCourse ? 'Edit Course' : 'Add New Course'}</h2>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Course Title"
                                    value={formData.title}
                                    onChange={e => setFormData({...formData, title: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="University"
                                    value={formData.university}
                                    onChange={e => setFormData({...formData, university: e.target.value})}
                                    required
                                    disabled={loading}
                                />
                            </div>
                            
                            <div className="platform-selector">
                                {Object.entries(platforms).map(([key, platform]) => (
                                    <div 
                                        key={key}
                                        className={`platform-option ${formData.platform === key ? 'selected' : ''}`}
                                        onClick={() => setFormData({...formData, platform: key})}
                                        style={{
                                            borderColor: platform.color,
                                            backgroundColor: formData.platform === key ? platform.color : 'transparent'
                                        }}
                                    >
                                        <img src={platform.logo} alt={platform.name} />
                                        <span>{platform.name}</span>
                                        {formData.platform === key && (
                                            <FaCheck className="check-icon" />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Duration (hours)"
                                    value={formData.duration}
                                    onChange={e => {
                                        const duration = parseInt(e.target.value) || 0;
                                        setFormData({
                                            ...formData, 
                                            duration,
                                            completedHours: Math.min(formData.completedHours, duration),
                                            progress: calculateProgress(
                                                Math.min(formData.completedHours, duration),
                                                duration
                                            )
                                        });
                                    }}
                                    required
                                    min="1"
                                    disabled={loading}
                                />
                            </div>

                            <div className="hours-input-container">
                                <div className="hours-display">
                                    <span className="completed-hours">{formData.completedHours}</span>
                                    <span className="separator">/</span>
                                    <span className="total-hours">{formData.duration}</span>
                                    <span className="hours-label">hours completed</span>
                                </div>
                                <input
                                    type="range"
                                    value={formData.completedHours}
                                    onChange={e => handleHoursChange(parseInt(e.target.value))}
                                    min="0"
                                    max={formData.duration}
                                    disabled={!formData.duration || loading}
                                    className="hours-slider"
                                />
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="primary-button" disabled={loading}>
                                    {loading ? 'Saving...' : (editingCourse ? 'Update' : 'Save')}
                                </button>
                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingCourse(null);
                                        setFormData({
                                            title: '',
                                            university: '',
                                            platform: '',
                                            duration: 0,
                                            progress: 0,
                                            completedHours: 0
                                        });
                                    }}
                                    disabled={loading}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showConfirmDialog && (
                <div className="modal-overlay">
                    <div className="modal-content confirm-dialog">
                        <h2>Confirm Deletion</h2>
                        <p>Are you sure you want to delete "{courseToDelete?.title}"?</p>
                        <div className="form-buttons">
                            <button 
                                className="primary-button delete-confirm" 
                                onClick={confirmDelete}
                            >
                                Delete
                            </button>
                            <button 
                                className="secondary-button"
                                onClick={() => {
                                    setShowConfirmDialog(false);
                                    setCourseToDelete(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
        </div>
    );
};

export default Learning;
