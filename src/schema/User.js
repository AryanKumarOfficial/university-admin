import {z} from "zod"

export const UserSchema = z.object({
    name: z.string()
        .min(1, {message: 'Name is required'}),
    email: z.string().email({message: 'Please provide a valid email address'}),
    password: z.string().min(6, {message: 'Password is required'}).max(16, {message: 'Password too long'}),
    phone: z.string()
        .refine((value) => {
            // Match exactly 10 digits after the country code
            const match = value.match(/^\+(\d{1,4})(\d{10})$/);
            return match !== null;
        }, { message: "Invalid phone. Must be country code followed by exactly 10 digits (e.g., +91XXXXXXXXXX)" }),
    role: z.enum(["Admin", "Course Manager", "Professional", "Trainee", "Growth Manager", "Intern"], {
        errorMap: () => ({message: "Select a valid Role"})
    }),
    createdBy: z.string()
        .min(1, {message: 'Created By is Required'}),

})