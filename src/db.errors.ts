export const PG_ERRORS = {
    UNIQUE_VIOLATION : "23505",
    CHECK_VIOLATION : "23514",
    NOT_NULL_VIOLATION : "23502",
    FOREIGN_KEY_VIOLATION : "23503",
    INVALID_TEXT_REPRESENTATION : "22P02"
} as const

export interface PgError extends Error {
    code : string
    constraint? : string
    detail? : string
    column? : string
    table?: string
}

export function isPgError(err : unknown): err is PgError {
    return (
        err instanceof Error &&
        typeof (err as PgError).code === "string"
    )
}