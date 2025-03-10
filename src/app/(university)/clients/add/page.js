"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {addDoc, collection} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import Alert from 'react-bootstrap/Alert';
import {useRouter} from "next/navigation";

/**
 * Zod schema defining form structure:
 * - Most fields are mandatory, except competitorSchools[] and expansionPlans.
 * - Key Contact Person is an array of at least one contact (name, designation, email, phone).
 * - Communication channels are selected via checkboxes, requiring at least one.
 */
const ClientSchema = z.object({
    // Basic School Information
    schoolName: z.string().min(1, "School Name is required"),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, "City is required"),
    area: z.string().min(1, "Area is required"),
    typeOfSchool: z.enum(["co-ed", "boys-only", "girls-only"], {
        errorMap: () => ({message: "Select Co-ed, Boys only, or Girls only"}),
    }),
    yearOfEstablishment: z
        .union([
            z.number().min(1900, "Year must be >= 1900").max(new Date().getFullYear()),
            z
                .string()
                .min(1900)
                .regex(/^\d+$/, "Must be a valid year")
                .transform(Number)
                .refine((val) => val <= new Date().getFullYear(), {
                    message: "Year cannot exceed current year",
                }),
        ])
        .or(z.string()), // fallback if needed
    boardOfAffiliation: z.enum(
        ["cbse", "icse", "state-board", "ib", "igcse", "hpbose", "custom"],
        {
            errorMap: () => ({
                message: "Select a valid Board (CBSE, ICSE, State Board, etc.)",
            }),
        }
    ),
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
        {
            errorMap: () => ({
                message: "Select a valid medium or 'custom'",
            }),
        }
    ),
    newSessionStarts: z.enum(["January", "February", "March", "April", "May", "June", "July", "August", "september", "October", "November", "December"],
        {
            errorMap: () => ({
                message: "Select a Valid Month"
            })
        }
    ),
    frequencyOfPTA: z.enum(["weekly", "monthly", "quarterly", "half-yearly", "yearly"], {
        errorMap: () => ({
            message:
                "Select a valid frequency (Weekly, Monthly, Quarterly, Half Yearly, Yearly)",
        }),
    }),
    schoolTimingsFrom: z.string().min(1, "Start time is required"),
    schoolTimingsTo: z.string().min(1, "End time is required"),

    // Enrollment and Infrastructure
    numStudents: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Students must be at least 1",
        }),
    numClasses: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Classes must be at least 1",
        }),
    numSections: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Sections must be at least 1",
        }),
    numTeachers: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Teachers must be at least 1",
        }),
    numAdminStaff: z
        .union([
            z.number().min(1, "Must be >= 1"),
            z.string().regex(/^\d+$/, "Must be a valid number").transform(Number),
        ])
        .refine((val) => val >= 1, {
            message: "Number of Administrative Staff must be at least 1",
        }),

    // Financial Information
    annualFees: z.string().min(1, "Annual Fees is required"),
    feePaymentFrequency: z.enum(["monthly", "quarterly", "annually"], {
        errorMap: () => ({
            message: "Select a valid payment frequency (Monthly, Quarterly, Annually)",
        }),
    }),

    // Technology and Current System
    currentTools: z.string().min(1, "Current Tools/Software is required"),
    hasWebsite: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    hasInternet: z.enum(["yes", "no"], {
        errorMap: () => ({message: "Select Yes or No"}),
    }),
    digitalLiteracy: z.enum(["basic", "moderate", "advanced"], {
        errorMap: () => ({
            message: "Select Basic, Moderate, or Advanced",
        }),
    }),

    // Decision-Making and Influencers
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
    purchaseDecisionBy: z.enum(
        ["principal", "school-owner", "management", "admin", "others"],
        {
            errorMap: () => ({
                message: "Select who makes purchase decisions",
            }),
        }
    ),

    // Miscellaneous
    specificNeeds: z.string().min(1, "This field is required"),
    knownPainPoints: z.string().min(1, "This field is required"),
    communicationChannels: z
        .array(z.enum(["whatsapp", "phone-call", "email", "others"]))
        .min(1, "Select at least one channel"),
    usp: z.string().min(1, "USP is required"),
    competitorSchools: z.array(z.string().min(1)).optional(),
    expansionPlans: z.string().optional(),

    // comments
    comments: z.array(
        z.object({
            text: z.string().min(1, "Comment cannot be empty"),
        })
    ).optional(),
});

