import {z} from "zod";

export const LeadSchema = z.object({
    // Basic School Information
    schoolName: z.string().min(1, "School Name is required"),
    contacts: z
        .array(
            z.object({
                name: z.string().min(1, "Name is required"),
                designation: z.string().min(1, "Designation is required"),
                email: z.string().email("Invalid email address"),
                phone: z.string().min(1, "Phone is required"),
            })
        )
        .min(1, "At least one contact person is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    numStudents: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Students must be at least 1",
        }),

    annualFees: z.string().min(1, "Annual Fees is required"),
    hasWebsite: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    response: z.enum(["Call later", "Not interested"], {
        errorMap: () => ({message: "Select Call later or Not interested"}),
    }),
    followUpDate: z.string().optional(),
    followUpTime: z.string().optional(),
    // comments
    newComments: z.array(z.object({
        text: z.string(),
    })).optional(),
    // leadType: z.enum(["school", "college", "institute"], {
    //     errorMap: () => ({message: "Select School, College or Institute"}),
    // })
});
