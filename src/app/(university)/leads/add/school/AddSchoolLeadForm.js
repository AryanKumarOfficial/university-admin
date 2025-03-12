"use client";

import React, {useState} from "react";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {addDoc, collection} from "firebase/firestore";

import {db} from "@/lib/firebase/client";
import {LeadSchema} from "@/schema/lead";

// Modular form sections (same ones used in update)
import BasicInfoSection from "@/components/sections/leads/BasicInfoSection";
import FollowUpSection from "@/components/sections/leads/FollowUpSection";
import DecisionMakingSection from "@/components/sections/leads/DecisionMakingSection";
import CommentsSection from "@/components/sections/leads/CommentsSection";

import Breadcrumb from "@/components/ui/Breadcrumb";
import Alert from "react-bootstrap/Alert";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AddSchoolLeadForm() {
    const router = useRouter();

    // Tracks if saving is in progress
    const [isSaving, setIsSaving] = useState(false);

    // We won't have old/existing comments for a brand-new lead
    const [existingComments] = useState([]);

    // For success/error messages
    const [alerts, setAlerts] = useState([]);

    // 1) React Hook Form Setup
    const {
        register,
        handleSubmit,
        control,
        watch,
        formState: {errors},
        reset,
    } = useForm({
        resolver: zodResolver(LeadSchema),
        defaultValues: {
            // Basic Info
            schoolName: "",
            // leadType: "school",
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
            contacts: [{name: "", designation: "", email: "", phone: ""}],
            // newComments for brand-new comments
            newComments: [],
        },
        mode: "onChange",
    });

    // 2) useFieldArray for contacts & newComments
    // Correct destructuring for contacts
    const {
        fields: contactFields,
        append: appendContact,
        remove: removeContact,
    } = useFieldArray({
        control,
        name: "contacts",
    });

    // Correct destructuring for new comments
    const {
        fields: newCommentFields,
        prepend: prependNewComment,
        append: appendNewComment,
        remove: removeNewComment,
    } = useFieldArray({
        control,
        name: "newComments",
    });

    // 3) Watch for "response"
    const response = watch("response");

    // 4) Alert Helpers
    const addAlert = (variant, message) => {
        setAlerts((prev) => [...prev, {id: Date.now(), variant, message}]);
    };

    const removeAlert = (id) => {
        setAlerts((prev) => prev.filter((a) => a.id !== id));
    };

    // Helper for optional icons
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

    // 5) On Submit: create a new lead in Firestore
    const onSubmit = async (data) => {
        setIsSaving(true); // Start saving
        try {
            // Combine new comments into a single 'comments' field
            const leadData = {
                ...data,
                comments: data.newComments, // brand-new lead => no old comments
                createdAt: new Date(Date.now()).toISOString(), // add timestamp
                leadType: "School",
            };
            delete leadData.newComments;

            // Save to Firestore
            await addDoc(collection(db, "leads"), leadData);

            addAlert("success", "Lead added successfully!");
            reset(); // clear the form
            router.push("/leads");
        } catch (error) {
            console.error("Error adding lead:", error);
            addAlert("danger", "Failed to add lead");
        } finally {
            setIsSaving(false); // End saving
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

                {/* If saving is in progress, show a top banner or spinner */}
                {isSaving && (
                    <Alert variant="info" className="d-flex align-items-center h-100 alert-icon">
                        <i className="fa fa-spinner fa-spin me-2"/>
                        Saving lead...
                    </Alert>
                )}

                {/* Breadcrumb (Optional) */}
                <Breadcrumb
                    breadcrumbs={[
                        {label: "Home", href: "/"},
                        {label: "Leads", href: "/leads"},
                        {label: "Add", href: "/leads/add",},
                        {label: "Add New School Lead", href: "/leads/add/school"},
                    ]}
                />

                <div className="section-body mt-4">
                    <div className="container-fluid">
                        <div className="tab-content">
                            <div className="tab-pane active show fade" id="lead-add">
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    {/* Basic Info */}
                                    <BasicInfoSection register={register} errors={errors} response={response}
                                                      title={"School"}/>

                                    {/* Follow Up if "Call later" */}
                                    {response === "Call later" && (
                                        <FollowUpSection register={register} errors={errors}/>
                                    )}

                                    {/* Contacts */}
                                    <DecisionMakingSection
                                        contactFields={contactFields}
                                        appendContact={appendContact}
                                        removeContact={removeContact}
                                        register={register}
                                        errors={errors}
                                    />

                                    {/* Comments (no old comments => empty array) */}
                                    <CommentsSection
                                        existingComments={[]} // new lead => no old comments
                                        newCommentFields={newCommentFields}
                                        prependNewComment={prependNewComment}
                                        appendNewComment={appendNewComment}
                                        removeNewComment={removeNewComment}
                                    />

                                    {/* Submit Button */}
                                    <div className="d-flex justify-content-end gap-2 mb-5">
                                        <button
                                            type="reset"
                                            className="btn btn-danger"
                                            onClick={() => {
                                                reset()
                                                router.push("/leads");
                                            }}
                                            disabled={isSaving}
                                        >
                                            Clear Form
                                        </button>
                                        <button type="submit" className="btn btn-success" disabled={isSaving}>
                                            {isSaving && <i className="fa fa-spinner fa-spin me-2"/>}
                                            Add Lead
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
