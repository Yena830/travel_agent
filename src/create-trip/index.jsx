import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  SelectBudgetOptions,
  SelectTravelList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModel";
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
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleInputChange = (name, value) => {
    if (name == "days" && value > 10) {
      toast("Please enter days within 10");
      return;
    } else if (name == "days" && value < 0) {
      toast("Please enter days more than 0");
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
      ((formData?.days > 10 || formData?.days < 0) && !formData?.location) ||
      !formData?.budget ||
      !formData?.people
    ) {
      toast("Please fill all details");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT.replace("{location}", formData?.location)
      .replace("{days}", formData?.days)
      .replace("{people}", formData?.people)
      .replace("{budget}", formData?.budget);
    console.log(FINAL_PROMPT);
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    console.log("--", result?.response?.text());
    setLoading(false);
    SaveAITrip(result?.response?.text());
  };

  const SaveAITrip = async (tripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));
    const docId = Date.now().toString();
    await setDoc(doc(db, "AITrips", docId), {
      userPreference: formData,
      tripDatas: JSON.parse(tripData),
      userEmail: user?.email,
      id: docId,
    });
    setLoading(false);
    navigate("/view-trip/" + docId);
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
    <div className="sm:px-10 md:px-28 lg:px-40 xl:px-80 px-4 mt-10">
      <div className="">
        <h2 className="font-bold text-2xl md:text-3xl lg:text-3xl xl:text-4xl text-center text-[#153582]">
          Tell me about your traval preferences✈️
        </h2>
        <p className="mt-5 text-[#3b5496] text-center">
          Just provide some basic information, and our trip planner assistant
          will give you a customized plan!
        </p>
      </div>
      <div className="mt-20 mb-10 px-3">
        <h2 className="text-lg xl:text-xl my-2 font-medium text-[#153582]">
          What is your favor destination?
        </h2>
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
              }),
              placeholder: (provided) => ({
                ...provided,
                color: "#989da8",
              }),
            },
          }}
        />
      </div>

      <div className="mt-10 mb-10 px-3">
        <h2 className="text-lg xl:text-xl my-2 font-medium text-[#153582]">
          How many days are you planning your trip?
        </h2>
        <Input
          placeholder="Ex.3"
          type="number"
          className="placeholder-[#989da8] "
          onChange={(day) => handleInputChange("days", day.target.value)}
        />
      </div>

      <div className="mb-10 px-3">
        <h2 className="text-lg xl:text-xl my-2 font-medium text-[#153582]">
          What is your budget?
        </h2>
        <div className="grid grid-cols-3 gap-6 mt-5">
          {SelectBudgetOptions.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("budget", item.budget)}
              className={`p-4 border rounded-2xl  hover:shadow-lg hover:scale-105 hover:rotate-3 hover:bg-[#dfe8ff] text-base text-center bg-white transition duration-300
                ${
                  formData?.budget == item.budget &&
                  "border-[#153582] border-2 bg-[#f1f4ff]"
                }`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl">
                {item.icon}
              </h2>
              <h2 className="mt-2 font-bold text-[#153582]">{item.title}</h2>
              <h2 className="mt-1 text-[13px] text-[#a0a9c2]">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-10 px-3">
        <h2 className="text-lg xl:text-xl my-2 font-medium text-[#153582]">
          Who will be joining you on the next trip?
        </h2>
        <div className="grid grid-cols-3 gap-6 mt-5">
          {SelectTravelList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleInputChange("people", item.people)}
              className={`p-4 border rounded-2xl  hover:shadow-lg hover:scale-105 hover:rotate-3 hover:bg-[#dfe8ff] transition duration-300 text-base text-center bg-white
                ${
                  formData?.people == item.people &&
                  "border-[#153582] border-2 bg-[#f1f4ff]"
                }`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-3xl xl:text-3xl">
                {item.icon}
              </h2>
              <h2 className="mt-2 font-bold text-[#153582]">{item.title}</h2>
              <h2 className="mt-1 text-[13px] text-[#a0a9c2]">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-10 xl:pt-10">
        <button
          className="bg-gradient-to-b from-[#989da8] via-[#455c94] to-[#002d96] text-[#f2f2ff] font-semibold px-0 py-0 rounded-full text-sm xl:text-xl md:text-base hover:scale-105"
          onClick={OnGenerateTrip}
          disabled={loading}
        >
          <span className="block bg-[#ffffff00] hover:bg-[#2d4583] rounded-full px-10 py-4 xl:px-20 xl:py-4 hover:scale-105 transition duration-100">
            {loading ? (
              <AiOutlineLoading3Quarters className="h-5 w-6 animate-spin" />
            ) : (
              "Generate Your Trip!"
            )}
          </span>
        </button>
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

      <div className="flex justify-center mt-10 xl:pt-10">
        <Link to={"/"}>
          <button className="bg-gradient-to-b from-[#989da8] via-[#455c94] to-[#002d96] text-[#f2f2ff] font-semibold px-0 py-0 rounded-full text-sm xl:text-xl md:text-base">
            <span className="block bg-[#ffffff00] hover:bg-[#2d4583] rounded-full px-10 py-4 xl:px-20 xl:py-4 ">
              Back
            </span>
          </button>
        </Link>
      </div>
    </div>
  );
}

export default CreateTrip;
