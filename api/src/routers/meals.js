import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// GET /api/meals - Returns all meals
router.get("/", async (req, res) => {
  try {
    const meals = await knex.select("*").from("meals");
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/meals/:id - Returns a meal by ID
router.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meals").where({ id: req.params.id }).first();
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
    const [newMeal] = await knex("meals").insert(req.body).returning("*");
    res.status(201).json(newMeal);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/meals/:id - Updates the meal by ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedMeal] = await knex("meals")
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
    const deleted = await knex("meals").where({ id: req.params.id }).del();
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
