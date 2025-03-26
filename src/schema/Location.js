import {z} from "zod";

export const LocationSchema = z.object({
    name: z.string().min(1, "Location Name is required"),
})