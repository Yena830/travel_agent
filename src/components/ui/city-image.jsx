import React, { useState, useEffect } from 'react';

const CityImage = ({ cityName, className = "", fallbackText = "City Image" }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchCityImage = async () => {
      if (!cityName) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(false);
        
        // 使用 Unsplash API 获取城市图片
        const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        
        if (!UNSPLASH_ACCESS_KEY) {
          console.warn('Unsplash API key not found. Please add VITE_UNSPLASH_ACCESS_KEY to your .env file');
          setError(true);
          setLoading(false);
          return;
        }

        const searchQuery = encodeURIComponent(`${cityName} city travel destination`);
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${searchQuery}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`Unsplash API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // 使用更高分辨率的图片
          const imageUrl = data.results[0].urls.full || data.results[0].urls.regular;
          setImageUrl(imageUrl);
          setLoading(false);
        } else {
          throw new Error('No images found for this city');
        }
        
      } catch (err) {
        console.error('Error fetching city image:', err);
        setError(true);
        setLoading(false);
      }
    };

    fetchCityImage();
  }, [cityName]);

  if (loading) {
    return (
      <div className={`bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#153582] mx-auto mb-4"></div>
          <p className="text-[#153582] font-medium">Loading city image...</p>
        </div>
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div className={`bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg flex items-center justify-center ${className}`}>
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🏙️</div>
          <p className="text-[#153582] font-medium">{fallbackText}</p>
          <p className="text-sm text-gray-500 mt-2">
            {!import.meta.env.VITE_UNSPLASH_ACCESS_KEY ? 'Unsplash API key required' : 'Image not available'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-lg ${className}`}>
      <img
        src={imageUrl}
        alt={`${cityName} city view`}
        className="w-full h-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
};

export default CityImage;
