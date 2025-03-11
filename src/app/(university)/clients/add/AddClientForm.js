"use client";

import React, {useState} from "react";
import {useFieldArray, useForm, useWatch} from "react-hook-form";
// If you have a Zod schema for validation:
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {db} from "@/lib/firebase/client";
// Suppose you have a Zod schema named ClientSchema that matches the fields
// import { ClientSchema } from "@/schema/client";
import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

// Modular sections
import BasicSchoolInfoSection from "@/components/sections/clients/BasicSchoolInfoSection";
import EnrollmentSection from "@/components/sections/clients/EnrollmentSection";
import FinancialSection from "@/components/sections/clients/FinancialSection";
import TechSystemSection from "@/components/sections/clients/TechSystemSection";
import DecisionMakingSection from "@/components/sections/clients/DecisionMakingSection";
import MiscSection from "@/components/sections/clients/MiscSection";
import CommentsSection from "@/components/sections/clients/CommentsSection";
import {ClientSchema} from "@/schema/client";

export default function AddClientForm() {
    const router = useRouter();

    // Track saving state
    const [isSaving, setIsSaving] = useState(false);

    // Alerts for success/error
    const [alerts, setAlerts] = useState([]);

    // If you have a Zod schema, pass it to zodResolver(ClientSchema).
    // Otherwise, remove the resolver or use your own validation.
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(ClientSchema),
        defaultValues: {
            // Basic School Information
            schoolName: "",
            state: "",
            city: "",
            area: "",
            typeOfSchool: "co-ed",
            yearOfEstablishment: "",
            boardOfAffiliation: "cbse",
            mediumOfInstruction: "english",
            newSessionStarts: "",
            frequencyOfPTA: "weekly",
            schoolTimingsFrom: "",
            schoolTimingsTo: "",

            // Enrollment and Infrastructure
            numStudents: "",
            numClasses: "",
            numSections: "",
            numTeachers: "",
            numAdminStaff: "",

            // Financial
            annualFees: "",
            feePaymentFrequency: "monthly",

            // Technology and Current System
            currentTools: "",
            hasWebsite: "no",
            hasInternet: "no",
            digitalLiteracy: "basic",

            // Decision-Making
            contacts: [
                {name: "", designation: "", email: "", phone: ""},
            ],
            purchaseDecisionBy: "principal",

            // Misc
            specificNeeds: "",
            customBoard: "",
            knownPainPoints: "",
            communicationChannels: [],
            usp: "",
            competitorSchools: [],
            expansionPlans: "",

            // Comments
            newComments: [],
        },
        mode: "onChange",
    });

    const boardOfAffiliation= useWatch({
        control,
        name: "boardOfAffiliation",
    })

    // Field arrays for contacts and competitorSchools and newComments
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

    const {
        fields: newCommentFields,
        append: appendNewComment,
        prepend: prependNewComment,
        remove: removeNewComment,
    } = useFieldArray({control, name: "newComments"});

    // For showing/hiding certain fields
    // etc. (if needed)

    // Alerts
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    const getIcon = (variant) => {
        switch (variant) {
            case "success":
                return <i className="fa fa-check-circle me-1"/>;
            case "danger":
                return <i className="fa fa-exclamation-triangle me-1"/>;
            case "info":
                return <i className="fa fa-info-circle me-1"/>;
            default:
                return null;
        }
    };

    // On submit, merge newComments into comments, etc.
    const onSubmit = async (data) => {
        setIsSaving(true);
        try {
            // Combine newComments into a final comments array if you want them under "comments"
            const clientData = {
                ...data,
                comments: data.newComments, // brand-new client => no old comments
            };
            delete clientData.newComments;

            // Add to Firestore "clients" collection
            await addDoc(collection(db, "clients"), clientData);

            addAlert("success", "Client added successfully!");
            reset(); // Clear the form
            router.push("/clients");
        } catch (error) {
            console.error("Error adding client:", error);
            addAlert("danger", "Failed to add client");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="page">
                {/* Alerts */}
                {alerts.map((alert) => (
                    <Alert
                        key={alert.id}
                        variant={alert.variant}
                        onClose={() => removeAlert(alert.id)}
                        dismissible
                        className={`alert-icon d-flex align-items-center h-100 alert alert-${alert.variant}`}
                    >
                        {getIcon(alert.variant)}
                        {alert.message}
                    </Alert>
                ))}

                {isSaving && (
                    <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                        <i className="fa fa-spinner fa-spin me-2"/>
                        Saving client...
                    </Alert>
                )}

                {/* Breadcrumb */}
                <Breadcrumb
                    breadcrumbs={[
                        {label: "Home", href: "/"},
                        {label: "Clients", href: "/clients"},
                        {label: "Add New Client", href: "/clients/add"},
                    ]}
                />

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="client-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Basic School Info */}
                                    <BasicSchoolInfoSection register={register} errors={errors} boardOfAffiliation={boardOfAffiliation}/>

                                    {/* Enrollment & Infrastructure */}
                                    <EnrollmentSection register={register} errors={errors}/>

                                    {/* Financial Info */}
                                    <FinancialSection register={register} errors={errors}/>

                                    {/* Tech System */}
                                    <TechSystemSection register={register} errors={errors}/>

                                    {/* Decision-Making */}
                                    <DecisionMakingSection
                                        contactFields={contactFields}
                                        appendContact={appendContact}
                                        removeContact={removeContact}
                                        register={register}
                                        errors={errors}
                                    />

                                    {/* Misc */}
                                    <MiscSection
                                        competitorFields={competitorFields}
                                        appendCompetitor={appendCompetitor}
                                        removeCompetitor={removeCompetitor}
                                        register={register}
                                        errors={errors}
                                    />

                                    {/* Comments */}
                                    <CommentsSection
                                        existingComments={[]} // brand-new => no old comments
                                        newCommentFields={newCommentFields}
                                        prependNewComment={prependNewComment}
                                        appendNewComment={appendNewComment}
                                        removeNewComment={removeNewComment}
                                    />

                                    {/* Submit */}
                                    <div className="d-flex justify-content-end gap-2 mb-5">
                                        <button
                                            type="reset"
                                            className="btn btn-secondary"
                                            onClick={() => reset()}
                                            disabled={isSaving}
                                        >
                                            Clear Form
                                        </button>
                                        <button type="submit" className="btn btn-success" disabled={isSaving}>
                                            {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                            Add Client
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
