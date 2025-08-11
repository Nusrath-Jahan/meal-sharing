import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Meal.module.css";

const Meal = ({ meal, variant = "default" , showReviewbtn = true, showReservationbtn = true }) => {
  const navigate = useNavigate();

  const imagePath = meal?.title
    ? `/app/public/images/${meal.title.toLowerCase().replace(/ /g, "_")}.jpg`
    : "";

  return (
    <div className={`${styles["meal-card"]} ${styles[`meal-card--${variant}`]}`}>
      {meal?.title && (
        <>
          <img src={imagePath} alt={meal.title} className={styles["meal-image"]} />
          <h3 className={styles["meal-title"]}>{meal.title}</h3>
          <p className={styles["meal-description"]}>{meal.description}</p>
          <p className={styles["meal-price"]}>{`Price: $${meal.price}`}</p>
        </>
      )}
      <div  className={styles["meal-btn"]}>
      {showReservationbtn && meal?.id && (
        <button 
        className={styles["res-btn"]}
          onClick={() => navigate(`/reservation/${meal.id}`)}
        >
          Add a Reservation
        </button>
      )}
      {showReviewbtn && meal?.id && (
        <button
        className={styles["res-btn"]}
          onClick={() => navigate(`/review/${meal.id}`)}
        >
          Leave a Review
        </button>
        
      )}
        
        <p><strong>Available Spots:</strong> {meal.available_spots}</p>
        
      </div>
    </div>
  );
};

export default Meal;
