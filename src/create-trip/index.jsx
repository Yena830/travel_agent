import { Input } from "../components/ui/input";
import { Slider } from "../components/ui/slider";
import {
  AI_PROMPT,
  generateAIPrompt,
  SelectBudgetOptions,
  SelectTravelList,
} from "../constants/options";
import { chatSession } from "../service/AIModel";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { UserService, TripService } from "../service/userService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({
    location: '',
    days: 3,
    budget: 5000,
    people: 2
  });
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [tripLimit, setTripLimit] = useState(null);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    if (name == "days" && (value < 1 || value > 14)) {
      toast("Days should be between 1 and 14");
      return;
    }
    if (name == "budget" && (value < 500 || value > 10000)) {
      toast("Budget should be between $500 and $10,000");
      return;
    }
    if (name == "people" && (value < 1 || value > 10)) {
      toast("Number of people should be between 1 and 10");
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  // 加载用户的旅行限制信息
  const loadTripLimit = async () => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        const userEmail = parsedUser.email || parsedUser.user_email;
        
        if (userEmail) {
          // 先获取或创建用户
          const userProfile = await UserService.createOrUpdateUser({
            email: userEmail,
            name: parsedUser.name || 'Traveler',
            profilePicture: parsedUser.picture || ''
          });
          
          // 从数据库获取最新的限制信息
          const limitCheck = await UserService.canGenerateTrip(userProfile.userId);
          setTripLimit(limitCheck);
          
          console.log('Trip limit loaded from database:', limitCheck);
        }
      } catch (error) {
        console.error('Error loading trip limit:', error);
        // 如果加载失败，设置默认值
        setTripLimit({
          canGenerate: true,
          currentCount: 0,
          maxAllowed: 10,
          remaining: 10
        });
      }
    }
  };

  useEffect(() => {
    loadTripLimit();
  }, []);

  // 监听页面可见性变化，当用户从其他页面返回时重新加载限制信息
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Page became visible, reloading trip limit...');
        loadTripLimit();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);
  const login = useGoogleLogin({
    onSuccess: (e) => GetUserProfile(e),
    onError: (error) => console.log(error),
  });

  const OnGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    if (
      !formData?.location ||
      !formData?.days ||
      formData?.days < 1 ||
      formData?.days > 14 ||
      !formData?.budget ||
      formData?.budget < 500 ||
      !formData?.people ||
      formData?.people < 1
    ) {
      toast("Please fill all details correctly");
      return;
    }

    // 检查用户是否可以生成新的旅行计划 - 从数据库实时获取
    try {
      const parsedUser = JSON.parse(user);
      const userEmail = parsedUser.email || parsedUser.user_email;
      
      if (userEmail) {
        // 确保用户存在并获取最新信息
        const userProfile = await UserService.createOrUpdateUser({
          email: userEmail,
          name: parsedUser.name || 'Traveler',
          profilePicture: parsedUser.picture || ''
        });
        
        // 从数据库实时检查限制
        const limitCheck = await UserService.canGenerateTrip(userProfile.userId);
        console.log('Real-time limit check:', limitCheck);
        
        if (!limitCheck.canGenerate) {
          toast.error(`You have reached the maximum limit of ${limitCheck.maxAllowed} trips. Please upgrade your plan to generate more trips.`);
          // 更新本地状态以反映数据库的真实状态
          setTripLimit(limitCheck);
          return;
        }
        
        // 显示剩余次数警告
        if (limitCheck.remaining <= 3) {
          toast.warning(`You have ${limitCheck.remaining} trips remaining. Consider upgrading your plan for unlimited trips!`);
        }
        
        // 更新本地状态
        setTripLimit(limitCheck);
      }
    } catch (error) {
      console.error('Error checking trip limit:', error);
      toast.error('Unable to verify trip limit. Please try again.');
      return; // 如果检查失败，阻止生成以避免计数错误
    }

    setLoading(true);
    
    // 使用新的智能prompt生成函数
    const FINAL_PROMPT = generateAIPrompt({
      location: formData?.location,
      days: parseInt(formData?.days) || 3,
      budget: parseInt(formData?.budget) || 5000,
      people: parseInt(formData?.people) || 2
    });
    
    console.log("Generated AI Prompt:", FINAL_PROMPT);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAITrip(result?.response?.text());
  };

  const SaveAITrip = async (tripData) => {
    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user"));
      
      // 清理和解析AI返回的数据
      let cleanedTripData = tripData;
      
      // 移除可能的markdown代码块标记
      if (cleanedTripData.includes('```json')) {
        cleanedTripData = cleanedTripData.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      }
      
      // 移除可能的markdown代码块标记（通用）
      if (cleanedTripData.includes('```')) {
        cleanedTripData = cleanedTripData.replace(/```\n?/g, '');
      }
      
      // 移除首尾空白字符
      cleanedTripData = cleanedTripData.trim();
      
      // 查找第一个 { 和最后一个 } 来提取有效的JSON
      const firstBrace = cleanedTripData.indexOf('{');
      const lastBrace = cleanedTripData.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        cleanedTripData = cleanedTripData.substring(firstBrace, lastBrace + 1);
      }
      
      // 尝试解析JSON
      let parsedTripData;
      try {
        parsedTripData = JSON.parse(cleanedTripData);
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.error("Raw AI Response:", tripData);
        console.error("Cleaned Response:", cleanedTripData);
        
        // 如果解析失败，创建一个默认结构
        parsedTripData = {
          tripDatas: {
            hotelOptions: [],
            itinerary: []
          }
        };
        
        toast.error("AI返回的数据格式有误，请重试");
        setLoading(false);
        return;
      }
      
      // Get user email and create/update user
      const userEmail = user?.email || user?.user_email;
      if (!userEmail) {
        toast.error("User information incomplete");
        setLoading(false);
        return;
      }

      // Create or update user profile
      const userProfile = await UserService.createOrUpdateUser({
        email: userEmail,
        name: user?.name || 'Traveler',
        profilePicture: user?.picture || ''
      });

      // Create trip using new structure
      const trip = await TripService.createTrip(userProfile.userId, {
        userPreference: formData,
        tripDatas: parsedTripData
      });

      // 重新从数据库获取最新的限制信息（基于实际旅行计划数量）
      const updatedLimitCheck = await UserService.canGenerateTrip(userProfile.userId);
      setTripLimit(updatedLimitCheck);
      console.log('Updated trip limit after generation:', updatedLimitCheck);
      
      // 触发自定义事件通知Header更新限制信息
      window.dispatchEvent(new CustomEvent('tripLimitUpdated', { 
        detail: { 
          userId: userProfile.userId, 
          limitInfo: updatedLimitCheck 
        } 
      }));
      
      setLoading(false);
      navigate("/view-trip/" + trip.tripId);
    } catch (error) {
      console.error("SaveAITrip Error:", error);
      toast.error("保存旅行计划时出错，请重试");
      setLoading(false);
    }
  };

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((resp) => {
        console.log("User Profile Data:", resp.data);
        localStorage.setItem("user", JSON.stringify(resp.data));
        setOpenDialog(false);
        OnGenerateTrip();
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
      });
  };

  return (
    <div className="relative min-h-screen bg-white py-12 pt-20">
      {/* Simple background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="simple-doodle top-16 right-16 text-lg simple-float pink-accent">✨</div>
        <div className="simple-doodle bottom-20 left-16 text-xl simple-float">📍</div>
        
        {/* Hand-drawn style arrows */}
        <svg className="absolute top-1/4 left-8 w-8 h-8 text-[#153582] opacity-20" viewBox="0 0 100 100" fill="none">
          <path d="M20 80 Q50 20 80 60" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <path d="M70 50 L80 60 L70 70" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        
        <svg className="absolute top-1/3 right-12 w-6 h-6 text-[#F48FB1] opacity-40" viewBox="0 0 100 100" fill="none">
          <circle cx="50" cy="50" r="20" stroke="currentColor" strokeWidth="3" fill="none"/>
          <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
      </div>
      
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Form title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-extrabold text-[#153582] mb-4">
              Customize Your Perfect Journey
            </h2>
            <div className="simple-doodle-line inline-block">
              <p className="text-[#576380] text-lg">
                Tell us your preferences, and AI will craft the perfect itinerary for you
              </p>
            </div>
            
            {/* Hand-drawn underline decoration */}
            <div className="flex justify-center mt-4">
              <svg className="w-40 h-3" viewBox="0 0 160 12" fill="none">
                <path d="M5 6 Q40 2 80 6 Q120 10 155 6" stroke="#F48FB1" strokeWidth="2" strokeLinecap="round" opacity="0.4"/>
              </svg>
            </div>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Destination */}
            <div className="nj-card simple-sticker">
              <div className="p-6">
                <h3 className="flex items-center text-[#153582] text-lg font-semibold mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Destination
                </h3>
                <label className="text-[#153582] mb-2 block text-sm">
                  Where would you like to go?
                </label>
                <GooglePlacesAutocomplete
                  apiKey={import.meta.env.VITE_GOOGLE_MAP_PLACE_API_KEY}
                  onLoadFailed={(error) =>
                    console.log("Google Places failed to load", error)
                  }
                  selectProps={{
                    place,
                    onChange: (value) => {
                      setPlace(value);
                      const location = value
                        ? value.label || value.value.description
                        : "";
                      handleInputChange("location", location);
                    },
                    styles: {
                      input: (provided) => ({
                        ...provided,
                        color: "#2e51a4",
                        border: "2px solid #e5e7eb",
                        borderRadius: "8px",
                        padding: "12px 16px",
                        fontSize: "16px",
                      }),
                      placeholder: (provided) => ({
                        ...provided,
                        color: "#989da8",
                      }),
                    },
                  }}
                />
              </div>
            </div>

            {/* Trip Duration */}
            <div className="nj-card simple-sticker">
              <div className="p-6">
                <h3 className="flex items-center text-[#153582] text-lg font-semibold mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Trip Duration
                </h3>
                <div className="space-y-4">
                  <label className="text-[#153582] text-lg font-medium">
                    {formData?.days || 3} days
                  </label>
                  <Slider
                    value={[formData?.days || 3]}
                    onValueChange={(value) => handleInputChange("days", value[0])}
                    min={1}
                    max={14}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>1 day</span>
                    <span>14 days</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Budget Selection */}
          <div className="nj-card simple-sticker mt-6">
            <div className="p-6">
              <h3 className="flex items-center text-[#153582] text-lg font-semibold mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                Budget
              </h3>
              <div className="space-y-4">
                <label className="text-[#153582] text-lg font-medium">
                  ${(formData?.budget || 5000).toLocaleString()}
                </label>
                <Slider
                  value={[formData?.budget || 5000]}
                  onValueChange={(value) => handleInputChange("budget", value[0])}
                  min={500}
                  max={10000}
                  step={100}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>
          </div>

          {/* Travelers Selection */}
          <div className="nj-card simple-sticker mt-6">
            <div className="p-6">
              <h3 className="flex items-center text-[#153582] text-lg font-semibold mb-4">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Travelers
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {SelectTravelList.map((item, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleInputChange("people", item.people)}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      formData?.people == item.people
                        ? 'bg-[#F48FB1] border-[#F48FB1] text-white'
                        : 'bg-white border-[#153582]/20 text-[#153582] hover:border-[#153582]/40'
                    }`}
                  >
                    <div className="text-2xl mb-2">{item.icon}</div>
                    <div className="text-sm font-medium">{item.title}</div>
                    <div className="text-xs opacity-75">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="text-center mt-12">
            <button 
              type="button"
              onClick={OnGenerateTrip}
              className="bg-gradient-to-r from-[#153582] to-[#283593] hover:from-[#283593] hover:to-[#1A237E] text-white font-semibold py-4 px-12 rounded-full text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
              disabled={loading}
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="w-5 h-5 inline mr-2 animate-spin" />
              ) : (
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              )}
              {loading ? "Creating Your Perfect Itinerary..." : "Create My Perfect Itinerary"}
            </button>
            
          </div>
        </div>
      </div>

      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <img src="/logo.png" width={40}></img>
            <DialogTitle className="font-bold text-lg text-center mb-4 text-[#153582]">
              Sign In
            </DialogTitle>
            <DialogDescription>
              <p className="text-center">
                Sign in to the app with Google authentication safely
              </p>

              <div className="flex justify-center mt-4">
                <button
                  className="bg-[#eaf0ff] flex gap-2 hover:bg-[#2d4583] text-[#153582] font-semibold px-6 py-3 rounded-full text-sm  hover:text-white transition duration-200"
                  onClick={login}
                >
                  <FcGoogle className="h-5 w-6" /> Sign In With Google
                </button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* 返回按钮 */}
      <div className="flex justify-center mt-8">
        <Link to={"/"}>
          <button className="px-8 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-full text-lg hover:border-gray-400 hover:bg-gray-50 transition-all duration-300 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CreateTrip;
