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

export async function getUserById(id:string): Promise<User|null> {
    const result = await pool.query<User>(
        `SELECT id, email, full_name, is_active, created_at, updated_at
        FROM users
        WHERE id = $1
        `,
        [id]
    );
    return result.rows[0] ?? null
}

export async function createUser(
    email : string,
    fullName : string,
    passwordHash : string
):Promise<User> {
    const result = await pool.query<User>(
        `INSERT INTO users (email, full_name, password_hash)
        VALUES ($1, $2, $3)
        RETURNING id, email, full_name, is_active, created_at, updated_at
        `,
        [email, fullName, passwordHash]
    );
    return result.rows[0]
}