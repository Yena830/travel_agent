import { db } from "../../service/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "./components/InfoSection";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import Hotels from "./components/Hotels";
import PlacesVisit from "./components/PlacesVisit";
import Footer from "../../components/custom/Footer";
import { Download, Share2, Edit, Calendar, MapPin, Star, Clock, Utensils, Camera, Bed } from "lucide-react";
import { TripService } from "../../service/userService";
import html2canvas from 'html2canvas';
import CityImage from "../../components/ui/city-image";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);
  const GetTripData = async () => {
    try {
      // 首先尝试从新的数据结构中查找
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      let tripFound = false;
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        try {
          const trip = await TripService.getTripById(userId, tripId);
          if (trip) {
            console.log("Found trip in new structure:", trip);
            setTrip(trip);
            tripFound = true;
            break;
          }
        } catch (error) {
          // 继续查找下一个用户
          continue;
        }
      }
      
      // 如果在新结构中没找到，尝试旧结构
      if (!tripFound) {
        console.log("Trying old structure...");
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
          console.log("Found trip in old structure:", docSnap.data());
      setTrip(docSnap.data());
          tripFound = true;
        }
      }
      
      if (!tripFound) {
        console.log("No trip found in any structure");
      toast("No trip found!");
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
      toast("Error loading trip data");
    }
  };

  // 下载行程功能 - 生成PDF格式
  const downloadItinerary = () => {
    const itinerary = trip?.tripDatas?.tripDatas?.itinerary || trip?.tripDatas?.itinerary || [];
    const hotelOptions = trip?.tripDatas?.tripDatas?.hotelOptions || trip?.tripDatas?.hotelOptions || [];
    const location = trip?.userPreference?.location || "Unknown Location";
    const days = trip?.userPreference?.days || 0;
    const budget = trip?.userPreference?.budget || 0;
    const people = trip?.userPreference?.people || 0;

    // 创建HTML内容用于PDF生成
    let htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${location} Travel Itinerary</title>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #fff;
        }
        .header {
          text-align: center;
          border-bottom: 3px solid #153582;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: #153582;
          font-size: 2.5em;
          margin: 0;
        }
        .trip-info {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 10px;
          margin-bottom: 30px;
        }
        .trip-info h2 {
          color: #153582;
          margin-top: 0;
        }
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
        }
        .info-item {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #153582;
        }
        .info-item strong {
          color: #153582;
        }
        .section {
          margin-bottom: 40px;
        }
        .section h2 {
          color: #153582;
          font-size: 1.8em;
          border-bottom: 2px solid #F48FB1;
          padding-bottom: 10px;
        }
        .hotel-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 20px;
        }
        .hotel-name {
          color: #153582;
          font-size: 1.3em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        .hotel-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 10px;
        }
        .day-card {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          padding: 20px;
          margin-bottom: 25px;
        }
        .day-header {
          background: #153582;
          color: white;
          padding: 15px;
          border-radius: 8px;
          margin: -20px -20px 20px -20px;
          text-align: center;
        }
        .day-header h3 {
          margin: 0;
          font-size: 1.4em;
        }
        .place-item {
          background: white;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
        }
        .place-name {
          color: #153582;
          font-size: 1.2em;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .place-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          font-size: 0.9em;
        }
        .place-details strong {
          color: #153582;
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e9ecef;
          color: #666;
        }
        @media print {
          body { margin: 0; padding: 15px; }
          .day-card { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${location} Travel Itinerary</h1>
        <p>Your personalized travel plan</p>
      </div>

      <div class="trip-info">
        <h2>Trip Details</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Destination:</strong><br>${location}
          </div>
          <div class="info-item">
            <strong>Duration:</strong><br>${days} days
          </div>
          <div class="info-item">
            <strong>Budget:</strong><br>$${budget.toLocaleString()}
          </div>
          <div class="info-item">
            <strong>Travelers:</strong><br>${people}
          </div>
        </div>
      </div>`;

    // 添加酒店推荐
    if (hotelOptions.length > 0) {
      htmlContent += `
      <div class="section">
        <h2>🏨 Hotel Recommendations</h2>`;
      
      hotelOptions.forEach((hotel, index) => {
        htmlContent += `
        <div class="hotel-card">
          <div class="hotel-name">${hotel.hotelName || `Hotel ${index + 1}`}</div>
          <div class="hotel-details">
            <div><strong>Address:</strong><br>${hotel.hotelAddress || 'N/A'}</div>
            <div><strong>Price:</strong><br>${hotel.price || 'N/A'}</div>
            <div><strong>Rating:</strong><br>${hotel.rating || 'N/A'}</div>
          </div>
        </div>`;
      });
      
      htmlContent += `</div>`;
    }

    // 添加每日行程
    if (itinerary.length > 0) {
      htmlContent += `
      <div class="section">
        <h2>🗓️ Daily Itinerary</h2>`;
      
      itinerary.forEach((day) => {
        htmlContent += `
        <div class="day-card">
          <div class="day-header">
            <h3>Day ${day.day}</h3>
          </div>`;
        
        if (day.plan && Array.isArray(day.plan)) {
          day.plan.forEach((place, index) => {
            htmlContent += `
            <div class="place-item">
              <div class="place-name">${index + 1}. ${place.placeName || 'Place'}</div>
              <div class="place-details">
                <div><strong>Time:</strong><br>${place.bestTime || 'N/A'}</div>
                <div><strong>Price:</strong><br>${place.ticketPricing || 'N/A'}</div>
                <div><strong>Rating:</strong><br>${place.rating || 'N/A'}</div>
                <div><strong>Duration:</strong><br>${place.travelTime || 'N/A'}</div>
              </div>
              <div style="margin-top: 10px;"><strong>Description:</strong><br>${place.placeDetails || 'No description available'}</div>
            </div>`;
          });
        }
        
        htmlContent += `</div>`;
      });
      
      htmlContent += `</div>`;
    }

    htmlContent += `
      <div class="footer">
        <p>Generated by Smart Trip AI Travel Planner</p>
        <p>Happy travels! ✈️</p>
      </div>
    </body>
    </html>`;

    // 创建并下载HTML文件（可以打印为PDF）
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${location.replace(/\s+/g, '_')}_Travel_Itinerary.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Itinerary downloaded! You can print it as PDF from your browser.");
  };

  // 生成并分享PDF截图
  const shareTrip = async () => {
    const location = trip?.userPreference?.location || "Unknown Location";
    const days = trip?.userPreference?.days || 0;
    const budget = trip?.userPreference?.budget || 0;
    
    try {
      // 显示加载提示
      toast.loading("Generating PDF and converting to image...", { id: "screenshot" });
      
      // 生成PDF内容（复用现有的downloadItinerary逻辑）
      const itinerary = trip?.tripDatas?.tripDatas?.itinerary || trip?.tripDatas?.itinerary || [];
      const hotelOptions = trip?.tripDatas?.tripDatas?.hotelOptions || trip?.tripDatas?.hotelOptions || [];
      
      // 创建PDF内容的HTML
      let htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>${location} Travel Itinerary</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #fff;
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #153582;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #153582;
            font-size: 2.5em;
            margin: 0;
          }
          .trip-info {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
          }
          .trip-info h2 {
            color: #153582;
            margin-top: 0;
          }
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
          }
          .info-item {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #153582;
          }
          .info-item strong {
            color: #153582;
          }
          .section {
            margin-bottom: 40px;
          }
          .section h2 {
            color: #153582;
            font-size: 1.8em;
            border-bottom: 2px solid #F48FB1;
            padding-bottom: 10px;
          }
          .hotel-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .hotel-name {
            color: #153582;
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .hotel-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
          }
          .day-card {
            background: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 25px;
          }
          .day-header {
            background: #153582;
            color: white;
            padding: 15px;
            border-radius: 8px;
            margin: -20px -20px 20px -20px;
            text-align: center;
          }
          .day-header h3 {
            margin: 0;
            font-size: 1.4em;
          }
          .place-item {
            background: white;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .place-name {
            color: #153582;
            font-size: 1.2em;
            font-weight: bold;
            margin-bottom: 8px;
          }
          .place-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 8px;
            font-size: 0.9em;
          }
          .place-details strong {
            color: #153582;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 2px solid #e9ecef;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>${location} Travel Itinerary</h1>
          <p>Your personalized travel plan</p>
        </div>

        <div class="trip-info">
          <h2>Trip Details</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Destination:</strong><br>${location}
            </div>
            <div class="info-item">
              <strong>Duration:</strong><br>${days} days
            </div>
            <div class="info-item">
              <strong>Budget:</strong><br>$${budget.toLocaleString()}
            </div>
            <div class="info-item">
              <strong>Travelers:</strong><br>${trip?.userPreference?.people || 0}
            </div>
          </div>
        </div>`;

      // 添加酒店推荐
      if (hotelOptions.length > 0) {
        htmlContent += `
        <div class="section">
          <h2>🏨 Hotel Recommendations</h2>`;
        
        hotelOptions.forEach((hotel, index) => {
          htmlContent += `
          <div class="hotel-card">
            <div class="hotel-name">${hotel.hotelName || `Hotel ${index + 1}`}</div>
            <div class="hotel-details">
              <div><strong>Address:</strong><br>${hotel.hotelAddress || 'N/A'}</div>
              <div><strong>Price:</strong><br>${hotel.price || 'N/A'}</div>
              <div><strong>Rating:</strong><br>${hotel.rating || 'N/A'}</div>
            </div>
          </div>`;
        });
        
        htmlContent += `</div>`;
      }

      // 添加每日行程
      if (itinerary.length > 0) {
        htmlContent += `
        <div class="section">
          <h2>🗓️ Daily Itinerary</h2>`;
        
        itinerary.forEach((day) => {
          htmlContent += `
          <div class="day-card">
            <div class="day-header">
              <h3>Day ${day.day}</h3>
            </div>`;
          
          if (day.plan && Array.isArray(day.plan)) {
            day.plan.forEach((place, index) => {
              htmlContent += `
              <div class="place-item">
                <div class="place-name">${index + 1}. ${place.placeName || 'Place'}</div>
                <div class="place-details">
                  <div><strong>Time:</strong><br>${place.bestTime || 'N/A'}</div>
                  <div><strong>Price:</strong><br>${place.ticketPricing || 'N/A'}</div>
                  <div><strong>Rating:</strong><br>${place.rating || 'N/A'}</div>
                  <div><strong>Duration:</strong><br>${place.travelTime || 'N/A'}</div>
                </div>
                <div style="margin-top: 10px;"><strong>Description:</strong><br>${place.placeDetails || 'No description available'}</div>
              </div>`;
            });
          }
          
          htmlContent += `</div>`;
        });
        
        htmlContent += `</div>`;
      }

      htmlContent += `
        <div class="footer">
          <p>Generated by Smart Trip AI Travel Planner</p>
          <p>Happy travels! ✈️</p>
        </div>
      </body>
      </html>`;

      // 创建临时iframe来渲染HTML
      const iframe = document.createElement('iframe');
      iframe.style.position = 'absolute';
      iframe.style.left = '-9999px';
      iframe.style.top = '-9999px';
      iframe.style.width = '800px';
      iframe.style.height = '600px';
      iframe.style.border = 'none';
      document.body.appendChild(iframe);
      
      // 写入HTML内容
      iframe.contentDocument.write(htmlContent);
      iframe.contentDocument.close();
      
      // 等待内容加载
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 使用html2canvas截图iframe内容
      const canvas = await html2canvas(iframe.contentDocument.body, {
        scale: 1,
        backgroundColor: '#ffffff',
        useCORS: true,
        allowTaint: true,
        logging: false
      });
      
      // 清理iframe
      document.body.removeChild(iframe);
      
      const dataURL = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataURL)).blob();
      const file = new File([blob], `${location}-travel-plan.png`, { type: 'image/png' });
      
      // 尝试使用 Web Share API 分享截图
      if (navigator.share && navigator.canShare) {
        const shareData = {
          title: `${location} Travel Plan`,
          text: `Check out my ${days}-day travel plan for ${location} with a budget of $${budget}!`,
          files: [file]
        };
        
        if (navigator.canShare(shareData)) {
          await navigator.share(shareData);
          toast.dismiss("screenshot");
          toast.success("Trip plan shared successfully!");
          return;
        }
      }
      
      // 如果不支持文件分享，则下载截图
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${location}-travel-plan.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.dismiss("screenshot");
      toast.success("Trip plan image downloaded!");
      
    } catch (error) {
      console.error('Error generating PDF screenshot:', error);
      toast.dismiss("screenshot");
      toast.error("Failed to generate trip plan image");
    }
  };


  return (
    <div className="relative min-h-screen bg-white py-8 sm:py-12 pt-16 sm:pt-20">
      {/* Simple background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="simple-doodle top-16 right-4 sm:right-20 text-base sm:text-lg simple-float pink-accent">🎉</div>
        <div className="simple-doodle bottom-20 left-4 sm:left-20 text-lg sm:text-xl simple-float">✈️</div>
        
        {/* Hand-drawn celebration elements */}
        <svg className="absolute top-32 left-1/4 w-8 h-8 sm:w-12 sm:h-12 text-[#F48FB1] opacity-30" viewBox="0 0 100 100" fill="none">
          <path d="M20 50 L30 40 L40 50 L50 40 L60 50 L70 40 L80 50" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <circle cx="25" cy="35" r="2" fill="currentColor"/>
          <circle cx="45" cy="35" r="2" fill="currentColor"/>
          <circle cx="65" cy="35" r="2" fill="currentColor"/>
        </svg>
        
        <svg className="absolute bottom-1/4 right-1/3 w-8 h-8 sm:w-10 sm:h-10 text-[#153582] opacity-20" viewBox="0 0 100 100" fill="none">
          <path d="M50 10 L60 40 L90 40 L70 60 L80 90 L50 70 L20 90 L30 60 L10 40 L40 40 Z" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* City Image with Overlay Content */}
          <div className="relative mb-6 rounded-lg overflow-hidden">
            <CityImage 
              cityName={trip?.userPreference?.location || "Travel Destination"}
              className="h-48 sm:h-56 md:h-64 lg:h-72 w-full"
              fallbackText="Beautiful Destination"
            />
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/30"></div>
            
            {/* City Name and Tags - Center overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 sm:px-6">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                {trip?.userPreference?.location || "Travel Destination"}
              </h2>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  {trip?.userPreference?.days || 0} Days
                </div>
                <div className="bg-[#F48FB1]/90 backdrop-blur-sm text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium">
                  ${trip?.userPreference?.budget || 0} Budget
                </div>
                {/* <div className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {trip?.userPreference?.people || 0} People
                </div> */}
              </div>
            </div>
            
            {/* Action buttons overlay on bottom-right of image */}
            <div className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 flex flex-col sm:flex-row gap-1 sm:gap-2">
              {/* <Link 
                to="/create-trip"
                className="bg-white/90 backdrop-blur-sm border border-gray-200 text-[#153582] hover:bg-[#153582] hover:text-white px-4 py-2 rounded-full flex items-center gap-2 transition-all duration-300 shadow-lg"
              >
                <Edit className="w-4 h-4" />
                Edit
              </Link> */}
              <button
                onClick={downloadItinerary}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 text-[#153582] hover:bg-[#153582] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Download</span>
                <span className="sm:hidden">DL</span>
              </button>
              <button
                onClick={shareTrip}
                className="bg-white/90 backdrop-blur-sm border border-gray-200 text-[#F48FB1] hover:bg-[#F48FB1] hover:text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 transition-all duration-300 shadow-lg text-xs sm:text-sm"
              >
                <Share2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Share</span>
                <span className="sm:hidden">SH</span>
              </button>
            </div>
          </div>

     
            
          {/* Hand-drawn style celebration line */}
          <div className="flex justify-center mt-4 sm:mt-6">
            <svg className="w-32 sm:w-48 h-3 sm:h-4" viewBox="0 0 192 16" fill="none">
              <path d="M5 8 Q50 4 96 8 Q142 12 187 8" stroke="#153582" strokeWidth="2" strokeLinecap="round" opacity="0.2"/>
              <circle cx="20" cy="6" r="1.5" fill="#F48FB1" opacity="0.6"/>
              <circle cx="96" cy="10" r="1.5" fill="#F48FB1" opacity="0.6"/>
              <circle cx="172" cy="6" r="1.5" fill="#F48FB1" opacity="0.6"/>
            </svg>
          </div>


           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
             {/* Hotel recommendations */}
             <div className="lg:col-span-1 order-2 lg:order-1">
               <div className="nj-card simple-sticker h-fit lg:sticky lg:top-2">
                 <div className="p-4 sm:p-6">
                   <h3 className="flex items-center text-[#153582] text-lg sm:text-xl font-bold mb-3 sm:mb-4">
                     <Bed className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                     Recommended Stay
                   </h3>
                 </div>
      <Hotels trip={trip} />
               </div>
             </div>

             {/* Daily itinerary */}
             <div className="lg:col-span-2 order-1 lg:order-2">
      <PlacesVisit trip={trip} />
             </div>
           </div>
        </div>
      </div>
      
      {/*Footer*/}
      <Footer />
    </div>
  );
}

export default ViewTrip;
