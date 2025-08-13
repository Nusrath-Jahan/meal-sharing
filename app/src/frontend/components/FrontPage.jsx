import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Meal from "./Meal"; 
import styles from "./FrontPage.module.css";

function HomePage() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigateAllMeal = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/all-meals`);
        if (!res.ok) {
          throw new Error(`HTTP status error: ${res.status}`);
        }
        const data = await res.json();
        setMeals(data.slice(0, 3)); 
      } catch (err) {
        console.error("Failed to fetch all meals from backend:", err);
        setError("Failed to load meals from the backend.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className={styles["frontPage-container"]}>
      <header className={styles["header"]}>
      </header>

      <main className={styles["main-content"]}>
        <h1 className={styles["title"]}>Meal Sharing</h1>
        

        <div className={styles["mealsPreview"]}>
         
          <div className={styles["mealsGrid"]}>
            {meals.map((meal, index) => (
              <Meal key={index} meal={meal} showReviewButton={false}  variant="home" />
            ))}
          </div>
          <button
            className={styles["allMeal-btn"]}
            onClick={() => navigateAllMeal("/all-meals")}
          >
            See more food
          </button>
        </div>
      </main>
    </div>
  );
}

export default HomePage;