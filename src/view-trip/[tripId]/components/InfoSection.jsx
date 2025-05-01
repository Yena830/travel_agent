import React from "react";
import { FaShareSquare } from "react-icons/fa";

function InfoSection({ trip }) {
  return (
    <div>
      <div>
        <img
          src="/japan.jpg"
          className="h-[180px] md:h-[200px] lg:h-[200px] xl:h-[300px] w-full object-cover rounded-2xl"
        ></img>
        <div className="my-5 flex flex-col gap-3">
          <div className="flex justify-between">
            <h2 className="font-bold text-2xl text-[#153582]">
              {trip?.userPreference?.location}
            </h2>
            <button className="bg-[#274c9b] px-4 shadow-md rounded-full hover:bg-[#7082ac] hover:scale-105">
              <FaShareSquare className="text-white" />
            </button>
          </div>
          <div className="flex gap-3 text-xs font-medium text-[#40517b]">
            <h2 className="p-1 px-3 bg-[#dce7ff] rounded-xl">
              {trip?.userPreference?.days} Days
            </h2>
            <h2 className="p-1 px-3 bg-[#dce7ff] rounded-xl">
              {trip?.userPreference?.budget}{" "}
            </h2>
            <h2 className="p-1 px-3 bg-[#dce7ff] rounded-xl">
              {trip?.userPreference?.people}{" "}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
