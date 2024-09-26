import "dotenv/config";
import express from "express";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";


const currentDateTime = () => new Date().toISOString();

const app = express();

const apiRouter = express.Router();

// Route 1: /future-meals
app.get("/future-meals", async (req, res) => {
  try {
    const futureMeals = await knex.raw("SELECT * FROM Meal WHERE `when` > ?", [
      currentDateTime(),
    ]);
    res.json(futureMeals[0]); // Return the rows
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route 2: /past-meals
app.get("/past-meals", async (req, res) => {
  try {
    const pastMeals = await knex.raw("SELECT * FROM Meal WHERE `when` < ?", [
      currentDateTime(),
    ]);
    res.json(pastMeals[0]); // Return the rows
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route 3: /all-meals
app.get("/all-meals", async (req, res) => {
  try {
    const allMeals = await knex.raw("SELECT * FROM Meal ORDER BY id ASC");
    res.json(allMeals[0]); // Return the rows
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route 4: /first-meal
app.get("/first-meal", async (req, res) => {
  try {
    const firstMeal = await knex.raw(
      "SELECT * FROM Meal ORDER BY id ASC LIMIT 1"
    );
    if (firstMeal[0].length === 0) {
      res.status(404).json({ message: "No meals found" });
    } else {
      res.json(firstMeal[0][0]); // Return the first row
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// Route 5: /last-meal
app.get("/last-meal", async (req, res) => {
  try {
    const lastMeal = await knex.raw(
      "SELECT * FROM Meal ORDER BY id DESC LIMIT 1"
    );
    if (lastMeal[0].length === 0) {
      res.status(404).json({ message: "No meals found" });
    } else {
      res.json(lastMeal[0][0]); // Return the last row
    }
  } catch (error) {
    res.status(500).json({ error: "An error occurred" });
  }
});

// This nested router example can also be replaced with your own sub-router
apiRouter.use("/nested", nestedRouter);

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});
