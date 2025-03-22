import {z} from "zod";

export const TraineeLeadSchema = z.object({
    traineeName: z.string().min(1, "Trainee name is required"),
    traineeCollegeName: z.string().min(1, "Trainee college name is required"),
    contactNumber: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .max(15, "Contact number cannot exceed 15 digits")
        .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
    location: z.string().min(1, "Location is required"),
    response: z.enum([
        "Wrong number",
        "Not Interested",
        "Interested",
        "Send details on WhatsApp",
        "Mail sent",
        "Call later",
        "Meeting scheduled",
        "Follow up required",
    ]),
    date: z.string().optional(),
    time: z.string().optional(),
    newComments: z
        .array(z.object({text: z.string()}))
        .optional(),
});
