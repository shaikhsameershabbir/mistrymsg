import { z } from "zod";
const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const usernameValidation = z
    .string()
    .min(2, 'Username must be at lest 2 characters ')
    .min(20, 'Username must be no more than  20 characters ')
    .regex(emailPattern, 'Username must not contain special character')

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: 'Invalid Email address.' }),
    password: z.string().min(6, { message: 'Password must be 6 characters' })
})