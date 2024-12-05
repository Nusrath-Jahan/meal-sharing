import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// GET /api/reviews/ - all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await knex("review").select("*");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get /api/reviews/ -reviews for a specific meal
router.get("/meals/:meal_id/reviews", async (req, res) => {
  try {
    const { meal_id } = req.params;
    const reviews = await knex("review").where("meal_id", meal_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// /api/reviews/ Add a new review
router.post("/", async (req, res) => {
  try {
    const newReview = req.body;
    const [id] = await knex("review").insert(newReview);
    res.status(201).json({ id, ...newReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific review by ID
router.get("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const review = await knex("review").where({ id }).first();
    res.json(review);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a review by ID
router.put("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = req.body;
    await knex("review").where({ id }).update(updatedReview);
    res.json({ id, ...updatedReview });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a review by ID
router.delete("/reviews/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await knex("review").where({ id }).del();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
