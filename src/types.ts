export interface User {
    id : string
    email : string
    full_name : string
    password_hash : string
    is_active : boolean
    created_at : Date,
    updated_at : Date
}