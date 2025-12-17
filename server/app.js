// ====================== Imports ======================
import "dotenv/config";
if (process.env.GLOBAL_AGENT_HTTP_PROXY) {
  await import("global-agent/bootstrap.js");
}
import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import passport from "passport";
import "./auth/google.js";
import pool from "./db.js";

const app = express();

// ====================== Middleware ======================
app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());
app.use(passport.initialize());

// ====================== JWT Generate ======================
function generateToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

// ====================== Auth Middleware ======================
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authorization header missing" });
  }

  const token = authHeader.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.userId;

    return next();
  } catch (error) {
    console.error("Invalid token:", error.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// ====================== Auth: Register ======================
app.post("/api/auth/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);

    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "Email is already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, password_hash) VALUES ($1, $2)" +
        "RETURNING id, email, created_at",
      [email, passwordHash]
    );

    const user = result.rows[0];
    const token = generateToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user" });
  }
});

// ====================== Auth: Login ======================
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const result = await pool.query(
      "SELECT id, email, password_hash, created_at FROM users WHERE email = $1",
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Failed to login" });
  }
});

// ====================== Google OAuth ======================
app.get(
  "/api/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const { token, user } = req.user;

    const clientBaseUrl =
      process.env.CLIENT_BASE_URL || "http://localhost:5173";
    const emailParam = user?.email
      ? `&email=${encodeURIComponent(user.email)}`
      : "";
    const redirectUrl = `${clientBaseUrl}/?token=${token}${emailParam}`;
    return res.redirect(redirectUrl);
  }
);

// ====================== Auth: Me ======================
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, email, created_at FROM users WHERE id = $1",
      [req.userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = result.rows[0];

    return res.json({
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res.status(500).json({ error: "Failed to fetch current user" });
  }
});

// ====================== GET: Fetch All Todos ======================
app.get("/api/todos", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, text, completed FROM todos " +
        "WHERE user_id = $1 ORDER BY position ASC, id ASC",
      [req.userId]
    );

    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching todos from DB:", error);
    return res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// ====================== POST: Create Todo ======================
app.post("/api/todos", authMiddleware, async (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO todos (text, completed, position, user_id) VALUES ($1, $2, " +
        "(SELECT COALESCE(MAX(position), 0) + 1 FROM todos WHERE user_id = $3), $3) " +
        "RETURNING id, text, completed, position",
      [text.trim(), false, req.userId]
    );

    const newTodo = result.rows[0];
    return res.status(201).json(newTodo);
  } catch (error) {
    console.error("Error creating todo in DB:", error);
    return res.status(500).json({ error: "Failed to create todo" });
  }
});

// ====================== PATCH: Update Todo ======================
app.patch("/api/todos/:id", authMiddleware, async (req, res) => {
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
      "UPDATE todos SET completed = $1 WHERE id = $2 AND user_id = $3 " +
        "RETURNING id, text, completed, position",
      [completed, numericId, req.userId]
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
app.delete("/api/todos/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  const numericId = Number(id);
  if (!Number.isInteger(numericId)) {
    return res.status(400).json({ error: "Invaild id" });
  }

  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE id = $1 AND user_id = $2",
      [numericId, req.userId]
    );

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
app.delete("/api/todos", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM todos WHERE completed = TRUE AND user_id = $1",
      [req.userId]
    );
    const removed = result.rowCount;

    return res.json({ removed });
  } catch (error) {
    console.error("Error clearing completed todos in DB:", error);
    return res.status(500).json({ error: "Failed to clear completed todos" });
  }
});

// ====================== PUT: Reorder Todos ======================
app.put("/api/todos/reorder", authMiddleware, async (req, res) => {
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

      await pool.query(
        "UPDATE todos SET position = $1 WHERE id = $2 AND user_id = $3",
        [index, id, req.userId]
      );
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

export default app;
