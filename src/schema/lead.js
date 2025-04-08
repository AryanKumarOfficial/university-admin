import {z} from "zod";

export const LeadSchema = z.object({
    // Basic School Information
    schoolName: z.string().min(1, "School Name is required"),
    contacts: z
        .array(
            z.object({
                name: z.string().min(1, "Name is required"),
                designation: z.string().min(1, "Designation is required"),
                email: z.string().email("Invalid email address").optional().or(z.literal('')), // Made email optional but not null
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
            z.string().length(0) // Allow empty string
        ])
        .optional() // Make the whole field optional
        .refine((val) => val === undefined || val === '' || val >= 1, { // Refine optional/empty or >= 1
            message: "Number of Students must be at least 1 if provided",
        }),


    annualFees: z.string().optional(), // Made optional
    hasWebsite: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    // Updated response enum with all options from the image
    response: z.enum([
        "Yet to Call",
        "Wrong Number",
        "Did Not pick up",
        "Call later",
        "Not Interested",
        "Sent details on whatsapp",
        "Mail sent",
        "PPT Scheduled",
        "Follow up after PPT",
        "After PPT",
        "7 Day Demo",
        "Follow up after 7D demo",
        "After 7D Demo",
        "Converted"
    ], {
        errorMap: () => ({message: "Please select a valid response status"}), // Updated error message
    }),
    followUpDate: z.string().optional(),
    followUpTime: z.string().optional(),
    // comments
    newComments: z.array(z.object({
        text: z.string(),
        // Optional: Add timestamp for comments if needed
        // createdAt: z.date().default(() => new Date()),
    })).optional(),
    // leadType: z.enum(["school", "college", "institute"], {
    //     errorMap: () => ({message: "Select School, College or Institute"}),
    // }) // Assuming this remains commented out as per original schema
});

// Example of how you might use it (optional type export)