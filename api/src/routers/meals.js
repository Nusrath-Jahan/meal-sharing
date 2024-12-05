import express from "express";
import knex from "../database_client.js";
const router = express.Router();

router.get("/meals", async (req, res) => {
  try {
    let query = knex("meal")
      .select(
        "meal.id",
        "meal.title",
        "meal.max_reservations",
        "meal.reserved_spots"
      )
      .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
      .sum("reservation.number_of_guests as sum_of_guests")
      .groupBy("meal.id", "meal.title", "meal.max_reservations");

    // Filter by maxPrice
    if (req.query.maxPrice) {
      query = query.where("price", "<=", req.query.maxPrice);
    }

    // Filter by availableReservations
    if (req.query.availableReservations) {
      query = query.having(
        knex.raw("sum_of_guests < ??", ["meal.max_reservations"])
      );
    }

    // Filter by title
    if (req.query.title) {
      query = query.where("title", "like", `%${req.query.title}%`);
    }

    // Filter by dateAfter
    if (req.query.dateAfter) {
      query = query.where("when", ">", req.query.dateAfter);
    }

    // Filter by dateBefore
    if (req.query.dateBefore) {
      query = query.where("when", "<", req.query.dateBefore);
    }

    // Limit the number of results
    if (req.query.limit) {
      query = query.limit(req.query.limit);
    }

    // Sorting logic
    if (req.query.sortKey) {
      const sortDir = req.query.sortDir || "asc"; // Default sorting direction is ascending
      query = query.orderBy(req.query.sortKey, sortDir);
    }

    const meals = await query;
    // Calculate available spots for each meal
    meals.forEach((meal) => {
      meal.available_spots = meal.max_reservations - meal.sum_of_guests;
    });

    // Calculate total available spots for all meals
    const totalAvailableSpots = meals.reduce(
      (total, meal) => total + meal.available_spots,
      0
    );
    res.json({
      meals,
      totalAvailableSpots,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals - Returns all meals
router.get("/", async (req, res) => {
  try {
    const meals = await knex.select("*").from("meal");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:id - Returns a meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meal").where({ id: req.params.id }).first();
    if (meal) {
      res.json(meal);
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/meals - Adds a new meal to the database
router.post("/", async (req, res) => {
  try {
    const [newMeal] = await knex("meal").insert(req.body).returning("*");
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/meals/:id - Updates the meal by ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedMeal] = await knex("meal")
      .where({ id: req.params.id })
      .update(req.body)
      .returning("*");

    if (updatedMeal) {
      res.json(updatedMeal);
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/meals/:id - Deletes the meal by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await knex("meal").where({ id: req.params.id }).del();
    if (deleted) {
      res.json({ message: "Meal deleted" });
    } else {
      res.status(404).json({ message: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals
router.get("/", async (req, res) => {
  try {
    const { title } = req.query;

    // Base query to select all meals
    let query = knex("meals").select("*");

    // If title query is provided, filter the meals based on the title
    if (title) {
      query = query.where("title", "like", `%${title}%`);
    }

    const meals = await query;
    res.json(meals);
  } catch (error) {
    console.error("Error fetching meals:", error);
    res.status(500).json({ error: "Failed to fetch meals" });
  }
});

// GET /api/meals/:id - Returns a meal by ID with available spots
router.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meal")
      .select("meal.id", "meal.title", "meal.max_reservations")
      .where("meal.id", req.params.id)
      .leftJoin("reservation", "meal.id", "=", "reservation.meal_id")
      .sum("reservation.number_of_guests as sum_of_guests")
      .groupBy("meal.id", "meal.title", "meal.max_reservations")
      .first();

    if (meal) {
      // Calculate available spots
      meal.available_spots = meal.max_reservations - meal.sum_of_guests;
      res.json(meal);
    } else {
      res.status(404).json({ error: "Meal not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
