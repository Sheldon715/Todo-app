import "dotenv/config";
import app from "./app.js";

const port = process.env.PORT || 4000;

// ====================== Start Server ======================
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
