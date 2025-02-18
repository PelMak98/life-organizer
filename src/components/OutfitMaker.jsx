import React, { useState, useEffect, useCallback } from 'react';
import { FaSave, FaArrowLeft, FaTshirt, FaTrash, FaCheck, FaUndo } from 'react-icons/fa';

const OutfitMaker = ({ items, onClose, selectedSeason, selectedCategory }) => {
    const [selectedOutfit, setSelectedOutfit] = useState({
        Tops: null,
        Trousers: null,
        Shoes: null,
        Accessories: null
    });
    const [currentCategory, setCurrentCategory] = useState('Tops');
    const [savedOutfits, setSavedOutfits] = useState([]);
    const [showSaved, setShowSaved] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);
    const [notification, setNotification] = useState(null);
    const [filterStatus, setFilterStatus] = useState({
        season: selectedSeason,
        category: selectedCategory
    });
    const [itemsPerCategory, setItemsPerCategory] = useState({});
    const [lastAction, setLastAction] = useState(null);
    const [actionHistory, setActionHistory] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [sortOrder, setSortOrder] = useState('default');
    const [filterOptions, setFilterOptions] = useState({
        color: 'all',
        size: 'all',
        brand: 'all'
    });

    const categories = ['Tops', 'Trousers', 'Shoes', 'Accessories'];

    useEffect(() => {
        const countItems = () => {
            const counts = {};
            categories.forEach(cat => {
                counts[cat] = items.filter(item => 
                    item.subCategory === cat &&
                    item.season === selectedSeason &&
                    item.category === selectedCategory
                ).length;
            });
            setItemsPerCategory(counts);
        };
        countItems();
    }, [items, selectedSeason, selectedCategory]);

    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
        setPreviewMode(false);
        addToHistory('categoryChange', category);
    };

    const filteredItems = useCallback((category) => {
        let filtered = items.filter(item => 
            item.subCategory === category &&
            item.season === filterStatus.season &&
            item.category === filterStatus.category
        );

        // Apply additional filters
        if (filterOptions.color !== 'all') {
            filtered = filtered.filter(item => item.color === filterOptions.color);
        }
        if (filterOptions.size !== 'all') {
            filtered = filtered.filter(item => item.size === filterOptions.size);
        }
        if (filterOptions.brand !== 'all') {
            filtered = filtered.filter(item => item.brand === filterOptions.brand);
        }

        // Apply sorting
        switch(sortOrder) {
            case 'nameAsc':
                filtered.sort((a, b) => a.brand.localeCompare(b.brand));
                break;
            case 'nameDesc':
                filtered.sort((a, b) => b.brand.localeCompare(a.brand));
                break;
            case 'newest':
                filtered.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                filtered.sort((a, b) => a.id - b.id);
                break;
            default:
                break;
        }

        return filtered;
    }, [items, filterStatus, filterOptions, sortOrder]);

    const handleItemSelect = (item) => {
        setSelectedOutfit(prev => ({
            ...prev,
            [currentCategory]: item
        }));
        addToHistory('itemSelect', { category: currentCategory, item });
        showNotification(`Added ${item.brand} to ${currentCategory}`);
        setSelectedItems(prev => [...prev, item.id]);
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleSaveOutfit = () => {
        if (Object.values(selectedOutfit).some(item => item !== null)) {
            const newOutfit = {
                id: Date.now(),
                items: selectedOutfit,
                season: selectedSeason,
                category: selectedCategory,
                date: new Date().toISOString(),
                createdAt: new Date(),
                lastModified: new Date()
            };
            setSavedOutfits(prev => [...prev, newOutfit]);
            addToHistory('saveOutfit', newOutfit);
            showNotification('Outfit saved successfully!');
            resetOutfit();
        }
    };

    const resetOutfit = () => {
        setSelectedOutfit({
            Tops: null,
            Trousers: null,
            Shoes: null,
            Accessories: null
        });
        setCurrentCategory('Tops');
        setPreviewMode(false);
        setSelectedItems([]);
        addToHistory('resetOutfit');
    };

    const handleRemoveItem = (category) => {
        const removedItem = selectedOutfit[category];
        setSelectedOutfit(prev => ({
            ...prev,
            [category]: null
        }));
        addToHistory('removeItem', { category, item: removedItem });
        showNotification(`Removed ${category} from outfit`);
        setSelectedItems(prev => prev.filter(id => id !== removedItem?.id));
    };

    const addToHistory = (action, data) => {
        setActionHistory(prev => [...prev, { action, data, timestamp: new Date() }]);
        setLastAction({ action, data, timestamp: new Date() });
    };

    const undoLastAction = () => {
        if (actionHistory.length === 0) return;
        
        const lastAction = actionHistory[actionHistory.length - 1];
        switch(lastAction.action) {
            case 'itemSelect':
                handleRemoveItem(lastAction.data.category);
                break;
            case 'removeItem':
                setSelectedOutfit(prev => ({
                    ...prev,
                    [lastAction.data.category]: lastAction.data.item
                }));
                break;
            case 'resetOutfit':
                // Restore previous state from history
                const previousState = actionHistory
                    .slice(0, -1)
                    .reduce((state, action) => {
                        // Reconstruct state based on actions
                        return state;
                    }, {});
                setSelectedOutfit(previousState);
                break;
            default:
                break;
        }
        
        setActionHistory(prev => prev.slice(0, -1));
    };

    const handleError = (error) => {
        console.error('Error in OutfitMaker:', error);
        setErrorMessage('An error occurred. Please try again.');
        setTimeout(() => setErrorMessage(null), 5000);
    };

    useEffect(() => {
        // Cleanup function
        return () => {
            // Cleanup any resources, subscriptions, etc.
            selectedItems.forEach(id => {
                const item = items.find(i => i.id === id);
                if (item?.image) {
                    URL.revokeObjectURL(item.image);
                }
            });
        };
    }, [selectedItems, items]);

    if (errorMessage) {
        return (
            <div className="error-container">
                <p>{errorMessage}</p>
                <button onClick={() => setErrorMessage(null)}>Dismiss</button>
            </div>
        );
    }

    return (
        <div className="outfit-maker-container">
            <div className="outfit-maker-header">
                <div className="category-tabs">
                    {categories.map(category => (
                        <button
                            key={category}
                            className={`category-tab ${currentCategory === category ? 'active' : ''}`}
                            onClick={() => handleCategoryChange(category)}
                        >
                            {category}
                            <span className="item-count">{itemsPerCategory[category] || 0}</span>
                        </button>
                    ))}
                </div>

                <div className="view-controls">
                    <select 
                        value={sortOrder} 
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="sort-select"
                    >
                        <option value="default">Default</option>
                        <option value="nameAsc">Name A-Z</option>
                        <option value="nameDesc">Name Z-A</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                    </select>

                    <button 
                        className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                        onClick={() => setViewMode('grid')}
                    >
                        Grid
                    </button>
                    <button 
                        className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                        onClick={() => setViewMode('list')}
                    >
                        List
                    </button>
                </div>
            </div>

            <div className="outfit-maker-content">
                <div className="items-scroll-container">
                    <div className="items-row">
                        {filteredItems(currentCategory).map(item => (
                            <div 
                                key={item.id}
                                className={`outfit-item ${selectedOutfit[currentCategory]?.id === item.id ? 'selected' : ''}`}
                                onClick={() => handleItemSelect(item)}
                            >
                                <div className="outfit-item-image">
                                    {loadingImages ? (
                                        <div className="loading-spinner" />
                                    ) : item.image ? (
                                        <img 
                                            src={URL.createObjectURL(item.image)} 
                                            alt={item.brand}
                                            onLoad={() => setLoadingImages(false)}
                                            onError={() => handleError('Image failed to load')}
                                        />
                                    ) : (
                                        <div className="no-image">
                                            <FaTshirt />
                                        </div>
                                    )}
                                </div>
                                <div className="outfit-item-info">
                                    <h4>{item.brand}</h4>
                                    <p>Size: {item.size}</p>
                                    {item.color && <p>Color: {item.color}</p>}
                                    {item.notes && <p className="notes">{item.notes}</p>}
                                </div>
                                {selectedOutfit[currentCategory]?.id === item.id && (
                                    <div className="selected-indicator">
                                        <FaCheck />
                                    </div>
                                )}
                            </div>
                        ))}
                        {filteredItems(currentCategory).length === 0 && (
                            <div className="no-items-message">
                                <FaTshirt />
                                <p>No items available in this category</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="outfit-preview-bar">
                <div className="selected-items-row">
                    {categories.map(category => (
                        <div key={category} className="preview-slot">
                            <span className="category-label">{category}</span>
                            {selectedOutfit[category] ? (
                                <div className="preview-item">
                                    <img 
                                        src={URL.createObjectURL(selectedOutfit[category].image)} 
                                        alt={selectedOutfit[category].brand}
                                    />
                                    <button 
                                        className="remove-item"
                                        onClick={() => handleRemoveItem(category)}
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ) : (
                                <div className="empty-preview-slot">
                                    <FaTshirt />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="preview-actions">
                    <button 
                        className="save-outfit"
                        onClick={handleSaveOutfit}
                        disabled={!Object.values(selectedOutfit).some(item => item !== null)}
                    >
                        <FaSave /> Save Outfit
                    </button>
                    <button 
                        className="undo-action"
                        onClick={undoLastAction}
                        disabled={actionHistory.length === 0}
                    >
                        <FaUndo /> Undo
                    </button>
                </div>
            </div>

            <button className="close-outfit-maker" onClick={onClose}>
                <FaArrowLeft /> Back
            </button>

            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.message}
                </div>
            )}
        </div>
    );
};

export default OutfitMaker;
