import {z} from "zod";

export const TraineeSchema = z.object({
    name: z.string().min(1, "Trainee name is required"),
    collage: z.string().min(1, "Trainee college name is required"),
    phone: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .max(15, "Contact number cannot exceed 15 digits")
        .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
    location: z.string().min(1, "Location is required"),
});
