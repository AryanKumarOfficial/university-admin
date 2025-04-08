import {z} from "zod";

export const TNPLeadSchema = z.object({
    // Basic Info
    collegeName: z.string().min(1, "College name is required"),
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
    // Date & Time (Optional)
    date: z.string().optional(),
    time: z.string().optional(),

    // Multiple Contacts
    contacts: z.array(
        z.object({
            contactName: z.string().min(1, "Contact name is required"),
            contactNumber: z
                .string()
                .min(10, "Contact number must be at least 10 digits")
                .max(15, "Contact number cannot exceed 15 digits")
                .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
        })
    ).min(1, "At least one contact is required"),

    // Comments
    newComments: z
        .array(
            z.object({
                text: z.string(),
            })
        )
        .optional(),

    // New Fields
    courseName: z.string().min(1, "Course name is required"),
    salesChannel: z.string().min(1, "Sales channel is required"),
    linkedinUrl: z.string().url("Invalid URL format").optional(),
    otherSalesChannel: z.string().optional(),

});
