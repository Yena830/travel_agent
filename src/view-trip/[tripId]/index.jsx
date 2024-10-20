import { db } from "@/service/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import InfoSection from "./components/InfoSection";
import { doc, getDoc } from "firebase/firestore";
import Hotels from "./components/Hotels";

function ViewTrip() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState([]);
  useEffect(() => {
    tripId && GetTripData();
  }, [tripId]);
  const GetTripData = async () => {
    const docRef = doc(db, "AITrips", tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document:", docSnap.data());
      setTrip(docSnap.data());
    } else {
      console.log("No such Document");
      toast("No trip found!");
    }
  };
  return (
    <div className="sm:px-10 md:px-28 lg:px-44 xl:px-56 px-6 mt-10">
      {/*Information Section*/}
      <InfoSection trip={trip} />

      {/*Recommended Hotels*/}
      <Hotels trip={trip} />

      {/*Daily Plan*/}
      {/*Footer*/}
    </div>
  );
}

export default ViewTrip;
