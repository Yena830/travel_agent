import React from "react";
import PlacesCardItem from "./PlacesCardItem";
import { Clock, MapPin, Star, Utensils, Camera, Bed, ExternalLink } from "lucide-react";
import CityImage from "../../../components/ui/city-image";

function PlacesVisit({ trip }) {
  // 调试数据结构
  console.log("PlacesVisit - trip data:", trip);
  console.log("PlacesVisit - tripDatas:", trip?.tripDatas);
  console.log("PlacesVisit - nested tripDatas:", trip?.tripDatas?.tripDatas);
  
  // 安全地获取itinerary数据 - 处理双重嵌套问题
  const itinerary = trip?.tripDatas?.tripDatas?.itinerary || trip?.tripDatas?.itinerary || [];
  console.log("PlacesVisit - itinerary:", itinerary);
  
  // 如果没有数据，显示加载状态或空状态
  if (!trip || !trip.tripDatas) {
    return (
      <div>
        <h2 className="font-bold text-xl mt-10">Daily Plan</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading trip data...</p>
        </div>
      </div>
    );
  }

  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return (
      <div>
        <h2 className="font-bold text-xl mt-10">Daily Plan</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No itinerary data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {itinerary.map((plan, index) => (
        <div key={index} className="nj-card simple-sticker">
          <div className="p-6">
            <div className="flex items-center text-[#153582] mb-6">
              <span className="bg-[#153582] text-white rounded-full w-8 h-8 flex items-center justify-center text-sm mr-3">
                {plan.day}
              </span>
              <h3 className="text-xl font-bold">
                Day {plan.day}
              </h3>
            </div>
            
            <div className="space-y-4">
              {Array.isArray(plan.plan) && plan.plan.map((place, i) => {
                // 构建Google Maps搜索URL
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName || '')}`;
                
                return (
                  <div key={i} className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#153582] flex items-center justify-center text-white text-xs">
                        <Camera className="w-4 h-4" />
                      </div>
                      {i < plan.plan.length - 1 && (
                        <div className="w-0.5 h-6 bg-[#153582]/20 mt-2"></div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-[#153582] text-lg hover:text-blue-600 transition-colors">
                              {place.placeName || 'Place'}
                            </h4>
                            <a
                              href={googleMapsUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#153582] hover:text-[#F48FB1] transition-colors"
                              title="View on Google Maps"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                          <div className="flex items-center text-[#576380] text-sm mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {place.bestTime || 'N/A'}
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm text-[#F48FB1] font-semibold">
                            {place.ticketPricing || 'N/A'}
                          </span>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span className="text-sm text-[#576380]">
                              {place.rating || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-[#576380] text-sm mb-2">
                        {place.placeDetails || 'No description available'}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-[#576380]">
                          <Clock className="w-3 h-3 mr-1" />
                          Duration: {place.travelTime || 'N/A'}
                        </div>
                        <a
                          href={googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#153582] hover:text-[#F48FB1] transition-colors flex items-center gap-1"
                        >
                          <MapPin className="w-3 h-3" />
                          View on Maps
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Daily Image - Show first place of the day */}
            {Array.isArray(plan.plan) && plan.plan.length > 0 && plan.plan[0]?.placeName && (
              <div className="mt-6">
                <CityImage 
                  cityName={plan.plan[0].placeName}
                  className="h-48 w-full rounded-lg"
                  fallbackText={`${plan.plan[0].placeName} View`}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PlacesVisit;
