import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <div className="my-6 mx-4">
      <div className="p-3 lg:py-6 xl:py-8">
        <h1 className="font-extrabold text-[30px] xl:text-[60px] text-center text-[#153582] mt-4">
          Discover Your Next Adventure with AI:
        </h1>
        <h1
          className="font-extrabold text-[30px] xl:text-[60px] text-center text-[#ededfd] mt-4 xl:mt-8 "
          style={{
            WebkitTextStroke: "1.1px #153582",
          }}
        >
          Personalized at Your Fingertips
        </h1>
      </div>
      <div className="pt-3 pb-6 px-3">
        <p className="text-sm md:text-lg lg:text-xl xl:text-xl text-center text-[#576380]">
          Your personal trip planner and travel curator, creating custom
          itineraries tailored to your interests and budget.
        </p>
      </div>
      <div className="flex justify-center xl:pt-10">
        <Link to={"/create-trip"}>
          <button className="bg-gradient-to-b from-[#989da8] via-[#455c94] to-[#002d96] text-[#f2f2ff] font-semibold px-0 py-0 rounded-full text-sm xl:text-xl md:text-base">
            <span className="block bg-[#ffffff00] hover:bg-[#2d4583] rounded-full px-10 py-4 xl:px-20 xl:py-4 hover:scale-105 transition duration-100">
              All Free! Get Started!
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
