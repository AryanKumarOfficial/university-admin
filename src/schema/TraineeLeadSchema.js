import {z} from "zod";

export const TraineeLeadSchema = z
    .object({
        traineeName: z.string().min(1, "Trainee name is required"),
        traineeCollegeName: z.string().min(1, "Trainee college name is required"),
        contactNumber: z
            .string()
            .min(10, "Contact number must be at least 10 digits")
            .max(15, "Contact number cannot exceed 15 digits")
            .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
        location: z.string().min(1, "Location is required"),
        courseName: z.string().min(1, "Course name is required"),
        salesChannel: z.string().min(1, "Sales channel is required"),
        otherSalesChannel: z.string().optional(),
        linkedinUrl: z.string().url("Invalid URL format").optional(),
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
            .array(z.object({text: z.string().min(1, "Comment cannot be empty")}))
            .optional(),
    })
    .refine(
        (data) =>
            data.salesChannel !== "Other" ||
            (data.otherSalesChannel && data.otherSalesChannel.trim().length > 0),
        {
            message: "Please specify the other sales channel",
            path: ["otherSalesChannel"],
        }
    );
