// src/components/Watchlist.jsx
import React, { useState, useEffect } from 'react';
import { 
    FaArrowLeft, 
    FaPlus, 
    FaTrash,
    FaFilm,
    FaTv,
    FaSearch,
    FaCheck,
    FaRegClock,
    FaTimes,
    FaStar,
    FaExclamationTriangle
} from 'react-icons/fa';
import { tmdbFetch, TMDB_IMG_URL } from '../config/tmdb';
import "../styles/watchlist.css";

const Watchlist = ({ onReturn }) => {
    const [activeTab, setActiveTab] = useState('movies');
    const [showModal, setShowModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [watchlist, setWatchlist] = useState(() => {
        const savedList = localStorage.getItem('watchlist');
        return savedList ? JSON.parse(savedList) : {
            movies: [],
            series: []
        };
    });
    const [watchStatus, setWatchStatus] = useState(() => {
        const savedStatus = localStorage.getItem('watch-status');
        return savedStatus ? JSON.parse(savedStatus) : {};
    });

    useEffect(() => {
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }, [watchlist]);

    useEffect(() => {
        localStorage.setItem('watch-status', JSON.stringify(watchStatus));
    }, [watchStatus]);

    const searchMedia = async (term) => {
        if (!term) return [];
        
        try {
            const movieResults = await tmdbFetch('/search/movie', {
                query: term,
                page: 1
            });

            const tvResults = await tmdbFetch('/search/tv', {
                query: term,
                page: 1
            });

            const formattedResults = [
                ...movieResults.results.map(movie => ({
                    id: movie.id,
                    title: movie.title,
                    year: movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A',
                    type: 'movie',
                    poster: movie.poster_path ? `${TMDB_IMG_URL}${movie.poster_path}` : null,
                    rating: movie.vote_average,
                    overview: movie.overview,
                    popularity: movie.popularity
                })),
                ...tvResults.results.map(tv => ({
                    id: tv.id,
                    title: tv.name,
                    year: tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'N/A',
                    type: 'series',
                    poster: tv.poster_path ? `${TMDB_IMG_URL}${tv.poster_path}` : null,
                    rating: tv.vote_average,
                    overview: tv.overview,
                    popularity: tv.popularity
                }))
            ]
            .sort((a, b) => b.popularity - a.popularity)
            .slice(0, 8); // Limit to top 8 most popular results

            return formattedResults;
        } catch (error) {
            console.error('Search error:', error);
            throw new Error('Failed to search. Please try again.');
        }
    };

    useEffect(() => {
        if (searchTerm.length >= 2) {
            setLoading(true);
            setError(null);

            const timeoutId = setTimeout(async () => {
                try {
                    const results = await searchMedia(searchTerm);
                    setSearchResults(results);
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }, 500);

            return () => clearTimeout(timeoutId);
        } else {
            setSearchResults([]);
            setError(null);
        }
    }, [searchTerm]);

    const handleAddToWatchlist = (item) => {
        const type = item.type === 'movie' ? 'movies' : 'series';
        if (!watchlist[type].some(existing => existing.id === item.id)) {
            setWatchlist(prev => ({
                ...prev,
                [type]: [...prev[type], { ...item, addedAt: new Date().toISOString() }]
            }));
            setShowModal(false);
            setSearchTerm('');
        } else {
            setError('This title is already in your watchlist');
        }
    };

    const handleStatusChange = (id, status) => {
        setWatchStatus(prev => ({
            ...prev,
            [id]: status
        }));
    };

    const handleDelete = (id, type) => {
        if (window.confirm('Remove from watchlist?')) {
            setWatchlist(prev => ({
                ...prev,
                [type]: prev[type].filter(item => item.id !== id)
            }));
            setWatchStatus(prev => {
                const newStatus = { ...prev };
                delete newStatus[id];
                return newStatus;
            });
        }
    };

    return (
        <div className="watchlist-container">
            <header className="watchlist-header">
                <button className="back-button" onClick={onReturn}>
                    <FaArrowLeft /> Back
                </button>
                <h1>Watchlist</h1>
                <button className="add-button" onClick={() => setShowModal(true)}>
                    <FaPlus /> Add to Watch
                </button>
            </header>

            <div className="tab-container">
                <button 
                    className={`tab-button ${activeTab === 'movies' ? 'active' : ''}`}
                    onClick={() => setActiveTab('movies')}
                >
                    <FaFilm /> Movies ({watchlist.movies.length})
                </button>
                <button 
                    className={`tab-button ${activeTab === 'series' ? 'active' : ''}`}
                    onClick={() => setActiveTab('series')}
                >
                    <FaTv /> TV Series ({watchlist.series.length})
                </button>
            </div>

            <div className="content-container">
                {watchlist[activeTab].length === 0 ? (
                    <div className="empty-state">
                        <FaFilm size={50} />
                        <p>No {activeTab} in your watchlist yet</p>
                        <button className="add-button" onClick={() => setShowModal(true)}>
                            <FaPlus /> Add {activeTab === 'movies' ? 'Movie' : 'Series'}
                        </button>
                    </div>
                ) : (
                    watchlist[activeTab].map(item => (
                        <div key={item.id} className="watchlist-item">
                            <div className="item-poster">
                                {item.poster ? (
                                    <img src={item.poster} alt={item.title} />
                                ) : (
                                    <div className="poster-placeholder">
                                        {item.type === 'movie' ? <FaFilm /> : <FaTv />}
                                    </div>
                                )}
                                {watchStatus[item.id] && (
                                    <div className={`status-badge ${watchStatus[item.id]}`}>
                                        {watchStatus[item.id] === 'watched' ? 'Watched' : 'Pending'}
                                    </div>
                                )}
                            </div>
                            <div className="item-info">
                                <div className="item-header">
                                    <h3>{item.title} <span className="year">({item.year})</span></h3>
                                </div>
                                {item.overview && <p className="overview">{item.overview}</p>}
                                <div className="ratings">
                                    <span className="rating">
                                        <FaStar /> {item.rating.toFixed(1)}
                                    </span>
                                </div>
                            </div>
                            <div className="item-actions">
                                <button 
                                    className={`status-button ${watchStatus[item.id] === 'watched' ? 'watched' : ''}`}
                                    onClick={() => handleStatusChange(item.id, 'watched')}
                                    title="Mark as Watched"
                                >
                                    <FaCheck />
                                </button>
                                <button 
                                    className={`status-button ${watchStatus[item.id] === 'pending' ? 'pending' : ''}`}
                                    onClick={() => handleStatusChange(item.id, 'pending')}
                                    title="Mark as Pending"
                                >
                                    <FaRegClock />
                                </button>
                                <button 
                                    className="delete-button"
                                    onClick={() => handleDelete(item.id, activeTab)}
                                    title="Remove from List"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-wrapper">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h2>Add to Watchlist</h2>
                                <button 
                                    className="close-button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setSearchTerm('');
                                        setSearchResults([]);
                                        setError(null);
                                    }}
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="search-container">
                                <div className="search-input">
                                    <FaSearch />
                                    <input
                                        type="text"
                                        placeholder="Search movies or TV series..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        autoFocus
                                    />
                                </div>
                                {loading && <div className="loading-spinner" />}
                                {error && (
                                    <div className="error-message">
                                        <FaExclamationTriangle /> {error}
                                    </div>
                                )}
                                {searchResults.length > 0 ? (
                                    <div className="search-results">
                                        {searchResults.map(result => (
                                            <div 
                                                key={result.id} 
                                                className="search-result-item"
                                                onClick={() => handleAddToWatchlist(result)}
                                            >
                                                <div className="result-poster">
                                                    {result.poster ? (
                                                        <img src={result.poster} alt={result.title} />
                                                    ) : (
                                                        <div className="poster-placeholder">
                                                            {result.type === 'movie' ? <FaFilm /> : <FaTv />}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="result-info">
                                                    <div className="result-header">
                                                        <h4>{result.title}</h4>
                                                        <span className="result-year">
                                                            {result.year !== 'N/A' ? `(${result.year})` : ''}
                                                        </span>
                                                    </div>
                                                    <div className="result-meta">
                                                        <span className="result-type">
                                                            {result.type === 'movie' ? 'Movie' : 'TV Series'}
                                                        </span>
                                                    </div>
                                                    {result.overview && (
                                                        <p className="result-overview">
                                                            {result.overview.length > 100 
                                                                ? `${result.overview.substring(0, 100)}...` 
                                                                : result.overview}
                                                        </p>
                                                    )}
                                                    <div className="result-ratings">
                                                        <span className="rating">
                                                            <FaStar /> {result.rating.toFixed(1)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <button className="add-to-list">
                                                    <FaPlus />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    searchTerm.length >= 2 && !loading && (
                                        <div className="no-results">
                                            No results found for '{searchTerm}'
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Watchlist;
