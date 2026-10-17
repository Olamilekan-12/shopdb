import express from "express"
import dotenv from "dotenv"
import {pool} from "./db.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 8000;

app.use(express.json())

app.get("/health", async(_req, res)=> {
    try {
        const result = await pool.query("SELECT NOW()");
        res.json({
            status : "ok",
            time : result.rows[0].now
        })
    } catch (error) {
        res.status(500).json({
            status : "error",
            message : "Database unreachable"
        })
    }
})

app.listen(PORT,()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})