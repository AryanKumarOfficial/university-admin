import {z} from "zod"

export const UserSchema = z.object({
    name: z.string()
        .min(1, {message: 'Name is required'}),
    email: z.string().email({message: 'Please provide a valid email address'}),
    password: z.string().min(6, {message: 'Password is required'}).max(16, {message: 'Password too long'}),
    phone: z.string().regex(/^\+[1-9]\d{1,14}$/,
        {message: "Invalid phone. Use E.164 format."}),
    role: z.enum(["Admin", "Course Manager", "Professional", "Trainee", "Growth Manager", "Intern"], {
        errorMap: () => ({message: "Select a valid Role"})
    }),
    createdBy: z.string()
        .min(1, {message: 'Created By is Required'}),

})