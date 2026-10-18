import express from "express";
import dotenv from "dotenv";
import { pool } from "./db.js";
import { createUser, getAllUsers, getUserById } from "./users.queries.js";
import { isPgError, PG_ERRORS } from "./db.errors.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      status: "ok",
      time: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Database unreachable",
    });
  }
});

app.get("/users", async (_req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch users",
    });
  }
});

app.post("/users", async (req, res) => {
  const { email, full_name, password_hash } = req.body;
  if (!email || !full_name || !password_hash) {
    return res.status(400).json({
      message: "email, full_name, password_hash are required",
    });
  }
  try {
    const user = await createUser(email, full_name, password_hash);
    res.status(201).json(user);
  } catch (error) {
    if (isPgError(error)) {
      if (error.code === PG_ERRORS.UNIQUE_VIOLATION) {
        return res.status(409).json({
          message: "Email already registered",
        });
      }
      if (error.code === PG_ERRORS.CHECK_VIOLATION) {
        return res.status(400).json({
          message: `Invalid value: ${error.constraint}`,
        });
      }
    }
    console.error(error)
    res.status(500).json({
        message : "Failed to create users"
    })
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
