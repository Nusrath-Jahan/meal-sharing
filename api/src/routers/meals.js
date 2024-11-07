import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/meals", async (req, res) => {
  try {
    let query = knex("meal").select("*");

    // Filter by maxPrice
    if (req.query.maxPrice) {
      query = query.where("price", "<=", req.query.maxPrice);
    }

    // Filter by availableReservations
    if (req.query.availableReservations) {
      const available = req.query.availableReservations === "true";
      query = query
        .leftJoin("reservations", "meals.id", "reservations.meal_id")
        .groupBy("meals.id")
        .havingRaw(
          available
            ? "meals.max_reservations > COUNT(reservations.id)"
            : "meals.max_reservations <= COUNT(reservations.id)"
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
    res.json(meals);
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

export default router;
