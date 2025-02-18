// src/config/tmdb.js
export const TMDB_API_KEY = 'cffd7f47b00dc012fa747d9256dc2e87'; // Replace with your actual API key
export const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
export const TMDB_IMG_URL = 'https://image.tmdb.org/t/p/w500';

export const tmdbFetch = async (endpoint, params = {}) => {
    const queryParams = new URLSearchParams({
        api_key: TMDB_API_KEY,
        language: 'en-US',
        ...params
    });

    try {
        const response = await fetch(
            `${TMDB_BASE_URL}${endpoint}?${queryParams}`
        );
        if (!response.ok) throw new Error('TMDB API request failed');
        return await response.json();
    } catch (error) {
        console.error('TMDB API Error:', error);
        throw error;
    }
};
