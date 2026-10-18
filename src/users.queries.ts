import {pool} from "./db.js"
import type { User } from "./types.js"

export async function getAllUsers():Promise<User[]> {
    const result = await pool.query<User>(
        `SELECT id, email, full_name, is_active, created_at, updated_at
        FROM users
        ORDER BY created_at DESC
        `
    );
    return result.rows
}