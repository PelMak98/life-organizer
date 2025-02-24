import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaSearch, FaEdit, FaTrash, FaClock } from "react-icons/fa";
import "../styles/learning.css";

const Learning = ({ onReturn }) => {
    const [showModal, setShowModal] = useState(false);
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingCourse, setEditingCourse] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        platform: '',
        university: '',
        link: '',
        hours: 0,
        progress: 0
    });

    const platforms = [
        { id: 'udemy', name: 'Udemy', image: '/assets/platforms/udemy.png' },
        { id: 'coursera', name: 'Coursera', image: '/assets/platforms/coursera.png' },
        { id: 'edx', name: 'edX', image: '/assets/platforms/edx.png' },
        { id: 'domestika', name: 'Domestika', image: '/assets/platforms/domestika.png' },
        { id: 'pluralsight', name: 'Pluralsight', image: '/assets/platforms/pluralsight.png' },
        { id: 'linkedin', name: 'LinkedIn Learning', image: '/assets/platforms/linkedin.png' }
    ];
    

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCourse) {
            setCourses(courses.map(course => 
                course.id === editingCourse.id ? { ...formData, id: course.id } : course
            ));
            setEditingCourse(null);
        } else {
            const newCourse = {
                ...formData,
                id: Date.now()
            };
            setCourses([...courses, newCourse]);
        }
        setShowModal(false);
        setFormData({ title: '', platform: '', university: '', link: '', hours: 0, progress: 0 });
    };

    const handleEdit = (course) => {
        setEditingCourse(course);
        setFormData(course);
        setShowModal(true);
    };

    const handleDelete = (courseId) => {
        setCourses(courses.filter(course => course.id !== courseId));
    };

    const handleProgressUpdate = (courseId, newProgress) => {
        setCourses(courses.map(course => 
            course.id === courseId ? { ...course, progress: newProgress } : course
        ));
    };

    const handlePlatformSelect = (platformId) => {
        setFormData({ ...formData, platform: platformId });
    };

    return (
        <div className="learning-container">
            <header className="learning-header">
                <button className="back-button" onClick={onReturn}>
                    <FaArrowLeft /> Back
                </button>
                <div className="header-actions">
                    <button className="add-button" onClick={() => setShowModal(true)}>
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
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="courses-grid">
                {courses
                    .filter(course => 
                        course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        course.university.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                    .map(course => (
                        <div key={course.id} className="course-card">
                            <div className="course-content">
                                <div className="platform-badge">
                                    <img 
                                        src={platforms.find(p => p.id === course.platform)?.image} 
                                        alt={course.platform}
                                    />
                                </div>
                                <div className="course-main-info">
                                    <h3>{course.title}</h3>
                                    <div className="course-meta">
                                        <span>{course.university}</span>
                                        <span className="hours-info">
                                            <FaClock /> {course.hours}h
                                        </span>
                                    </div>
                                    <div className="progress-tracker">
                                        <div 
                                            className="progress-bar" 
                                            style={{width: `${course.progress}%`}}
                                        />
                                        <input 
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={course.progress}
                                            onChange={(e) => handleProgressUpdate(course.id, parseInt(e.target.value))}
                                        />
                                        <span className="progress-text">{course.progress}%</span>
                                    </div>
                                </div>
                                <div className="course-actions">
                                    <button onClick={() => handleEdit(course)} className="edit-button">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(course.id)} className="delete-button">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {showModal && (
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
                                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group university-field">
                                <input
                                    type="text"
                                    placeholder="University Name"
                                    value={formData.university}
                                    onChange={(e) => setFormData({...formData, university: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="platform-selector">
                                {platforms.map(platform => (
                                    <button
                                        key={platform.id}
                                        type="button"
                                        className={`platform-option ${formData.platform === platform.id ? 'selected' : ''}`}
                                        onClick={() => handlePlatformSelect(platform.id)}
                                    >
                                        <img src={platform.image} alt={platform.name} />
                                    </button>
                                ))}
                            </div>
                            <div className="form-group">
                                <input
                                    type="url"
                                    placeholder="Course Link"
                                    value={formData.link}
                                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="number"
                                    placeholder="Course Hours"
                                    value={formData.hours}
                                    onChange={(e) => setFormData({...formData, hours: parseInt(e.target.value) || 0})}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="form-buttons">
                                <button 
                                    type="button" 
                                    className="secondary-button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingCourse(null);
                                        setFormData({ title: '', platform: '', university: '', link: '', hours: 0, progress: 0 });
                                    }}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="primary-button">
                                    {editingCourse ? 'Save Changes' : 'Add Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Learning;
