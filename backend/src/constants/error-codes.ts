export const ErrorCodes = {
    VALIDATION_ERROR: "VALIDATION_ERROR",
    RESTAURANT_EXISTS: "RESTAURANT_EXISTS",
    RESTAURANT_NOT_FOUND: "RESTAURANT_NOT_FOUND",
} as const;

export type ErrorCodeTypes= typeof ErrorCodes[keyof typeof ErrorCodes]