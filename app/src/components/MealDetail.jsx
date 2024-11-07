import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const MealDetail = () => {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    // Fetch meal details by ID
    fetch(`http://localhost:3001/api/meals/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setMeal(data);
        setIsAvailable(data.availableReservations > 0);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isAvailable) {
      alert("No reservations available for this meal");
      return;
    }

    // Submit reservation
    fetch("http://localhost:3001/api/reservations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mealId: id,
        ...formData,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Reservation successful!");
        } else {
          alert("Failed to make a reservation.");
        }
      });
  };

  return (
    <div>
      {meal ? (
        <div>
          <h1>{meal.title}</h1>
          <p>{meal.description}</p>
          <p>Price: ${meal.price}</p>

          {isAvailable && (
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="tel"
                name="phone"
                placeholder="Your Phone Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <button type="submit">Book a Seat</button>
            </form>
          )}
        </div>
      ) : (
        <p>Loading meal details...</p>
      )}
    </div>
  );
};

export default MealDetail;
