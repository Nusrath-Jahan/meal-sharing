import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Reservation.module.css";
import Meal from "./Meal";

const Reservation = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [reservation, setReservation] = useState({
    name: "",
    email: "",
    phonenumber: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/meals/${id}`
          
        );
        if (!response.ok) throw new Error("Failed to fetch meal details");
        const data = await response.json();
        setMeal(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchMeal();
  }, [id]);

  const handleChange = (e) => {
    setReservation({
      ...reservation,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/reservations/`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contact_name: reservation.contact_name,
          contact_email: reservation.contact_email,
          contact_phonenumber: reservation.contact_phonenumber,
          meal_id: id,
        }),
      });
      if (!response.ok) throw new Error("Failed to make reservation");
      alert("Reservation successful!");
      setReservation({ name: "", email: "", phonenumber: "" });
    } catch (error) {
      setError("Failed to create reservation. Please try again.");
    }
  };

  if (error) return <p>{error}</p>;
  if (!meal) return <p>Loading meal details...</p>;

  return (
    <div className={styles.mealDetail}>
      <h2>{meal.title}</h2>
      {/* <p>{meal.description}</p>
      <p>{meal.price}</p> */}

      <div>
        <h3 className={styles["reservation-text"]}>Make a Reservation</h3>
        <form onSubmit={handleSubmit} className={styles.reservationForm}>
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={reservation.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={reservation.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone Number:
            <input
              type="tel"
              name="phonenumber"
              value={reservation.phonenumber}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Reserve</button>
        </form>
      </div>
    </div>
  );
};

export default Reservation;
