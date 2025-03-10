"use client";

import React, {useEffect, useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import "bootstrap/dist/css/bootstrap.min.css";
import Breadcrumb from "@/components/ui/Breadcrumb";
import {doc, getDoc, updateDoc} from "firebase/firestore";
import {db} from "@/lib/firebase/client";
import Alert from 'react-bootstrap/Alert';
import {useRouter} from "next/navigation";

/**
 * Zod schema defining form structure:
 * - Most fields are mandatory, except competitorSchools[] and expansionPlans.
 * - Key Contact Person is an array of at least one contact (name, designation, email, phone).
 * - Communication channels are selected via checkboxes, requiring at least one.
 */
const LeadSchema = z.object({
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
    comments: z.array(
        z.object({
            text: z.string().min(1, "Comment cannot be empty"),
        })
    ).optional(),
});

export default function LeadAddForm({params}) {
    const resolvedParams = React.use(params);
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
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
        {label: "Leads", href: "/leads"},
        {label: "Update Lead", href: "/leads/add"},
    ];

    // Initialize the form
    const {
        register,
        handleSubmit,
        formState: {errors},
        control,
        watch,
        reset
    } = useForm({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            schoolName: "",
            state: "",
            city: "",
            area: "",
            response: "Not interested",
            numStudents: "",
            annualFees: "",
            hasWebsite: "no",
            followUpDate: "",
            followUpTime: "",
            // At least one contact
            contacts: [
                {name: "", designation: "", email: "", phone: ""},
            ],
            comments: [],

        },
        mode: "onChange",
    });

    const response = watch("response");

    // Field arrays for dynamic lists
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({control, name: "contacts"});

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
            const docRef = await doc(db, "leads", resolvedParams.id);
            await updateDoc(docRef, data);
            addAlert("success", "Lead Updated successfully")
            reset();
            router.push("/leads");
        } catch (error) {
            console.error("Error updating lead: ", error);
            addAlert("danger", "Error updating lead")
        }

    };

    useEffect(() => {
        async function fetchClient(docId) {
            try {
                const docRef = doc(db, "leads", docId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Merge the fetched data into the form
                    reset(docSnap.data());
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching client:", error);
            } finally {
                setLoading(false);
            }
        }

        if (resolvedParams.id) {
            (async () => await fetchClient(resolvedParams.id))()
        } else {
            setLoading(false)
        }


    }, [reset, resolvedParams.id])


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

                                            {/* Row 2:  */}
                                            <div className="row">
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Number of Students</label>
                                                    <input className="form-control" {...register("numStudents")}/>
                                                    {errors.numStudents && (
                                                        <small className="text-danger">
                                                            {errors.numStudents.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Annual School Fees</label>
                                                    <input
                                                        className="form-control"
                                                        type={"number"}
                                                        placeholder="e.g. 1990"
                                                        {...register("annualFees")}
                                                    />
                                                    {errors.annualFees && (
                                                        <small className="text-danger">
                                                            {errors.annualFees.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Do they have a website</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("hasWebsite")}
                                                    >
                                                        <option value="">Select Option</option>
                                                        <option value="yes">Yes</option>
                                                        <option value="no">No</option>
                                                    </select>
                                                    {errors.hasWebsite && (
                                                        <small className="text-danger">
                                                            {errors.hasWebsite.message}
                                                        </small>
                                                    )}
                                                </div>
                                                <div className="col-md-3 mb-3">
                                                    <label className="form-label">Response</label>
                                                    <select
                                                        className="form-select"
                                                        {...register("response")}
                                                    >
                                                        <option value="">Choose a follow up</option>
                                                        <option value="Call later">Call later</option>
                                                        <option value="Not interested">Not interested</option>
                                                    </select>
                                                    {errors.response && (
                                                        <small className="text-danger">
                                                            {errors.response.message}
                                                        </small>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                    </div>

                                    {/* Followup time and date */}
                                    {response === "Call later" && (
                                        <div className="card mb-3">
                                            <div className="card-header">
                                                <h3 className="card-title">Follow Up</h3>
                                            </div>
                                            <div className="card-body">
                                                {/* Key Contact Person (Dynamic Array) */}
                                                <div className="row">
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Date</label>
                                                        <input className="form-control"
                                                               type={"date"} {...register("followUpDate")}/>
                                                        {errors.followUpDate && (
                                                            <small className="text-danger">
                                                                {errors.followUpDate.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label">Time</label>
                                                        <input className="form-control"
                                                               type={"time"} {...register("followUpTime")}/>
                                                        {errors.followUpTime && (
                                                            <small className="text-danger">
                                                                {errors.followUpTime.message}
                                                            </small>
                                                        )}
                                                    </div>
                                                </div>


                                            </div>
                                        </div>

                                    )}


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
                                        </div>
                                    </div>

                                    {/* MISCELLANEOUS */}

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
                                            Update Lead
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
 # Renders a dynamic array of comments.
 */


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