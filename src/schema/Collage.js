import { z } from "zod";

export const CollageSchema = z.object({
    name: z.string().min(1, "Name is required"),
    location: z
        .object({
            value: z.string(),
            label: z.string(),
        }, {
            required_error: "Location is required",
        })
});
