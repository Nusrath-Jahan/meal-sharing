import React, { useEffect, useState } from "react";
import Meal from "./Meal";
import styles from "./MealsList.module.css";

function MealsList() {
  const [meals, setMeals] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(""); 

  // State for sorting
  const [sortField, setSortField] = useState("title"); 
  const [sortDirection, setSortDirection] = useState("asc"); 

  // Debouncing search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); 

    // Cleanup the timeout when the user types again
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Fetch meals based on the debounced search term, sort field, and sort direction
  const fetchMeals = async (searchQuery = "") => {
    setLoading(true);
    setError(null);

    try {
      // Construct the API endpoint with sorting and search parameters
      let url = "http://localhost:3001/api/meals/meals";
      let queryParams = [];

     
      if (searchQuery) {
        queryParams.push(`title=${searchQuery}`);
      }

      // Add sorting parameters
      queryParams.push(`sortKey=${sortField}`, `sortDir=${sortDirection}`);

      // Append query parameters to the URL
      if (queryParams.length > 0) {
        url += `?${queryParams.join("&")}`;
      }

      const response = await fetch(url); 
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      setMeals(data.meals); 
    } catch (error) {
      console.error("Failed to fetch meals:", error);
      setError("Failed to load meals. Please try again later.");
    } finally {
      setLoading(false); 
    }
  };

  
  useEffect(() => {
    fetchMeals(); 
  }, []);

  
  useEffect(() => {
    if (debouncedSearchTerm !== "") {
      fetchMeals(debouncedSearchTerm); 
    } else {
      fetchMeals(); 
    }
  }, [debouncedSearchTerm, sortField, sortDirection]);

  
  const handleSearch = (e) => {
    e.preventDefault(); 
  };

  if (loading) {
    return <p>Loading meals...</p>; 
  }

  if (error) {
    return <p>{error}</p>; 
  }

  return (
    <>
     
{/* Search Form  */}
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
