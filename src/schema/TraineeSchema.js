import {z} from "zod";

export const TraineeSchema = z.object({
    name: z.string().min(1, "Trainee name is required"),
    college: z.string().min(1, "Trainee college name is required"),
    phone: z
        .string()
        .min(10, "Contact number must be at least 10 digits")
        .max(15, "Contact number cannot exceed 15 digits")
        .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
    location: z.string().min(1, "Location is required"),
    courseName: z.string().min(1, "Course name is required"),
    salesChannel: z.string().min(1, "Sales channel is required"),
    otherSalesChannel: z.string().optional(),
    linkedinUrl: z.string().url("Invalid URL format").optional(),
    response: z.enum(
        [
            "Wrong number",
            "Not Interested",
            "Interested",
            "Send details on WhatsApp",
            "Mail sent",
            "Call later",
            "Meeting scheduled",
            "Follow up required",
        ],
        {errorMap: () => ({message: "Response is required"})}
    ),
    date: z.string().min(1, "Date is required"),
    time: z.string().min(1, "Time is required"),
    transactionNumber: z.string().min(1, "Transaction number is required"),
}).superRefine((data, ctx) => {
    if (data.salesChannel === "Other" && !data.otherSalesChannel) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please specify the other sales channel",
            path: ["otherSalesChannel"],
        });
    }
});
