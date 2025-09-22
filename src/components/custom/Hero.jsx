import React from "react";
import { Link } from "react-router-dom";
import { SparklesText } from "@/components/ui/sparkles-text";

function Hero() {
  return (
    <section className="relative min-h-[calc(100vh-200px)] bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 overflow-hidden pt-16">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated floating elements */}
        <div className="nj-doodle-star top-20 left-16 text-2xl">⭐</div>
        <div className="nj-doodle-star top-32 right-24 text-lg delay-1000">✨</div>
        <div className="nj-doodle-star bottom-40 left-1/4 text-xl delay-2000">💫</div>
        <div className="simple-doodle bottom-32 right-1/4 text-2xl simple-float">🌙</div>
        
        {/* Hand-drawn SVG decorations */}
        
        
        <svg className="absolute bottom-1/3 left-20 w-16 h-16 text-[#F48FB1] opacity-25" viewBox="0 0 100 100" fill="none">
          <path d="M10 50 L25 35 L40 50 L55 35 L70 50 L85 35" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
          <circle cx="20" cy="25" r="2" fill="currentColor"/>
          <circle cx="50" cy="25" r="2" fill="currentColor"/>
          <circle cx="80" cy="25" r="2" fill="currentColor"/>
        </svg>
        
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-blue-50/30"></div>
      </div>

      <div className="relative container mx-auto px-6 h-screen">
        <div className="flex flex-col items-center justify-center h-full text-center">
          
          {/* Main Hero Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Badge/Tag */}
            <div className="inline-flex items-center">
              {/* <div className="doodle-tag bg-gradient-to-r from-blue-50 to-pink-50 border-[#153582] text-[#153582]">
                ✨ AI-Powered Travel Planning
              </div> */}
            </div>
            
            {/* Hero Title */}
            <div className="space-y-4 flex flex-col items-center justify-center pt-2 mt-0">
              <h1 className="nj-hero-title text-4xl md:text-6xl lg:text-7xl text-center">
                Discover Your Next
                <br />
                <SparklesText 
                  text="Adventure" 
                  className="nj-hero-accent text-4xl md:text-6xl lg:text-7xl"
                  colors={{ first: "#153582", second: "#F48FB1" }}
                  sparklesCount={8}
                />
              </h1>
            </div>
            
            {/* Subtitle */}
            <p className="nj-hero-subtitle text-lg md:text-xl lg:text-2xl max-w-2xl mx-auto">
              Your personal AI travel curator, creating custom itineraries 
              <br className="hidden md:block" />
              <span className="doodle-highlight">tailored to your dreams and budget</span>
            </p>
            
            {/* CTA Button */}
            <div className="pt-8 relative">
              <Link to={"/create-trip"}>
                <button className="nj-modern-button px-8 py-4 md:px-12 md:py-5 text-lg md:text-xl">
                  <span className="relative z-10 flex items-center">
                    ✨ Start Your Journey - It's Free!
                  </span>
                </button>
              </Link>
              
              {/* Cat Image - positioned in bottom right */}
              <div className="absolute -bottom-4 -right-4 sm:-bottom-4 sm:-right-0 md:-bottom-6 md:-right-6 lg:-bottom-10 lg:-right-8">
                <img 
                  src="/cat.png" 
                  alt="Cute cat" 
                  className="w-16 h-16 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain opacity-95"
                />
              </div>
            </div>
            
            {/* Feature Cards
            <div className="grid md:grid-cols-3 gap-6 pt-16 max-w-3xl mx-auto">
              <div className="nj-feature-card text-center">
                <div className="nj-feature-icon">🤖</div>
                <h3 className="font-semibold text-[#153582] mb-2">Smart AI</h3>
                <p className="text-sm text-[#576380]">Advanced algorithms create perfect itineraries</p>
              </div>
              
              <div className="nj-feature-card text-center">
                <div className="nj-feature-icon pink-accent">❤️</div>
                <h3 className="font-semibold text-[#153582] mb-2">Personalized</h3>
                <p className="text-sm text-[#576380]">Every trip crafted just for you</p>
              </div>
              
              <div className="nj-feature-card text-center">
                <div className="nj-feature-icon">⚡</div>
                <h3 className="font-semibold text-[#153582] mb-2">Instant</h3>
                <p className="text-sm text-[#576380]">Get your perfect plan in seconds</p>
              </div>
            </div>
             */}
            {/* Trust indicators */}
            <div className="pt-12 flex flex-wrap justify-center items-center gap-8 text-[#576380] text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>No Sign-up Required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                <span>Instant Results</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
