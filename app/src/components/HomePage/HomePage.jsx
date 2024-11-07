"use client";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MealsList from "../MealsList";
import './HomePage.css';
const Home = () => {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    // Fetch meals from the API
    fetch("http://localhost:3001/api/meals")
      .then((response) => response.json())
      .then((data) => setMeals(data));
  }, []);

  return (
    <div>
      <h1>Welcome to Meal Sharing</h1>
      <h2>Enjoy delicious meals with your loved ones</h2>
      <MealsList meals={meals.slice(0, 3)} />
      <Link to="/meals">
        <button>See More Meals</button>
      </Link>
    </div>
  );
};

export default Home;
