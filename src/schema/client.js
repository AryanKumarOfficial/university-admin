import {z} from "zod";

/**
 * ClientSchema
 *
 * Covers all fields for the "Add Client" form:
 * 1) Basic School Information
 * 2) Enrollment & Infrastructure
 * 3) Financial
 * 4) Technology & Current System
 * 5) Decision-Making & Influencers
 * 6) Misc
 * 7) Comments
 */
export const ClientSchema = z.object({
    // Basic School Information
    schoolName: z.string().min(1, "School Name is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),

    typeOfSchool: z.enum(["co-ed", "boys-only", "girls-only"], {
        errorMap: () => ({message: "Select a valid type of school"}),
    }),

    /**
     * Year of Establishment: can be numeric or string,
     * but must be >= 1900 if numeric. Adjust as needed.
     */
    yearOfEstablishment: z
        .union([
            z.string().regex(/^\d+$/, "Must be a valid year").transform(Number),
            z.number()
                // .min(1900, "Year must be >= 1900")
        ])
        .optional(),

    boardOfAffiliation: z.enum(
        ["cbse", "icse", "state-board", "ib", "igcse", "hpbose", "custom"],
        {errorMap: () => ({message: "Select a valid Board"})}
    ),
    customBoard: z.string().optional(),
    mediumOfInstruction: z.enum(
        [
            "english",
            "hindi",
            "tamil",
            "marathi",
            "bengali",
            "malayalam",
            "telugu",
            "custom",
        ],
        {errorMap: () => ({message: "Select a valid medium of instruction"})}
    ),

    newSessionStarts: z.string().min(1, "Month is required"),
    frequencyOfPTA: z.enum(
        ["weekly", "monthly", "quarterly", "half-yearly", "yearly"],
        {errorMap: () => ({message: "Select a valid PTA frequency"})}
    ),
    schoolTimingsFrom: z.string().optional(), // or z.string().min(1, "Time required") if needed
    schoolTimingsTo: z.string().optional(),

    // Enrollment & Infrastructure
    numStudents: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {message: "Must be >= 1"})
        .optional(),

    numClasses: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {message: "Must be >= 1"})
        .optional(),

    numSections: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {message: "Must be >= 1"})
        .optional(),

    numTeachers: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {message: "Must be >= 1"})
        .optional(),

    numAdminStaff: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {message: "Must be >= 1"})
        .optional(),

    // Financial
    annualFees: z.string().min(1, "Annual Fees is required"),
    feePaymentFrequency: z.enum(["monthly", "quarterly", "annually"], {
        errorMap: () => ({message: "Select Monthly, Quarterly, or Annually"}),
    }),

    // Technology & Current System
    currentTools: z.string().min(1, "Current tools/software is required"),
    hasWebsite: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    hasInternet: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    digitalLiteracy: z.enum(["basic", "moderate", "advanced"], {
        errorMap: () => ({message: "Select Basic, Moderate, or Advanced"}),
    }),

    // Decision-Making & Influencers
    contacts: z
        .array(
            z.object({
                name: z.string().min(1, "Name is required"),
                designation: z.string().min(1, "Designation is required"),
                email: z.string().email("Invalid email address"),
                phone: z.string().min(1, "Phone is required"),
            })
        )
        .min(1, "At least one contact is required"),
    purchaseDecisionBy: z.enum(
        ["principal", "school-owner", "management", "admin", "others"],
        {
            errorMap: () => ({message: "Select a valid purchase decision maker"}),
        }
    ),

    // Misc
    specificNeeds: z.string().min(1, "Specific needs are required"),
    knownPainPoints: z.string().min(1, "Known pain points are required"),

    // Communication channels: array of possible strings
    communicationChannels: z
        .array(
            z.enum(["whatsapp", "phone-call", "email", "others"], {
                errorMap: () => ({message: "Select a valid channel"}),
            })
        )
        .optional(),

    usp: z.string().min(1, "USP is required"),
    competitorSchools: z.array(z.string().min(1)).optional(),
    expansionPlans: z.string().optional(),

    // Comments (newComments in the form, merged into final "comments")
    // If you store them as objects with .text
    newComments: z
        .array(
            z.object({
                text: z.string().min(1, "Comment cannot be empty"),
            })
        )
        .optional(),
}).superRefine((data, ctx) => {
    // if board is custom, customBoard must not be empty
    if (
        (data.boardOfAffiliation === "custom") && (!data.customBoard || data.customBoard.trim() === "")
    ) {
        ctx.addIssue({
            code: "custom",
            path: ["customBoard"],
            message: "Please Specify the custom board"
        })
    }
})
