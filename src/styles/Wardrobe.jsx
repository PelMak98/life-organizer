import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import "../styles/wardrobe.css";

const seasons = ["Winter", "Summer", "Fall/Spring"];
const categories = ["Casual", "Formal", "Sport", "Other"];
const subCategories = ["Tops", "Trousers", "Shirts", "Jackets", "Shoes", "Accessories"];

const processImage = (file) => {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            const size = Math.min(400, Math.max(img.width, img.height));
            canvas.width = size;
            canvas.height = size;

            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, size, size);

            const scale = Math.min(size / img.width, size / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;

            const offsetX = (size - scaledWidth) / 2;
            const offsetY = (size - scaledHeight) / 2;

            ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
            
            // Convert to base64
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            resolve(dataUrl);
        };

        img.src = URL.createObjectURL(file);
    });
};

const Wardrobe = ({ onReturn }) => {
    // Initialize states with localStorage data
    const [items, setItems] = useState(() => {
        const savedItems = localStorage.getItem('wardrobeItems');
        return savedItems ? JSON.parse(savedItems) : [];
    });

    const [currentView, setCurrentView] = useState(() => 
        localStorage.getItem('wardrobeView') || 'seasons'
    );

    const [selectedSeason, setSelectedSeason] = useState(() =>
        localStorage.getItem('wardrobeSeason') || null
    );

    const [selectedCategory, setSelectedCategory] = useState(() =>
        localStorage.getItem('wardrobeCategory') || null
    );

    const [selectedSubCategory, setSelectedSubCategory] = useState(() =>
        localStorage.getItem('wardrobeSubCategory') || null
    );

    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [processedImage, setProcessedImage] = useState(null);

    const [formData, setFormData] = useState({
        brand: "",
        size: "",
        notes: "",
        laundry: false,
        iron: false,
        damage: false,
        image: null
    });

    // Save to localStorage when data changes
    useEffect(() => {
        localStorage.setItem('wardrobeItems', JSON.stringify(items));
    }, [items]);

    useEffect(() => {
        localStorage.setItem('wardrobeView', currentView);
    }, [currentView]);

    useEffect(() => {
        if (selectedSeason) {
            localStorage.setItem('wardrobeSeason', selectedSeason);
        } else {
            localStorage.removeItem('wardrobeSeason');
        }
    }, [selectedSeason]);

    useEffect(() => {
        if (selectedCategory) {
            localStorage.setItem('wardrobeCategory', selectedCategory);
        } else {
            localStorage.removeItem('wardrobeCategory');
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (selectedSubCategory) {
            localStorage.setItem('wardrobeSubCategory', selectedSubCategory);
        } else {
            localStorage.removeItem('wardrobeSubCategory');
        }
    }, [selectedSubCategory]);

    const resetForm = () => {
        setFormData({
            brand: "",
            size: "",
            notes: "",
            laundry: false,
            iron: false,
            damage: false,
            image: null
        });
        setProcessedImage(null);
        setEditingItem(null);
    };

    const handleBack = () => {
        if (selectedSubCategory) {
            setSelectedSubCategory(null);
            localStorage.removeItem('wardrobeSubCategory');
        } else if (currentView === 'subcategories') {
            setCurrentView('categories');
            setSelectedCategory(null);
            localStorage.removeItem('wardrobeCategory');
        } else if (currentView === 'categories') {
            setCurrentView('seasons');
            setSelectedSeason(null);
            localStorage.removeItem('wardrobeSeason');
        } else {
            localStorage.removeItem('wardrobeView');
            localStorage.removeItem('wardrobeSeason');
            localStorage.removeItem('wardrobeCategory');
            localStorage.removeItem('wardrobeSubCategory');
            onReturn();
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const base64Image = await processImage(file);
            setProcessedImage(base64Image);
            setFormData({ ...formData, image: base64Image });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const itemData = {
            ...formData,
            season: selectedSeason,
            category: selectedCategory,
            subCategory: selectedSubCategory,
            id: editingItem ? editingItem.id : Date.now()
        };

        if (editingItem) {
            setItems(items.map(item => 
                item.id === editingItem.id ? itemData : item
            ));
        } else {
            setItems([...items, itemData]);
        }

        setShowForm(false);
        resetForm();
    };

    const handleEdit = (item) => {
        setEditingItem(item);
        setFormData({
            brand: item.brand,
            size: item.size,
            notes: item.notes,
            laundry: item.laundry,
            iron: item.iron,
            damage: item.damage,
            image: item.image
        });
        setProcessedImage(item.image);
        setShowForm(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            setItems(items.filter(item => item.id !== id));
        }
    };

    const renderSeasons = () => (
        <div className="seasons-grid">
            {seasons.map(season => (
                <div 
                    key={season}
                    className="season-card"
                    onClick={() => {
                        setSelectedSeason(season);
                        setCurrentView('categories');
                    }}
                >
                    <h2>{season}</h2>
                </div>
            ))}
        </div>
    );

    const renderCategories = () => (
        <div className="categories-grid">
            {categories.map(category => (
                <div 
                    key={category}
                    className="category-card"
                    onClick={() => {
                        setSelectedCategory(category);
                        setCurrentView('subcategories');
                    }}
                >
                    <h2>{category}</h2>
                </div>
            ))}
        </div>
    );

    const renderSubCategories = () => (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="subcategories-grid">
                {subCategories.map(sub => (
                    <div 
                        key={sub}
                        className="subcategory-card"
                        onClick={() => setSelectedSubCategory(sub)}
                    >
                        <h3>{sub}</h3>
                    </div>
                ))}
            </div>
        </div>
    );

    const renderItems = () => (
        <div className="items-view">
            <div className="items-header">
                <h2>{selectedSubCategory}</h2>
                <button 
                    className="add-button"
                    onClick={() => setShowForm(true)}
                >
                    <FaPlus /> Add Item
                </button>
            </div>
            <div className="items-grid">
                {items
                    .filter(item => 
                        item.season === selectedSeason &&
                        item.category === selectedCategory &&
                        item.subCategory === selectedSubCategory
                    )
                    .map(item => (
                        <div key={item.id} className="item-card">
                            {item.image && (
                                <div className="item-image">
                                    <img 
                                        src={item.image}
                                        alt={item.brand}
                                    />
                                </div>
                            )}
                            <div className="item-details">
                                <h3>{item.brand}</h3>
                                <p>Size: {item.size}</p>
                                {item.notes && <p>{item.notes}</p>}
                                <div className="item-status">
                                    {item.laundry && <span className="status">Laundry</span>}
                                    {item.iron && <span className="status">Iron</span>}
                                    {item.damage && <span className="status">Damage</span>}
                                </div>
                                <div className="item-actions">
                                    <button onClick={() => handleEdit(item)}>
                                        <FaEdit /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(item.id)}>
                                        <FaTrash /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );

    return (
        <div className="wardrobe-container">
            <header className="wardrobe-header">
                <button className="back-button" onClick={handleBack}>
                    <FaArrowLeft /> Back
                </button>
                <h1>
                    {currentView === 'seasons' ? 'Select Season' :
                     currentView === 'categories' ? selectedSeason :
                     selectedSubCategory ? `${selectedSeason} - ${selectedCategory} - ${selectedSubCategory}` :
                     `${selectedSeason} - ${selectedCategory}`}
                </h1>
            </header>

            <div className="scrollable-content">
                {currentView === 'seasons' && renderSeasons()}
                {currentView === 'categories' && renderCategories()}
                {currentView === 'subcategories' && !selectedSubCategory && renderSubCategories()}
                {selectedSubCategory && renderItems()}
            </div>

            {showForm && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <form onSubmit={handleSubmit}>
                            <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
                            
                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Brand"
                                    value={formData.brand}
                                    onChange={e => setFormData({...formData, brand: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <input
                                    type="text"
                                    placeholder="Size"
                                    value={formData.size}
                                    onChange={e => setFormData({...formData, size: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <textarea
                                    placeholder="Notes"
                                    value={formData.notes}
                                    onChange={e => setFormData({...formData, notes: e.target.value})}
                                />
                            </div>

                            <div className="form-switches">
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.laundry}
                                        onChange={e => setFormData({...formData, laundry: e.target.checked})}
                                    />
                                    Needs Laundry
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.iron}
                                        onChange={e => setFormData({...formData, iron: e.target.checked})}
                                    />
                                    Needs Ironing
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={formData.damage}
                                        onChange={e => setFormData({...formData, damage: e.target.checked})}
                                    />
                                    Has Damage
                                </label>
                            </div>

                            <div className="form-group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="file-input"
                                />
                                {processedImage && (
                                    <div className="image-preview">
                                        <img src={processedImage} alt="Preview" />
                                    </div>
                                )}
                            </div>

                            <div className="form-buttons">
                                <button type="submit" className="save-button">
                                    {editingItem ? 'Update' : 'Save'}
                                </button>
                                <button 
                                    type="button" 
                                    className="cancel-button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Wardrobe;
