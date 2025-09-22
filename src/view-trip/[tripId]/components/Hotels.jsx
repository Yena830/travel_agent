import React from "react";
import { Link } from "react-router-dom";

function Hotels({ trip }) {
  // 调试数据结构
  console.log("Hotels - trip data:", trip);
  console.log("Hotels - tripDatas:", trip?.tripDatas);
  console.log("Hotels - nested tripDatas:", trip?.tripDatas?.tripDatas);
  
  // 安全地获取hotelOptions数据 - 处理双重嵌套问题
  const hotelOptions = trip?.tripDatas?.tripDatas?.hotelOptions || trip?.tripDatas?.hotelOptions || [];
  console.log("Hotels - hotelOptions:", hotelOptions);
  
  // 如果没有数据，显示加载状态或空状态
  if (!trip || !trip.tripDatas) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loading hotel data...</p>
      </div>
    );
  }

  if (!Array.isArray(hotelOptions) || hotelOptions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No hotel recommendations available</p>
      </div>
    );
  }

  return (
    <div className="px-4 py-2">
        {hotelOptions.map((hotel, index) => (
          <div key={index} className="mb-6">
            <Link
              to={
                "https://www.google.com/maps/search/?api=1&query=" +
                hotel.hotelName +
                hotel.hotelAddress
              }
              target="_blank"
              className="group block"
            >
            <div className="bg-gray-50 rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group-hover:border-gray-400">
              {/* 酒店信息 */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-[#153582] mb-2 group-hover:text-blue-600 transition-colors">
                  {hotel.hotelName}
                </h3>

                {/* 评分 */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className={`w-3 h-3 ${i < Math.floor(4.8) ? 'fill-current' : ''}`} viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-xs text-[#576380]">4.8</span>
                  </div>
                  <span className="text-sm text-[#F48FB1] font-semibold">
                    {hotel.price || '$150-200/night'}
                  </span>
                </div>

                {/* 位置 */}
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-xs text-[#576380]">
                    {hotel.hotelAddress || 'City Center'}
                  </p>
                </div>
              </div>
            </div>
            </Link>
          </div>
        ))}
    </div>
  );
}

export default Hotels;
