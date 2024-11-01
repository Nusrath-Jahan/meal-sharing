import React from "react";
import "./Meal.css";

const Meal = ({ meal }) => {
  return (
    <div className="meal-card">
      <h3>{meal.title}</h3>
      <p>{meal.description}</p>
      <p className="meal-price">{meal.price} DKK</p>
    </div>
  );
};

export default Meal;
