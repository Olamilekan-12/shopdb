import express from "express"
import dotenv from "dotenv"
import {pool} from "./db.js"
import { getAllUsers, getUserById } from "./users.queries.js"

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

app.get("/users", async(_req, res) => {
    try {
        const users = await getAllUsers()
        res.json(users)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message : "Failed to fetch users"
        })
    }
   
})

app.get("/users/:id", async(req, res)=> {
    try {
        const user = await getUserById(req.params.id)
        if(!user){
            return res.status(404).json({
                message : "User not found"
            })
        }
        res.status(200).json(user)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message : "Failed to fetch users"
        })
    }
})

app.listen(PORT,()=> {
    console.log(`Server running on http://localhost:${PORT}`)
})