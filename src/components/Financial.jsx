// src/components/Financial.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaArrowLeft, 
    FaPlus, 
    FaTrash,
    FaEdit,
    FaMoneyBillWave,
    FaShoppingCart,
    FaPiggyBank,
    FaHandHoldingUsd
} from 'react-icons/fa';
import "../styles/financial.css";

const Financial = ({ onReturn }) => {
    const [categories, setCategories] = useState(() => {
        const savedCategories = localStorage.getItem('financial-categories');
        return savedCategories ? JSON.parse(savedCategories) : {
            income: [],
            expenses: [],
            savings: [],
            debts: []
        };
    });

    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        amount: '',
        type: 'income'
    });

    useEffect(() => {
        localStorage.setItem('financial-categories', JSON.stringify(categories));
    }, [categories]);

    const calculateTotal = (type) => {
        return categories[type].reduce((sum, item) => sum + Number(item.amount), 0);
    };

    const calculateRemaining = () => {
        const income = calculateTotal('income');
        const expenses = calculateTotal('expenses');
        return income - expenses;
    };

    const calculateSavingsBalance = () => {
        const savings = calculateTotal('savings');
        const debts = calculateTotal('debts');
        return savings - debts;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const newItem = {
            id: editingItem ? editingItem.id : Date.now(),
            name: formData.name,
            amount: Number(formData.amount),
            dateAdded: editingItem ? editingItem.dateAdded : new Date().toISOString()
        };

        if (editingItem) {
            setCategories(prev => ({
                ...prev,
                [formData.type]: prev[formData.type].map(item => 
                    item.id === editingItem.id ? newItem : item
                )
            }));
            setEditingItem(null);
        } else {
            setCategories(prev => ({
                ...prev,
                [formData.type]: [...prev[formData.type], newItem]
            }));
        }

        setFormData({
            name: '',
            amount: '',
            type: 'income'
        });
        setShowModal(false);
    };

    const handleEdit = (type, item) => {
        setFormData({
            name: item.name,
            amount: item.amount,
            type: type
        });
        setEditingItem(item);
        setShowModal(true);
    };

    const handleDelete = (type, id) => {
        if (window.confirm('Delete this item?')) {
            setCategories(prev => ({
                ...prev,
                [type]: prev[type].filter(item => item.id !== id)
            }));
        }
    };

    const getCategoryIcon = (type) => {
        switch(type) {
            case 'income':
                return <FaMoneyBillWave />;
            case 'expenses':
                return <FaShoppingCart />;
            case 'savings':
                return <FaPiggyBank />;
            case 'debts':
                return <FaHandHoldingUsd />;
            default:
                return null;
        }
    };

    return (
        <div className="financial-container">
            <header className="financial-header">
                <button className="back-button" onClick={onReturn}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Financial Tracker</h1>
                <button className="add-button" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add Item
                </button>
            </header>

            <div className="balance-overview">
                <div className="balance-card remaining">
                    <h3>Remaining Money</h3>
                    <span className={`amount ${calculateRemaining() >= 0 ? 'positive' : 'negative'}`}>
                        €{calculateRemaining().toFixed(2)}
                    </span>
                </div>
                <div className="balance-card savings">
                    <h3>Remaining Savings</h3>
                    <span className={`amount ${calculateSavingsBalance() >= 0 ? 'positive' : 'negative'}`}>
                        €{calculateSavingsBalance().toFixed(2)}
                    </span>
                </div>
            </div>

            <div className="categories-grid">
                {Object.keys(categories).map(type => (
                    <div key={type} className={`category-section ${type}`}>
                        <div className="category-header">
                            {getCategoryIcon(type)}
                            <h2>{type.charAt(0).toUpperCase() + type.slice(1)}</h2>
                            <span className="total">
                                €{calculateTotal(type).toFixed(2)}
                            </span>
                        </div>
                        <div className="items-list">
                            {categories[type].map(item => (
                                <div key={item.id} className="financial-item">
                                    <div className="item-info">
                                        <span className="item-name">{item.name}</span>
                                        <span className="item-amount">
                                            €{item.amount.toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="item-actions">
                                        <button 
                                            className="edit-button"
                                            onClick={() => handleEdit(type, item)}
                                        >
                                            <FaEdit />
                                        </button>
                                        <button 
                                            className="delete-button"
                                            onClick={() => handleDelete(type, item.id)}
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>{editingItem ? 'Edit' : 'Add'} Financial Item</h2>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Item Name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <input
                                        type="number"
                                        placeholder="Amount in €"
                                        value={formData.amount}
                                        onChange={e => setFormData({...formData, amount: e.target.value})}
                                        required
                                        step="0.01"
                                        min="0"
                                    />
                                </div>
                                <div className="type-switch">
                                    {Object.keys(categories).map(type => (
                                        <button
                                            key={type}
                                            type="button"
                                            className={`switch-option ${formData.type === type ? 'active' : ''}`}
                                            onClick={() => setFormData({...formData, type})}
                                        >
                                            {getCategoryIcon(type)}
                                            {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </button>
                                    ))}
                                </div>
                                <div className="form-buttons">
                                    <button type="submit" className="primary-button">
                                        {editingItem ? 'Update' : 'Save'}
                                    </button>
                                    <button 
                                        type="button" 
                                        className="secondary-button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingItem(null);
                                            setFormData({
                                                name: '',
                                                amount: '',
                                                type: 'income'
                                            });
                                        }}
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

export default Financial;
