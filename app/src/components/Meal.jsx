import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Meals = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    // Fetch all meals from the API
    fetch("http://localhost:3001/api/meals")
      .then((response) => {
        // Check if response is successful
        if (!response.ok) {
          throw new Error("Failed to fetch meals");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Meals data:", data); // Log the fetched data
        setMeals(data);
      })
      .catch((error) => {
        console.error("Error fetching meals:", error); // Log any errors
      });
  }, []);

  return (
    <div>
      <h1>All Meals</h1>
      <ul>
        {meals.map((meal) => (
          <li key={meal.id}>
            <Link to={`/meals/${meal.id}`}>{meal.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Meals;
