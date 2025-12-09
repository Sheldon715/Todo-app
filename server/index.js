// ====================== Imports ======================
import express from "express";
import cors from "cors";
import pkg from "pg";
import dotenv from "dotenv";

const app = express();
const { Pool } = pkg;
dotenv.config();
const port = process.env.PORT

// ====================== Middleware ======================
app.use(cors());
app.use(express.json());

// ====================== DB Connection ======================
const pool = new Pool({
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

// ====================== GET: Fetch All Todos ======================
app.get("/api/todos", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, completed FROM todos ORDER BY position ASC, id ASC"
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching todos from DB:", error);
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ====================== POST: Create Todo ======================
app.post("/api/todos", async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (text, completed, position) VALUES ($1, $2, " +
        "(SELECT COALESCE(MAX(position), 0) + 1 FROM todos)) RETURNING id, text, completed",
      [text.trim(), false]
    );

    const newTodo = result.rows[0];
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo in DB:", error);
    return res.status(500).json({ error: "Failed to create todo" });
  }
});

// ====================== PATCH: Update Todo ======================
app.patch("/api/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return res.status(400).json({ error: "Invaild id" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  try {
    const result = await pool.query(
      "UPDATE todos SET completed = $1 WHERE id = $2 RETURNING id, text, completed",
      [completed, numericId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    const updateTodo = result.rows[0];
    return res.json(updateTodo);
  } catch (error) {
    console.error("Error updating todo in DB:", error);
    return res.status(500).json({ error: "Failed to update todo" });
  }
});

// ====================== DELETE: Single Todo ======================
app.delete("/api/todos/:id", async (req, res) => {
  const { id } = req.params;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return res.status(400).json({ error: "Invaild id" });
  }

  try {
    const result = await pool.query("DELETE FROM todos WHERE id = $1", [
      numericId,
    ]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting todo from DB:", error);
    return res.status(500).json({ error: "Failed to delete todo" });
  }
});


// ====================== DELETE: Clear Completed ======================
app.delete("/api/todos", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM todos WHERE completed = TRUE");
    const removed = result.rowCount;

    return res.json({ removed });
  } catch (error) {
    console.error("Error clearing completed todos in DB:", error);
    return res.status(500).json({ error: "Failed to clear completed todos" });
  }
});


// ====================== PUT: Reorder Todos ======================
app.put("/api/todos/reorder", async (req, res) => {
  const { orderIds } = req.body;

  if (!Array.isArray(orderIds) || orderIds.length === 0) {
    return res
      .status(400)
      .json({ error: "orderIds must be a non-empty string" });
  }

  try {
    for (let index = 0; index < orderIds.length; index++) {
      const id = Number(orderIds[index]);

      if (!Number.isInteger(id)) {
        return res
          .status(400)
          .json({ error: "orderIds must contain integers" });
      }

      await pool.query("UPDATE todos SET position = $1 WHERE id = $2", [
        index,
        id,
      ]);
    }

    return res.json({ success: true });
  } catch (error) {
    console.error("Error reordering todos in DB:", error);
    return res.status(500).json({ error: "Failed to reorder todos" });
  }
});

// ====================== Health Check ======================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// ====================== Start Server ======================
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
