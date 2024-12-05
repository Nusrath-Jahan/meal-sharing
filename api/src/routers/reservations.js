import express from "express";
import knex from "../database_client.js";

const router = express.Router();

// GET /api/reservations - Returns all reservations
router.get("/", async (req, res) => {
  try {
    const reservations = await knex.select("*").from("reservation");
    res.json(reservations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/reservations/:id - Returns a reservation by ID
router.get("/:id", async (req, res) => {
  try {
    const reservation = await knex("reservation")
      .where({ id: req.params.id })
      .first();
    if (reservation) {
      res.json(reservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/reservations - Adds a new reservation to the database
router.post("/", async (req, res, next) => {
  try {
    const [newReservation] = await knex("reservation")
      .insert(req.body)
      .returning("*");
    res.status(201).json(newReservation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/reservations/:id - Updates the reservation by ID
router.put("/:id", async (req, res) => {
  try {
    const [updatedReservation] = await knex("reservation")
      .where({ id: req.params.id })
      .update(req.body)
      .returning("*");
    if (updatedReservation) {
      res.json(updatedReservation);
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/reservations/:id - Deletes the reservation by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await knex("reservation")
      .where({ id: req.params.id })
      .del();
    if (deleted) {
      res.json({ message: "Reservation deleted" });
    } else {
      res.status(404).json({ message: "Reservation not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
