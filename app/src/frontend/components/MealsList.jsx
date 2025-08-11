import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]); // State to store fetched meals
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages
  const [searchTerm, setSearchTerm] = useState(""); // State for search input
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); // State for debounced search term

  // State for sorting
  const [sortField, setSortField] = useState("title"); // Default sorting field
  const [sortDirection, setSortDirection] = useState("asc"); // Default sorting direction

  // Debouncing search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // Wait for 500ms after the user stops typing

    // Cleanup the timeout when the user types again
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch meals based on the debounced search term, sort field, and sort direction
  const fetchMeals = async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      // Construct the API endpoint with sorting and search parameters
      // let url = "http://localhost:3001/api/meals/meals";
      let url = "https://meal-sharing-8vsd.onrender.com/api/meals/meals";
      let queryParams = [];

      // If searchQuery exists, add it to the query params
      if (searchQuery) {
        queryParams.push(`title=${searchQuery}`);
      }

      // Add sorting parameters
      queryParams.push(`sortKey=${sortField}`, `sortDir=${sortDirection}`);

      // Append query parameters to the URL
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url); // Fetch meals with the query params
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMeals(data.meals); // Update meals state with fetched data
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  // Initial fetch on component mount (without search term)
  useEffect(() => {
    fetchMeals(); // Fetch all meals on component load
  }, []);

  // Fetch meals when the debounced search term changes
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      fetchMeals(debouncedSearchTerm); // Fetch meals based on the debounced search term
    } else {
      fetchMeals(); // Fetch all meals if no search term
    }
  }, [debouncedSearchTerm, sortField, sortDirection]); // Re-fetch meals if sortField or sortDirection changes

  // Handle form submission to search for meals
  const handleSearch = (e) => {
    e.preventDefault(); // Prevent page reload on form submission
  };

  if (loading) {
    return <p>Loading meals...</p>; // Show loading indicator while fetching
  }

  if (error) {
    return <p>{error}</p>; // Show error message if fetching fails
  }

  return (
    <>
      {/* <h2 className={styles["meals"]}>Meals</h2> */}
{/* Search Form and Sorting Controls on the Same Line */}
<div className={styles["controls-container"]}>
    <form onSubmit={handleSearch}>
      <input
        type="text"
        placeholder="Search meals by title"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>

    {/* Sorting Controls */}
    <div className={styles["sorting-controls"]}>
      <label htmlFor="sortField">Sort by:</label>
      <select
        id="sortField"
        value={sortField}
        onChange={(e) => setSortField(e.target.value)}
      >
        <option value="title">Title</option>
        <option value="price">Price</option>
      </select>

      <label htmlFor="sortDirection">Direction:</label>
      <select
        id="sortDirection"
        value={sortDirection}
        onChange={(e) => setSortDirection(e.target.value)}
      >
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  </div>

      {/* Meal List */}
      <div className={styles["meal-container"]}>
        <div className={styles["meals-grid"]}>
          {meals.length > 0 ? (
            meals.map((meal, id) => (
              <Meal key={id} meal={meal} variant="all-meals" />
            ))
          ) : (
            <p>No meals found</p>
          )}
        </div>
      </div>
    </>
  );
}

export default MealsList;
