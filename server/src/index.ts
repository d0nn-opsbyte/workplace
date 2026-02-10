import express from "express";

const app = express();

app.get("/", (_req, res) => {
  res.send("Backend running 🚀");
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
