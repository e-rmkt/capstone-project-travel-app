import TripForm from "@/components/TripForm";
import { useRouter } from "next/router";
import useSWR from "swr";
import { useState } from "react";

export default function TripFormPage() {
  const { mutate } = useSWR("/api/trips");
  const router = useRouter();

  const [endDateDisabled, setEndDateDisabled] = useState(true);
  const [endDate, setEndDate] = useState("");

  function handleDisabled(event) {
    setEndDateDisabled(!event.target.value);
  }

  function handleEndDate(event) {
    const endDate = event.target.value;
    const startDate = document.getElementsByName("startDate");
    if (endDate < startDate) {
      alert("The end date has to be bigger or equal to the start date") &&
        setEndDate(endDate === "");
    } else {
      return;
    }
  }

  async function handleAddTrip(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const tripData = Object.fromEntries(formData);

    const repTripDataCountry = tripData.country.replace(" ", "");
    const repTripDataCity = tripData.city.replace(" ", "-");

    const newTrip = {
      title: tripData.title,
      location: [{ country: tripData.country, city: tripData.city }],
      timePeriod: [
        { startDate: tripData.startDate, endDate: tripData.endDate },
      ],
      img: `${repTripDataCity}`
        ? `https://source.unsplash.com/random/?${repTripDataCountry}-${repTripDataCity}`
        : `https://source.unsplash.com/random/?${repTripDataCountry}`,
    };

    const response = await fetch("/api/trips", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTrip),
    });

    if (!response.ok) {
      console.error(response.status);
      return;
    }

    mutate();
    router.push("/");
  }

  return (
    <main>
      <h1>New Trip</h1>
      <TripForm handleAddTrip={handleAddTrip} />
    </main>
  );
}
