import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

const port = 4000;

let todos = [
  { id: "1", text: "Learn React", completed: false },
  { id: "2", text: "Build Todo App", completed: true },
];

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  const newTodo = {
    id: Date.now().toString(),
    text: text.trim(),
    completed: false,
  };

  todos.push(newTodo);

  return res.status(201).json(newTodo);
});

app.patch("/api/todos/:id", (req, res) => {
  const { id } = req.params;
  const { completed } = req.body;

  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    return res.status(404).json({ error: "Todo not found" });
  }

  if (typeof completed !== "boolean") {
    return res.status(400).json({ error: "completed must be a boolean" });
  }

  todo.completed = completed;
  return res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const { id } = req.params;

  const beforeLength = todos.length;
  todos = todos.filter((item) => item.id === id);

  if (beforeLength === todos.length) {
    return res.status(404).json({ error: "Todo not found" });
  }

  return res.status(204).send();
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
