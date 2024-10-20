import React from "react";
import { Link } from "react-router-dom";

function Hotels({ trip }) {
  return (
    <div>
      <h2 className="font-bold text-xl mt-10 mb-4">Hotel Recommendation</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-5 ">
        {trip?.tripDatas?.hotelOptions?.map((hotel, index) => (
          <Link
            to={
              "https://www.google.com/maps/search/?api=1&query=" +
              hotel.hotelName +
              hotel.hotelAddress
            }
            target="_blank"
          >
            <div className="hover:scale-105 transition duration-150 cursor-pointer">
              <img
                src="/catTraveler.jpg"
                className="rounded-2xl border-2 border-[#859fdb6d]"
              ></img>
              <div>
                <h3 className="font-semibold text-center text-[#153582] mt-2">
                  {hotel.hotelName}
                </h3>

                <div className="mx-2 mt-3">
                  <p className="text-xs text-[#7082ac]">
                    <span className="text-sm">📍</span>
                    {hotel.hotelAddress}
                  </p>
                  <p className="text-sm font-medium text-[#495a83]">
                    💰{hotel.price}
                  </p>
                  <p className="text-sm text-[#495a83]]">⭐️{hotel.rating}</p>
                  {/* <p className="text-sm text-[#7082ac]">
                      Geo: {hotel.geoCoordinates}
                    </p> */}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
