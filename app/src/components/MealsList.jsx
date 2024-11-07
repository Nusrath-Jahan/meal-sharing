import React, { useState, useEffect } from "react";
import Meal from "./Meal";
import "./MealsList.css";
const MealsList = () => {
  // State to store the meals
  const [meals, setMeals] = useState([]);

  // Fetching the meals from the API
  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/meals");
        const data = await response.json();
        setMeals(data);
      } catch (error) {
        console.error("Error fetching meals:", error);
      }
    };

    fetchMeals();
  }, []);

  return (
    <div>
      <h2>Available Meals</h2>
      <div className="meals-grid">
        {meals.length > 0 ? (
          meals.map((meal) => <Meal key={meal.id} meal={meal} />)
        ) : (
          <p>No meals available</p>
        )}
      </div>
    </div>
  );
};

export default MealsList;
