import React from "react";
import { Link } from "react-router-dom";

function PlacesCardItem({ place }) {
  return (
    <div>
      <div className="font-semibold text-sm mb-2">🕧{place.bestTime}</div>
      <Link
        to={
          "https://www.google.com/maps/search/?api=1&query=" + place.placeName
        }
        target="_blank"
      >
        <div className="bg-[#c0cdea92] rounded-xl p-4 hover:scale-105 transition duration-150">
          <div className="grid grid-cols-5">
            <img
              src="/cat.jpg"
              alt={place.placeName}
              className="rounded-2xl w-[120px] col-span-2 ml-2"
            />
            <div className="col-span-3 m-1 text-[#435a8c]">
              <p className="text-sm ">💰{place.ticketPricing}</p>
              <p className="text-sm ">⭐️{place.rating}</p>
            </div>
          </div>
          <div className="mt-3 ml-2 text-[#243352]">
            <h2 className="font-bold text-base">{place.placeName}</h2>
            <p className="text-sm">{place.placeDetails}</p>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default PlacesCardItem;
