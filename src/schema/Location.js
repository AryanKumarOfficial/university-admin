import {z} from "zod";

export const LocationSchema = z.object({
    name: z.string().min(1, "Name is required"),
})