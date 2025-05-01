import React from "react";
import "@fontsource/black-ops-one";
import { useGoogleLogin } from "@react-oauth/google";



function Header() {
    const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
        console.log('Login success!', tokenResponse);
        localStorage.setItem('user', JSON.stringify(tokenResponse));
    },
    onError: (error) => {
        console.error('Login failed:', error);
    },
});
  return (
    <div className="p-3 shadow-sm flex justify-between items-center">
      <div className="flex items-center">
        <img
          src="/logo.png"
          width="40"
          md:width="60"
          lg:width="65"
          xl:width="70"
        ></img>
        <h2
          className="text-2xl md:text-4xl xl:text-5xl m-2"
          style={{
            fontFamily: "'Black Ops One', sans-serif",
            background: "linear-gradient(to bottom, #f8f8ff,#455d94,#002d96)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            WebkitTextStroke: "1.5px #002d96",
          }}
        >
          SMART TRIP
        </h2>
      </div>

        <div>
          {/*  <button*/}
          {/*      className="bg-gradient-to-b from-[#989da8] via-[#455c94] to-[#002d96] text-[#f2f2ff] font-bold px-0 py-0 rounded-full mr-1 text-sm md:text-base"*/}
          {/*      onClick={() => login()}*/}
          {/*  >*/}
          {/*<span*/}
          {/*    className="block bg-[#ffffff00] hover:bg-[#2d4583] rounded-full px-4 py-2 xl:px-7 xl:py-4 hover:scale-105 transition duration-100">*/}
          {/*  Sign in*/}
          {/*</span>*/}
          {/*  </button>*/}
        </div>
    </div>
  );
}

export default Header;