export default function ClientAddForm() {
    const [alerts, setAlerts] = useState([]);
    const addAlert = (variant, message) => {
        const newAlert = {id: Date.now(), variant, message};
        setAlerts((prev) => [...prev, newAlert]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    const getIcon = (variant) => {
        switch (variant) {
            case 'success':
                return <i className="fa fa-check-circle" style={{marginRight: '8px'}}/>;
            case 'danger':
                return <i className="fa fa-exclamation-triangle" style={{marginRight: '8px'}}/>;
            case 'info':
                return <i className="fa fa-info-circle" style={{marginRight: '8px'}}/>;
            default:
                return null;
        }
    };
    const router = useRouter();

    // Breadcrumbs (modify as needed)
    const breadcrumbs = [
        {label: "Home", href: "/"},
        {label: "Clients", href: "/clients"},
        {label: "Add New Client", href: "/clients/add"},
    ];

    // Initialize the form
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        reset
    } = useForm({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            schoolName: "",
            state: "",
            city: "",
            area: "",
            typeOfSchool: "co-ed",
            yearOfEstablishment: "",
            boardOfAffiliation: "cbse",
            mediumOfInstruction: "english",
            newSessionStarts: "January",
            frequencyOfPTA: "weekly",
            schoolTimingsFrom: "",
            schoolTimingsTo: "",

            numStudents: "",
            numClasses: "",
            numSections: "",
            numTeachers: "",
            numAdminStaff: "",

            annualFees: "",
            feePaymentFrequency: "monthly",

            currentTools: "",
            hasWebsite: "no",
            hasInternet: "no",
            digitalLiteracy: "basic",

            // At least one contact
            contacts: [
                {name: "", designation: "", email: "", phone: ""},
            ],
            purchaseDecisionBy: "principal",

            specificNeeds: "",
            knownPainPoints: "",
            communicationChannels: [],
            usp: "",
            competitorSchools: [],
            expansionPlans: "",
            comments: [],

        },
        mode: "onChange",
    });

    // Field arrays for dynamic lists
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({control, name: "contacts"});

    const {
        fields: competitorFields,
        append: appendCompetitor,
        remove: removeCompetitor,
    } = useFieldArray({control, name: "competitorSchools"});

    // We'll also manage the comments array via useFieldArray
    const {
        fields: commentFields,
        append: appendComment,
        remove: removeComment,
    } = useFieldArray({control, name: "comments"});

    // Submit handler
    const onSubmit = async (data) => {
        console.log("Submitting Client:", data);
        try {
            data.createdAt = new Date(Date.now()).toISOString();
            await addDoc(collection(db, "clients"), data);
            addAlert("success", "Client Added successfully")
            reset();
            router.push("/clients");
        } catch (error) {
            console.error("Error adding client: ", error);
            addAlert("danger", "Error adding client")
        }

    };

    return (
        <>
            <div className="page">
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        variant={alert.variant}
                        onClose={() => removeAlert(alert.id)}
                        dismissible
                        className={"alert-icon d-flex align-items-center h-100 alert alert-" + alert.variant}
                    >
                        {getIcon(alert.variant)}
                        {alert.message}
                    </Alert>
                ))}
                {/* Breadcrumb Component */}
                <Breadcrumb breadcrumbs={breadcrumbs}/>

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="lead-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* BASIC SCHOOL INFORMATION */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Basic School Information</h3>
                                        </div>
                                        <div className="card-body">
                                            {/* Row 1: School Name */}
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">School Name</label>
                                                    <input className="form-control" {...register("schoolName")} />
                                                    {errors.schoolName && (
                                                        <small className="text-danger">
                                                            {errors.schoolName.message}
                                                        </small>
                                                    )}
                                                </div>

                                                {/* Location: State, City, Area */}
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">State</label>
                                                    <input className="form-control" {...register("state")} />
                                                    {errors.state && (
                                                        <small className="text-danger">{errors.state.message}</small>
                                                    )}
                                                </div>
                                                <div className="col-md-2 mb-3">
                                                    <label className="form-label">City</label>
                                                    <input className="form-control" {...register("city")} />
                                                    {errors.city && (
                                                        <small className="text-danger">{errors.city.message}</small>
                                                    )}
                                                </div>
                                                <div className="col-md-2 mb-3">
                                                    <label className="form-label">Area</label>
                                                    <input className="form-control" {...register("area")} />
                                                    {errors.area && (
                                                        <small className="text-danger">{errors.area.message}</small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Row 2: Type of School, Year, Board, Medium */}
                                            <div className="row">
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Type of School</label>
                                                    <select className="form-select" {...register("typeOfSchool")}>
                                                        <option value="co-ed">Co-ed</option>
                                                        <option value="boys-only">Boys only</option>
                                                        <option value="girls-only">Girls only</option>
                                                    </select>
                                                    {errors.typeOfSchool && (
                                                        <small className="text-danger">
                                                            {errors.typeOfSchool.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Year of Establishment</label>
                                                    <input
                                                        className="form-control"
                                                        type={"number"}
                                                        placeholder="e.g. 1990"
                                                        {...register("yearOfEstablishment")}
                                                    />
                                                    {errors.yearOfEstablishment && (
                                                        <small className="text-danger">
                                                            {errors.yearOfEstablishment.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Board of Affiliation</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("boardOfAffiliation")}
                                                    >
                                                        <option value="cbse">CBSE</option>
                                                        <option value="icse">ICSE</option>
                                                        <option value="state-board">State Board</option>
                                                        <option value="ib">IB</option>
                                                        <option value="igcse">IGCSE</option>
                                                        <option value="hpbose">HPBOSE</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                    {errors.boardOfAffiliation && (
                                                        <small className="text-danger">
                                                            {errors.boardOfAffiliation.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Medium of Instruction</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("mediumOfInstruction")}
                                                    >
                                                        <option value="english">English</option>
                                                        <option value="hindi">Hindi</option>
                                                        <option value="tamil">Tamil</option>
                                                        <option value="marathi">Marathi</option>
                                                        <option value="bengali">Bengali</option>
                                                        <option value="malayalam">Malayalam</option>
                                                        <option value="telugu">Telugu</option>
                                                        <option value="custom">Custom</option>
                                                    </select>
                                                    {errors.mediumOfInstruction && (
                                                        <small className="text-danger">
                                                            {errors.mediumOfInstruction.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Row 3: New Session, PTA, Timings */}
                                            <div className="row">
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">New Session Starts From
                                                        (Month)</label>
                                                    <select className="form-select" {...register("newSessionStarts")}>
                                                        <option value="">Select Month</option>
                                                        <option value="January">January</option>
                                                        <option value="February">February</option>
                                                        <option value="March">March</option>
                                                        <option value="April">April</option>
                                                        <option value="May">May</option>
                                                        <option value="June">June</option>
                                                        <option value="July">July</option>
                                                        <option value="August">August</option>
                                                        <option value="September">September</option>
                                                        <option value="October">October</option>
                                                        <option value="November">November</option>
                                                        <option value="December">December</option>
                                                    </select>
                                                    {errors.newSessionStarts && (
                                                        <small className="text-danger">
                                                            {errors.newSessionStarts.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Frequency of PTA Meetings</label>
                                                    <select className="form-select" {...register("frequencyOfPTA")}>
                                                        <option value="weekly">Weekly</option>
                                                        <option value="monthly">Monthly</option>
                                                        <option value="quarterly">Quarterly</option>
                                                        <option value="half-yearly">Half Yearly</option>
                                                        <option value="yearly">Yearly</option>
                                                    </select>
                                                    {errors.frequencyOfPTA && (
                                                        <small className="text-danger">
                                                            {errors.frequencyOfPTA.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">School Timings (From)</label>
                                                    <input
                                                        className="form-control"
                                                        type={"time"}
                                                        placeholder="e.g. 8:00 AM"
                                                        {...register("schoolTimingsFrom")}
                                                    />
                                                    {errors.schoolTimingsFrom && (
                                                        <small className="text-danger">
                                                            {errors.schoolTimingsFrom.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">School Timings (To)</label>
                                                    <input
                                                        className="form-control"
                                                        type={"time"}
                                                        placeholder="e.g. 2:00 PM"
                                                        {...register("schoolTimingsTo")}
                                                    />
                                                    {errors.schoolTimingsTo && (
                                                        <small className="text-danger">
                                                            {errors.schoolTimingsTo.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ENROLLMENT & INFRASTRUCTURE */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Enrollment and Infrastructure</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Number of Students</label>
                                                    <input className="form-control" {...register("numStudents")} />
                                                    {errors.numStudents && (
                                                        <small className="text-danger">
                                                            {errors.numStudents.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Number of Classes (Max)</label>
                                                    <input className="form-control" {...register("numClasses")} />
                                                    {errors.numClasses && (
                                                        <small className="text-danger">
                                                            {errors.numClasses.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Number of Sections (Max)</label>
                                                    <input className="form-control" {...register("numSections")} />
                                                    {errors.numSections && (
                                                        <small className="text-danger">
                                                            {errors.numSections.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Number of Teachers</label>
                                                    <input className="form-control" {...register("numTeachers")} />
                                                    {errors.numTeachers && (
                                                        <small className="text-danger">
                                                            {errors.numTeachers.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Number of Administrative Staff</label>
                                                    <input className="form-control" {...register("numAdminStaff")} />
                                                    {errors.numAdminStaff && (
                                                        <small className="text-danger">
                                                            {errors.numAdminStaff.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* FINANCIAL INFORMATION */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Financial Information</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Annual School Fees</label>
                                                    <input className="form-control" {...register("annualFees")} />
                                                    {errors.annualFees && (
                                                        <small className="text-danger">
                                                            {errors.annualFees.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-6 mb-3">
                                                    <label className="form-label">Fee Payment Frequency</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("feePaymentFrequency")}
                                                    >
                                                        <option value="monthly">Monthly</option>
                                                        <option value="quarterly">Quarterly</option>
                                                        <option value="annually">Annually</option>
                                                    </select>
                                                    {errors.feePaymentFrequency && (
                                                        <small className="text-danger">
                                                            {errors.feePaymentFrequency.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* TECHNOLOGY AND CURRENT SYSTEM */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Technology and Current System</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label className="form-label">Current Tools/Software Used</label>
                                                <input className="form-control" {...register("currentTools")} />
                                                {errors.currentTools && (
                                                    <small className="text-danger">
                                                        {errors.currentTools.message}
                                                    </small>
                                                )}
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Do they have a website?</label>
                                                    <select className="form-select" {...register("hasWebsite")}>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                    {errors.hasWebsite && (
                                                        <small className="text-danger">
                                                            {errors.hasWebsite.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Access to Internet on Campus?</label>
                                                    <select className="form-select" {...register("hasInternet")}>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                    {errors.hasInternet && (
                                                        <small className="text-danger">
                                                            {errors.hasInternet.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-4 mb-3">
                                                    <label className="form-label">Digital Literacy Level of
                                                        Staff</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("digitalLiteracy")}
                                                    >
                                                        <option value="basic">Basic</option>
                                                        <option value="moderate">Moderate</option>
                                                        <option value="advanced">Advanced</option>
                                                    </select>
                                                    {errors.digitalLiteracy && (
                                                        <small className="text-danger">
                                                            {errors.digitalLiteracy.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* DECISION-MAKING AND INFLUENCERS */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Decision-Making and Influencers</h3>
                                        </div>
                                        <div className="card-body">
                                            {/* Key Contact Person (Dynamic Array) */}
                                            <h6>Key Contact Person(s)</h6>
                                            <ContactArray
                                                contactFields={contactFields}
                                                removeContact={removeContact}
                                                appendContact={appendContact}
                                                register={register}
                                                errors={errors}
                                            />

                                            <div className="mb-3">
                                                <label className="form-label">Who Makes Purchase Decisions?</label>
                                                <select className="form-select" {...register("purchaseDecisionBy")}>
                                                    <option value="principal">Principal</option>
                                                    <option value="school-owner">School Owner</option>
                                                    <option value="management">Management</option>
                                                    <option value="admin">Admin</option>
                                                    <option value="others">Others</option>
                                                </select>
                                                {errors.purchaseDecisionBy && (
                                                    <small className="text-danger">
                                                        {errors.purchaseDecisionBy.message}
                                                    </small>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* MISCELLANEOUS */}
                                    <div className="card mb-3">
                                        <div className="card-header">
                                            <h3 className="card-title">Miscellaneous</h3>
                                        </div>
                                        <div className="card-body">
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Specific Needs Highlighted by the School
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    {...register("specificNeeds")}
                                                />
                                                {errors.specificNeeds && (
                                                    <small className="text-danger">
                                                        {errors.specificNeeds.message}
                                                    </small>
                                                )}
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label">Any Known Pain Points</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    {...register("knownPainPoints")}
                                                />
                                                {errors.knownPainPoints && (
                                                    <small className="text-danger">
                                                        {errors.knownPainPoints.message}
                                                    </small>
                                                )}
                                            </div>

                                            {/* Preferred Communication Channels (Checkboxes) */}
                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Preferred Communication Channels with Parents
                                                </label>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="whatsapp"
                                                        value="whatsapp"
                                                        {...register("communicationChannels")}
                                                    />
                                                    <label className="form-check-label" htmlFor="whatsapp">
                                                        WhatsApp
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="phone-call"
                                                        value="phone-call"
                                                        {...register("communicationChannels")}
                                                    />
                                                    <label className="form-check-label" htmlFor="phone-call">
                                                        Phone call
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="email"
                                                        value="email"
                                                        {...register("communicationChannels")}
                                                    />
                                                    <label className="form-check-label" htmlFor="email">
                                                        Email
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        id="others"
                                                        value="others"
                                                        {...register("communicationChannels")}
                                                    />
                                                    <label className="form-check-label" htmlFor="others">
                                                        Others
                                                    </label>
                                                </div>
                                                {errors.communicationChannels && (
                                                    <small className="text-danger">
                                                        {errors.communicationChannels.message}
                                                    </small>
                                                )}
                                            </div>

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Unique Selling Proposition (USP)
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    {...register("usp")}
                                                />
                                                {errors.usp && (
                                                    <small className="text-danger">{errors.usp.message}</small>
                                                )}
                                            </div>

                                            {/* Competitor Schools (Dynamic Array) */}
                                            <h6>Competitor Schools Nearby</h6>
                                            <CompetitorArray
                                                competitorFields={competitorFields}
                                                removeCompetitor={removeCompetitor}
                                                appendCompetitor={appendCompetitor}
                                                errors={errors}
                                                register={register}
                                            />

                                            <div className="mb-3">
                                                <label className="form-label">
                                                    Any Plans for Expansion or Upgrades (Optional)
                                                </label>
                                                <textarea
                                                    className="form-control"
                                                    rows={2}
                                                    {...register("expansionPlans")}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/*Comments ( Can add comments from time to time) :show the latest comment */}
                                    <CommentsSection
                                        commentFields={commentFields}
                                        appendComment={appendComment}
                                        removeComment={removeComment}
                                        register={register}
                                        errors={errors}

                                    />

                                    {/* Submit Button */}
                                    <div className="text-end mb-5">
                                        <button type="submit" className="btn btn-success">
                                            Save Client
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

/**
 * Renders a dynamic array of Key Contact Person(s).
 * Uses useFieldArray from the parent component.
 */
function ContactArray({contactFields, removeContact, appendContact, register, errors}) {
    return (
        <div className="mb-3">
            {contactFields.map((field, index) => (
                <div key={field.id} className="card card-body mb-2">
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Name</label>
                            <input
                                className="form-control"
                                {...register(`contacts.${index}.name`)}
                            />
                            {errors.contacts?.[index]?.name && (
                                <small className="text-danger">
                                    {errors.contacts[index].name.message}
                                </small>
                            )}
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Designation</label>
                            <input
                                className="form-control"
                                {...register(`contacts.${index}.designation`)}
                            />
                            {errors.contacts?.[index]?.designation && (
                                <small className="text-danger">
                                    {errors.contacts[index].designation.message}
                                </small>
                            )}
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Email</label>
                            <input
                                className="form-control"
                                {...register(`contacts.${index}.email`)}
                            />
                            {errors.contacts?.[index]?.email && (
                                <small className="text-danger">
                                    {errors.contacts[index].email.message}
                                </small>
                            )}
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="form-label">Phone</label>
                            <input
                                className="form-control"
                                {...register(`contacts.${index}.phone`)}
                            />
                            {errors.contacts?.[index]?.phone && (
                                <small className="text-danger">
                                    {errors.contacts[index].phone.message}
                                </small>
                            )}
                        </div>
                    </div>
                    {contactFields.length > 1 && (
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm align-self-end"
                            onClick={() => removeContact(index)}
                        >
                            Remove Contact
                        </button>
                    )}
                </div>
            ))}
            <button
                type="button"
                className="btn btn-outline-primary"
                onClick={() =>
                    appendContact({name: "", designation: "", email: "", phone: ""})
                }
            >
                + Add Contact
            </button>
        </div>
    );
}

/**
 * Renders a dynamic array of Competitor Schools.
 */
function CompetitorArray({
                             competitorFields,
                             removeCompetitor,
                             appendCompetitor,
                             register,
                             errors,
                         }) {
    return (
        <div className="mb-3">
            {competitorFields.map((field, index) => (
                <div key={field.id} className="input-group mb-2">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Enter competitor school name"
                        {...register(`competitorSchools.${index}`)}
                    />
                    <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeCompetitor(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
            <button
                type="button"
                className="btn btn-primary"
                onClick={() => appendCompetitor("")}
            >
                + Add Competitor
            </button>
        </div>
    );
}


function CommentsSection({
                             commentFields,
                             appendComment,
                             removeComment,
                             register,
                             errors,
                         }) {
    return (
        <div className="card mb-3">
            <div className="card-header">
                <h3 className="card-title">Comments</h3>
            </div>
            <div className="card-body">
                {/* Input to add a new comment */}
                {commentFields.map((field, index) => (
                    <div key={field.id} className="card card-body mb-2">
                        {/* One field: text */}
                        <label className="form-label">Comment</label>
                        <input
                            className="form-control"
                            {...register(`comments.${index}.text`)}
                        />
                        {errors.comments?.[index]?.text && (
                            <small className="text-danger">
                                {errors.comments[index].text.message}
                            </small>
                        )}

                        {/* Remove button (only if more than 1 or always—your choice) */}
                        <button
                            type="button"
                            className="btn btn-outline-danger btn-sm mt-2"
                            onClick={() => removeComment(index)}
                        >
                            Remove Comment
                        </button>
                    </div>
                ))}
                {/* Add a blank new comment */}
                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={() => appendComment({text: ""})}
                >
                    + Add Comment
                </button>
            </div>
        </div>
    );
}