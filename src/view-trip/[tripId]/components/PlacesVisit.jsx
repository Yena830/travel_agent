import React from "react";
import PlacesCardItem from "./PlacesCardItem";

function PlacesVisit({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-10 ">Daily Plan</h2>
      <div>
        {trip?.tripDatas?.itinerary.map((plan, index) => (
          <div key={index} className="">
            <div className="font-semibold text-lg text-[#2b60dd] pt-3">
              Day {plan.day}
            </div>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-5 my-3">
              {plan.plan?.map((place, i) => (
                <div key={i} className="">
                  <PlacesCardItem place={place} />

                  {/* <div>Geo Coordinates: {place.geoCoordinates}</div> */}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PlacesVisit;
